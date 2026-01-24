-- Ethiopian Land Registration & Sale Validation System
-- This migration enforces Ethiopian law: Only land with permanent structures can be sold

-- Create enum for structure types
CREATE TYPE public.structure_type AS ENUM (
  'residential_house',
  'commercial_building', 
  'apartment',
  'institutional',
  'government_approved'
);

-- Create enum for verification status
CREATE TYPE public.verification_status AS ENUM (
  'pending',
  'verified',
  'rejected'
);

-- Create enum for compliance status
CREATE TYPE public.compliance_status AS ENUM (
  'compliant',
  'non_compliant',
  'under_review'
);

-- Create land_structures table to track permanent structures on land parcels
CREATE TABLE public.land_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id UUID REFERENCES public.land_parcels(id) ON DELETE CASCADE NOT NULL,
  structure_type structure_type NOT NULL,
  structure_name TEXT NOT NULL,
  building_permit_number TEXT,
  occupancy_certificate_number TEXT,
  construction_year INTEGER,
  floor_count INTEGER DEFAULT 1,
  structure_images TEXT[] DEFAULT '{}',
  verification_status verification_status DEFAULT 'pending',
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add compliance fields to property_sales table
DO $$ 
BEGIN 
    -- Add structure_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='property_sales' AND column_name='structure_id') THEN
        ALTER TABLE public.property_sales ADD COLUMN structure_id UUID REFERENCES public.land_structures(id);
    END IF;

    -- Add compliance_status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='property_sales' AND column_name='compliance_status') THEN
        ALTER TABLE public.property_sales ADD COLUMN compliance_status compliance_status DEFAULT 'under_review';
    END IF;

    -- Add rejection_reason column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='property_sales' AND column_name='rejection_reason') THEN
        ALTER TABLE public.property_sales ADD COLUMN rejection_reason TEXT;
    END IF;
END $$;

-- Enable RLS on land_structures table
ALTER TABLE public.land_structures ENABLE ROW LEVEL SECURITY;

-- RLS Policies for land_structures

-- Staff can view all structures
CREATE POLICY "Staff can view all structures"
  ON public.land_structures FOR SELECT
  USING (public.is_staff(auth.uid()));

-- Staff can manage structures
CREATE POLICY "Staff can manage structures"
  ON public.land_structures FOR ALL
  USING (public.is_staff(auth.uid()));

-- Citizens can view structures on their own parcels
CREATE POLICY "Citizens can view their parcel structures"
  ON public.land_structures FOR SELECT
  USING (
    parcel_id IN (
      SELECT lp.id FROM public.land_parcels lp
      JOIN public.land_owners lo ON lp.owner_id = lo.id
      WHERE lo.user_id = auth.uid()
    )
  );

-- Public can view verified structures on available properties
CREATE POLICY "Public can view verified structures on available properties"
  ON public.land_structures FOR SELECT
  USING (
    verification_status = 'verified' AND
    parcel_id IN (
      SELECT parcel_id FROM public.property_sales 
      WHERE status = 'available'
    )
  );

-- Function to check if a parcel has permanent structures
CREATE OR REPLACE FUNCTION public.has_permanent_structure(p_parcel_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.land_structures
    WHERE parcel_id = p_parcel_id
      AND verification_status = 'verified'
  )
$$;

-- Function to check sale eligibility (Ethiopian law compliance)
CREATE OR REPLACE FUNCTION public.check_sale_eligibility(p_parcel_id UUID)
RETURNS TABLE(
  eligible BOOLEAN,
  reason TEXT,
  structure_count INTEGER
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_structure_count INTEGER;
  v_has_verified_structure BOOLEAN;
BEGIN
  -- Count verified structures on this parcel
  SELECT COUNT(*) INTO v_structure_count
  FROM public.land_structures
  WHERE parcel_id = p_parcel_id
    AND verification_status = 'verified';

  v_has_verified_structure := v_structure_count > 0;

  -- Ethiopian law: Land must have permanent structure to be sold
  IF NOT v_has_verified_structure THEN
    RETURN QUERY SELECT 
      FALSE as eligible,
      'Land sale not permitted under Ethiopian law - No verified permanent structure registered. Land must contain a residential house, commercial building, apartment, or institutional building to be eligible for sale.' as reason,
      v_structure_count as structure_count;
  ELSE
    RETURN QUERY SELECT 
      TRUE as eligible,
      'Land is eligible for sale - Has ' || v_structure_count || ' verified permanent structure(s)' as reason,
      v_structure_count as structure_count;
  END IF;
END;
$$;

-- Function to generate compliance report
CREATE OR REPLACE FUNCTION public.generate_compliance_report(p_parcel_id UUID)
RETURNS TABLE(
  parcel_id TEXT,
  owner_name TEXT,
  land_use TEXT,
  area_sqm DECIMAL,
  structure_count INTEGER,
  verified_structures INTEGER,
  pending_structures INTEGER,
  sale_eligible BOOLEAN,
  compliance_notes TEXT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_parcel RECORD;
  v_structure_count INTEGER;
  v_verified_count INTEGER;
  v_pending_count INTEGER;
  v_eligible BOOLEAN;
BEGIN
  -- Get parcel information
  SELECT 
    lp.parcel_id,
    lo.full_name,
    lp.land_use::TEXT,
    lp.area_sqm
  INTO v_parcel
  FROM public.land_parcels lp
  LEFT JOIN public.land_owners lo ON lp.owner_id = lo.id
  WHERE lp.id = p_parcel_id;

  -- Count structures
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE verification_status = 'verified'),
    COUNT(*) FILTER (WHERE verification_status = 'pending')
  INTO v_structure_count, v_verified_count, v_pending_count
  FROM public.land_structures
  WHERE land_structures.parcel_id = p_parcel_id;

  -- Determine eligibility
  v_eligible := v_verified_count > 0;

  RETURN QUERY SELECT
    v_parcel.parcel_id,
    v_parcel.full_name,
    v_parcel.land_use,
    v_parcel.area_sqm,
    v_structure_count,
    v_verified_count,
    v_pending_count,
    v_eligible,
    CASE 
      WHEN v_eligible THEN 'COMPLIANT: Land has verified permanent structures and is eligible for sale'
      WHEN v_pending_count > 0 THEN 'PENDING: Structure verification in progress'
      ELSE 'NON-COMPLIANT: Empty land cannot be sold under Ethiopian law'
    END as compliance_notes;
END;
$$;

-- Trigger function to validate property sales
CREATE OR REPLACE FUNCTION public.validate_structure_sale()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_eligibility RECORD;
  v_parcel_id UUID;
BEGIN
  -- Get parcel_id from the sale record
  v_parcel_id := NEW.parcel_id;

  -- Check sale eligibility
  SELECT * INTO v_eligibility
  FROM public.check_sale_eligibility(v_parcel_id)
  LIMIT 1;

  -- If not eligible, reject the sale
  IF NOT v_eligibility.eligible THEN
    -- Set compliance status to non-compliant
    NEW.compliance_status := 'non_compliant';
    NEW.rejection_reason := v_eligibility.reason;
    NEW.status := 'cancelled';
    
    -- Raise notice (won't block, but logs the issue)
    RAISE NOTICE 'Sale blocked: %', v_eligibility.reason;
  ELSE
    -- Set compliance status to compliant
    NEW.compliance_status := 'compliant';
    NEW.rejection_reason := NULL;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger to validate sales before insert/update
DROP TRIGGER IF EXISTS validate_property_sale_trigger ON public.property_sales;
CREATE TRIGGER validate_property_sale_trigger
  BEFORE INSERT OR UPDATE ON public.property_sales
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_structure_sale();

-- Create trigger for updated_at on land_structures
CREATE TRIGGER update_land_structures_updated_at
  BEFORE UPDATE ON public.land_structures
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_land_structures_parcel_id ON public.land_structures(parcel_id);
CREATE INDEX IF NOT EXISTS idx_land_structures_verification_status ON public.land_structures(verification_status);
CREATE INDEX IF NOT EXISTS idx_property_sales_compliance_status ON public.property_sales(compliance_status);
CREATE INDEX IF NOT EXISTS idx_property_sales_structure_id ON public.property_sales(structure_id);

-- Add helpful comments
COMMENT ON TABLE public.land_structures IS 'Tracks permanent structures on land parcels to enforce Ethiopian law prohibiting sale of empty land';
COMMENT ON COLUMN public.land_structures.structure_images IS 'Array of image URLs showing the actual building/house/apartment';
COMMENT ON FUNCTION public.check_sale_eligibility IS 'Validates if land can be sold according to Ethiopian law (requires permanent structure)';
COMMENT ON FUNCTION public.generate_compliance_report IS 'Generates detailed compliance report for land parcel sale eligibility';

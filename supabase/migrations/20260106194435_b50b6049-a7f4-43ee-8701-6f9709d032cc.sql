-- Create enum types
CREATE TYPE public.land_use_type AS ENUM ('residential', 'commercial', 'agricultural', 'public', 'mixed');
CREATE TYPE public.parcel_status AS ENUM ('registered', 'pending', 'disputed', 'inactive');
CREATE TYPE public.payment_status AS ENUM ('paid', 'pending', 'overdue', 'partial');
CREATE TYPE public.dispute_status AS ENUM ('open', 'under_review', 'resolved', 'escalated', 'closed');
CREATE TYPE public.app_role AS ENUM ('admin', 'land_officer', 'tax_officer', 'surveyor', 'legal_officer', 'citizen');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  kebele TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Create land_owners table
CREATE TABLE public.land_owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  national_id TEXT UNIQUE,
  phone TEXT,
  email TEXT,
  address TEXT,
  kebele TEXT,
  owner_type TEXT DEFAULT 'individual' CHECK (owner_type IN ('individual', 'joint', 'institutional')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create land_parcels table
CREATE TABLE public.land_parcels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES public.land_owners(id) ON DELETE SET NULL,
  land_use land_use_type NOT NULL DEFAULT 'residential',
  area_sqm DECIMAL(12,2) NOT NULL,
  location TEXT,
  kebele TEXT,
  zone TEXT,
  coordinates JSONB,
  boundaries JSONB,
  status parcel_status DEFAULT 'pending',
  registration_date DATE,
  title_deed_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create property_valuations table
CREATE TABLE public.property_valuations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id UUID REFERENCES public.land_parcels(id) ON DELETE CASCADE NOT NULL,
  valuation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  assessed_value DECIMAL(15,2) NOT NULL,
  market_value DECIMAL(15,2),
  valuation_method TEXT DEFAULT 'standard',
  infrastructure_score INTEGER DEFAULT 0 CHECK (infrastructure_score >= 0 AND infrastructure_score <= 100),
  location_factor DECIMAL(3,2) DEFAULT 1.0,
  notes TEXT,
  valuated_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  is_current BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tax_assessments table
CREATE TABLE public.tax_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tax_id TEXT UNIQUE NOT NULL,
  parcel_id UUID REFERENCES public.land_parcels(id) ON DELETE CASCADE NOT NULL,
  valuation_id UUID REFERENCES public.property_valuations(id),
  fiscal_year INTEGER NOT NULL,
  assessed_value DECIMAL(15,2) NOT NULL,
  tax_rate DECIMAL(5,4) NOT NULL,
  tax_amount DECIMAL(15,2) NOT NULL,
  penalty_amount DECIMAL(15,2) DEFAULT 0,
  total_due DECIMAL(15,2) NOT NULL,
  due_date DATE NOT NULL,
  status payment_status DEFAULT 'pending',
  exemption_type TEXT,
  exemption_amount DECIMAL(15,2) DEFAULT 0,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number TEXT UNIQUE NOT NULL,
  tax_assessment_id UUID REFERENCES public.tax_assessments(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('bank', 'mobile_money', 'cash', 'cheque')),
  payment_date TIMESTAMPTZ DEFAULT NOW(),
  reference_number TEXT,
  bank_name TEXT,
  notes TEXT,
  processed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create disputes table
CREATE TABLE public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id TEXT UNIQUE NOT NULL,
  parcel_id UUID REFERENCES public.land_parcels(id) ON DELETE SET NULL,
  complainant_id UUID REFERENCES public.land_owners(id),
  respondent_id UUID REFERENCES public.land_owners(id),
  dispute_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status dispute_status DEFAULT 'open',
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  evidence_files JSONB DEFAULT '[]',
  resolution_notes TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create activity_logs table
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tax_rates table for configuration
CREATE TABLE public.tax_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  land_use land_use_type NOT NULL,
  zone TEXT,
  rate DECIMAL(5,4) NOT NULL,
  effective_from DATE NOT NULL,
  effective_to DATE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (land_use, zone, effective_from)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.land_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.land_parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_valuations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_rates ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user is staff (any officer role)
CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'land_officer', 'tax_officer', 'surveyor', 'legal_officer')
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Staff can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- User roles policies
CREATE POLICY "Admins can manage user roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Land owners policies
CREATE POLICY "Staff can view all land owners"
  ON public.land_owners FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can manage land owners"
  ON public.land_owners FOR ALL
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'land_officer'));

CREATE POLICY "Citizens can view their own owner record"
  ON public.land_owners FOR SELECT
  USING (user_id = auth.uid());

-- Land parcels policies
CREATE POLICY "Staff can view all parcels"
  ON public.land_parcels FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Land officers can manage parcels"
  ON public.land_parcels FOR ALL
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'land_officer'));

CREATE POLICY "Citizens can view their own parcels"
  ON public.land_parcels FOR SELECT
  USING (
    owner_id IN (
      SELECT id FROM public.land_owners WHERE user_id = auth.uid()
    )
  );

-- Property valuations policies
CREATE POLICY "Staff can view all valuations"
  ON public.property_valuations FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Valuers can manage valuations"
  ON public.property_valuations FOR ALL
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'surveyor'));

-- Tax assessments policies
CREATE POLICY "Staff can view all tax assessments"
  ON public.tax_assessments FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Tax officers can manage assessments"
  ON public.tax_assessments FOR ALL
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'tax_officer'));

CREATE POLICY "Citizens can view their own tax assessments"
  ON public.tax_assessments FOR SELECT
  USING (
    parcel_id IN (
      SELECT lp.id FROM public.land_parcels lp
      JOIN public.land_owners lo ON lp.owner_id = lo.id
      WHERE lo.user_id = auth.uid()
    )
  );

-- Payments policies
CREATE POLICY "Staff can view all payments"
  ON public.payments FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Tax officers can manage payments"
  ON public.payments FOR ALL
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'tax_officer'));

CREATE POLICY "Citizens can view their own payments"
  ON public.payments FOR SELECT
  USING (
    tax_assessment_id IN (
      SELECT ta.id FROM public.tax_assessments ta
      JOIN public.land_parcels lp ON ta.parcel_id = lp.id
      JOIN public.land_owners lo ON lp.owner_id = lo.id
      WHERE lo.user_id = auth.uid()
    )
  );

-- Disputes policies
CREATE POLICY "Staff can view all disputes"
  ON public.disputes FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Legal officers can manage disputes"
  ON public.disputes FOR ALL
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'legal_officer'));

CREATE POLICY "Citizens can view and create their disputes"
  ON public.disputes FOR SELECT
  USING (
    complainant_id IN (
      SELECT id FROM public.land_owners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Citizens can insert disputes"
  ON public.disputes FOR INSERT
  WITH CHECK (
    complainant_id IN (
      SELECT id FROM public.land_owners WHERE user_id = auth.uid()
    )
  );

-- Activity logs policies
CREATE POLICY "Admins can view all activity logs"
  ON public.activity_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own activity"
  ON public.activity_logs FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can insert logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Tax rates policies
CREATE POLICY "Everyone can view tax rates"
  ON public.tax_rates FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Admins can manage tax rates"
  ON public.tax_rates FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    NEW.email
  );
  
  -- Assign default citizen role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'citizen');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_land_owners_updated_at
  BEFORE UPDATE ON public.land_owners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_land_parcels_updated_at
  BEFORE UPDATE ON public.land_parcels
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_tax_assessments_updated_at
  BEFORE UPDATE ON public.tax_assessments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_disputes_updated_at
  BEFORE UPDATE ON public.disputes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Generate parcel ID function
CREATE OR REPLACE FUNCTION public.generate_parcel_id()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(parcel_id FROM 'HP-[0-9]{4}-([0-9]+)') AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.land_parcels;
  
  NEW.parcel_id := 'HP-' || EXTRACT(YEAR FROM CURRENT_DATE) || '-' || LPAD(next_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER generate_parcel_id_trigger
  BEFORE INSERT ON public.land_parcels
  FOR EACH ROW
  WHEN (NEW.parcel_id IS NULL OR NEW.parcel_id = '')
  EXECUTE FUNCTION public.generate_parcel_id();

-- Generate tax ID function
CREATE OR REPLACE FUNCTION public.generate_tax_id()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(tax_id FROM 'TX-[0-9]{4}-([0-9]+)') AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.tax_assessments;
  
  NEW.tax_id := 'TX-' || EXTRACT(YEAR FROM CURRENT_DATE) || '-' || LPAD(next_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER generate_tax_id_trigger
  BEFORE INSERT ON public.tax_assessments
  FOR EACH ROW
  WHEN (NEW.tax_id IS NULL OR NEW.tax_id = '')
  EXECUTE FUNCTION public.generate_tax_id();

-- Generate receipt number function
CREATE OR REPLACE FUNCTION public.generate_receipt_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(receipt_number FROM 'RCP-[0-9]{4}-([0-9]+)') AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.payments;
  
  NEW.receipt_number := 'RCP-' || EXTRACT(YEAR FROM CURRENT_DATE) || '-' || LPAD(next_num::TEXT, 6, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER generate_receipt_number_trigger
  BEFORE INSERT ON public.payments
  FOR EACH ROW
  WHEN (NEW.receipt_number IS NULL OR NEW.receipt_number = '')
  EXECUTE FUNCTION public.generate_receipt_number();

-- Generate dispute ID function
CREATE OR REPLACE FUNCTION public.generate_dispute_id()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(dispute_id FROM 'DSP-[0-9]{4}-([0-9]+)') AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.disputes;
  
  NEW.dispute_id := 'DSP-' || EXTRACT(YEAR FROM CURRENT_DATE) || '-' || LPAD(next_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER generate_dispute_id_trigger
  BEFORE INSERT ON public.disputes
  FOR EACH ROW
  WHEN (NEW.dispute_id IS NULL OR NEW.dispute_id = '')
  EXECUTE FUNCTION public.generate_dispute_id();

-- Insert default tax rates
INSERT INTO public.tax_rates (land_use, zone, rate, effective_from) VALUES
  ('residential', 'urban', 0.0100, '2024-01-01'),
  ('residential', 'rural', 0.0075, '2024-01-01'),
  ('commercial', 'urban', 0.0150, '2024-01-01'),
  ('commercial', 'rural', 0.0125, '2024-01-01'),
  ('agricultural', 'urban', 0.0050, '2024-01-01'),
  ('agricultural', 'rural', 0.0025, '2024-01-01'),
  ('public', NULL, 0.0000, '2024-01-01'),
  ('mixed', 'urban', 0.0120, '2024-01-01'),
  ('mixed', 'rural', 0.0100, '2024-01-01');
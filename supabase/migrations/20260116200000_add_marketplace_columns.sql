-- Add missing columns to property_sales table for marketplace functionality
-- This migration adds columns needed by PropertySales.tsx and HouseSales.tsx

DO $$ 
BEGIN 
    -- Add title column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='property_sales' AND column_name='title') THEN
        ALTER TABLE public.property_sales ADD COLUMN title TEXT;
    END IF;

    -- Add description column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='property_sales' AND column_name='description') THEN
        ALTER TABLE public.property_sales ADD COLUMN description TEXT;
    END IF;

    -- Add listing_type column if it doesn't exist (for marketplace pages)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='property_sales' AND column_name='listing_type') THEN
        ALTER TABLE public.property_sales ADD COLUMN listing_type TEXT;
        -- Update existing records to set listing_type from property_type
        UPDATE public.property_sales SET listing_type = property_type WHERE listing_type IS NULL;
    END IF;

    -- Add price column if it doesn't exist (for marketplace pages)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='property_sales' AND column_name='price') THEN
        ALTER TABLE public.property_sales ADD COLUMN price NUMERIC;
        -- Copy sale_price to price for existing records
        UPDATE public.property_sales SET price = sale_price WHERE price IS NULL;
    END IF;

    -- Add images column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='property_sales' AND column_name='images') THEN
        ALTER TABLE public.property_sales ADD COLUMN images TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Add check constraint for listing_type if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'property_sales_listing_type_check'
    ) THEN
        ALTER TABLE public.property_sales 
        ADD CONSTRAINT property_sales_listing_type_check 
        CHECK (listing_type IN ('land', 'house'));
    END IF;
END $$;

-- Update status check constraint to include 'available' for marketplace
DO $$
BEGIN
    -- Drop existing constraint if it exists
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'property_sales_status_check'
    ) THEN
        ALTER TABLE public.property_sales DROP CONSTRAINT property_sales_status_check;
    END IF;
    
    -- Add new constraint with all status values
    ALTER TABLE public.property_sales 
    ADD CONSTRAINT property_sales_status_check 
    CHECK (status IN ('pending', 'approved', 'completed', 'cancelled', 'available', 'sold'));
END $$;

-- Create index for faster queries on listing_type
CREATE INDEX IF NOT EXISTS idx_property_sales_listing_type ON public.property_sales(listing_type);

-- Add RLS policy for public viewing of available listings (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'property_sales' 
        AND policyname = 'Public can view available property sales'
    ) THEN
        CREATE POLICY "Public can view available property sales" 
        ON public.property_sales FOR SELECT 
        USING (status = 'available');
    END IF;
END $$;

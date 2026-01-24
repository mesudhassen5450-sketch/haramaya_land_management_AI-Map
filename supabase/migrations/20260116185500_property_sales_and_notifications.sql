-- Create property_sales table
CREATE TABLE IF NOT EXISTS public.property_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parcel_id UUID REFERENCES public.land_parcels(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    listing_type TEXT NOT NULL CHECK (listing_type IN ('land', 'house')),
    price NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'pending')),
    images TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enhance inquiries table (it already exists)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='inquiries' AND column_name='property_id') THEN
        ALTER TABLE public.inquiries ADD COLUMN property_id UUID REFERENCES public.property_sales(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Enable RLS
ALTER TABLE public.property_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for property_sales
CREATE POLICY "Public can view available property sales" 
ON public.property_sales FOR SELECT 
USING (status = 'available');

CREATE POLICY "Authenticated users can create property sales" 
ON public.property_sales FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Sellers can update their own property sales" 
ON public.property_sales FOR UPDATE 
USING (auth.uid() = seller_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for inquiries (assuming default policies might not be enough)
CREATE POLICY "Users can view their own inquiries" 
ON public.inquiries FOR SELECT 
USING (auth.uid() = user_id OR (SELECT is_staff(auth.uid())));

CREATE POLICY "Users can insert their own inquiries" 
ON public.inquiries FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff can update inquiries" 
ON public.inquiries FOR UPDATE 
USING ((SELECT is_staff(auth.uid())));

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE property_sales;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE inquiries;

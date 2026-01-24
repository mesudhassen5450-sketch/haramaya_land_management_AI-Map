-- Create table for property sales (land and houses)
CREATE TABLE public.property_sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id TEXT NOT NULL UNIQUE,
  parcel_id UUID REFERENCES public.land_parcels(id),
  property_type TEXT NOT NULL CHECK (property_type IN ('land', 'house')),
  seller_id UUID REFERENCES public.land_owners(id),
  buyer_name TEXT NOT NULL,
  buyer_national_id TEXT,
  buyer_phone TEXT,
  buyer_email TEXT,
  sale_price NUMERIC NOT NULL,
  sale_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'completed', 'cancelled')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid')),
  title_transfer_fee NUMERIC DEFAULT 0,
  stamp_duty NUMERIC DEFAULT 0,
  total_fees NUMERIC DEFAULT 0,
  notes TEXT,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for auto-generating sale_id
CREATE OR REPLACE FUNCTION public.generate_sale_id()
RETURNS TRIGGER AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(sale_id FROM 'SL-[0-9]{4}-([0-9]+)') AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.property_sales;
  
  NEW.sale_id := 'SL-' || EXTRACT(YEAR FROM CURRENT_DATE) || '-' || LPAD(next_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER generate_sale_id_trigger
  BEFORE INSERT ON public.property_sales
  FOR EACH ROW
  WHEN (NEW.sale_id IS NULL OR NEW.sale_id = '')
  EXECUTE FUNCTION public.generate_sale_id();

-- Update timestamp trigger
CREATE TRIGGER update_property_sales_updated_at
  BEFORE UPDATE ON public.property_sales
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Enable RLS
ALTER TABLE public.property_sales ENABLE ROW LEVEL SECURITY;

-- RLS Policies for property_sales
CREATE POLICY "Staff can view all sales"
  ON public.property_sales FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can create sales"
  ON public.property_sales FOR INSERT
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Staff can update sales"
  ON public.property_sales FOR UPDATE
  USING (public.is_staff(auth.uid()));

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  entity_type TEXT,
  entity_id TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (public.is_staff(auth.uid()) OR auth.uid() = user_id);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Add index for faster queries
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_property_sales_status ON public.property_sales(status);
CREATE INDEX idx_property_sales_type ON public.property_sales(property_type);
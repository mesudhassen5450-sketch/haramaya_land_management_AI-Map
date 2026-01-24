-- Create inquiries table for citizen support requests
CREATE TABLE public.inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inquiry_id TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'open',
  priority TEXT NOT NULL DEFAULT 'normal',
  response TEXT,
  responded_by UUID,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own inquiries" 
ON public.inquiries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own inquiries" 
ON public.inquiries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff can view all inquiries" 
ON public.inquiries 
FOR SELECT 
USING (is_staff(auth.uid()));

CREATE POLICY "Staff can manage inquiries" 
ON public.inquiries 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger to auto-generate inquiry_id
CREATE OR REPLACE FUNCTION public.generate_inquiry_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(inquiry_id FROM 'INQ-[0-9]{4}-([0-9]+)') AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.inquiries;
  
  NEW.inquiry_id := 'INQ-' || EXTRACT(YEAR FROM CURRENT_DATE) || '-' || LPAD(next_num::TEXT, 4, '0');
  RETURN NEW;
END;
$function$;

CREATE TRIGGER generate_inquiry_id_trigger
BEFORE INSERT ON public.inquiries
FOR EACH ROW
EXECUTE FUNCTION public.generate_inquiry_id();

-- Trigger for updated_at
CREATE TRIGGER update_inquiries_updated_at
BEFORE UPDATE ON public.inquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();
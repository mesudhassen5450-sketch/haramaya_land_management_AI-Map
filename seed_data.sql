
-- 1. Ensure the admin user exists in profiles and has the admin role
-- Replace 'itechnology416@gmail.com' with the actual email if different
DO $$
DECLARE
  target_user_id UUID;
BEGIN
  SELECT id INTO target_user_id FROM auth.users WHERE email = 'itechnology416@gmail.com';
  
  IF target_user_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, full_name, email)
    VALUES (target_user_id, 'Admin User', 'itechnology416@gmail.com')
    ON CONFLICT (id) DO NOTHING;
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;

-- 2. Seed some Land Owners
INSERT INTO public.land_owners (full_name, phone, email, address, national_id, kebele)
VALUES 
('Abebe Kebede', '0911001122', 'abebe@example.com', 'Haramaya Zone 01', 'ID-001', '01'),
('Chala Tadesse', '0922003344', 'chala@example.com', 'Haramaya Zone 02', 'ID-002', '02'),
('Fatuma Mohammed', '0933005566', 'fatuma@example.com', 'Haramaya Zone 03', 'ID-003', '01')
ON CONFLICT (national_id) DO NOTHING;

-- 3. Seed some Land Parcels
-- Note: We use subqueries to get the owner IDs
INSERT INTO public.land_parcels (parcel_id, owner_id, land_use, area_sqm, zone, kebele, status, registration_date)
SELECT 'HP-2025-001', id, 'residential', 450, 'Zone A', '01', 'registered', CURRENT_DATE FROM public.land_owners WHERE national_id = 'ID-001'
ON CONFLICT (parcel_id) DO NOTHING;

INSERT INTO public.land_parcels (parcel_id, owner_id, land_use, area_sqm, zone, kebele, status, registration_date)
SELECT 'HP-2025-002', id, 'commercial', 1200, 'Zone B', '02', 'registered', CURRENT_DATE FROM public.land_owners WHERE national_id = 'ID-002'
ON CONFLICT (parcel_id) DO NOTHING;

INSERT INTO public.land_parcels (parcel_id, owner_id, land_use, area_sqm, zone, kebele, status, registration_date)
SELECT 'HP-2025-003', id, 'agricultural', 5000, 'Zone C', '03', 'pending', CURRENT_DATE FROM public.land_owners WHERE national_id = 'ID-003'
ON CONFLICT (parcel_id) DO NOTHING;

-- 4. Seed Tax Assessments
-- Note: We join to get the parcel ID
INSERT INTO public.tax_assessments (tax_id, parcel_id, fiscal_year, assessed_value, tax_rate, tax_amount, total_due, due_date, status)
SELECT 
  'TAX-001-' || lp.parcel_id, 
  lp.id, 
  2025, 
  lp.area_sqm * 1000, 
  0.05, 
  lp.area_sqm * 50, 
  lp.area_sqm * 50, 
  '2025-12-31', 
  'paid'
FROM public.land_parcels lp WHERE lp.parcel_id = 'HP-2025-001'
ON CONFLICT (tax_id) DO NOTHING;

INSERT INTO public.tax_assessments (tax_id, parcel_id, fiscal_year, assessed_value, tax_rate, tax_amount, total_due, due_date, status)
SELECT 
  'TAX-001-' || lp.parcel_id, 
  lp.id, 
  2025, 
  lp.area_sqm * 1000, 
  0.05, 
  lp.area_sqm * 50, 
  lp.area_sqm * 50, 
  '2025-12-31', 
  'pending'
FROM public.land_parcels lp WHERE lp.parcel_id = 'HP-2025-002'
ON CONFLICT (tax_id) DO NOTHING;

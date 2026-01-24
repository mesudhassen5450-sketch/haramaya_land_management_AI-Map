-- 1. Create OR Replace the trigger function to handle future signups
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
  
  -- Assign role based on email - Force admin for specific email
  IF NEW.email = 'itechnology416@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'citizen');
  END IF;
  
  RETURN NEW;
END;
$$;

-- 2. FORCE update for existing user (if they already exist)
-- This block attempts to find the user and insert the role directly
DO $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Find user by email
  SELECT id INTO target_user_id FROM auth.users WHERE email = 'itechnology416@gmail.com';
  
  IF target_user_id IS NOT NULL THEN
    -- Delete any existing 'citizen' role to avoid confusion, though multiple roles are supported
    -- DELETE FROM public.user_roles WHERE user_id = target_user_id AND role = 'citizen';
    
    -- Insert 'admin' role if not present
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RAISE NOTICE 'Admin role assigned to %', target_user_id;
  ELSE
    RAISE NOTICE 'User itechnology416@gmail.com found. They will be admin when they sign up.';
  END IF;
END $$;

-- Drop the insecure policy
DROP POLICY IF EXISTS "Anyone can view invitations by token" ON public.user_invitations;

-- Create a secure RPC function to validate invitations by token
CREATE OR REPLACE FUNCTION public.get_invitation_by_token(_token TEXT)
RETURNS TABLE (
  id UUID,
  email TEXT,
  roles app_role[],
  status TEXT,
  expires_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, email, roles, status, expires_at
  FROM public.user_invitations
  WHERE token = _token
    AND status = 'pending'
    AND expires_at > now()
  LIMIT 1;
$$;

-- Create function to accept invitation after user signs up
CREATE OR REPLACE FUNCTION public.accept_invitation(_token TEXT, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inv RECORD;
  r app_role;
BEGIN
  -- Get the invitation
  SELECT * INTO inv FROM public.user_invitations
  WHERE token = _token
    AND status = 'pending'
    AND expires_at > now();
    
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Add the roles to the user
  FOREACH r IN ARRAY inv.roles
  LOOP
    INSERT INTO public.user_roles (user_id, role)
    VALUES (_user_id, r)
    ON CONFLICT (user_id, role) DO NOTHING;
  END LOOP;
  
  -- Mark invitation as accepted
  UPDATE public.user_invitations
  SET status = 'accepted', accepted_at = now()
  WHERE id = inv.id;
  
  RETURN TRUE;
END;
$$;
-- Create role_audit_logs table for tracking role changes
CREATE TABLE public.role_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  target_user_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('add', 'remove')),
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT
);

-- Enable RLS
ALTER TABLE public.role_audit_logs ENABLE ROW LEVEL SECURITY;

-- Admins can view all audit logs
CREATE POLICY "Admins can view all audit logs"
ON public.role_audit_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Authenticated users can insert audit logs
CREATE POLICY "Authenticated users can insert audit logs"
ON public.role_audit_logs
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Create user_invitations table
CREATE TABLE public.user_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  invited_by UUID NOT NULL,
  roles app_role[] NOT NULL DEFAULT ARRAY['citizen'::app_role],
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;

-- Admins can manage invitations
CREATE POLICY "Admins can manage invitations"
ON public.user_invitations
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Public can view invitations by token (for accepting)
CREATE POLICY "Anyone can view invitations by token"
ON public.user_invitations
FOR SELECT
USING (true);

-- Create indexes for performance
CREATE INDEX idx_role_audit_logs_user_id ON public.role_audit_logs(user_id);
CREATE INDEX idx_role_audit_logs_target_user_id ON public.role_audit_logs(target_user_id);
CREATE INDEX idx_role_audit_logs_created_at ON public.role_audit_logs(created_at DESC);
CREATE INDEX idx_user_invitations_email ON public.user_invitations(email);
CREATE INDEX idx_user_invitations_token ON public.user_invitations(token);
CREATE INDEX idx_user_invitations_status ON public.user_invitations(status);

-- Create admin_emails table for tracking emails sent by admin
CREATE TABLE public.admin_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL,
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('client', 'therapist', 'friend', 'all')),
  recipient_ids UUID[] DEFAULT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create content_management table for dynamic content
CREATE TABLE public.content_management (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create platform_settings table for admin settings
CREATE TABLE public.platform_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  setting_type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Admin emails policies (only admins can access)
CREATE POLICY "Admins can manage admin emails" 
  ON public.admin_emails 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Content management policies (only admins can access)
CREATE POLICY "Admins can manage content" 
  ON public.content_management 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Platform settings policies (only admins can access)
CREATE POLICY "Admins can manage platform settings" 
  ON public.platform_settings 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Insert some default platform settings
INSERT INTO public.platform_settings (setting_key, setting_value, setting_type, description) VALUES
('platform_name', '"TheraLink"', 'string', 'Platform name'),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode'),
('registration_enabled', 'true', 'boolean', 'Allow new user registration'),
('email_notifications', 'true', 'boolean', 'Enable email notifications'),
('default_currency', '"NGN"', 'string', 'Default platform currency'),
('platform_fee_percentage', '10', 'number', 'Platform commission percentage');

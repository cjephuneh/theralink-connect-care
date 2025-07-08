-- Schema cleanup and optimization for therapist platform
-- This migration fixes the database structure issues

-- 1. Clean up redundant therapist tables
DROP TABLE IF EXISTS public.therapist CASCADE;

-- 2. Ensure profiles table has proper structure and constraints
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. Optimize therapists table structure
ALTER TABLE public.therapists 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_community_therapist BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS languages TEXT[],
ADD COLUMN IF NOT EXISTS session_formats TEXT[],
ADD COLUMN IF NOT EXISTS therapy_approaches_array TEXT[];

-- 4. Ensure foreign key constraints are proper
ALTER TABLE public.therapist_details 
DROP CONSTRAINT IF EXISTS therapist_details_therapist_id_fkey;

ALTER TABLE public.therapist_details 
ADD CONSTRAINT therapist_details_therapist_id_fkey 
FOREIGN KEY (therapist_id) REFERENCES public.therapists(id) ON DELETE CASCADE;

-- 5. Ensure friend_details references profiles correctly
ALTER TABLE public.friend_details 
DROP CONSTRAINT IF EXISTS friend_details_friend_id_fkey;

ALTER TABLE public.friend_details 
ADD CONSTRAINT friend_details_friend_id_fkey 
FOREIGN KEY (friend_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_therapists_verified ON public.therapists(is_verified);
CREATE INDEX IF NOT EXISTS idx_therapists_community ON public.therapists(is_community_therapist);
CREATE INDEX IF NOT EXISTS idx_therapists_user_id ON public.therapists(user_id);

-- 7. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_details ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies

-- Profiles: Users can view their own profile, admins can view all
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Therapists: Verified therapists are public, users can manage their own
CREATE POLICY "Verified therapists are public" ON public.therapists
    FOR SELECT USING (is_verified = true);

CREATE POLICY "Users can manage own therapist profile" ON public.therapists
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all therapists" ON public.therapists
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Therapist details: Similar to therapists table
CREATE POLICY "Public can view verified therapist details" ON public.therapist_details
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.therapists 
            WHERE id = therapist_id AND is_verified = true
        )
    );

CREATE POLICY "Therapists can manage own details" ON public.therapist_details
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.therapists 
            WHERE id = therapist_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all therapist details" ON public.therapist_details
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Friend details: Users can manage their own
CREATE POLICY "Users can manage own friend details" ON public.friend_details
    FOR ALL USING (friend_id = auth.uid());

CREATE POLICY "Admins can manage all friend details" ON public.friend_details
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 9. Create audit log table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    changed_by UUID REFERENCES public.profiles(id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Create audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO public.audit_logs (table_name, record_id, action, old_values, changed_by)
        VALUES (TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD), auth.uid());
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.audit_logs (table_name, record_id, action, old_values, new_values, changed_by)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD), row_to_json(NEW), auth.uid());
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO public.audit_logs (table_name, record_id, action, new_values, changed_by)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW), auth.uid());
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 11. Add audit triggers to key tables
DROP TRIGGER IF EXISTS audit_therapists ON public.therapists;
CREATE TRIGGER audit_therapists
    AFTER INSERT OR UPDATE OR DELETE ON public.therapists
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_profiles ON public.profiles;
CREATE TRIGGER audit_profiles
    AFTER INSERT OR UPDATE OR DELETE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
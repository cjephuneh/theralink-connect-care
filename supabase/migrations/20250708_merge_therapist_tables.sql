-- Merge therapist_details into therapists table
-- This migration consolidates all therapist data into a single table

-- 1. Add missing columns from therapist_details to therapists table
ALTER TABLE public.therapists 
ADD COLUMN IF NOT EXISTS education TEXT,
ADD COLUMN IF NOT EXISTS license_number TEXT,
ADD COLUMN IF NOT EXISTS license_type TEXT,
ADD COLUMN IF NOT EXISTS therapy_approaches TEXT,
ADD COLUMN IF NOT EXISTS insurance_info TEXT,
ADD COLUMN IF NOT EXISTS has_insurance BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS consultation_fee DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS availability_hours JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS experience_years INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

-- 2. Migrate data from therapist_details to therapists if exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'therapist_details') THEN
    -- Copy data from therapist_details to therapists
    UPDATE public.therapists t
    SET 
      education = td.education,
      license_number = td.license_number,
      license_type = td.license_type,
      therapy_approaches = td.therapy_approaches,
      insurance_info = td.insurance_info,
      has_insurance = td.has_insurance,
      hourly_rate = COALESCE(td.hourly_rate, 0),
      consultation_fee = COALESCE(td.consultation_fee, 0),
      availability_hours = COALESCE(td.availability_hours, '{}'),
      experience_years = COALESCE(td.experience_years, 0),
      rating = COALESCE(td.rating, 0.0),
      total_reviews = COALESCE(td.total_reviews, 0)
    FROM public.therapist_details td
    WHERE t.id = td.therapist_id;
    
    -- Drop the old table
    DROP TABLE public.therapist_details CASCADE;
  END IF;
END $$;

-- 3. Update therapists table to reference profiles properly
ALTER TABLE public.therapists 
DROP CONSTRAINT IF EXISTS therapists_user_id_fkey;

ALTER TABLE public.therapists 
ADD CONSTRAINT therapists_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_therapists_verified ON public.therapists(is_verified);
CREATE INDEX IF NOT EXISTS idx_therapists_community ON public.therapists(is_community_therapist);
CREATE INDEX IF NOT EXISTS idx_therapists_user_id ON public.therapists(user_id);
CREATE INDEX IF NOT EXISTS idx_therapists_rating ON public.therapists(rating);
CREATE INDEX IF NOT EXISTS idx_therapists_hourly_rate ON public.therapists(hourly_rate);

-- 5. Update RLS policies for the merged table
DROP POLICY IF EXISTS "Public can view verified therapist details" ON public.therapist_details;
DROP POLICY IF EXISTS "Therapists can manage own details" ON public.therapist_details;
DROP POLICY IF EXISTS "Admins can manage all therapist details" ON public.therapist_details;

-- 6. Ensure therapists table has proper RLS policies
DROP POLICY IF EXISTS "Verified therapists are public" ON public.therapists;
DROP POLICY IF EXISTS "Users can manage own therapist profile" ON public.therapists;
DROP POLICY IF EXISTS "Admins can manage all therapists" ON public.therapists;

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

-- 7. Update audit trigger for therapists table
DROP TRIGGER IF EXISTS audit_therapist_details ON public.therapist_details;
DROP TRIGGER IF EXISTS audit_therapists ON public.therapists;

CREATE TRIGGER audit_therapists
    AFTER INSERT OR UPDATE OR DELETE ON public.therapists
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
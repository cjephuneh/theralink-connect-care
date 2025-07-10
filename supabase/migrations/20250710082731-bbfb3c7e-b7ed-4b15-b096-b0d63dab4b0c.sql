
-- Clean up database and establish proper structure
-- First, drop unnecessary and duplicate tables
DROP TABLE IF EXISTS public.therapist CASCADE;
DROP TABLE IF EXISTS public.friends_test CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;

-- Clean up therapists table and make it the single source of truth
DROP TABLE IF EXISTS public.therapists CASCADE;

-- Recreate therapists table with proper structure
CREATE TABLE public.therapists (
    id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    bio text,
    specialization text,
    years_experience integer DEFAULT 0,
    hourly_rate numeric(10,2) DEFAULT 0,
    availability jsonb,
    rating numeric(3,2) DEFAULT 0,
    languages text[] DEFAULT ARRAY['English'],
    therapy_approaches text[] DEFAULT ARRAY[]::text[],
    education text,
    license_number text,
    license_type text,
    insurance_info text,
    session_formats text[] DEFAULT ARRAY['online', 'in-person'],
    has_insurance boolean DEFAULT false,
    is_verified boolean DEFAULT false,
    is_community_therapist boolean DEFAULT false,
    application_status text DEFAULT 'pending',
    preferred_currency text DEFAULT 'USD',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create proper indexes for performance
CREATE INDEX idx_therapists_verified ON public.therapists(is_verified);
CREATE INDEX idx_therapists_community ON public.therapists(is_community_therapist);
CREATE INDEX idx_therapists_rating ON public.therapists(rating);
CREATE INDEX idx_therapists_languages ON public.therapists USING GIN(languages);

-- Drop and recreate therapist_details as it's now redundant
DROP TABLE IF EXISTS public.therapist_details CASCADE;

-- Enable RLS on therapists table
ALTER TABLE public.therapists ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for therapists
CREATE POLICY "Anyone can view verified therapists" ON public.therapists
    FOR SELECT USING (is_verified = true);

CREATE POLICY "Therapists can view their own profile" ON public.therapists
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Therapists can update their own profile" ON public.therapists
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Therapists can insert their own profile" ON public.therapists
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage all therapists" ON public.therapists
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Update appointments table to use proper foreign keys
ALTER TABLE public.appointments 
    DROP CONSTRAINT IF EXISTS appointments_therapist_id_fkey,
    ADD CONSTRAINT appointments_therapist_id_fkey 
        FOREIGN KEY (therapist_id) REFERENCES public.therapists(id) ON DELETE CASCADE,
    ADD CONSTRAINT appointments_client_id_fkey 
        FOREIGN KEY (client_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Update reviews table foreign keys
ALTER TABLE public.reviews
    DROP CONSTRAINT IF EXISTS reviews_therapist_id_fkey,
    DROP CONSTRAINT IF EXISTS reviews_client_id_fkey,
    ADD CONSTRAINT reviews_therapist_id_fkey 
        FOREIGN KEY (therapist_id) REFERENCES public.therapists(id) ON DELETE CASCADE,
    ADD CONSTRAINT reviews_client_id_fkey 
        FOREIGN KEY (client_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Update session_notes foreign keys
ALTER TABLE public.session_notes
    DROP CONSTRAINT IF EXISTS session_notes_therapist_id_fkey,
    DROP CONSTRAINT IF EXISTS session_notes_client_id_fkey,
    ADD CONSTRAINT session_notes_therapist_id_fkey 
        FOREIGN KEY (therapist_id) REFERENCES public.therapists(id) ON DELETE CASCADE,
    ADD CONSTRAINT session_notes_client_id_fkey 
        FOREIGN KEY (client_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Ensure friend_details has proper foreign key to profiles
ALTER TABLE public.friend_details
    DROP CONSTRAINT IF EXISTS friend_details_friend_id_fkey,
    ADD CONSTRAINT friend_details_friend_id_fkey 
        FOREIGN KEY (friend_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Update friend_details column name for consistency
ALTER TABLE public.friend_details 
    RENAME COLUMN areas_of_experience TO area_of_experience;

-- Create trigger for updating therapists updated_at
CREATE OR REPLACE FUNCTION update_therapists_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER therapists_updated_at_trigger
    BEFORE UPDATE ON public.therapists
    FOR EACH ROW
    EXECUTE FUNCTION update_therapists_updated_at();

-- Update handle_new_user function to work with new structure
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', ''), 
    COALESCE(new.raw_user_meta_data->>'role', 'client')
  );
  
  -- Create a wallet for the user
  INSERT INTO public.wallets (user_id)
  VALUES (new.id);
  
  -- If the user is a therapist, create a therapist profile
  IF COALESCE(new.raw_user_meta_data->>'role', 'client') = 'therapist' THEN
    INSERT INTO public.therapists (id)
    VALUES (new.id);
  END IF;
  
  RETURN new;
END;
$$;

-- Clear any existing mock data
DELETE FROM public.therapists;
DELETE FROM public.appointments;
DELETE FROM public.reviews;
DELETE FROM public.session_notes;
DELETE FROM public.friend_details;

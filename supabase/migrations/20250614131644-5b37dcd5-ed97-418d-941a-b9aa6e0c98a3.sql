
-- Add currency column to therapist_details table
ALTER TABLE public.therapist_details 
ADD COLUMN preferred_currency TEXT DEFAULT 'NGN';

-- Add currency column to therapists table as well for easier access
ALTER TABLE public.therapists 
ADD COLUMN preferred_currency TEXT DEFAULT 'NGN';

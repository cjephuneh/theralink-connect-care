
-- Add phone and location fields to profiles table (if not already added)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS location text;

-- Add verified status to therapist_details table (if not already added)
ALTER TABLE therapist_details
ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;

-- Enable realtime for messages (only if not already added)
DO $$
BEGIN
  -- Check if messages table is already in the publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'messages'
  ) THEN
    ALTER TABLE messages REPLICA IDENTITY FULL;
    ALTER PUBLICATION supabase_realtime ADD TABLE messages;
  END IF;
END $$;

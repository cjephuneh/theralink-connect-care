
-- Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  read BOOLEAN DEFAULT false NOT NULL
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view all contact messages"
ON public.contact_messages
FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can insert their own contact messages"
ON public.contact_messages
FOR INSERT
TO authenticated
WITH CHECK ((user_id IS NULL) OR (auth.uid() = user_id));

-- Allow anonymous users to submit messages
CREATE POLICY "Anonymous users can insert contact messages"
ON public.contact_messages
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

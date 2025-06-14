
-- Create a blogs table for admin-managed blog posts
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  author TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Create policies for blogs
CREATE POLICY "Admins can manage all blogs" 
  ON public.blogs 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Allow public read access to published blogs
CREATE POLICY "Public can view published blogs" 
  ON public.blogs 
  FOR SELECT 
  USING (published = true);

-- Update contact_messages table to add is_read column if it doesn't exist
ALTER TABLE public.contact_messages 
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;

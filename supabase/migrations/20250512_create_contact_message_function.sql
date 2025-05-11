
-- Create a function to insert contact messages
CREATE OR REPLACE FUNCTION public.insert_contact_message(
  p_name TEXT,
  p_email TEXT,
  p_subject TEXT,
  p_message TEXT,
  p_user_id UUID
) RETURNS void AS $$
BEGIN
  INSERT INTO public.contact_messages (
    name,
    email,
    subject,
    message,
    user_id
  ) VALUES (
    p_name,
    p_email,
    p_subject,
    p_message,
    p_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION public.insert_contact_message TO authenticated;
GRANT EXECUTE ON FUNCTION public.insert_contact_message TO anon;

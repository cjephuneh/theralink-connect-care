
-- Function to add funds to a user's wallet
CREATE OR REPLACE FUNCTION add_funds_to_wallet(p_user_id UUID, p_amount DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE wallets
  SET balance = balance + p_amount, 
      updated_at = now()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to deduct funds from a user's wallet
CREATE OR REPLACE FUNCTION deduct_funds_from_wallet(p_user_id UUID, p_amount DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE wallets
  SET balance = balance - p_amount,
      updated_at = now()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get therapist information with profile data
CREATE OR REPLACE FUNCTION get_therapist_with_profile(p_therapist_id UUID)
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  profile_image_url TEXT,
  specialization TEXT,
  years_experience INTEGER,
  bio TEXT,
  hourly_rate DECIMAL(10,2),
  availability JSONB,
  rating DECIMAL(3,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    p.email,
    p.full_name,
    p.profile_image_url,
    t.specialization,
    t.years_experience,
    t.bio,
    t.hourly_rate,
    t.availability,
    t.rating
  FROM therapists t
  JOIN profiles p ON t.id = p.id
  WHERE t.id = p_therapist_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

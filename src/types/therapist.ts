export interface Therapist {
  id: string;
  bio: string | null;
  specialization: string | null;
  years_experience: number;
  hourly_rate: number;
  availability: any; // JSONB from database
  rating: number;
  languages: string[];
  therapy_approaches: string[];
  education: string | null;
  license_number: string | null;
  license_type: string | null;
  insurance_info: string | null;
  session_formats: string[];
  has_insurance: boolean;
  is_verified: boolean;
  is_community_therapist: boolean;
  application_status: string;
  preferred_currency: string;
  created_at: string;
  updated_at: string;
}

export interface TherapistWithProfile extends Therapist {
  full_name: string;
  profile_image_url: string | null;
  email: string;
  // Add specialization as computed field
  specialization: string;
}
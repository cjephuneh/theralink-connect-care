import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Shield,
  Clock,
  User,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";

interface SessionType {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface AvailabilitySlot {
  date: string;
  slots: string[];
}

interface ProfileType {
  id: string;
  full_name: string;
  profile_image_url?: string;
  role: string;
  isTherapist: boolean;
  sessions: SessionType[];
  availability: AvailabilitySlot[];
}

const BookingPage = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const { user, loading: userLoading } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  // States for managing profile details, selections, and loading
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<SessionType | null>(null);

  // Fetch Profile and Availability from Supabase
  useEffect(() => {
    if (!profileId) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data: profile, error: profileError } = await supabase
          .from("therapist")
          .select("id, full_name, role, profile_image_url")
          .eq("id", profileId)
          .single();

        if (profileError || !profile) {
          toast({
            title: "Failed to load profile",
            description: "Profile not found or unavailable.",
            variant: "destructive",
          });
          setProfile(null);
          setLoading(false);
          return;
        }

        const isTherapist = profile.role === "therapist";
        const availabilityTable = isTherapist ? "therapist_availability" : "friend_availability";
        const { data: availability, error: availabilityError } = await supabase
          .from(availabilityTable)
          .select("*")
          .eq("user_id", profileId);

        if (availabilityError) throw availabilityError;

        const sessions = isTherapist
          ? [
              { id: "therapy", name: "Therapy Session", duration: 50, price: 80 },
              { id: "consultation", name: "Consultation", duration: 30, price: 50 },
            ]
          : [{ id: "video_chat", name: "Video Chat", duration: 60, price: 0 }];

        setProfile({
          ...profile,
          isTherapist,
          sessions,
          availability: availability || [],
        });

        setSelectedSession(sessions[0]);
        if (availability?.length > 0) {
          setSelectedDate(availability[0].date);
        }
      } catch (error) {
        toast({
          title: "Error fetching data",
          description: "Unable to load availability or session details.",
          variant: "destructive",
        });
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId, toast]);

  // Handle Booking Confirmation
  const handleConfirmBooking = async () => {
    if (!profile || !selectedDate || !selectedTime || !selectedSession || !user) {
      toast({
        title: "Incomplete Selection",
        description: "Select session type, date, and time to proceed.",
        variant: "warning",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          profile_id: profile.id,
          date: selectedDate,
          time: selectedTime,
          session_type: selectedSession.name,
          duration: selectedSession.duration,
          amount: selectedSession.price,
          status: "pending",
          is_therapist: profile.isTherapist,
          payment_status: selectedSession.price > 0 ? "unpaid" : "free",
        });

      if (error) throw error;

      // Redirect based on payment requirement
      if (profile.isTherapist && selectedSession.price > 0) {
        navigate(`/booking/payment`, { state: { bookingData: data } });
      } else {
        navigate(`/booking/confirm`, { state: { bookingData: data } });
      }
    } catch (error) {
      toast({
        title: "Booking Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading || userLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
        <Link to="/" className="text-primary hover:underline">
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-3xl font-bold text-center mb-6">
        Book {profile.isTherapist ? "a Therapy Session" : "a Friendly Chat"} with {profile.full_name}
      </h1>

      <Card>
        <CardContent className="space-y-6">
          <h2 className="text-xl font-bold">Select Session Type</h2>
          {profile.sessions.map((session) => (
            <div
              key={session.id}
              className={`border p-4 rounded cursor-pointer ${
                selectedSession?.id === session.id
                  ? "border-primary bg-primary/10"
                  : "border-border"
              }`}
              onClick={() => setSelectedSession(session)}
            >
              <h3 className="text-lg font-medium">{session.name}</h3>
              <p>
                Duration: {session.duration} minutes ·{" "}
                {session.price > 0 ? `$${session.price}` : "Free"}
              </p>
            </div>
          ))}

          <h2 className="text-xl font-bold mt-6">Select Date</h2>
          {profile.availability.map((avail) => (
            <button
              key={avail.date}
              className={`p-3 rounded ${
                selectedDate === avail.date ? "bg-primary text-white" : "border"
              }`}
              onClick={() => setSelectedDate(avail.date)}
            >
              {new Date(avail.date).toLocaleDateString()}
            </button>
          ))}

          <h2 className="text-xl font-bold mt-6">Select Time</h2>
          {selectedDate &&
            profile.availability
              .find((a) => a.date === selectedDate)
              ?.slots.map((time) => (
                <button
                  key={time}
                  className={`p-3 rounded ${
                    selectedTime === time ? "bg-primary text-white" : "border"
                  }`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
        </CardContent>

        <CardFooter className="mt-6 flex justify-end">
          <Button disabled={!selectedDate || !selectedTime} onClick={handleConfirmBooking}>
            Confirm Booking
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BookingPage;
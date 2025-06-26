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
  Shield,
  Clock,
  User,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";

// Define therapist interfaces
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

interface TherapistType {
  id: string;
  full_name: string;
  profile_image_url: string;
  role: string;
  specialization?: string;
  bio?: string;
  isTherapist: boolean;
  sessions: SessionType[];
  availability: AvailabilitySlot[];
}

const BookingPage = () => {
  const { therapistId } = useParams<{ therapistId: string }>(); // Using therapistId from URL params
  const { user, loading: userLoading } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  // State variables
  const [therapist, setTherapist] = useState<TherapistType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<SessionType | null>(null);

  // Fetch therapist data and availability
  useEffect(() => {
    if (!therapistId) return;

    const fetchTherapist = async () => {
      setLoading(true);
      try {
        // Fetch therapist details
        const { data: therapistData, error: therapistError } = await supabase
          .from("therapist")
          .select(
            "therapist_id, full_name, therapy_approaches, licence_type, bio"
          )
          .eq("therapist_id", therapistId)
          .single();

        if (therapistError || !therapistData) {
          throw new Error("Therapist not found.");
        }

        // Determine if therapist has the "therapist" role
        const isTherapist = therapistData.role === "therapist";

        // Fetch availability for the therapist
        const availabilityTable = isTherapist
          ? "therapist_availability"
          : "friend_availability";

        const { data: availability, error: availabilityError } = await supabase
          .from(availabilityTable)
          .select("*")
          .eq("user_id", therapistData.id);

        if (availabilityError || !availability) {
          throw new Error("Failed to load availability.");
        }

        // Define sessions based on role
        const sessions = isTherapist
          ? [
              { id: "therapy", name: "Therapy Session", duration: 50, price: 80 },
              { id: "consultation", name: "Consultation", duration: 30, price: 50 },
            ]
          : [{ id: "video_chat", name: "Friendly Chat", duration: 60, price: 0 }];

        setTherapist({
          ...therapistData,
          isTherapist,
          sessions,
          availability,
        });

        // Preselect session and date if data is available
        setSelectedSession(sessions[0]);
        if (availability.length > 0) {
          setSelectedDate(availability[0].date);
        }
      } catch (error: unknown) {
        toast({
          title: "Failed to load therapist",
          description: error.message || "An error occurred while fetching data.",
          variant: "destructive",
        });
        setTherapist(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapist();
  }, [therapistId, toast]);

  // Handle booking confirmation logic
  const handleConfirmBooking = async () => {
    if (!therapist || !selectedDate || !selectedTime || !selectedSession || !user) {
      toast({
        title: "Incomplete Selection",
        description: "Please select a session type, date, and time.",
        variant: "warning",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          profile_id: therapist.id, // Note: therapistId from therapist table
          date: selectedDate,
          time: selectedTime,
          session_type: selectedSession.name,
          duration: selectedSession.duration,
          amount: selectedSession.price,
          status: "pending",
          is_therapist: therapist.isTherapist,
        });

      if (error) {
        throw new Error("Failed to create booking.");
      }

      // Redirect based on payment requirement
      if (therapist.isTherapist && selectedSession.price > 0) {
        navigate(`/booking/payment`, { state: { bookingData: data } });
      } else {
        navigate(`/booking/confirm`, { state: { bookingData: data } });
      }
    } catch (error: unknown) {
      toast({
        title: "Booking Error",
        description: error.message || "Something went wrong. Please try again.",
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

  if (!therapist) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold">Therapist Not Found</h2>
        <p>We couldn't find the therapist or friend you're looking for.</p>
        <Link to="/" className="text-primary hover:underline">
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-3xl font-bold text-center mb-6">
        Book {therapist.isTherapist ? "Therapy Session" : "Friendly Chat"} with {therapist.full_name}
      </h1>

      <Card>
        <CardContent className="space-y-6">
          <h2 className="text-xl font-bold">Select Session Type</h2>
          {therapist.sessions.map((session) => (
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
          {therapist.availability.map((avail) => (
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
            therapist.availability
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
          <Button
            disabled={!selectedDate || !selectedTime}
            onClick={handleConfirmBooking}
          >
            Confirm Booking
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BookingPage;
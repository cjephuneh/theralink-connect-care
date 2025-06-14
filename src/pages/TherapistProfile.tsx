
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  Video, 
  MessageCircle, 
  Star, 
  Award, 
  Languages, 
  MapPin, 
  DollarSign, 
  Check,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const TherapistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [therapist, setTherapist] = useState<any | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTherapistData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Fetch therapist profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, full_name, profile_image_url, role, location, email")
          .eq("id", id)
          .maybeSingle();

        const { data: therapistRow } = await supabase
          .from("therapists")
          .select("hourly_rate, availability, specialization, years_experience, rating, bio")
          .eq("id", id)
          .maybeSingle();

        const { data: detailsRow } = await supabase
          .from("therapist_details")
          .select("license_type, therapy_approaches, languages, session_formats, is_verified, education")
          .eq("therapist_id", id)
          .maybeSingle();

        // Format availability into same structure as used everywhere else
        let availability: any[] = [];
        try {
          availability = Array.isArray(therapistRow?.availability)
            ? therapistRow.availability
            : JSON.parse(therapistRow?.availability ?? "[]");
        } catch {
          availability = [];
        }

        // Sessions from session_formats (comma-separated)
        let sessions: any[] = [];
        if (detailsRow?.session_formats) {
          sessions = detailsRow.session_formats.split(",").map((s: string) => ({
            id: s.toLowerCase().replace(/\s/g, "_"),
            name: s.trim(),
            description: "",
            duration: 50,
            price: therapistRow?.hourly_rate || 80,
          }));
        }

        setTherapist({
          ...profile,
          ...therapistRow,
          ...detailsRow,
          availability,
          sessions,
        });

        // Set selected date default
        if (availability.length > 0) setSelectedDate(availability[0].date);

        // Fetch reviews for this therapist
        const { data: reviewsRow } = await supabase
          .from("reviews")
          .select("rating, comment, created_at")
          .eq("therapist_id", String(id))
          .order("created_at", { ascending: false });
        setReviews(reviewsRow || []);
      } catch (err) {
        toast({
          title: "Error loading therapist",
          description: "Please try again later",
          variant: "destructive",
        });
        setTherapist(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapistData();
    // eslint-disable-next-line
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="w-full max-w-6xl h-96 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading therapist profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
          <h2 className="text-2xl font-bold mb-4">Therapist Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the therapist you're looking for.</p>
          <Button asChild>
            <Link to="/therapists">Back to Therapist Directory</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleBookSession = () => {
    if (selectedDate && selectedTime) {
      navigate(`/booking/complete/${String(therapist.id)}/${encodeURIComponent(selectedDate)}/${encodeURIComponent(selectedTime)}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column */}
        <div className="lg:w-2/3 space-y-6">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3 flex-shrink-0">
                {therapist.profile_image_url ? (
                  <img
                    src={therapist.profile_image_url}
                    alt={therapist.full_name}
                    className="w-full h-auto aspect-square object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-auto aspect-square rounded-lg flex items-center justify-center bg-muted text-3xl font-bold">
                    {therapist.full_name
                      ? therapist.full_name
                          .split(" ")
                          .filter(n => n && n[0])
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : ""}
                  </div>
                )}
              </div>
              <div className="md:w-2/3">
                <h1 className="text-2xl md:text-3xl font-bold mb-1">{therapist.full_name}</h1>
                <p className="text-lg text-gray-600 mb-3">{therapist.specialization || "Therapist"}</p>
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {Array.from({ length: Math.floor(therapist.rating || 5) }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="ml-1 font-medium">{therapist.rating || 5}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-thera-600" />
                    <span>{therapist.years_experience || "N/A"} years experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-thera-600" />
                    <span>{therapist.location || "Remote Available"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Languages className="h-5 w-5 text-thera-600" />
                    <span>{therapist.languages || "English"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-thera-600" />
                    <span>${therapist.hourly_rate || 80} per session</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Therapist Details Tabs */}
          <div className="bg-white rounded-xl shadow-sm">
            <Tabs defaultValue="about">
              <div className="px-6 pt-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="credentials">Credentials</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="about" className="p-6">
                <h2 className="text-xl font-bold mb-4">About {therapist.full_name}</h2>
                <p className="text-gray-700 mb-4">{therapist.bio || "No bio provided."}</p>
                <h3 className="text-lg font-bold mt-6 mb-3">Therapeutic Approach</h3>
                <ul className="space-y-2">
                  {therapist.therapy_approaches
                    ? therapist.therapy_approaches.split(',').map((approach: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-mint-500" />
                          <span>{approach.trim()}</span>
                        </li>
                      ))
                    : <span>No approach information available.</span>
                  }
                </ul>
                {/* ... insurance, etc could be added ... */}
              </TabsContent>
              <TabsContent value="credentials" className="p-6">
                <h2 className="text-xl font-bold mb-4">Education & Credentials</h2>
                <div className="space-y-4 mb-6">
                  <div className="border-l-2 border-thera-200 pl-4">
                    <p className="font-medium">{therapist.education || "No education info."}</p>
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-3">Certifications & Licenses</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-mint-500" />
                    <span>{therapist.license_type || "No license type provided."}</span>
                  </li>
                </ul>
              </TabsContent>
              <TabsContent value="reviews" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Client Reviews</h2>
                </div>
                {reviews.length === 0 ? (
                  <p className="text-muted-foreground">No reviews at the moment.</p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review, idx) => (
                      <div key={idx} className="border-b border-gray-100 pb-6">
                        <div className="flex items-center mb-3">
                          <div className="flex">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-700 mb-3">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
        {/* Right Column - Booking */}
        <div className="lg:w-1/3" id="booking-section">
          <div className="bg-white rounded-xl shadow-sm sticky top-24">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Book a Session</h2>
              <div className="mb-6">
                <h3 className="font-medium mb-2 flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> Select a Date
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2">
                  {therapist.availability?.map((day: any) => (
                    <Button
                      key={day.date}
                      variant={selectedDate === day.date ? "default" : "outline"}
                      onClick={() => {
                        setSelectedDate(day.date);
                        setSelectedTime(null);
                      }}
                    >
                      {day.date}
                    </Button>
                  ))}
                </div>
              </div>
              {selectedDate && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2 flex items-center gap-1">
                    <Clock className="h-4 w-4" /> Select a Time
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {therapist.availability
                      .find((day: any) => day.date === selectedDate)
                      ?.slots.map((time: string) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </Button>
                      ))}
                  </div>
                </div>
              )}
              <div className="space-y-4">
                <Button
                  className="w-full bg-thera-600 hover:bg-thera-700"
                  disabled={!selectedDate || !selectedTime}
                  onClick={handleBookSession}
                >
                  Book Session
                </Button>
                <div className="flex gap-2">
                  <Button asChild variant="outline" className="w-1/2">
                    <Link to={`/chat/${String(therapist.id)}`}>
                      <MessageCircle className="h-4 w-4 mr-1" /> Message
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-1/2">
                    <Link to={`/video/${String(therapist.id)}`}>
                      <Video className="h-4 w-4 mr-1" /> Quick Consult
                    </Link>
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  <p className="flex items-center gap-1 mb-1">
                    <DollarSign className="h-4 w-4" /> ${therapist.hourly_rate || 80} per session
                  </p>
                  <p className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> 50-minute session
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-b-xl border-t border-gray-100 text-sm text-gray-500">
              <p className="flex items-center gap-1">
                <Check className="h-4 w-4 text-mint-500" /> Secure & confidential
              </p>
              <p className="flex items-center gap-1">
                <Check className="h-4 w-4 text-mint-500" /> Cancel up to 24 hours before
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistProfile;

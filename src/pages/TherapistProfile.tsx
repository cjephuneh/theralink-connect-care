
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
        // Explicitly cast id to string for all Supabase queries
        const idString = typeof id === "string" ? id : String(id);

        // Fetch therapist profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, full_name, profile_image_url, role, location, email")
          .eq("id", idString)
          .maybeSingle();

        const { data: therapistRow } = await supabase
          .from("therapists")
          .select("hourly_rate, availability, specialization, years_experience, rating, bio")
          .eq("id", idString)
          .maybeSingle();

        const { data: detailsRow } = await supabase
          .from("therapist_details")
          .select("license_type, therapy_approaches, languages, session_formats, is_verified, education")
          .eq("therapist_id", idString)
          .maybeSingle();

        // Format availability into same structure as used everywhere else
        let availability: any[] = [];
        try {
          availability = Array.isArray(therapistRow?.availability)
            ? therapistRow.availability
            : JSON.parse(JSON.stringify(therapistRow?.availability) || "[]");
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
          .eq("therapist_id", idString)
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
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading therapist profile...</p>
        </div>
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm text-center max-w-md w-full">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Therapist Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the therapist you're looking for.</p>
          <Button asChild className="w-full">
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col xl:flex-row gap-6 xl:gap-8">
          {/* Left Column - Main Content */}
          <div className="xl:w-2/3 space-y-6">
            {/* Profile Header */}
            <Card className="overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                  <div className="w-full md:w-1/3 flex-shrink-0">
                    {therapist.profile_image_url ? (
                      <img
                        src={therapist.profile_image_url}
                        alt={therapist.full_name}
                        className="w-full h-48 md:h-auto aspect-square object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-48 md:h-auto aspect-square rounded-lg flex items-center justify-center bg-muted text-2xl sm:text-3xl font-bold">
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
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">{therapist.full_name}</h1>
                    <p className="text-base sm:text-lg text-gray-600 mb-3">{therapist.specialization || "Therapist"}</p>
                    <div className="flex items-center mb-4">
                      <div className="flex">
                        {Array.from({ length: Math.floor(therapist.rating || 5) }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="ml-1 font-medium text-sm sm:text-base">{therapist.rating || 5}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm sm:text-base">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 sm:h-5 sm:w-5 text-thera-600 flex-shrink-0" />
                        <span>{therapist.years_experience || "N/A"} years experience</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-thera-600 flex-shrink-0" />
                        <span>{therapist.location || "Remote Available"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Languages className="h-4 w-4 sm:h-5 sm:w-5 text-thera-600 flex-shrink-0" />
                        <span>{therapist.languages || "English"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-thera-600 flex-shrink-0" />
                        <span>${therapist.hourly_rate || 80} per session</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Therapist Details Tabs */}
            <Card>
              <Tabs defaultValue="about">
                <div className="px-4 sm:px-6 pt-4 sm:pt-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="about" className="text-xs sm:text-sm">About</TabsTrigger>
                    <TabsTrigger value="credentials" className="text-xs sm:text-sm">Credentials</TabsTrigger>
                    <TabsTrigger value="reviews" className="text-xs sm:text-sm">Reviews</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="about" className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold mb-4">About {therapist.full_name}</h2>
                  <p className="text-gray-700 mb-4 text-sm sm:text-base">{therapist.bio || "No bio provided."}</p>
                  <h3 className="text-base sm:text-lg font-bold mt-6 mb-3">Therapeutic Approach</h3>
                  <ul className="space-y-2">
                    {therapist.therapy_approaches
                      ? therapist.therapy_approaches.split(',').map((approach: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-2 text-sm sm:text-base">
                            <Check className="h-4 w-4 sm:h-5 sm:w-5 text-mint-500 flex-shrink-0" />
                            <span>{approach.trim()}</span>
                          </li>
                        ))
                      : <span className="text-sm sm:text-base">No approach information available.</span>
                    }
                  </ul>
                </TabsContent>
                <TabsContent value="credentials" className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold mb-4">Education & Credentials</h2>
                  <div className="space-y-4 mb-6">
                    <div className="border-l-2 border-thera-200 pl-4">
                      <p className="font-medium text-sm sm:text-base">{therapist.education || "No education info."}</p>
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold mb-3">Certifications & Licenses</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm sm:text-base">
                      <Award className="h-4 w-4 sm:h-5 sm:w-5 text-mint-500 flex-shrink-0" />
                      <span>{therapist.license_type || "No license type provided."}</span>
                    </li>
                  </ul>
                </TabsContent>
                <TabsContent value="reviews" className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg sm:text-xl font-bold">Client Reviews</h2>
                  </div>
                  {reviews.length === 0 ? (
                    <p className="text-muted-foreground text-sm sm:text-base">No reviews at the moment.</p>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((review, idx) => (
                        <div key={idx} className="border-b border-gray-100 pb-6">
                          <div className="flex items-center mb-3">
                            <div className="flex">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <span className="ml-2 text-xs sm:text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-gray-700 mb-3 text-sm sm:text-base">
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Right Column - Booking (Sticky on desktop, normal on mobile) */}
          <div className="xl:w-1/3" id="booking-section">
            <div className="bg-white rounded-xl shadow-sm xl:sticky xl:top-24">
              <div className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold mb-4">Book a Session</h2>
                <div className="mb-6">
                  <h3 className="font-medium mb-2 flex items-center gap-1 text-sm sm:text-base">
                    <Calendar className="h-4 w-4" /> Select a Date
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-1 gap-2">
                    {therapist.availability?.map((day: any) => (
                      <Button
                        key={day.date}
                        variant={selectedDate === day.date ? "default" : "outline"}
                        onClick={() => {
                          setSelectedDate(day.date);
                          setSelectedTime(null);
                        }}
                        className="text-xs sm:text-sm"
                      >
                        {day.date}
                      </Button>
                    ))}
                  </div>
                </div>
                {selectedDate && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-2 flex items-center gap-1 text-sm sm:text-base">
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
                            className="text-xs sm:text-sm"
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
                    size="lg"
                  >
                    Book Session
                  </Button>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" className="w-1/2 text-xs sm:text-sm">
                      <Link to={`/chat/${String(therapist.id)}`}>
                        <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Message
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-1/2 text-xs sm:text-sm">
                      <Link to={`/video/${String(therapist.id)}`}>
                        <Video className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Quick Consult
                      </Link>
                    </Button>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    <p className="flex items-center gap-1 mb-1">
                      <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" /> ${therapist.hourly_rate || 80} per session
                    </p>
                    <p className="flex items-center gap-1">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" /> 50-minute session
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-b-xl border-t border-gray-100 text-xs sm:text-sm text-gray-500">
                <p className="flex items-center gap-1">
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-mint-500" /> Secure & confidential
                </p>
                <p className="flex items-center gap-1">
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-mint-500" /> Cancel up to 24 hours before
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistProfile;

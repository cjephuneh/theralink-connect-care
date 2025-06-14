import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Remove all mock therapist data and fetch from Supabase

const BookingPage = () => {
  const { therapistId } = useParams<{ therapistId: string }>();
  const [therapist, setTherapist] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const { toast } = useToast();

  // Fetch therapist profile, therapist (session) details, and availability from DB
  useEffect(() => {
    if (!therapistId) return;

    const fetchTherapist = async () => {
      setLoading(true);
      try {
        // Therapist profile
        const { data: profile, error: pErr } = await supabase
          .from("profiles")
          .select("id, full_name, email, profile_image_url, location, role")
          .eq("id", String(therapistId))
          .maybeSingle();
        if (pErr) throw pErr;
        if (!profile) {
          setTherapist(null);
          setLoading(false);
          return;
        }

        // Therapist core
        const { data: therapistRow, error: tErr } = await supabase
          .from("therapists")
          .select("hourly_rate, availability, specialization, years_experience, bio")
          .eq("id", String(therapistId))
          .maybeSingle();
        if (tErr) throw tErr;

        // Therapist details (get session formats)
        const { data: details, error: dErr } = await supabase
          .from("therapist_details")
          .select("session_formats")
          .eq("therapist_id", String(therapistId))
          .maybeSingle();

        // Parse session formats if present (comma separated)
        let sessionTypes: any[] = [];
        if (details?.session_formats) {
          sessionTypes = details.session_formats
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
            .map((s: string, idx: number) => ({
              id: s.toLowerCase().replace(/\s/g, "_"),
              name: s,
              description: "",
              duration: 50,
              price: therapistRow?.hourly_rate || 80,
            }));
        }

        // Availability parsing (stored as JSON array of objects with date/slots or as array of slots?), fallback to empty if not set
        const rawAvail = therapistRow?.availability || [];
        // Accept both [{date, slots}] and [{date,slots}] or fallback to one week if missing
        let availability: any[] = [];
        try {
          availability = Array.isArray(rawAvail) ? rawAvail : JSON.parse(rawAvail ?? "[]");
        } catch {
          availability = [];
        }

        setTherapist({
          ...profile,
          ...therapistRow,
          sessions: sessionTypes,
          availability: availability,
        });

        // Set selection defaults if possible
        if (sessionTypes.length > 0) setSelectedSession(sessionTypes[0]);
        if (availability.length > 0) setSelectedDate(availability[0].date);
      } catch (error) {
        toast({
          title: "Failed to load therapist",
          description: "Therapist not found or unavailable.",
          variant: "destructive",
        });
        setTherapist(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapist();
    // eslint-disable-next-line
  }, [therapistId]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };
  const handleTimeSelect = (time: string) => setSelectedTime(time);
  const handleSessionSelect = (session: any) => setSelectedSession(session);
  const handleProceed = () => setBookingStep(bookingStep + 1);
  const handleBack = () => setBookingStep(bookingStep - 1);

  const canProceed = () => {
    switch (bookingStep) {
      case 1: return selectedSession !== null;
      case 2: return selectedDate !== null && selectedTime !== null;
      default: return true;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center animation-fade-in">
        <div className="w-full max-w-4xl h-96 flex items-center justify-center">
          <div className="flex flex-col items-center animate-pulse-subtle">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <CalendarClock className="h-8 w-8 text-primary/40" />
            </div>
            <p className="text-muted-foreground">Loading booking page...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="container mx-auto px-4 py-12 animation-fade-in">
        <div className="bg-card p-8 rounded-xl shadow-sm text-center">
          <h2 className="text-2xl font-bold mb-4">Therapist Not Found</h2>
          <p className="text-muted-foreground mb-6">We couldn't find the therapist you're looking for.</p>
          <Button asChild>
            <Link to="/therapists">Back to Therapist Directory</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Format date for booking header
  const formatDate = (date: string) => {
    try {
      const d = new Date(date);
      const day = d.getDate();
      const month = d.toLocaleString("default", { month: "short" });
      const weekday = d.toLocaleString("default", { weekday: "short" });
      return { fullDate: `${weekday}, ${month} ${day}`, weekday, month, day };
    } catch {
      return { fullDate: date, weekday: "", month: "", day: "" };
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animation-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to={`/therapists/${String(therapistId)}`} className="text-primary hover:underline flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to profile
          </Link>
          <h1 className="text-3xl font-bold mt-2">
            Book a Session with {therapist.full_name}
          </h1>
          <p className="text-muted-foreground">Select session type, date and time</p>
        </div>
        <div className="mb-8">
          {/* Progress Steps */}
          <div className="flex items-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step < bookingStep
                      ? 'bg-primary text-white'
                      : step === bookingStep
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step < bookingStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span>{step}</span>
                  )}
                </div>
                <div className="text-sm ml-2">
                  {step === 1 && 'Session Type'}
                  {step === 2 && 'Date & Time'}
                  {step === 3 && 'Confirmation'}
                </div>
                {step < 3 && (
                  <div
                    className={`h-0.5 w-16 mx-4 ${
                      step < bookingStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
        <Card className="rounded-xl card-shadow">
          <CardContent className="p-6">
            {/* Step 1 */}
            {bookingStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Select Session Type</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {therapist.sessions?.length > 0 ? (
                    therapist.sessions.map((session: any) => (
                      <div
                        key={session.id}
                        className={`border rounded-xl p-4 cursor-pointer transition-all ${
                          selectedSession?.id === session.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleSessionSelect(session)}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{session.name}</h3>
                          <div
                            className={`w-5 h-5 rounded-full border ${
                              selectedSession?.id === session.id
                                ? 'border-primary bg-primary'
                                : 'border-muted'
                            } flex items-center justify-center`}
                          >
                            {selectedSession?.id === session.id && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{session.description || 'Online Therapy Session.'}</p>
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{session.duration} minutes</span>
                          </div>
                          <div className="font-medium">
                            ${session.price}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No session types available.</p>
                  )}
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-primary mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm">All sessions are confidential and secure. Your privacy is our priority.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Step 2 */}
            {bookingStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Select Date & Time</h2>
                  <p className="text-sm text-muted-foreground">All times shown are in your local timezone</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date Selection */}
                  <div>
                    <h3 className="font-medium mb-3">Date</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {therapist.availability?.map((avail: any) => {
                        const dateInfo = formatDate(avail.date);
                        return (
                          <div
                            key={avail.date}
                            className={`text-center p-2 rounded-lg cursor-pointer transition-all ${
                              selectedDate === avail.date
                                ? 'bg-primary text-white'
                                : 'bg-muted/50 hover:bg-muted'
                            }`}
                            onClick={() => handleDateSelect(avail.date)}
                          >
                            <p className="text-xs">{dateInfo.weekday}</p>
                            <p className="font-bold text-lg">{dateInfo.day}</p>
                            <p className="text-xs">{dateInfo.month}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* Time Selection */}
                  <div>
                    <h3 className="font-medium mb-3">Time</h3>
                    {selectedDate ? (
                      <div className="grid grid-cols-3 gap-2">
                        {therapist.availability
                          .find((a: any) => a.date === selectedDate)
                          ?.slots.map((time: string) => (
                            <div
                              key={time}
                              className={`text-center p-3 rounded-lg cursor-pointer transition-all ${
                                selectedTime === time
                                  ? 'bg-primary text-white'
                                  : 'bg-muted/50 hover:bg-muted'
                              }`}
                              onClick={() => handleTimeSelect(time)}
                            >
                              {time}
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <p className="text-muted-foreground">Please select a date first</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* Step 3 */}
            {bookingStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Confirm Your Booking</h2>
                <div className="bg-muted/30 rounded-xl p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-3xl font-bold select-none">
                      {therapist.profile_image_url ? (
                        <img
                          src={therapist.profile_image_url}
                          alt={therapist.full_name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        therapist.full_name
                          ? therapist.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : ""
                      )}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">{therapist.full_name}</h3>
                      <p className="text-sm text-muted-foreground">{therapist.specialization}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-border">
                      <div className="flex items-center">
                        <CalendarClock className="h-5 w-5 mr-2 text-primary" />
                        <span className="font-medium">Session Details</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Session Type</p>
                        <p className="font-medium">{selectedSession?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-medium">{selectedSession?.duration} minutes</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">{selectedDate && formatDate(selectedDate).fullDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-medium">{selectedTime}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-border">
                      <span className="font-medium">Total Amount</span>
                      <span className="text-xl font-bold">${selectedSession?.price}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-muted/30 rounded-xl p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-border">
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-primary" />
                        <span className="font-medium">Payment Method</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-4">Add your payment details to complete the booking.</p>
                      <Button className="w-full">
                        <CreditCard className="h-5 w-5 mr-2" /> Add Payment Method
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-muted/30 p-6 flex justify-between">
            {bookingStep > 1 ? (
              <Button
                variant="outline"
                onClick={handleBack}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            ) : (
              <Button
                variant="outline"
                asChild
              >
                <Link to={`/therapists/${String(therapistId)}`}>Cancel</Link>
              </Button>
            )}
            {bookingStep < 3 ? (
              <Button
                onClick={handleProceed}
                disabled={!canProceed()}
              >
                Continue <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button asChild>
                <Link
                  to={
                    selectedDate && selectedTime
                      ? `/booking/complete/${String(therapistId)}/${encodeURIComponent(selectedDate)}/${encodeURIComponent(selectedTime)}`
                      : "#"
                  }
                >
                  Complete Booking <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
        <div className="mt-6 rounded-lg p-4 bg-accent text-center">
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <p className="text-sm">Secure, encrypted booking | Cancel up to 24 hours before without charge.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

import { Link, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, CheckCircle, Calendar as CalendarIcon, MessageCircle } from "lucide-react";
import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/utils/notifications";

const BookingComplete = () => {
  const { therapistId, date, time } = useParams<{ therapistId: string; date: string; time: string }>();
  const [therapist, setTherapist] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { showNotificationToast } = useNotifications();

  // Fetch therapist details and create appointment
  useEffect(() => {
    const fetchTherapistDataAndCreateAppointment = async () => {
      if (!therapistId || !date || !time) {
        setError("Missing required parameters");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get therapist profile and details in parallel
        const [profilePromise, therapistPromise] = await Promise.allSettled([
          supabase
            .from('profiles')
            .select('full_name, profile_image_url')
            .eq('id', therapistId)
            .single(),
          supabase
            .from('therapists')
            .select('hourly_rate, specialization, bio')
            .eq('id', therapistId)
            .single()
        ]);

        if (profilePromise.status === 'rejected' || therapistPromise.status === 'rejected') {
          throw new Error('Failed to fetch therapist data');
        }

        const profileData = profilePromise.value.data;
        const profileError = profilePromise.value.error;
        const therapistData = therapistPromise.value.data;
        const therapistError = therapistPromise.value.error;

        if (profileError || therapistError) {
          throw profileError || therapistError;
        }

        if (!profileData || !therapistData) {
          throw new Error('Therapist not found');
        }

        setTherapist({
          id: therapistId,
          name: profileData.full_name,
          image: profileData.profile_image_url,
          title: therapistData.specialization,
          hourlyRate: therapistData.hourly_rate
        });

        // Create appointment if user is authenticated
        if (user) {
          try {
            const appointmentDate = new Date(decodeURIComponent(date));
            const timeString = decodeURIComponent(time);
            const timeMatch = timeString.match(/(\d+):(\d+)\s*([AP]M)/i);
            
            if (!timeMatch) {
              throw new Error('Invalid time format');
            }

            const [_, hourStr, minuteStr, ampm] = timeMatch;
            let hour = parseInt(hourStr, 10);
            const minute = parseInt(minuteStr, 10);
            
            // Convert to 24-hour format
            if (ampm.toUpperCase() === 'PM' && hour < 12) hour += 12;
            if (ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;
            
            appointmentDate.setHours(hour, minute, 0, 0);
            const endTime = new Date(appointmentDate);
            endTime.setMinutes(endTime.getMinutes() + 50); // 50 minute appointment
            
            const { data: appointmentData, error: appointmentError } = await supabase
              .from('appointments')
              .insert({
                client_id: user.id,
                therapist_id: therapistId,
                start_time: appointmentDate.toISOString(),
                end_time: endTime.toISOString(),
                status: 'scheduled',
                session_type: 'Initial Consultation'
              })
              .select()
              .single();
              
            if (appointmentError) throw appointmentError;
            
            // Show success notification
            showNotificationToast({
              user_id: user.id,
              title: 'Booking Confirmed',
              message: `Your appointment with ${profileData.full_name} on ${decodeURIComponent(date)} at ${decodeURIComponent(time)} has been confirmed.`,
              type: 'appointment',
              action_url: '/client/appointments'
            });
          } catch (appointmentError) {
            console.error("Failed to create appointment:", appointmentError);
            toast({
              title: 'Warning',
              description: 'Booking was confirmed but there was an issue creating the appointment record.',
              variant: 'default',
            });
          }
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load booking details. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to complete booking process',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTherapistDataAndCreateAppointment();
  }, [therapistId, toast, date, time, user, showNotificationToast]);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Confirming your booking...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-16">
        <div className="bg-card rounded-2xl shadow-sm p-8 border border-border/50 text-center">
          <div className="bg-destructive/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-10 w-10 text-destructive"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Booking Error</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-16 animation-fade-in">
      <div className="bg-card rounded-2xl shadow-sm p-8 border border-border/50">
        <div className="text-center mb-8">
          <div className="bg-primary/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">
            Your session with {therapist?.name} has been scheduled.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-muted/50 rounded-xl p-6 flex gap-4 items-center">
            <div className="h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
              <img 
                src={therapist?.image}
                alt={therapist?.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-semibold text-lg">{therapist?.name}</h2>
              <p className="text-muted-foreground text-sm">{therapist?.title}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/50 p-4 rounded-xl flex items-center gap-3">
              <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Date</div>
                <div className="font-medium">{decodeURIComponent(date)}</div>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-xl flex items-center gap-3">
              <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Time</div>
                <div className="font-medium">{decodeURIComponent(time)}</div>
              </div>
            </div>
          </div>

          <div className="bg-accent/30 border border-accent/30 p-4 rounded-xl">
            <h3 className="font-medium mb-2">Next Steps</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-secondary mt-0.5" />
                <span>A confirmation email has been sent to your inbox</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-secondary mt-0.5" />
                <span>A calendar invite has been sent to your email</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-secondary mt-0.5" />
                <span>You can join the video session 5 minutes before the scheduled time</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 space-y-4">
            <Button asChild className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              <Link to={`/video/${therapistId}`} className="flex items-center justify-center gap-2">
                <Video className="h-4 w-4" />
                Join Video Session
              </Link>
            </Button>

            <div className="grid grid-cols-2 gap-4">
              <Button asChild variant="outline">
                <Link to="/client/appointments" className="flex items-center justify-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  View My Calendar
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to={`/chat/${therapistId}`} className="flex items-center justify-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Message Therapist
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-8">
        Need to reschedule? <Link to="/client/appointments" className="text-primary hover:underline">Manage your appointments</Link> or <Link to="/contact" className="text-primary hover:underline">contact support</Link>.
      </p>
    </div>
  );
};

export default BookingComplete;

import { Link, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, CheckCircle, Calendar as CalendarIcon, MessageCircle } from "lucide-react";
import { useEffect, useState } from 'react';

const BookingComplete = () => {
  const { therapistId, date, time } = useParams<{ therapistId: string; date: string; time: string }>();
  const [therapist, setTherapist] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for a single therapist (in a real app, this would be fetched from an API)
  useEffect(() => {
    const mockTherapist = {
      id: therapistId,
      name: "Dr. Sarah Johnson",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      title: "Licensed Clinical Psychologist",
    };

    // Simulate API call
    setTimeout(() => {
      setTherapist(mockTherapist);
      setLoading(false);
    }, 1000);
  }, [therapistId]);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Loading booking details...</p>
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
                <div className="font-medium">{date}</div>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-xl flex items-center gap-3">
              <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Time</div>
                <div className="font-medium">{time}</div>
              </div>
            </div>
          </div>

          <div className="bg-accent/30 border border-accent/30 p-4 rounded-xl">
            <h3 className="font-medium mb-2">Next Steps</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-secondary mt-0.5" />
                <span>You'll receive a confirmation email with details</span>
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
                <Link to="/dashboard" className="flex items-center justify-center gap-2">
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
        Need to reschedule? <Link to="/dashboard" className="text-primary hover:underline">Manage your appointments</Link> or <Link to="/contact" className="text-primary hover:underline">contact support</Link>.
      </p>
    </div>
  );
};

export default BookingComplete;

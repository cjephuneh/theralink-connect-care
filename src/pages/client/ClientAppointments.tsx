import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, User, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface Appointment {
  id: string;
  start_time: string;
  end_time: string;
  session_type: string;
  status: string;
  therapist_id: string;
  therapist?: {
    full_name: string;
    profile_image_url?: string;
  };
}

const ClientAppointments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const now = new Date().toISOString();

        // Fetch upcoming appointments with therapist data
        const { data: upcomingData, error: upcomingError } = await supabase
          .from('bookings')
          .select(`
            id,
            date,
            time,
            session_type,
            status,
            therapist_id,
            therapists(
              profiles(
                full_name,
                profile_image_url
              )
            )
          `)
          .eq('user_id', user.id)
          .gte('date', new Date().toISOString().split('T')[0])
          .order('date', { ascending: true })
          .order('time', { ascending: true });

        if (upcomingError) throw upcomingError;

        // Fetch past appointments with therapist data
        const { data: pastData, error: pastError } = await supabase
          .from('bookings')
          .select(`
            id,
            date,
            time,
            session_type,
            status,
            therapist_id,
            therapists(
              profiles(
                full_name,
                profile_image_url
              )
            )
          `)
          .eq('user_id', user.id)
          .lt('date', new Date().toISOString().split('T')[0])
          .order('date', { ascending: false })
          .order('time', { ascending: false });

        if (pastError) throw pastError;


        const formatAppointment = (apt: any): Appointment => {
          const startTime = new Date(`${apt.date}T${apt.time}`);
          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + 50); // Assuming 50-minute sessions

          return {
            id: apt.id,
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            session_type: apt.session_type || 'Therapy Session',
            status: apt.status || 'scheduled',
            therapist_id: apt.therapist_id,
            therapist: {
              full_name: apt.therapists?.profiles?.full_name || 'Therapist',
              profile_image_url: apt.therapists?.profiles?.profile_image_url
            }
          };
        };

        setUpcomingAppointments(upcomingData?.map(formatAppointment) || []);
        setPastAppointments(pastData?.map(formatAppointment) || []);

      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast({
          title: "Failed to load appointments",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [user, toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const cancelAppointment = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', parseInt(appointmentId))
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setUpcomingAppointments(upcomingAppointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
      ));

      toast({
        title: "Appointment cancelled",
        description: "Your appointment has been successfully cancelled",
      });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast({
        title: "Failed to cancel appointment",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Appointments</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcomingAppointments.length > 0 ? (
            <div className="grid gap-4 mt-4">
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      {appointment.therapist?.profile_image_url ? (
                        <img 
                          src={appointment.therapist.profile_image_url} 
                          alt={appointment.therapist.full_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <div>
                        <div>{appointment.session_type}</div>
                        <CardDescription className="mt-1">
                          With {appointment.therapist?.full_name}
                        </CardDescription>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(appointment.start_time)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appointment.status === 'scheduled' 
                            ? 'bg-green-100 text-green-800' 
                            : appointment.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/chat/${appointment.therapist_id}`}>
                        Message Therapist
                      </Link>
                    </Button>
                    {appointment.status === 'scheduled' && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => cancelAppointment(appointment.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/50 rounded-lg mt-4">
              <p className="text-muted-foreground mb-4">No upcoming appointments</p>
              <Button asChild>
                <Link to="/therapists">Find a Therapist</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {pastAppointments.length > 0 ? (
            <div className="grid gap-4 mt-4">
              {pastAppointments.map((appointment) => (
                <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      {appointment.therapist?.profile_image_url ? (
                        <img 
                          src={appointment.therapist.profile_image_url} 
                          alt={appointment.therapist.full_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <div>
                        <div>{appointment.session_type}</div>
                        <CardDescription className="mt-1">
                          With {appointment.therapist?.full_name}
                        </CardDescription>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(appointment.start_time)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appointment.status === 'completed' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link to={`/therapists/${appointment.therapist_id}`}>
                        Book Again
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/50 rounded-lg mt-4">
              <p className="text-muted-foreground">No past appointments</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientAppointments;
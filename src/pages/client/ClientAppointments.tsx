
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
import { Calendar, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";

const ClientAppointments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const now = new Date().toISOString();

        // Modified query: Removed the problematic join with profiles table
        const { data: upcomingData, error: upcomingError } = await supabase
          .from('appointments')
          .select(`
            id,
            start_time,
            end_time,
            session_type,
            status,
            notes,
            therapist_id
          `)
          .eq('client_id', user.id)
          .gte('start_time', now)
          .order('start_time', { ascending: true });

        if (upcomingError) throw upcomingError;
        
        // Fetch therapist profiles separately if needed
        let therapistData = {};
        if (upcomingData && upcomingData.length > 0) {
          const therapistIds = [...new Set(upcomingData.map(apt => apt.therapist_id))];
          
          // Only fetch if there are therapist IDs
          if (therapistIds.length > 0) {
            const { data: therapists } = await supabase
              .from('profiles')
              .select('id, full_name, profile_image_url')
              .in('id', therapistIds);
              
            if (therapists) {
              therapistData = therapists.reduce((acc, therapist) => {
                acc[therapist.id] = therapist;
                return acc;
              }, {});
            }
          }
        }
        
        // Combine appointment data with therapist data
        const enrichedUpcomingData = upcomingData ? upcomingData.map(apt => ({
          ...apt,
          therapist: therapistData[apt.therapist_id] || {}
        })) : [];
        
        setUpcomingAppointments(enrichedUpcomingData);

        // Fetch past appointments with the same approach
        const { data: pastData, error: pastError } = await supabase
          .from('appointments')
          .select(`
            id,
            start_time,
            end_time,
            session_type,
            status,
            notes,
            therapist_id
          `)
          .eq('client_id', user.id)
          .lt('start_time', now)
          .order('start_time', { ascending: false });

        if (pastError) throw pastError;
        
        // Combine past appointment data with therapist data
        const enrichedPastData = pastData ? pastData.map(apt => ({
          ...apt,
          therapist: therapistData[apt.therapist_id] || {}
        })) : [];
        
        setPastAppointments(enrichedPastData);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId)
        .eq('client_id', user.id);

      if (error) throw error;

      // Update the local state
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
    return <div className="text-center py-8">Loading appointments...</div>;
  }

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4 mt-4">
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardHeader>
                    <CardTitle>{appointment.session_type}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>{appointment.therapist?.full_name || 'Therapist'}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{formatDate(appointment.start_time)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>{formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</span>
                      </div>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appointment.status === 'scheduled' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button asChild variant="outline">
                      <Link to={`/chat/${appointment.therapist_id}`}>
                        Message Therapist
                      </Link>
                    </Button>
                    {appointment.status === 'scheduled' && (
                      <Button 
                        variant="destructive" 
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
            <div className="text-center py-8">
              <p className="text-muted-foreground">No upcoming appointments</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/therapists">Find a Therapist</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {pastAppointments.length > 0 ? (
            <div className="space-y-4 mt-4">
              {pastAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardHeader>
                    <CardTitle>{appointment.session_type}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>{appointment.therapist?.full_name || 'Therapist'}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{formatDate(appointment.start_time)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>{formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</span>
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
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/therapists">Book Again</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No past appointments</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientAppointments;

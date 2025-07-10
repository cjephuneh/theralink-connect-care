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

        // Fetch appointments with therapist profile data
        const { data: appointmentsData, error } = await supabase
          .from('appointments')
          .select(`*`)
          .eq('client_id', user.id)
          .order('start_time', { ascending: true });

        if (error) throw error;

        // Fetch therapist names separately for now
        const transformedAppointments = appointmentsData?.map(appointment => ({
          ...appointment,
          therapist: {
            full_name: 'Therapist',
            profile_image_url: null
          }
        })) || [];


        const upcoming = transformedAppointments.filter(
          appointment => appointment.start_time >= now
        );
        const past = transformedAppointments.filter(
          appointment => appointment.start_time < now
        );

        setUpcomingAppointments(upcoming);
        setPastAppointments(past);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast({
          title: "Error loading appointments",
          description: "Could not fetch your appointments",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [user, toast]);

  const formatDate = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const renderAppointmentCard = (appointment: Appointment) => (
    <Card key={appointment.id} className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {appointment.therapist?.profile_image_url ? (
              <img
                src={appointment.therapist.profile_image_url}
                alt={appointment.therapist.full_name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-5 w-5 text-gray-500" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg">
                {appointment.therapist?.full_name || 'Therapist'}
              </CardTitle>
              <CardDescription>
                {appointment.session_type === 'video' ? 'Video Session' : 'Chat Session'}
              </CardDescription>
            </div>
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(appointment.start_time)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>
              {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/therapists/${appointment.therapist_id}`}>
            View Therapist
          </Link>
        </Button>
        {appointment.status === 'scheduled' && (
          <Button size="sm">
            Join Session
          </Button>
        )}
      </CardFooter>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Appointments</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastAppointments.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-6">
          {upcomingAppointments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No upcoming appointments</h3>
                <p className="text-muted-foreground mb-4">
                  Ready to book your first session?
                </p>
                <Button asChild>
                  <Link to="/therapists">Find a Therapist</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div>
              {upcomingAppointments.map(renderAppointmentCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {pastAppointments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No past appointments</h3>
                <p className="text-muted-foreground">
                  Your completed sessions will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div>
              {pastAppointments.map(renderAppointmentCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientAppointments;
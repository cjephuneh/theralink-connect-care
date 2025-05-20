
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

const ClientAppointments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [therapists, setTherapists] = useState({});

  useEffect(() => {
    if (!user) return;

    // Add mock therapists to the database
    const addMockTherapists = async () => {
      try {
        // Check if we already have therapists in the database
        const { data: existingTherapists, error: checkError } = await supabase
          .from('therapists')
          .select('id')
          .limit(1);
        
        if (checkError) throw checkError;
        
        // Only seed therapists if none exist
        if (existingTherapists && existingTherapists.length === 0) {
          const mockTherapists = [
            {
              id: "f47ac10b-58cc-4372-a567-0e02b2c3d479", // Generate a UUID
              bio: "Licensed clinical psychologist with over 8 years of experience helping clients navigate life's challenges.",
              specialization: "Anxiety, Depression, Trauma, PTSD",
              years_experience: 8,
              hourly_rate: 85,
              rating: 4.9
            },
            {
              id: "550e8400-e29b-41d4-a716-446655440000", // Generate a UUID
              bio: "Licensed marriage and family therapist with over 12 years of experience helping couples and families.",
              specialization: "Relationships, Couples Therapy, Family Conflict",
              years_experience: 12,
              hourly_rate: 95,
              rating: 4.8
            },
            {
              id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8", // Generate a UUID
              bio: "Clinical social worker passionate about helping individuals navigate through depression and grief.",
              specialization: "Depression, Grief, Life Transitions, Identity",
              years_experience: 5,
              hourly_rate: 75,
              rating: 5.0
            }
          ];
          
          // Add mock therapists to the database
          for (const therapist of mockTherapists) {
            // Add therapist profile first
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: therapist.id,
                email: `therapist${therapist.id.substring(0, 4)}@example.com`,
                full_name: `Dr. ${therapist.specialization.split(',')[0]} Specialist`,
                role: 'therapist',
                profile_image_url: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?fit=crop&w=500&q=80`,
              }, { onConflict: 'id' });
              
            if (profileError) console.error("Error creating therapist profile:", profileError);
            
            // Then add therapist record
            const { error: therapistError } = await supabase
              .from('therapists')
              .upsert(therapist, { onConflict: 'id' });
              
            if (therapistError) console.error("Error creating therapist:", therapistError);
          }
          
          console.log("Mock therapists added to database");
        }
      } catch (error) {
        console.error("Error seeding therapists:", error);
      }
    };

    // Create a mock appointment if needed for testing
    const createMockAppointment = async () => {
      try {
        // First check if user already has appointments
        const { data: existingAppointments, error: checkError } = await supabase
          .from('appointments')
          .select('id')
          .eq('client_id', user.id)
          .limit(1);
          
        if (checkError) throw checkError;
        
        // Only create a mock appointment if none exist
        if (!existingAppointments || existingAppointments.length === 0) {
          // Get a random therapist
          const { data: randomTherapist, error: therapistError } = await supabase
            .from('therapists')
            .select('id')
            .limit(1);
            
          if (therapistError) throw therapistError;
          
          if (randomTherapist && randomTherapist.length > 0) {
            // Create a future appointment
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(10, 0, 0, 0);
            
            const endTime = new Date(tomorrow);
            endTime.setMinutes(endTime.getMinutes() + 50);
            
            const { error: appointmentError } = await supabase
              .from('appointments')
              .insert({
                client_id: user.id,
                therapist_id: randomTherapist[0].id,
                start_time: tomorrow.toISOString(),
                end_time: endTime.toISOString(),
                status: 'scheduled',
                session_type: 'Initial Consultation'
              });
              
            if (appointmentError) throw appointmentError;
            
            console.log("Mock appointment created");
          }
        }
      } catch (error) {
        console.error("Error creating mock appointment:", error);
      }
    };

    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        // First ensure we have some therapists and an appointment for testing
        await addMockTherapists();
        await createMockAppointment();
        
        const now = new Date().toISOString();

        // Fetch upcoming appointments
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
        
        // Fetch past appointments
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
        
        // Get unique therapist IDs from all appointments
        const allAppointments = [...(upcomingData || []), ...(pastData || [])];
        const therapistIds = [...new Set(allAppointments.map(apt => apt.therapist_id))];
        
        // Fetch therapist profiles separately if there are appointments
        if (therapistIds.length > 0) {
          const { data: therapistData, error: therapistError } = await supabase
            .from('profiles')
            .select('id, full_name, profile_image_url')
            .in('id', therapistIds);
            
          if (therapistError) throw therapistError;
          
          // Create a map of therapist data for easy lookup
          const therapistMap = {};
          therapistData?.forEach(therapist => {
            therapistMap[therapist.id] = therapist;
          });
          
          setTherapists(therapistMap);
          
          // Enrich appointments with therapist data
          const enrichedUpcomingData = upcomingData?.map(apt => ({
            ...apt,
            therapist: therapistMap[apt.therapist_id] || { full_name: 'Therapist' }
          })) || [];
          
          const enrichedPastData = pastData?.map(apt => ({
            ...apt,
            therapist: therapistMap[apt.therapist_id] || { full_name: 'Therapist' }
          })) || [];
          
          setUpcomingAppointments(enrichedUpcomingData);
          setPastAppointments(enrichedPastData);
        } else {
          setUpcomingAppointments([]);
          setPastAppointments([]);
        }
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
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading appointments...</p>
      </div>
    );
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

// Helper functions for formatting dates and times
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

// Function to cancel an appointment
const cancelAppointment = async (appointmentId) => {
  try {
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', appointmentId);

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

export default ClientAppointments;

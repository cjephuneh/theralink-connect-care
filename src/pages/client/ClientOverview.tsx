
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, FileText, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ClientOverview = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch upcoming appointments
        const { data: appointmentData, error: appointmentError } = await supabase
          .from('appointments')
          .select(`
            id,
            start_time,
            end_time,
            session_type,
            status,
            therapist_id,
            profiles:therapist_id (full_name, profile_image_url)
          `)
          .eq('client_id', user.id)
          .eq('status', 'scheduled')
          .gte('start_time', new Date().toISOString())
          .order('start_time', { ascending: true })
          .limit(3);

        if (appointmentError) throw appointmentError;
        setUpcomingAppointments(appointmentData || []);

        // Fetch recent client notes
        const { data: notesData, error: notesError } = await supabase
          .from('session_notes')
          .select('*')
          .eq('client_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);

        if (notesError) throw notesError;
        setRecentNotes(notesData || []);

        // Count unread messages
        const { count: messageCount, error: messageError } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('receiver_id', user.id)
          .eq('is_read', false);

        if (messageError) throw messageError;
        setUnreadMessages(messageCount || 0);
      } catch (error) {
        console.error('Error fetching overview data:', error);
        toast({
          title: "Failed to load dashboard data",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  const formatDate = (dateString) => {
    // Fixed date formatting options to use literal values instead of strings
    const options = { 
      weekday: 'long' as const, 
      year: 'numeric' as const, 
      month: 'long' as const, 
      day: 'numeric' as const, 
      hour: '2-digit' as const, 
      minute: '2-digit' as const 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>Upcoming Appointments</span>
          </CardTitle>
          <CardDescription>Your next scheduled therapy sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-3">
                  <div className="font-medium">{appointment.profiles?.full_name || 'Therapist'}</div>
                  <div className="text-sm text-muted-foreground">{formatDate(appointment.start_time)}</div>
                  <div className="text-sm mt-1">{appointment.session_type}</div>
                </div>
              ))}
              <Button asChild variant="outline" className="w-full mt-2">
                <Link to="/client/appointments">View All Appointments</Link>
              </Button>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No upcoming appointments</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/therapists">Find a Therapist</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <span>Recent Notes</span>
          </CardTitle>
          <CardDescription>Session notes from your therapist</CardDescription>
        </CardHeader>
        <CardContent>
          {recentNotes.length > 0 ? (
            <div className="space-y-4">
              {recentNotes.map((note) => (
                <div key={note.id} className="border rounded-lg p-3">
                  <div className="font-medium">{note.title}</div>
                  <div className="text-sm text-muted-foreground">{new Date(note.created_at).toLocaleDateString()}</div>
                </div>
              ))}
              <Button asChild variant="outline" className="w-full mt-2">
                <Link to="/client/notes">View All Notes</Link>
              </Button>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No notes yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <span>Messages</span>
            {unreadMessages > 0 && (
              <span className="ml-2 text-sm bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                {unreadMessages} new
              </span>
            )}
          </CardTitle>
          <CardDescription>Communication with your therapist</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" className="w-full">
            <Link to="/client/messages">Go to Messages</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientOverview;

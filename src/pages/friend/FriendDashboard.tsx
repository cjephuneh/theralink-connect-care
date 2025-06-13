
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageCircle, FileText, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import FeedbackForm from "@/components/feedback/FeedbackForm";

const FriendDashboard = () => {
  const { profile, user } = useAuth();

  // Fetch friend's active clients/appointments
  const { data: clientStats } = useQuery({
    queryKey: ['friend-clients', user?.id],
    queryFn: async () => {
      if (!user?.id) return { activeClients: 0, totalSessions: 0 };
      
      const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('therapist_id', user.id)
        .eq('status', 'completed');
      
      const { data: activeAppointments } = await supabase
        .from('appointments')
        .select('client_id')
        .eq('therapist_id', user.id)
        .in('status', ['scheduled', 'confirmed']);
      
      const uniqueClients = new Set(activeAppointments?.map(a => a.client_id));
      
      return {
        activeClients: uniqueClients.size,
        totalSessions: appointments?.length || 0
      };
    },
    enabled: !!user?.id
  });

  // Fetch unread messages
  const { data: messageStats } = useQuery({
    queryKey: ['friend-messages', user?.id],
    queryFn: async () => {
      if (!user?.id) return { unreadCount: 0 };
      
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('receiver_id', user.id)
        .eq('is_read', false);
      
      return { unreadCount: data?.length || 0 };
    },
    enabled: !!user?.id
  });

  // Fetch session notes count
  const { data: notesStats } = useQuery({
    queryKey: ['friend-notes', user?.id],
    queryFn: async () => {
      if (!user?.id) return { notesCount: 0 };
      
      const { data } = await supabase
        .from('session_notes')
        .select('*')
        .eq('therapist_id', user.id);
      
      return { notesCount: data?.length || 0 };
    },
    enabled: !!user?.id
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {profile?.full_name || 'Friend'}
        </h2>
        <p className="text-muted-foreground">
          Thank you for being a Friend on TheraLink. You're making a positive impact by sharing your experiences.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientStats?.activeClients || 0}</div>
            <p className="text-xs text-muted-foreground">
              People you're currently supporting
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Messages</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messageStats?.unreadCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Unread messages from clients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Session Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notesStats?.notesCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Notes from your sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientStats?.totalSessions || 0}</div>
            <p className="text-xs text-muted-foreground">
              Completed support sessions
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Impact as a Friend</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Your personal experience and empathy make a real difference in people's lives. 
            As you connect with more clients, your impact will grow.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {clientStats?.activeClients || 0}
              </div>
              <p className="text-sm text-muted-foreground">People Currently Supported</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-secondary">
                {clientStats?.totalSessions || 0}
              </div>
              <p className="text-sm text-muted-foreground">Lives Touched</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button>View Clients</Button>
            <Button variant="outline">Update Profile</Button>
          </div>
        </CardContent>
      </Card>

      <FeedbackForm dashboardType="friend" />
    </div>
  );
};

export default FriendDashboard;

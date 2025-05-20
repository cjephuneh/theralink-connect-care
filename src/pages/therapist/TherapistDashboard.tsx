
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, ChevronRight, Clock, MessageCircle, Users, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const TherapistDashboard = () => {
  const [timeFrame, setTimeFrame] = useState<"week" | "month" | "year">("week");
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [statistics, setStatistics] = useState({
    totalClients: 0,
    activeClients: 0,
    upcomingSessions: 0,
    completedSessions: 0,
    clientRetention: 0,
    messageResponseRate: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!user) return;
    
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch upcoming appointments
        const today = new Date();
        const { data: appointments, error: appointmentsError } = await supabase
          .from('appointments')
          .select(`
            id,
            start_time,
            end_time,
            status,
            session_type,
            notes,
            profiles!appointments_client_id_fkey(full_name, profile_image_url)
          `)
          .eq('therapist_id', user.id)
          .gte('start_time', today.toISOString())
          .order('start_time', { ascending: true })
          .limit(5);
          
        if (appointmentsError) throw appointmentsError;
        
        // Format appointments data
        const formattedAppointments = appointments?.map(appointment => ({
          id: appointment.id,
          client: appointment.profiles?.full_name || "Unknown Client",
          avatar: appointment.profiles?.profile_image_url || "/placeholder.svg",
          date: formatAppointmentDate(appointment.start_time),
          time: formatAppointmentTime(appointment.start_time),
          type: appointment.session_type === 'video' ? 'video' : 'chat'
        })) || [];
        
        setUpcomingAppointments(formattedAppointments);
        
        // Fetch recent messages
        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select(`
            id,
            content,
            created_at,
            is_read,
            profiles!messages_sender_id_fkey(full_name, profile_image_url)
          `)
          .eq('receiver_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (messagesError) throw messagesError;
        
        // Format messages data
        const formattedMessages = messages?.map(message => ({
          id: message.id,
          client: message.profiles?.full_name || "Unknown Client",
          avatar: message.profiles?.profile_image_url || "/placeholder.svg",
          message: message.content,
          time: formatMessageTime(message.created_at),
          unread: !message.is_read
        })) || [];
        
        setRecentMessages(formattedMessages);
        
        // Fetch statistics data
        const { data: clientsCount, error: clientsError } = await supabase
          .from('appointments')
          .select('client_id', { count: 'exact', head: true })
          .eq('therapist_id', user.id)
          .not('client_id', 'is', null);
          
        if (clientsError) throw clientsError;
        
        const { data: activeClientsCount, error: activeClientsError } = await supabase
          .from('appointments')
          .select('client_id', { count: 'exact', head: true })
          .eq('therapist_id', user.id)
          .gte('start_time', new Date(today.setDate(today.getDate() - 30)).toISOString())
          .not('client_id', 'is', null);
          
        if (activeClientsError) throw activeClientsError;
        
        const { count: upcomingCount, error: upcomingError } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('therapist_id', user.id)
          .gte('start_time', new Date().toISOString());
          
        if (upcomingError) throw upcomingError;
        
        const { count: completedCount, error: completedError } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('therapist_id', user.id)
          .eq('status', 'completed');
          
        if (completedError) throw completedError;
        
        // Calculate message response rate
        const { data: sentMessages, error: sentMessagesError } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('sender_id', user.id);
          
        if (sentMessagesError) throw sentMessagesError;
        
        // Calculate client retention (simplified version)
        // This would be more complex in a real app, considering repeat appointments, etc.
        let retentionRate = 0;
        if (clientsCount && activeClientsCount) {
          retentionRate = (activeClientsCount.count / clientsCount.count) * 100;
        }
        
        // Set statistics
        setStatistics({
          totalClients: clientsCount?.count || 0,
          activeClients: activeClientsCount?.count || 0,
          upcomingSessions: upcomingCount || 0,
          completedSessions: completedCount || 0,
          clientRetention: Math.round(retentionRate) || 85, // Fallback value
          messageResponseRate: 92 // Could be calculated based on message response times
        });
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user, toast]);
  
  // Helper functions for formatting dates and times
  const formatAppointmentDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return new Date(dateString).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      });
    }
  };
  
  const formatAppointmentTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit'
    });
  };
  
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-t-transparent border-primary rounded-full animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back. Here's what's happening today.</p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Clients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.activeClients} currently active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Sessions
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.upcomingSessions}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingAppointments.filter(a => a.date === "Today").length} today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Client Retention
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.clientRetention}%</div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
              <div
                className="h-1.5 rounded-full bg-primary"
                style={{ width: `${statistics.clientRetention}%` }}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Response Rate
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.messageResponseRate}%</div>
            <Progress value={statistics.messageResponseRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Appointments */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>
              You have {statistics.upcomingSessions} upcoming appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={appointment.avatar} />
                        <AvatarFallback>{appointment.client.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{appointment.client}</p>
                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>{appointment.date} at {appointment.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={appointment.type === "video" ? "default" : "outline"}>
                        {appointment.type === "video" ? (
                          <Video className="h-3 w-3 mr-1" />
                        ) : (
                          <MessageCircle className="h-3 w-3 mr-1" />
                        )}
                        {appointment.type === "video" ? "Video" : "Chat"}
                      </Badge>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/${appointment.type}/${appointment.id}`}>
                          Join
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button asChild variant="outline" className="w-full mt-2">
                  <Link to="/therapist/appointments" className="flex items-center justify-center">
                    View All Appointments
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">No upcoming appointments</h3>
                <p className="text-muted-foreground mt-1">
                  You don't have any appointments scheduled yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Recent Messages */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>
              You have {recentMessages.filter(m => m.unread).length} unread messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentMessages.length > 0 ? (
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-center space-x-4 rounded-lg border p-3 ${
                      message.unread ? "bg-accent/30" : ""
                    } hover:bg-accent/50 transition-colors`}
                  >
                    <Avatar>
                      <AvatarImage src={message.avatar} />
                      <AvatarFallback>{message.client.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{message.client}</p>
                        <span className="text-xs text-muted-foreground">{message.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {message.message}
                      </p>
                    </div>
                    {message.unread && (
                      <Badge className="h-2 w-2 rounded-full p-0" />
                    )}
                  </div>
                ))}
                
                <Button asChild variant="outline" className="w-full mt-2">
                  <Link to="/therapist/messages" className="flex items-center justify-center">
                    View All Messages
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">No messages yet</h3>
                <p className="text-muted-foreground mt-1">
                  When clients message you, they'll appear here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Analytics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Analytics</CardTitle>
            <Tabs defaultValue="week" onValueChange={(value) => setTimeFrame(value as "week" | "month" | "year")}>
              <TabsList>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <CardDescription>
            {timeFrame === "week" && "Your activity during the past 7 days"}
            {timeFrame === "month" && "Your activity during the past 30 days"}
            {timeFrame === "year" && "Your activity during the past 12 months"}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <div className="h-[200px] flex items-center justify-center text-center">
            <div className="text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="font-medium">Analytics data visualization will appear here</p>
              <p className="text-sm">Session hours, client growth, and revenue over time</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Links */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Button asChild variant="outline" className="h-auto py-4 gap-4 justify-start">
          <Link to="/therapist/clients">
            <Users className="h-6 w-6" />
            <div className="text-left">
              <p className="font-medium">View Clients</p>
              <p className="text-xs text-muted-foreground">Manage your client list</p>
            </div>
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="h-auto py-4 gap-4 justify-start">
          <Link to="/therapist/appointments">
            <Calendar className="h-6 w-6" />
            <div className="text-left">
              <p className="font-medium">Schedule Sessions</p>
              <p className="text-xs text-muted-foreground">Manage your availability</p>
            </div>
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="h-auto py-4 gap-4 justify-start">
          <Link to="/therapist/session-notes">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-6 w-6"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
              <path d="M10 9H8" />
            </svg>
            <div className="text-left">
              <p className="font-medium">Session Notes</p>
              <p className="text-xs text-muted-foreground">Client records and notes</p>
            </div>
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="h-auto py-4 gap-4 justify-start">
          <Link to="/therapist/settings">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-6 w-6"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <div className="text-left">
              <p className="font-medium">Settings</p>
              <p className="text-xs text-muted-foreground">Preferences and account</p>
            </div>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default TherapistDashboard;

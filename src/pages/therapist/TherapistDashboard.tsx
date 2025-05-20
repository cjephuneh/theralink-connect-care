
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, DollarSign, MessageSquare, Users, Star, BarChart2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

// Define types for clarity
interface AppointmentData {
  id: string;
  start_time: string;
  client: {
    full_name: string;
    profile_image_url: string | null;
  };
}

interface MessageData {
  id: string;
  created_at: string;
  content: string;
  sender: {
    full_name: string;
    profile_image_url: string | null;
  };
}

interface StatisticsData {
  totalClients: number;
  totalAppointments: number;
  totalEarnings: number;
  averageRating: number;
  uniqueClientCount: number;
  activeClientPercentage: number;
}

const TherapistDashboard = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState<AppointmentData[]>([]);
  const [recentMessages, setRecentMessages] = useState<MessageData[]>([]);
  const [stats, setStats] = useState<StatisticsData>({
    totalClients: 0,
    totalAppointments: 0,
    totalEarnings: 0,
    averageRating: 0,
    uniqueClientCount: 0,
    activeClientPercentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Fetch upcoming appointments with client data
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select(`
            id,
            start_time,
            client:client_id (
              full_name,
              profile_image_url
            )
          `)
          .eq('therapist_id', user.id)
          .eq('status', 'scheduled')
          .gt('start_time', new Date().toISOString())
          .order('start_time', { ascending: true })
          .limit(5);

        if (appointmentsError) throw appointmentsError;
        
        // Transform the data to make TypeScript happy
        const processedAppointments: AppointmentData[] = appointmentsData.map(appt => ({
          id: appt.id,
          start_time: appt.start_time,
          client: {
            full_name: appt.client?.full_name || 'Unknown Client',
            profile_image_url: appt.client?.profile_image_url || null
          }
        }));
        
        setUpcomingAppointments(processedAppointments);

        // Fetch recent messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select(`
            id,
            content,
            created_at,
            sender:sender_id (
              full_name,
              profile_image_url
            )
          `)
          .eq('receiver_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (messagesError) throw messagesError;
        
        // Transform the message data
        const processedMessages: MessageData[] = messagesData.map(msg => ({
          id: msg.id,
          created_at: msg.created_at,
          content: msg.content,
          sender: {
            full_name: msg.sender?.full_name || 'Unknown Sender',
            profile_image_url: msg.sender?.profile_image_url || null
          }
        }));
        
        setRecentMessages(processedMessages);

        // Fetch statistics data
        const [
          appointmentsCountResult,
          earningsResult,
          ratingsResult,
          clientsResult
        ] = await Promise.all([
          supabase
            .from('appointments')
            .select('id', { count: 'exact' })
            .eq('therapist_id', user.id),
          
          supabase
            .from('transactions')
            .select('amount')
            .eq('therapist_id', user.id)
            .eq('transaction_type', 'payment'),
          
          supabase
            .from('reviews')
            .select('rating')
            .eq('therapist_id', user.id),
          
          supabase
            .from('appointments')
            .select('client_id')
            .eq('therapist_id', user.id)
            .order('client_id')
        ]);

        // Calculate unique clients
        const uniqueClientsSet = new Set();
        clientsResult.data?.forEach(item => uniqueClientsSet.add(item.client_id));
        const uniqueClientsCount = uniqueClientsSet.size;

        // Calculate total earnings
        const totalEarnings = earningsResult.data?.reduce((sum, transaction) => 
          sum + (parseFloat(transaction.amount.toString()) || 0), 0) || 0;

        // Calculate average rating
        const allRatings = ratingsResult.data || [];
        const averageRating = allRatings.length > 0 
          ? allRatings.reduce((sum, review) => sum + review.rating, 0) / allRatings.length 
          : 0;

        // Update statistics state
        setStats({
          totalClients: uniqueClientsCount,
          totalAppointments: appointmentsCountResult.count || 0,
          totalEarnings,
          averageRating,
          uniqueClientCount: uniqueClientsCount,
          activeClientPercentage: uniqueClientsCount > 0 
            ? Math.round((uniqueClientsCount / (uniqueClientsCount + 5)) * 100) 
            : 0
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-t-transparent border-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your therapy practice</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Appointments</p>
                <h3 className="text-2xl font-bold">{stats.totalAppointments}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                <h3 className="text-2xl font-bold">{stats.totalClients}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                <h3 className="text-2xl font-bold">₦{stats.totalEarnings.toLocaleString()}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                <h3 className="text-2xl font-bold">{stats.averageRating.toFixed(1)} / 5</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>
              Your next scheduled sessions with clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center gap-4">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={appointment.client.profile_image_url || undefined} alt={appointment.client.full_name} />
                      <AvatarFallback>{appointment.client.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium leading-none">{appointment.client.full_name}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        {format(new Date(appointment.start_time), 'MMM dd, h:mm a')}
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate(`/therapist/appointments/${appointment.id}`)}
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-10 w-10 text-muted-foreground opacity-50" />
                <p className="mt-2 text-muted-foreground">No upcoming appointments</p>
              </div>
            )}
            <div className="mt-4 text-right">
              <Button 
                variant="link" 
                className="text-sm" 
                onClick={() => navigate('/therapist/appointments')}
              >
                View all appointments
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>
              Latest communications from your clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentMessages.length > 0 ? (
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="flex items-start gap-4">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={message.sender.profile_image_url || undefined} alt={message.sender.full_name} />
                      <AvatarFallback>{message.sender.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <p className="font-medium leading-none">{message.sender.full_name}</p>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(message.created_at), 'MMM dd')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground opacity-50" />
                <p className="mt-2 text-muted-foreground">No recent messages</p>
              </div>
            )}
            <div className="mt-4 text-right">
              <Button 
                variant="link" 
                className="text-sm" 
                onClick={() => navigate('/therapist/messages')}
              >
                View all messages
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Practice Analytics</CardTitle>
          <CardDescription>
            Key metrics and trends for your therapy practice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Client Acquisition</h4>
                <span className="text-sm text-muted-foreground">{stats.uniqueClientCount} unique clients</span>
              </div>
              <div className="h-4 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${stats.uniqueClientCount ? stats.activeClientPercentage : 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.activeClientPercentage}% of your target client base
              </p>
            </div>

            <div>
              <BarChart2 className="h-24 w-full text-muted-foreground opacity-50" />
              <div className="flex justify-center mt-2">
                <Button variant="outline" size="sm" onClick={() => navigate('/therapist/analytics')}>
                  View detailed analytics
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TherapistDashboard;

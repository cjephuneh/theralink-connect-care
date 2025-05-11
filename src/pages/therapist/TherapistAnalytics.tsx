
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, DollarSign, Clock } from 'lucide-react';

const TherapistAnalytics = () => {
  const [sessionsData, setSessionsData] = useState<any[]>([]);
  const [earningsData, setEarningsData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalClients: 0,
    totalEarnings: 0,
    averageRating: 0,
    completionRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!user) return;

      try {
        // Fetch all appointments for this therapist
        const { data: appointments, error: appointmentsError } = await supabase
          .from('appointments')
          .select('*')
          .eq('therapist_id', user.id);

        if (appointmentsError) throw appointmentsError;

        // Fetch all successful transactions for this therapist
        const { data: transactions, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .eq('therapist_id', user.id)
          .eq('status', 'success');

        if (transactionsError) throw transactionsError;

        // Fetch all reviews for this therapist
        const { data: reviews, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .eq('therapist_id', user.id);

        if (reviewsError) throw reviewsError;

        // Get unique client IDs
        const uniqueClients = new Set(appointments?.map(app => app.client_id) || []);
        
        // Calculate completion rate
        const completedSessions = appointments?.filter(app => app.status === 'completed').length || 0;
        const totalSessions = appointments?.length || 0;
        const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
        
        // Calculate average rating
        const totalRating = reviews?.reduce((sum, review) => sum + review.rating, 0) || 0;
        const averageRating = reviews?.length ? totalRating / reviews.length : 0;
        
        // Calculate total earnings
        const totalEarnings = transactions?.reduce((sum, tx) => sum + tx.amount, 0) || 0;

        // Prepare sessions data for chart (last 7 days)
        const last7Days = Array.from({length: 7}, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toISOString().split('T')[0]; // YYYY-MM-DD format
        }).reverse();

        const sessionsChartData = last7Days.map(date => {
          const count = appointments?.filter(app => 
            new Date(app.start_time).toISOString().split('T')[0] === date
          ).length || 0;
          
          return {
            date: new Date(date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}),
            sessions: count
          };
        });

        // Prepare earnings data for chart (last 7 days)
        const earningsChartData = last7Days.map(date => {
          const dailyEarnings = transactions?.filter(tx => 
            new Date(tx.created_at).toISOString().split('T')[0] === date
          ).reduce((sum, tx) => sum + tx.amount, 0) || 0;
          
          return {
            date: new Date(date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}),
            earnings: dailyEarnings
          };
        });

        setSessionsData(sessionsChartData);
        setEarningsData(earningsChartData);
        setStats({
          totalSessions,
          totalClients: uniqueClients.size,
          totalEarnings,
          averageRating,
          completionRate
        });

      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast({
          title: 'Error',
          description: 'Failed to load analytics data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [user, toast]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading analytics...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Performance Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalSessions}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unique Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalClients}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₦{stats.totalEarnings.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.completionRate.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sessions" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Sessions (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sessionsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="sessions" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="earnings">
          <Card>
            <CardHeader>
              <CardTitle>Earnings (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₦${value}`, 'Earnings']} />
                  <Bar dataKey="earnings" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TherapistAnalytics;

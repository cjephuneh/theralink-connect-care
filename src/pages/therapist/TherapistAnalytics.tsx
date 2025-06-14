
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { format, subMonths, startOfMonth } from 'date-fns';

interface AnalyticsData {
  monthlyAppointments: Array<{ month: string; appointments: number; earnings: number }>;
  sessionTypes: Array<{ name: string; value: number }>;
  reviewsData: Array<{ rating: number; count: number }>;
  totalStats: {
    totalAppointments: number;
    totalEarnings: number;
    averageRating: number;
    totalReviews: number;
  };
}

const TherapistAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    monthlyAppointments: [],
    sessionTypes: [],
    reviewsData: [],
    totalStats: { totalAppointments: 0, totalEarnings: 0, averageRating: 0, totalReviews: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;
      
      try {
        // Fetch appointments
        const { data: appointments, error: appointmentsError } = await supabase
          .from('appointments')
          .select('*')
          .eq('therapist_id', user.id)
          .eq('status', 'completed');
          
        if (appointmentsError) throw appointmentsError;

        // Fetch transactions for earnings
        const { data: transactions, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .eq('therapist_id', user.id)
          .eq('transaction_type', 'payment')
          .eq('status', 'completed');
          
        if (transactionsError) throw transactionsError;

        // Fetch reviews
        const { data: reviews, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .eq('therapist_id', user.id);
          
        if (reviewsError) throw reviewsError;

        // Process monthly data
        const monthlyData: Record<string, { appointments: number; earnings: number }> = {};
        const last6Months = Array.from({ length: 6 }, (_, i) => 
          startOfMonth(subMonths(new Date(), i))
        ).reverse();

        last6Months.forEach(date => {
          const monthKey = format(date, 'MMM yyyy');
          monthlyData[monthKey] = { appointments: 0, earnings: 0 };
        });

        appointments?.forEach(appointment => {
          const month = format(new Date(appointment.start_time), 'MMM yyyy');
          if (monthlyData[month]) {
            monthlyData[month].appointments++;
          }
        });

        transactions?.forEach(transaction => {
          const month = format(new Date(transaction.created_at), 'MMM yyyy');
          if (monthlyData[month]) {
            monthlyData[month].earnings += parseFloat(transaction.amount.toString());
          }
        });

        const monthlyAppointments = Object.entries(monthlyData).map(([month, data]) => ({
          month,
          appointments: data.appointments,
          earnings: data.earnings
        }));

        // Process session types
        const sessionTypeCounts: Record<string, number> = {};
        appointments?.forEach(appointment => {
          const type = appointment.session_type || 'Individual';
          sessionTypeCounts[type] = (sessionTypeCounts[type] || 0) + 1;
        });

        const sessionTypes = Object.entries(sessionTypeCounts).map(([name, value]) => ({
          name,
          value
        }));

        // Process reviews data
        const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews?.forEach(review => {
          ratingCounts[review.rating]++;
        });

        const reviewsData = Object.entries(ratingCounts).map(([rating, count]) => ({
          rating: parseInt(rating),
          count
        }));

        // Calculate totals
        const totalAppointments = appointments?.length || 0;
        const totalEarnings = transactions?.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0) || 0;
        const averageRating = reviews?.length ? 
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
        const totalReviews = reviews?.length || 0;

        setAnalyticsData({
          monthlyAppointments,
          sessionTypes,
          reviewsData,
          totalStats: {
            totalAppointments,
            totalEarnings,
            averageRating,
            totalReviews
          }
        });
        
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load analytics data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [user, toast]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading analytics data...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Insights into your therapy practice performance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{analyticsData.totalStats.totalAppointments}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Ksh{analyticsData.totalStats.totalEarnings.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{analyticsData.totalStats.averageRating.toFixed(1)}/5</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{analyticsData.totalStats.totalReviews}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.monthlyAppointments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="appointments" fill="#8884d8" name="Appointments" />
                <Line yAxisId="right" type="monotone" dataKey="earnings" stroke="#82ca9d" name="Earnings (Ksh)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Session Types Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.sessionTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData.sessionTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Review Ratings Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.reviewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Number of Reviews" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TherapistAnalytics;

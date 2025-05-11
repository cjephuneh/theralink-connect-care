
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';

const TherapistAnalytics = () => {
  const [appointmentStats, setAppointmentStats] = useState<any[]>([]);
  const [sessionTypeData, setSessionTypeData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;
      
      try {
        // Fetch appointments for this therapist
        const { data: appointments, error: appointmentsError } = await supabase
          .from('appointments')
          .select('*')
          .eq('therapist_id', user.id);
          
        if (appointmentsError) throw appointmentsError;
        
        // Process appointment data for statistics
        if (appointments) {
          // Group appointments by month
          const monthlyData: Record<string, number> = {};
          appointments.forEach(appointment => {
            const month = format(new Date(appointment.start_time), 'MMM yyyy');
            if (!monthlyData[month]) {
              monthlyData[month] = 0;
            }
            monthlyData[month]++;
          });
          
          // Convert to array for chart
          const chartData = Object.entries(monthlyData).map(([month, count]) => ({
            month,
            appointments: count
          }));
          
          // Sort by date
          chartData.sort((a, b) => {
            const dateA = new Date(a.month);
            const dateB = new Date(b.month);
            return dateA.getTime() - dateB.getTime();
          });
          
          setAppointmentStats(chartData);
          
          // Group appointments by session type
          const sessionTypes: Record<string, number> = {};
          appointments.forEach(appointment => {
            const type = appointment.session_type || 'Unknown';
            if (!sessionTypes[type]) {
              sessionTypes[type] = 0;
            }
            sessionTypes[type]++;
          });
          
          // Convert to array for pie chart
          const pieChartData = Object.entries(sessionTypes).map(([name, value]) => ({
            name,
            value
          }));
          
          setSessionTypeData(pieChartData);
        }
        
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
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{appointmentStats.reduce((sum, item) => sum + item.appointments, 0)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Most Popular Session Type</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {sessionTypeData.length > 0 
                ? sessionTypeData.reduce((prev, current) => (prev.value > current.value) ? prev : current).name
                : 'N/A'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Monthly Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {appointmentStats.length > 0 
                ? (appointmentStats.reduce((sum, item) => sum + item.appointments, 0) / appointmentStats.length).toFixed(1)
                : '0'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Monthly Appointments</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={appointmentStats}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="appointments" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Session Types</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sessionTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sessionTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TherapistAnalytics;

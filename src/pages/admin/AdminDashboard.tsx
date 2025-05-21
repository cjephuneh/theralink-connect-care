
import { useState, useEffect } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  Star,
  FileText,
  FileCheck,
  UserCog,
  MessageSquare
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [therapists, setTherapists] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    if (profile && profile.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access this page.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        // Fetch all users
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (userError) throw userError;
        setUsers(userData || []);

        // Fetch all therapists with their profiles
        const { data: therapistData, error: therapistError } = await supabase
          .from('therapists')
          .select(`
            *,
            profiles:id (*)
          `);
        
        if (therapistError) throw therapistError;
        setTherapists(therapistData || []);

        // Fetch all appointments
        const { data: appointmentData, error: appointmentError } = await supabase
          .from('appointments')
          .select('*')
          .order('start_time', { ascending: false });
        
        if (appointmentError) throw appointmentError;
        setAppointments(appointmentData || []);

        // Fetch all feedback
        const { data: feedbackData, error: feedbackError } = await supabase
          .from('feedback')
          .select(`
            *,
            profiles:user_id (full_name, email)
          `)
          .order('created_at', { ascending: false });
        
        if (feedbackError) throw feedbackError;
        setFeedback(feedbackData || []);

        // Fetch all contact messages
        const { data: contactData, error: contactError } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (contactError) throw contactError;
        setContactMessages(contactData || []);

      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [profile, toast, navigate]);

  const markFeedbackAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ is_read: true })
        .eq('id', id);
      
      if (error) throw error;
      
      setFeedback(feedback.map(item => 
        item.id === id ? { ...item, is_read: true } : item
      ));
      
      toast({
        title: 'Success',
        description: 'Feedback marked as read'
      });
    } catch (error) {
      console.error('Error marking feedback as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to update feedback status',
        variant: 'destructive',
      });
    }
  };
  
  const markContactMessageAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', id);
      
      if (error) throw error;
      
      setContactMessages(contactMessages.map(item => 
        item.id === id ? { ...item, is_read: true } : item
      ));
      
      toast({
        title: 'Success',
        description: 'Message marked as read'
      });
    } catch (error) {
      console.error('Error marking contact message as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to update message status',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{users.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Therapists</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{therapists.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{appointments.length}</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="users" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="therapists">Therapists</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="messages">Contact Messages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-mono text-xs">{user.id.substring(0, 8)}...</TableCell>
                        <TableCell>{user.full_name || 'N/A'}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="therapists">
          <Card>
            <CardHeader>
              <CardTitle>All Therapists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Specialization</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Hourly Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {therapists.map((therapist) => (
                      <TableRow key={therapist.id}>
                        <TableCell>{therapist.profiles?.full_name || 'N/A'}</TableCell>
                        <TableCell>{therapist.specialization || 'N/A'}</TableCell>
                        <TableCell>{therapist.rating || 'N/A'}</TableCell>
                        <TableCell>{therapist.years_experience} years</TableCell>
                        <TableCell>₦{therapist.hourly_rate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>All Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Client ID</TableHead>
                      <TableHead>Therapist ID</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-mono text-xs">{appointment.id.substring(0, 8)}...</TableCell>
                        <TableCell className="font-mono text-xs">{appointment.client_id.substring(0, 8)}...</TableCell>
                        <TableCell className="font-mono text-xs">{appointment.therapist_id.substring(0, 8)}...</TableCell>
                        <TableCell>{new Date(appointment.start_time).toLocaleString()}</TableCell>
                        <TableCell>{appointment.session_type}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>User Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Dashboard</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedback.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No feedback messages yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      feedback.map((item) => (
                        <TableRow key={item.id} className={!item.is_read ? 'bg-blue-50' : ''}>
                          <TableCell>{item.profiles?.full_name || 'Anonymous'}</TableCell>
                          <TableCell>{item.dashboard_type}</TableCell>
                          <TableCell className="max-w-xs truncate">{item.message}</TableCell>
                          <TableCell>
                            {item.rating ? (
                              <div className="flex">
                                {Array.from({ length: item.rating }).map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                ))}
                              </div>
                            ) : (
                              'No rating'
                            )}
                          </TableCell>
                          <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              item.is_read ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {item.is_read ? 'Read' : 'Unread'}
                            </span>
                          </TableCell>
                          <TableCell>
                            {!item.is_read && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => markFeedbackAsRead(item.id)}
                              >
                                Mark as Read
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Contact Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contactMessages.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No contact messages yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      contactMessages.map((message) => (
                        <TableRow key={message.id} className={!message.is_read ? 'bg-blue-50' : ''}>
                          <TableCell>{message.name}</TableCell>
                          <TableCell>{message.email}</TableCell>
                          <TableCell>{message.subject}</TableCell>
                          <TableCell className="max-w-xs truncate">{message.message}</TableCell>
                          <TableCell>{new Date(message.created_at).toLocaleString()}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              message.is_read ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {message.is_read ? 'Read' : 'Unread'}
                            </span>
                          </TableCell>
                          <TableCell>
                            {!message.is_read && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => markContactMessageAsRead(message.id)}
                              >
                                Mark as Read
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

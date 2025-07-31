import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { BookingRequestCard } from "@/components/booking/BookingRequestCard";

export const ClientBookings = () => {
  const [bookingRequests, setBookingRequests] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchBookingRequests();
      fetchAppointments();
    }
  }, [user]);

  const fetchBookingRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('booking_requests')
        .select(`
          *,
          profiles!booking_requests_therapist_id_fkey (
            full_name,
            email,
            profile_image_url
          )
        `)
        .eq('client_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookingRequests(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch booking requests",
        variant: "destructive",
      });
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          profiles!appointments_therapist_id_fkey (
            full_name,
            email,
            profile_image_url
          )
        `)
        .eq('client_id', user?.id)
        .order('start_time', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch appointments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = () => {
    fetchBookingRequests();
    fetchAppointments();
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground">Please log in to view your bookings.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-muted-foreground">
          Manage your therapy session requests and appointments
        </p>
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Booking Requests
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Scheduled Appointments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : bookingRequests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No booking requests yet</h3>
                <p className="text-muted-foreground">
                  Start by booking a session with one of our therapists
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookingRequests.map((request) => (
                <BookingRequestCard
                  key={request.id}
                  bookingRequest={request}
                  userRole="client"
                  onUpdate={handleUpdate}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No appointments scheduled</h3>
                <p className="text-muted-foreground">
                  Your confirmed appointments will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Session with {appointment.profiles.full_name}</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {appointment.status}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>Date:</strong> {new Date(appointment.start_time).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {new Date(appointment.start_time).toLocaleTimeString()}</p>
                      <p><strong>Type:</strong> {appointment.session_type}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
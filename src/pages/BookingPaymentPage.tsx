
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { PaystackService } from '@/services/PaystackService';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AppointmentData {
  id: string;
  therapist_id: string;
  therapist_name: string;
  date: string;
  time: string;
  hourly_rate: number;
  session_type: string;
}

const BookingPaymentPage = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  useEffect(() => {
    const fetchAppointmentData = async () => {
      if (!appointmentId) return;
      
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            id,
            therapist_id,
            start_time,
            session_type,
            therapists:therapist_id(
              hourly_rate,
              profiles:id(full_name)
            )
          `)
          .eq('id', appointmentId)
          .single();

        if (error) throw error;

        if (data) {
          const appointmentInfo: AppointmentData = {
            id: data.id,
            therapist_id: data.therapist_id,
            therapist_name: data.therapists.profiles.full_name,
            date: new Date(data.start_time).toLocaleDateString(),
            time: new Date(data.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            hourly_rate: data.therapists.hourly_rate,
            session_type: data.session_type
          };
          
          setAppointmentData(appointmentInfo);
        }
      } catch (error) {
        console.error('Error fetching appointment:', error);
        toast({
          title: 'Error',
          description: 'Failed to load appointment details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointmentData();
  }, [appointmentId, toast]);

  const handlePayment = async () => {
    if (!user || !appointmentData) return;
    
    setIsProcessing(true);
    
    try {
      // Initialize the transaction
      const paymentResponse = await PaystackService.initializeTransaction({
        email: user.email || '',
        amount: appointmentData.hourly_rate * 100, // Convert to kobo/cents
        callback_url: `${window.location.origin}/booking/complete/${appointmentData.therapist_id}/${encodeURIComponent(appointmentData.date)}/${encodeURIComponent(appointmentData.time)}`,
        metadata: {
          user_id: user.id,
          therapist_id: appointmentData.therapist_id,
          description: `Therapy session on ${appointmentData.date} at ${appointmentData.time}`
        }
      });

      if (paymentResponse.authorization_url) {
        window.location.href = paymentResponse.authorization_url;
      } else {
        throw new Error('Failed to get payment authorization URL');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: 'There was an issue processing your payment',
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading appointment details...</p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="container max-w-md mx-auto p-4 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-green-600">Payment Successful</CardTitle>
            <CardDescription className="text-center">Your appointment has been confirmed</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <p className="text-center">
              Thank you for your payment. Your session with {appointmentData?.therapist_name} has been scheduled.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto p-4 mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Booking</CardTitle>
          <CardDescription>Review and pay for your appointment</CardDescription>
        </CardHeader>
        <CardContent>
          {appointmentData && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Therapist:</span>
                <span className="font-medium">{appointmentData.therapist_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{appointmentData.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium">{appointmentData.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Session Type:</span>
                <span className="font-medium">{appointmentData.session_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-bold">₦{appointmentData.hourly_rate.toLocaleString()}</span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
          <Button 
            onClick={handlePayment} 
            disabled={isProcessing}
            className="bg-thera-600 hover:bg-thera-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Pay Now'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BookingPaymentPage;

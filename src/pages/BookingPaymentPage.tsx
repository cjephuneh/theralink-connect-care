
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PaystackService } from '@/services/PaystackService';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethodManager } from '@/components/payment/PaymentMethodManager';
import { useNotifications } from '@/components/notifications/NotificationProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const { addNotification } = useNotifications();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card');
  const [walletBalance, setWalletBalance] = useState(0);
  const [insufficientFunds, setInsufficientFunds] = useState(false);

  useEffect(() => {
    const fetchAppointmentData = async () => {
      if (!appointmentId) return;
      
      try {
        // First fetch the appointment details
        const { data: appointmentData, error: appointmentError } = await supabase
          .from('appointments')
          .select(`
            id,
            therapist_id,
            start_time,
            session_type
          `)
          .eq('id', appointmentId)
          .single();

        if (appointmentError) throw appointmentError;
        
        // Get the therapist details
        const { data: therapistData, error: therapistError } = await supabase
          .from('therapists')
          .select(`hourly_rate`)
          .eq('id', appointmentData.therapist_id)
          .single();
          
        if (therapistError) throw therapistError;
        
        // Get the therapist's profile information
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select(`full_name`)
          .eq('id', appointmentData.therapist_id)
          .single();
          
        if (profileError) throw profileError;

        // Get wallet balance
        if (user) {
          const { data: walletData, error: walletError } = await supabase
            .from('wallets')
            .select('balance')
            .eq('user_id', user.id)
            .single();
            
          if (!walletError && walletData) {
            setWalletBalance(walletData.balance);
            // Check if wallet has enough funds
            setInsufficientFunds(walletData.balance < therapistData.hourly_rate);
          }
        }

        if (appointmentData && therapistData && profileData) {
          const appointmentInfo: AppointmentData = {
            id: appointmentData.id,
            therapist_id: appointmentData.therapist_id,
            therapist_name: profileData.full_name || 'Unnamed Therapist',
            date: new Date(appointmentData.start_time).toLocaleDateString(),
            time: new Date(appointmentData.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            hourly_rate: therapistData.hourly_rate,
            session_type: appointmentData.session_type
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
  }, [appointmentId, toast, user]);

  const handleCardPayment = async () => {
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
        // For demo purposes, simulate successful payment instead of redirect
        simulateSuccessfulPayment();
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

  const handleWalletPayment = async () => {
    if (!user || !appointmentData) return;
    
    setIsProcessing(true);
    
    try {
      // Check wallet balance
      if (walletBalance < appointmentData.hourly_rate) {
        toast({
          title: 'Insufficient Balance',
          description: 'Your wallet does not have enough funds for this payment',
          variant: 'destructive',
        });
        setIsProcessing(false);
        return;
      }
      
      // Process payment using wallet
      const response = await PaystackService.makePaymentToTherapist({
        user_id: user.id,
        amount: appointmentData.hourly_rate,
        therapist_id: appointmentData.therapist_id,
        appointment_id: appointmentData.id
      });
      
      if (response.success) {
        // Update local wallet balance
        setWalletBalance(prev => prev - appointmentData.hourly_rate);
        
        // Simulate successful payment for demo purposes
        simulateSuccessfulPayment();
      } else {
        throw new Error('Wallet payment failed');
      }
    } catch (error) {
      console.error('Wallet payment error:', error);
      toast({
        title: 'Payment Failed',
        description: 'There was an issue processing your wallet payment',
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
  };

  const simulateSuccessfulPayment = () => {
    // For demo purposes, simulate a successful payment
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Add notification for the client
      addNotification({
        title: 'Appointment Booked Successfully',
        message: `Your session with ${appointmentData?.therapist_name} on ${appointmentData?.date} at ${appointmentData?.time} has been confirmed.`,
        type: 'success',
        read: false,
        action: '/client/appointments'
      });
      
      // Send notification to therapist (in a real app, this would be done server-side)
      // This is just for demonstration purposes
      toast({
        title: 'Booking Confirmed',
        description: 'Your appointment has been booked and the therapist has been notified',
      });
    }, 2000);
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
            <Button onClick={() => navigate('/client/appointments')}>View Appointments</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-lg mx-auto p-4 mt-8">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Complete Your Booking</CardTitle>
          <CardDescription>Review and pay for your appointment</CardDescription>
        </CardHeader>
        <CardContent>
          {appointmentData && (
            <div className="space-y-6">
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
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
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-bold">₦{appointmentData.hourly_rate.toLocaleString()}</span>
                </div>
              </div>
              
              <Tabs defaultValue="card" onValueChange={(value) => setPaymentMethod(value as 'card' | 'wallet')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="card">Pay with Card</TabsTrigger>
                  <TabsTrigger value="wallet">Pay from Wallet</TabsTrigger>
                </TabsList>
                
                <TabsContent value="card" className="space-y-4 py-4">
                  <PaymentMethodManager />
                </TabsContent>
                
                <TabsContent value="wallet" className="space-y-4 py-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Wallet Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center p-4">
                        <p className="text-2xl font-bold mb-2">₦{walletBalance.toLocaleString()}</p>
                        {insufficientFunds ? (
                          <p className="text-destructive text-sm">
                            Insufficient funds. Please add money to your wallet or use a card.
                          </p>
                        ) : (
                          <p className="text-green-600 text-sm">
                            You have enough funds to complete this payment.
                          </p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => navigate('/client/billing')}
                        variant="outline" 
                        className="w-full"
                      >
                        Fund Wallet
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
          <Button 
            onClick={paymentMethod === 'card' ? handleCardPayment : handleWalletPayment} 
            disabled={isProcessing || (paymentMethod === 'wallet' && insufficientFunds)}
            className="bg-primary hover:bg-primary/90"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                {paymentMethod === 'card' ? 'Pay with Card' : 'Pay from Wallet'}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BookingPaymentPage;

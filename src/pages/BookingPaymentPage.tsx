
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PaystackService } from "@/services/PaystackService";
import { Wallet, CreditCard, Loader2 } from "lucide-react";

const BookingPaymentPage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [appointmentData, setAppointmentData] = useState<any>(null);
  const [therapistData, setTherapistData] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "card">("wallet");
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch appointment and therapist data
  useEffect(() => {
    if (!user || !appointmentId) return;

    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        // Fetch appointment data
        const { data: appointmentData, error: appointmentError } = await supabase
          .from('appointments')
          .select('*')
          .eq('id', appointmentId)
          .single();

        if (appointmentError) {
          throw appointmentError;
        }

        if (!appointmentData) {
          toast({
            title: "Appointment not found",
            description: "The appointment you are trying to pay for does not exist.",
            variant: "destructive",
          });
          navigate('/dashboard');
          return;
        }

        // Check if appointment belongs to current user
        if (appointmentData.client_id !== user.id) {
          toast({
            title: "Access denied",
            description: "You don't have permission to access this appointment.",
            variant: "destructive",
          });
          navigate('/dashboard');
          return;
        }

        setAppointmentData(appointmentData);

        // Fetch therapist data
        const { data: therapistData, error: therapistError } = await supabase.rpc(
          'get_therapist_with_profile',
          { p_therapist_id: appointmentData.therapist_id }
        );

        if (therapistError) {
          throw therapistError;
        }

        setTherapistData(therapistData);

        // Fetch wallet balance
        const { data: walletData, error: walletError } = await supabase
          .from('wallets')
          .select('balance')
          .eq('user_id', user.id)
          .single();

        if (walletError) {
          throw walletError;
        }

        setWalletBalance(walletData.balance);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load appointment details.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [appointmentId, user, navigate, toast]);

  const handlePayWithWallet = async () => {
    if (!user || !appointmentData || !therapistData) return;

    setIsProcessing(true);
    try {
      // Check if wallet balance is sufficient
      if (walletBalance < therapistData.hourly_rate) {
        toast({
          title: "Insufficient balance",
          description: "Please top up your wallet or select a different payment method.",
          variant: "destructive",
        });
        return;
      }

      // Process wallet payment
      const response = await PaystackService.makePaymentToTherapist({
        user_id: user.id,
        therapist_id: therapistData.id,
        amount: therapistData.hourly_rate,
        appointment_id: appointmentData.id,
      });

      if (response && response.success) {
        toast({
          title: "Payment successful",
          description: "Your session has been successfully paid for.",
        });
        // Update local wallet balance
        setWalletBalance(walletBalance - therapistData.hourly_rate);
        // Redirect to confirmation page
        navigate(`/booking/complete/${therapistData.id}/${appointmentData.start_time}/${appointmentData.end_time}`);
      } else {
        throw new Error("Payment failed");
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayWithCard = async () => {
    if (!user || !appointmentData || !therapistData) return;

    setIsProcessing(true);
    try {
      const callback_url = `${window.location.origin}/booking/complete/${therapistData.id}/${appointmentData.start_time}/${appointmentData.end_time}?verify=true&appointment=${appointmentData.id}`;
      
      const response = await PaystackService.initializeTransaction({
        email: user.email || '',
        amount: therapistData.hourly_rate,
        callback_url,
        metadata: {
          user_id: user.id,
          therapist_id: therapistData.id,
          description: `Payment for session with ${therapistData.full_name}`
        }
      });

      if (response && response.status) {
        // Redirect to Paystack payment page
        window.location.href = response.data.authorization_url;
      } else {
        throw new Error(response.message || "Failed to initialize payment");
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: error.message || "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === "wallet") {
      handlePayWithWallet();
    } else {
      handlePayWithCard();
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoadingData) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-thera-600" />
          <p>Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!appointmentData || !therapistData) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-12">
        <div className="text-center">
          <p className="text-lg mb-4">Appointment details not found</p>
          <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Complete Your Booking</h1>
          <p className="text-muted-foreground mt-2">Please select your payment method</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>
                  Choose how you want to pay for your session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-md border p-4 bg-muted/30">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Session with</div>
                    <div className="font-medium">{therapistData.full_name}</div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="text-sm text-muted-foreground">Date & Time</div>
                    <div>{formatDate(appointmentData.start_time)}</div>
                  </div>
                </div>

                <div>
                  <Label>Select Payment Method</Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value as "wallet" | "card")}
                    className="mt-3"
                  >
                    <div className="flex items-center space-x-2 border rounded-md p-4 mb-3">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet" className="flex items-center cursor-pointer">
                        <Wallet className="h-4 w-4 mr-2" />
                        <div>
                          <div>Wallet Balance</div>
                          <div className="text-sm text-muted-foreground">
                            Available: ₦{walletBalance.toFixed(2)}
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-4">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center cursor-pointer">
                        <CreditCard className="h-4 w-4 mr-2" />
                        <div>Pay with Card</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {paymentMethod === "wallet" && walletBalance < therapistData.hourly_rate && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-md text-sm">
                    Your wallet balance is insufficient for this payment. Please top up your wallet or select a different payment method.
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing || (paymentMethod === "wallet" && walletBalance < therapistData.hourly_rate)}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ₦${therapistData.hourly_rate?.toFixed(2) || '0.00'}`
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Session Fee</span>
                  <span>₦{therapistData.hourly_rate?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>₦{therapistData.hourly_rate?.toFixed(2) || '0.00'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPaymentPage;


import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, CreditCard, ArrowRight, Shield } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { PaystackService } from '@/services/PaystackService';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { createNotification } from '@/utils/notifications';

interface AppointmentData {
  id: string;
  therapist_id: string;
  therapist_name: string;
  date: string;
  time: string;
  hourly_rate: number;
  session_type: string;
}

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

const BookingPaymentPage = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showAddCardDialog, setShowAddCardDialog] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [paymentTab, setPaymentTab] = useState<string>("card");
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  // Form state for new payment method
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

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
        
        // Fetch user's wallet balance
        if (user) {
          const { data: walletData, error: walletError } = await supabase
            .from('wallets')
            .select('balance')
            .eq('user_id', user.id)
            .single();
            
          if (walletError) {
            console.error('Error fetching wallet:', walletError);
          } else {
            setWalletBalance(walletData?.balance || 0);
          }
          
          // Mock payment methods for the demo
          setPaymentMethods([
            { 
              id: 'pm_1234', 
              type: 'visa', 
              last4: '4242', 
              expiry: '12/25', 
              isDefault: true 
            },
            { 
              id: 'pm_5678', 
              type: 'mastercard', 
              last4: '8888', 
              expiry: '06/26', 
              isDefault: false 
            }
          ]);
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

  const handlePayWithCard = async () => {
    if (!user || !appointmentData) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          therapist_id: appointmentData.therapist_id,
          amount: appointmentData.hourly_rate,
          transaction_type: 'payment',
          reference: `booking-${Date.now()}`,
          status: 'completed',
          description: `Payment for ${appointmentData.session_type} session on ${appointmentData.date} at ${appointmentData.time}`
        })
        .select()
        .single();
      
      if (transactionError) throw transactionError;
      
      // Update appointment with payment information
      const { error: appointmentError } = await supabase
        .from('appointments')
        .update({ 
          status: 'confirmed',
          payment_id: transaction.id 
        })
        .eq('id', appointmentData.id);
        
      if (appointmentError) throw appointmentError;
      
      // Create notification for client
      await createNotification({
        user_id: user.id,
        title: 'Booking Confirmed',
        message: `Your appointment with ${appointmentData.therapist_name} on ${appointmentData.date} at ${appointmentData.time} has been confirmed.`,
        type: 'appointment',
        action_url: `/client/appointments`
      });
      
      // Create notification for therapist
      await createNotification({
        user_id: appointmentData.therapist_id,
        title: 'New Appointment',
        message: `You have a new ${appointmentData.session_type} session booked on ${appointmentData.date} at ${appointmentData.time}.`,
        type: 'appointment',
        action_url: `/therapist/appointments`
      });

      setIsSuccess(true);
      setShowSuccessDialog(true);
      
      toast({
        title: 'Payment Successful',
        description: 'Your booking has been confirmed!',
        variant: 'default',
      });
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: 'There was an issue processing your payment',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayWithWallet = async () => {
    if (!user || !appointmentData) return;
    
    // Check if wallet has enough balance
    if (walletBalance < appointmentData.hourly_rate) {
      toast({
        title: 'Insufficient Balance',
        description: 'Your wallet balance is not enough for this booking',
        variant: 'destructive',
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Process payment from wallet
      const paymentResponse = await PaystackService.makePaymentToTherapist({
        user_id: user.id,
        amount: appointmentData.hourly_rate,
        therapist_id: appointmentData.therapist_id,
        appointment_id: appointmentData.id
      });

      if (!paymentResponse.success) {
        throw new Error(paymentResponse.message || 'Payment failed');
      }
      
      // Update wallet balance locally
      setWalletBalance(prevBalance => prevBalance - appointmentData.hourly_rate);
      
      // Create notification for client
      await createNotification({
        user_id: user.id,
        title: 'Booking Confirmed',
        message: `Your appointment with ${appointmentData.therapist_name} on ${appointmentData.date} at ${appointmentData.time} has been confirmed.`,
        type: 'appointment',
        action_url: `/client/appointments`
      });
      
      // Create notification for therapist
      await createNotification({
        user_id: appointmentData.therapist_id,
        title: 'New Appointment',
        message: `You have a new ${appointmentData.session_type} session booked on ${appointmentData.date} at ${appointmentData.time}.`,
        type: 'appointment',
        action_url: `/therapist/appointments`
      });

      setIsSuccess(true);
      setShowSuccessDialog(true);
      
      toast({
        title: 'Payment Successful',
        description: 'Your booking has been confirmed!',
        variant: 'default',
      });
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: 'There was an issue processing your payment',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddCard = async () => {
    // Validate form fields
    if (!cardName || !cardNumber || !cardExpiry || !cardCvc) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all card details',
        variant: 'destructive',
      });
      return;
    }
    
    // Simple validation for card number format (16 digits)
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      toast({
        title: 'Invalid Card Number',
        description: 'Please enter a valid 16-digit card number',
        variant: 'destructive',
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate adding a card
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add the new card to the list (in a real app, this would be stored in the database)
      const newCard = {
        id: `pm_${Math.random().toString(36).substring(2, 10)}`,
        type: cardNumber.startsWith('4') ? 'visa' : 'mastercard',
        last4: cardNumber.slice(-4),
        expiry: cardExpiry,
        isDefault: paymentMethods.length === 0
      };
      
      setPaymentMethods(prev => [...prev, newCard]);
      setSelectedPaymentMethod(newCard.id);
      setShowAddCardDialog(false);
      
      // Reset form
      setCardName('');
      setCardNumber('');
      setCardExpiry('');
      setCardCvc('');
      
      toast({
        title: 'Card Added',
        description: 'Your payment method has been added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add payment method',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    if (paymentTab === 'wallet') {
      handlePayWithWallet();
    } else {
      handlePayWithCard();
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };
  
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      let formatted = value;
      if (value.length > 2) {
        formatted = value.slice(0, 2) + '/' + value.slice(2);
      }
      setCardExpiry(formatted);
    }
  };

  const navigateToDashboard = () => {
    navigate('/client/appointments');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading appointment details...</p>
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
              <div className="flex justify-between border-t pt-4 mt-4">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-bold">Ksh{appointmentData.hourly_rate.toLocaleString()}</span>
              </div>
              
              <Tabs defaultValue="card" className="w-full mt-6" onValueChange={setPaymentTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="card">Credit Card</TabsTrigger>
                  <TabsTrigger value="wallet">
                    Wallet (Ksh{walletBalance.toLocaleString()})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="card" className="space-y-4 pt-4">
                  {paymentMethods.length > 0 ? (
                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <div 
                          key={method.id}
                          className={`border rounded-lg p-3 flex items-center justify-between cursor-pointer transition-colors ${
                            selectedPaymentMethod === method.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedPaymentMethod(method.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center text-white text-xs">
                              {method.type.toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium">•••• {method.last4}</p>
                              <p className="text-xs text-muted-foreground">Expires {method.expiry}</p>
                            </div>
                          </div>
                          {method.isDefault && <Badge variant="outline">Default</Badge>}
                        </div>
                      ))}
                      
                      <Button 
                        variant="outline" 
                        className="w-full mt-2 border-dashed"
                        onClick={() => setShowAddCardDialog(true)}
                      >
                        <CreditCard className="mr-2 h-4 w-4" /> Add New Card
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground mb-4">No payment methods found</p>
                      <Button onClick={() => setShowAddCardDialog(true)}>
                        <CreditCard className="mr-2 h-4 w-4" /> Add Payment Method
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="wallet" className="space-y-4 pt-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span>Current Balance:</span>
                      <span className="font-bold">Ksh{walletBalance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Required:</span>
                      <span className="font-medium">Ksh{appointmentData.hourly_rate.toLocaleString()}</span>
                    </div>
                    <div className="border-t mt-2 pt-2 flex justify-between font-medium">
                      <span>Balance after payment:</span>
                      <span className={walletBalance >= appointmentData.hourly_rate ? 'text-green-600' : 'text-red-600'}>
                        Ksh{(walletBalance - appointmentData.hourly_rate).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  {walletBalance < appointmentData.hourly_rate && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                      <p className="text-amber-800 text-sm">
                        Your wallet balance is insufficient. Please add funds or select another payment method.
                      </p>
                      <Button 
                        className="w-full mt-2" 
                        variant="outline"
                        onClick={() => navigate('/client/billing')}
                      >
                        Add Funds to Wallet
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
          <Button 
            onClick={handlePayment} 
            disabled={isProcessing || (paymentTab === 'card' && !selectedPaymentMethod) || (paymentTab === 'wallet' && walletBalance < (appointmentData?.hourly_rate || 0))}
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
      
      <div className="mt-4 text-xs text-center text-muted-foreground flex items-center justify-center">
        <Shield className="h-3 w-3 mr-1" />
        <span>Secure payment processing. Your data is protected.</span>
      </div>
      
      {/* Add New Card Dialog */}
      <Dialog open={showAddCardDialog} onOpenChange={setShowAddCardDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Enter your card details below
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name on Card</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="number">Card Number</Label>
              <Input
                id="number"
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={handleCardNumberChange}
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={handleExpiryChange}
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  placeholder="123"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  maxLength={3}
                  type="password"
                />
              </div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg text-xs text-muted-foreground">
              <p>For testing, you can use:</p>
              <p>Card number: 4242 4242 4242 4242</p>
              <p>Expiry: Any future date</p>
              <p>CVC: Any 3 digits</p>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setShowAddCardDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCard} disabled={isProcessing}>
              {isProcessing ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
              ) : (
                'Add Card'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Booking Confirmed!</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="bg-green-100 rounded-full p-3 mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <p className="text-center mb-4">
              Your appointment with {appointmentData?.therapist_name} has been successfully booked.
            </p>
            <div className="bg-muted/50 p-4 rounded-lg w-full">
              <p className="font-medium">Appointment Details</p>
              <div className="text-sm mt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{appointmentData?.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{appointmentData?.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>Session Type:</span>
                  <span>{appointmentData?.session_type}</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={navigateToDashboard} className="w-full">
              <ArrowRight className="mr-2 h-4 w-4" /> View My Appointments
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingPaymentPage;


import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Plus, Check, Trash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNotifications } from '@/components/notifications/NotificationProvider';

// Mock payment methods for testing
const TEST_PAYMENT_METHODS = [
  { id: '1', last4: '4242', brand: 'visa', expMonth: 12, expYear: 2028 },
  { id: '2', last4: '5555', brand: 'mastercard', expMonth: 8, expYear: 2026 }
];

export function PaymentMethodManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvc, setCvc] = useState('');
  
  useEffect(() => {
    // In a real app, fetch from Stripe via an edge function
    // For now, use mock data
    setPaymentMethods(TEST_PAYMENT_METHODS);
    if (TEST_PAYMENT_METHODS.length > 0) {
      setSelectedMethod(TEST_PAYMENT_METHODS[0].id);
    }
  }, [user]);
  
  const handleSubmitCard = () => {
    setIsLoading(true);
    
    // Validate form data
    if (!cardNumber || !cardName || !expiryMonth || !expiryYear || !cvc) {
      toast({
        title: "Incomplete information",
        description: "Please fill in all card details",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // For testing, simulate a successful card addition
    setTimeout(() => {
      const last4 = cardNumber.slice(-4);
      const brand = cardNumber.startsWith('4') ? 'visa' : 
                   cardNumber.startsWith('5') ? 'mastercard' : 'unknown';
      
      const newCard = {
        id: `new-${Date.now()}`,
        last4,
        brand,
        expMonth: parseInt(expiryMonth),
        expYear: parseInt(expiryYear)
      };
      
      setPaymentMethods(prev => [...prev, newCard]);
      setSelectedMethod(newCard.id);
      
      // Reset form
      setCardNumber('');
      setCardName('');
      setExpiryMonth('');
      setExpiryYear('');
      setCvc('');
      
      // Close dialog
      setIsAddDialogOpen(false);
      setIsLoading(false);
      
      toast({
        title: "Payment method added",
        description: `${brand.charAt(0).toUpperCase() + brand.slice(1)} card ending in ${last4} added successfully`,
      });
      
      // Add notification
      addNotification({
        title: 'New Payment Method Added',
        message: `You've successfully added a ${brand} card ending in ${last4} to your account.`,
        type: 'payment',
        read: false
      });
    }, 1500);
  };
  
  const removePaymentMethod = (id: string) => {
    const methodToRemove = paymentMethods.find(m => m.id === id);
    
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
    
    if (selectedMethod === id && paymentMethods.length > 1) {
      // Select another card if available
      const remainingMethods = paymentMethods.filter(m => m.id !== id);
      if (remainingMethods.length > 0) {
        setSelectedMethod(remainingMethods[0].id);
      } else {
        setSelectedMethod('');
      }
    }
    
    toast({
      title: "Payment method removed",
      description: `Card ending in ${methodToRemove?.last4} has been removed`,
    });
  };
  
  const formatCardNumber = (value: string) => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Limit to 19 digits (16 + 3 spaces)
    const limitedDigits = digits.substring(0, 16);
    
    // Add spaces after every 4 digits
    let formatted = '';
    for (let i = 0; i < limitedDigits.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += limitedDigits[i];
    }
    
    return formatted;
  };
  
  const getCardBrandIcon = (brand: string) => {
    // In a real app, you would use proper card brand SVGs
    // For simplicity, just return the brand name and an icon
    return <CreditCard className="h-4 w-4 text-muted-foreground" />;
  };
  
  const getTestCardMessage = () => {
    return (
      <div className="text-xs text-muted-foreground mt-2">
        <p><strong>Test Card Numbers:</strong></p>
        <p>Visa: 4242 4242 4242 4242</p>
        <p>Mastercard: 5555 5555 5555 4444</p>
        <p>Use any future expiry date and any 3-digit CVC</p>
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>Manage your payment options for future sessions</CardDescription>
      </CardHeader>
      
      <CardContent>
        {paymentMethods.length > 0 ? (
          <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between space-x-2 border p-3 rounded-md">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={method.id} id={`card-${method.id}`} />
                    <div className="flex items-center gap-2">
                      {getCardBrandIcon(method.brand)}
                      <Label htmlFor={`card-${method.id}`} className="flex flex-col">
                        <span className="font-medium">{method.brand.charAt(0).toUpperCase() + method.brand.slice(1)} •••• {method.last4}</span>
                        <span className="text-xs text-muted-foreground">Expires {method.expMonth}/{method.expYear}</span>
                      </Label>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePaymentMethod(method.id)}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              ))}
            </div>
          </RadioGroup>
        ) : (
          <div className="text-center py-6">
            <CreditCard className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No payment methods added yet</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button onClick={() => setIsAddDialogOpen(true)} className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add Payment Method
        </Button>
      </CardFooter>
      
      {/* Add Payment Method Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Enter your card information to add a new payment method
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cardName">Name on Card</Label>
              <Input
                id="cardName"
                placeholder="Jane Smith"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryMonth">Month</Label>
                <Input
                  id="expiryMonth"
                  placeholder="MM"
                  value={expiryMonth}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setExpiryMonth(value.substring(0, 2));
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiryYear">Year</Label>
                <Input
                  id="expiryYear"
                  placeholder="YYYY"
                  value={expiryYear}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setExpiryYear(value.substring(0, 4));
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setCvc(value.substring(0, 3));
                  }}
                />
              </div>
            </div>
            
            {getTestCardMessage()}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitCard} disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin">◌</span>
                  Processing...
                </>
              ) : (
                'Add Card'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

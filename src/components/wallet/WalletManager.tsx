
import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PaystackService } from "@/services/PaystackService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Wallet, CreditCard, ArrowDown, ArrowUp } from "lucide-react";

const WalletManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [walletData, setWalletData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [amount, setAmount] = useState<string>('');
  const [showFundDialog, setShowFundDialog] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWalletData();
      fetchTransactions();
    }
  }, [user]);

  const fetchWalletData = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching wallet data:', error);
        return;
      }

      setWalletData(data);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }

      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleFundWallet = async () => {
    try {
      if (!amount || parseFloat(amount) <= 0) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid amount",
          variant: "destructive",
        });
        return;
      }

      const parsedAmount = parseFloat(amount);
      const callback_url = window.location.origin + '/dashboard?verify=true';

      const response = await PaystackService.initializeTransaction({
        email: user?.email || '',
        amount: parsedAmount,
        callback_url,
        metadata: {
          user_id: user?.id || '',
          description: 'Wallet funding'
        }
      });

      if (response.status) {
        // Redirect to Paystack payment page
        window.location.href = response.data.authorization_url;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to initialize transaction",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fund wallet",
        variant: "destructive",
      });
    }
  };

  // Function to verify transaction on callback
  const verifyTransaction = async (reference: string) => {
    try {
      const response = await PaystackService.verifyTransaction({ reference });
      
      if (response.status && response.data.status === "success") {
        toast({
          title: "Success",
          description: "Wallet funded successfully",
        });
        fetchWalletData();
        fetchTransactions();
      } else {
        toast({
          title: "Transaction Failed",
          description: "The payment was not successful",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to verify transaction",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Check if there's a reference in the URL (callback from Paystack)
    const url = new URL(window.location.href);
    const reference = url.searchParams.get('reference');
    const shouldVerify = url.searchParams.get('verify');

    if (reference && shouldVerify === 'true' && user) {
      verifyTransaction(reference);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading wallet data...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="mr-2 h-6 w-6" />
            Your Wallet
          </CardTitle>
          <CardDescription>Manage your funds and view transaction history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 p-6 rounded-lg mb-6">
            <div className="text-muted-foreground text-sm">Available Balance</div>
            <div className="text-4xl font-bold mt-1">Ksh{walletData?.balance?.toFixed(2) || '0.00'}</div>
          </div>
          
          <Button 
            onClick={() => setShowFundDialog(true)}
            className="w-full"
          >
            <CreditCard className="mr-2 h-4 w-4" /> Fund Wallet
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your recent wallet activities</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No transactions yet
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-4 ${
                      transaction.transaction_type === 'deposit' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-amber-100 text-amber-600'
                    }`}>
                      {transaction.transaction_type === 'deposit' ? (
                        <ArrowDown className="h-5 w-5" />
                      ) : (
                        <ArrowUp className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">
                        {transaction.transaction_type === 'deposit' ? 'Wallet Funding' : 'Payment'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(transaction.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className={`font-medium ${
                    transaction.transaction_type === 'deposit' ? 'text-green-600' : 'text-amber-600'
                  }`}>
                    {transaction.transaction_type === 'deposit' ? '+' : '-'}Ksh{transaction.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline">View All Transactions</Button>
        </CardFooter>
      </Card>

      {/* Fund Wallet Dialog */}
      <Dialog open={showFundDialog} onOpenChange={setShowFundDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fund Your Wallet</DialogTitle>
            <DialogDescription>
              Enter the amount you want to add to your wallet
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (Ksh)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="100"
                step="100"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFundDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleFundWallet}>
              Proceed to Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletManager;

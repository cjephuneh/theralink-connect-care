
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, CreditCard, Wallet, CalendarClock, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const ClientBilling = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("transactions");
  const [transactions, setTransactions] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchTransactionData = async () => {
      setIsLoading(true);
      try {
        // Fetch transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select(`
            id,
            amount,
            description,
            reference,
            status,
            created_at,
            transaction_type,
            therapist_id,
            profiles:therapist_id (full_name)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (transactionsError) throw transactionsError;
        setTransactions(transactionsData || []);

        // Fetch wallet balance
        const { data: walletData, error: walletError } = await supabase
          .from('wallets')
          .select('balance')
          .eq('user_id', user.id)
          .single();

        if (walletError) throw walletError;
        setWalletBalance(walletData?.balance || 0);

      } catch (error) {
        console.error('Error fetching billing data:', error);
        toast({
          title: "Failed to load billing information",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionData();
  }, [user, toast]);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const openTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  };

  const getTransactionStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return "bg-green-100 text-green-800";
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      case 'failed':
      case 'declined':
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing & Payments</h1>
        <p className="text-muted-foreground">Manage your payments and transaction history</p>
      </div>

      {/* Balance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wallet className="h-5 w-5" />
              <span>Your Balance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatAmount(walletBalance)}</p>
            <p className="text-sm text-muted-foreground mt-1">Available for future sessions</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <CreditCard className="mr-2 h-4 w-4" />
              Add Funds
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarClock className="h-5 w-5" />
              <span>Next Payment</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 && transactions[0].status === 'scheduled' ? (
              <>
                <p className="text-2xl font-bold">{formatAmount(transactions[0].amount)}</p>
                <p className="text-sm text-muted-foreground mt-1">Due on {formatDate(transactions[0].created_at)}</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold">No scheduled payments</p>
                <p className="text-sm text-muted-foreground mt-1">Book a session to schedule your next payment</p>
              </>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <a href="/therapists">
                Book a Session
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-6">
          {transactions.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {transactions.map((transaction) => (
                    <div 
                      key={transaction.id}
                      className="flex items-center justify-between p-4 hover:bg-accent/50 cursor-pointer"
                      onClick={() => openTransactionDetails(transaction)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          transaction.transaction_type === 'payment' ? 'bg-red-100' : 'bg-green-100'
                        }`}>
                          {transaction.transaction_type === 'payment' ? (
                            <CreditCard className="h-5 w-5 text-red-600" />
                          ) : (
                            <Wallet className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {transaction.transaction_type === 'payment' 
                              ? `Payment to ${transaction.profiles?.full_name || 'Therapist'}`
                              : 'Wallet Deposit'}
                          </p>
                          <p className="text-sm text-muted-foreground">{formatDate(transaction.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getTransactionStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                        <p className={`font-semibold ${
                          transaction.transaction_type === 'payment' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {transaction.transaction_type === 'payment' ? '- ' : '+ '}
                          {formatAmount(transaction.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <p className="mt-4 text-lg font-medium">No transaction history yet</p>
                <p className="text-muted-foreground">Your payment history will appear here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="payment-methods" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Visa ending in 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/25</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Default
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Add Payment Method
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Transaction Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedTransaction && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
              <DialogDescription>
                {formatDate(selectedTransaction.created_at)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium">{formatAmount(selectedTransaction.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getTransactionStatusColor(selectedTransaction.status)}>
                    {selectedTransaction.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">{selectedTransaction.transaction_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reference</p>
                  <p className="font-medium">{selectedTransaction.reference}</p>
                </div>
              </div>
              {selectedTransaction.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{selectedTransaction.description}</p>
                </div>
              )}
              {selectedTransaction.profiles?.full_name && (
                <div>
                  <p className="text-sm text-muted-foreground">Therapist</p>
                  <p>{selectedTransaction.profiles.full_name}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default ClientBilling;

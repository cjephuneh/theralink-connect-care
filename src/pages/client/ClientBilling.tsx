import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, CreditCard, Wallet, CalendarClock, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import IntasendPayment from "@/components/payments/Intasendpay";

const ClientBilling = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("transactions");
  const [transactions, setTransactions] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [therapistData, setTherapistData] = useState({});
  const [paymentAmount, setPaymentAmount] = useState(500); // default amount
  const [showIntasend, setShowIntasend] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select(`
            id, amount, description, reference, status, created_at, transaction_type, therapist_id
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (transactionsError) throw transactionsError;

        const therapistIds = [...new Set(transactionsData.filter(tx => tx.therapist_id).map(tx => tx.therapist_id))];
        if (therapistIds.length > 0) {
          const { data: therapists } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', therapistIds);

          const therapistMap = therapists?.reduce((acc, therapist) => {
            acc[therapist.id] = therapist;
            return acc;
          }, {}) || {};

          setTherapistData(therapistMap);
        }

        setTransactions(transactionsData || []);

        const { data: walletData } = await supabase
          .from('wallets')
          .select('balance')
          .eq('user_id', user.id)
          .single();

        setWalletBalance(walletData?.balance || 0);
      } catch (error) {
        console.error(error);
        toast({
          title: "Billing load failed",
          description: "Try refreshing the page.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'KES' }).format(amount);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  const handlePayNow = () => {
    setShowIntasend(true);
  };

  const closeDialog = () => setIsDialogOpen(false);

  const getTherapistName = (id: string) => therapistData[id]?.full_name || 'Therapist';

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
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

  if (isLoading) return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Billing & Payments</h1>
      <p className="text-muted-foreground">Manage your billing and add funds securely.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Wallet className="w-5 h-5" /> Wallet Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatAmount(walletBalance)}</p>
          </CardContent>
          <CardFooter className="flex-col gap-3 items-start">
            <input
              type="number"
              min={10}
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
              className="border p-2 w-full rounded-md"
              placeholder="Enter amount (KES)"
            />
            <Button className="w-full" onClick={handlePayNow}>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay Now
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <CalendarClock className="w-5 h-5" /> Next Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions[0]?.status === 'scheduled' ? (
              <>
                <p className="text-2xl font-bold">{formatAmount(transactions[0].amount)}</p>
                <p className="text-sm mt-1 text-muted-foreground">
                  Due on {formatDate(transactions[0].created_at)}
                </p>
              </>
            ) : (
              <p>No scheduled payments</p>
            )}
          </CardContent>
        </Card>
      </div>

      {showIntasend && user && (
        <IntasendPayment
          email={user.email}
          firstName={user.user_metadata?.first_name || "Theralink"}
          lastName={user.user_metadata?.last_name || "User"}
          amount={paymentAmount}
          onComplete={(res) => {
            toast({ title: "Payment Completed", description: res.invoice, variant: "default" });
            setShowIntasend(false);
          }}
          onFailed={(res) => {
            toast({ title: "Payment Failed", description: res.message, variant: "destructive" });
            setShowIntasend(false);
          }}
        />
      )}
    </div>
  );
};

export default ClientBilling;

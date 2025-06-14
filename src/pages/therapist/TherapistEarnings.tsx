
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Calendar, Download } from 'lucide-react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Transaction {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  description: string;
  reference: string;
}

interface EarningsData {
  totalEarnings: number;
  monthlyEarnings: number;
  pendingEarnings: number;
  transactions: Transaction[];
  monthlyData: Array<{ month: string; earnings: number }>;
}

const TherapistEarnings = () => {
  const [earningsData, setEarningsData] = useState<EarningsData>({
    totalEarnings: 0,
    monthlyEarnings: 0,
    pendingEarnings: 0,
    transactions: [],
    monthlyData: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchEarnings = async () => {
      if (!user) return;

      try {
        // Fetch all transactions for this therapist
        const { data: transactions, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('therapist_id', user.id)
          .eq('transaction_type', 'payment')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const completedTransactions = transactions?.filter(t => t.status === 'completed') || [];
        const pendingTransactions = transactions?.filter(t => t.status === 'pending') || [];

        const totalEarnings = completedTransactions.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
        const pendingEarnings = pendingTransactions.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

        // Calculate monthly earnings (current month)
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyEarnings = completedTransactions
          .filter(t => {
            const transactionDate = new Date(t.created_at);
            return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
          })
          .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

        // Process monthly data for chart
        const monthlyData: Record<string, number> = {};
        completedTransactions.forEach(transaction => {
          const month = format(new Date(transaction.created_at), 'MMM yyyy');
          monthlyData[month] = (monthlyData[month] || 0) + parseFloat(transaction.amount.toString());
        });

        const chartData = Object.entries(monthlyData)
          .map(([month, earnings]) => ({ month, earnings }))
          .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
          .slice(-6); // Last 6 months

        setEarningsData({
          totalEarnings,
          monthlyEarnings,
          pendingEarnings,
          transactions: transactions || [],
          monthlyData: chartData
        });

      } catch (error) {
        console.error('Error fetching earnings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load earnings data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarnings();

    // Set up real-time subscription for new transactions
    const channel = supabase
      .channel('therapist-transactions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions',
          filter: `therapist_id=eq.${user?.id}`
        },
        (payload) => {
          const newTransaction = payload.new as Transaction;
          
          // Show notification for new payment
          if (newTransaction.transaction_type === 'payment' && newTransaction.status === 'completed') {
            toast({
              title: 'Payment Received!',
              description: `You received Ksh${newTransaction.amount} for your session`,
            });
          }
          
          // Refresh earnings data
          fetchEarnings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading earnings data...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Earnings</h1>
        <p className="text-muted-foreground">Track your therapy session payments and income</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ksh{earningsData.totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ksh{earningsData.monthlyEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current month earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ksh{earningsData.pendingEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Pending payments</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Earnings Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={earningsData.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`Ksh${value}`, 'Earnings']} />
              <Legend />
              <Line type="monotone" dataKey="earnings" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transaction History</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {earningsData.transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No transactions yet
              </div>
            ) : (
              earningsData.transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{transaction.description || 'Therapy Session Payment'}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(transaction.created_at), 'MMM dd, yyyy - h:mm a')}
                    </p>
                    <p className="text-xs text-muted-foreground">Ref: {transaction.reference}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-bold">Ksh{parseFloat(transaction.amount.toString()).toLocaleString()}</p>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TherapistEarnings;

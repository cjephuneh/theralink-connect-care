
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  amount: number;
  created_at: string;
  status: string;
  description?: string;
  reference: string;
}

interface EarningsData {
  totalEarnings: number;
  thisMonth: number;
  lastMonth: number;
  transactions: Transaction[];
}

interface TherapistEarningsModalProps {
  therapistId: string | null;
  therapistName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const TherapistEarningsModal = ({ 
  therapistId, 
  therapistName, 
  isOpen, 
  onClose 
}: TherapistEarningsModalProps) => {
  const [earnings, setEarnings] = useState<EarningsData>({
    totalEarnings: 0,
    thisMonth: 0,
    lastMonth: 0,
    transactions: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (therapistId && isOpen) {
      fetchEarnings();
    }
  }, [therapistId, isOpen]);

  const fetchEarnings = async () => {
    if (!therapistId) return;

    setIsLoading(true);
    try {
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('therapist_id', therapistId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
      const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

      const totalEarnings = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      
      const thisMonthEarnings = transactions?.filter(t => {
        const date = new Date(t.created_at);
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
      }).reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      const lastMonthEarnings = transactions?.filter(t => {
        const date = new Date(t.created_at);
        return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
      }).reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      setEarnings({
        totalEarnings,
        thisMonth: thisMonthEarnings,
        lastMonth: lastMonthEarnings,
        transactions: transactions || []
      });
    } catch (error) {
      console.error('Error fetching earnings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch earnings data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const calculateGrowth = () => {
    if (earnings.lastMonth === 0) return 0;
    return ((earnings.thisMonth - earnings.lastMonth) / earnings.lastMonth) * 100;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Earnings for {therapistName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Total Earnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(earnings.totalEarnings)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      This Month
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(earnings.thisMonth)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Growth
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${calculateGrowth() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {calculateGrowth() >= 0 ? '+' : ''}{calculateGrowth().toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground">vs last month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Transactions List */}
              <div>
                <h3 className="font-semibold mb-3">Recent Transactions</h3>
                {earnings.transactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No transactions found for this therapist.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {earnings.transactions.slice(0, 10).map((transaction) => (
                      <div key={transaction.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{formatCurrency(Number(transaction.amount))}</div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.description || 'Session Payment'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Ref: {transaction.reference}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {transaction.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
          
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

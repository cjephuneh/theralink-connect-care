
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Download, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { Button } from '@/components/ui/button';

interface Transaction {
  id: string;
  created_at: string;
  amount: number;
  description: string | null;
  transaction_type: string;
  status: string;
}

interface EarningsSummary {
  totalEarnings: number;
  pendingPayouts: number;
  completedSessions: number;
  avgPerSession: number;
}

const TherapistEarnings = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<EarningsSummary>({
    totalEarnings: 0,
    pendingPayouts: 0,
    completedSessions: 0,
    avgPerSession: 0
  });
  const [timeRange, setTimeRange] = useState<string>('month');
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, timeRange]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      // Calculate date range based on time filter
      let startDate = new Date();
      let endDate = new Date();

      if (timeRange === 'month') {
        startDate = startOfMonth(new Date());
        endDate = endOfMonth(new Date());
      } else if (timeRange === '3months') {
        startDate = subMonths(new Date(), 3);
      } else if (timeRange === '6months') {
        startDate = subMonths(new Date(), 6);
      } else if (timeRange === 'year') {
        startDate = subMonths(new Date(), 12);
      }

      // Format dates for Supabase query
      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();

      // Fetch transactions for the therapist
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('therapist_id', user?.id)
        .gte('created_at', formattedStartDate)
        .lte('created_at', formattedEndDate)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setTransactions(data || []);
      
      // Calculate summary data
      const totalEarnings = data ? data.reduce((acc, tx) => acc + tx.amount, 0) : 0;
      const pendingTransactions = data ? data.filter(tx => tx.status === 'pending') : [];
      const pendingAmount = pendingTransactions.reduce((acc, tx) => acc + tx.amount, 0);
      const completedSessions = data ? data.filter(tx => tx.transaction_type === 'session_payment' && tx.status === 'completed').length : 0;
      const avgPerSession = completedSessions > 0 ? totalEarnings / completedSessions : 0;

      setSummary({
        totalEarnings,
        pendingPayouts: pendingAmount,
        completedSessions,
        avgPerSession
      });

      // Generate monthly earnings data for charts
      const monthlyDataMap = new Map();
      
      if (data) {
        data.forEach(tx => {
          const month = format(new Date(tx.created_at), 'MMM yyyy');
          if (monthlyDataMap.has(month)) {
            monthlyDataMap.set(month, monthlyDataMap.get(month) + tx.amount);
          } else {
            monthlyDataMap.set(month, tx.amount);
          }
        });
      }

      const chartData = Array.from(monthlyDataMap).map(([month, amount]) => ({
        month,
        amount
      }));

      setMonthlyData(chartData);

    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch earnings data. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    try {
      // Create CSV content
      let csvContent = "Date,Amount,Description,Type,Status\n";
      
      transactions.forEach(tx => {
        const date = format(new Date(tx.created_at), 'yyyy-MM-dd');
        const row = [
          date,
          tx.amount,
          tx.description || 'N/A',
          tx.transaction_type,
          tx.status
        ].join(',');
        csvContent += row + "\n";
      });

      // Create download link
      const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `earnings_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: "Your earnings data has been exported to CSV.",
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your earnings data.",
        variant: "destructive"
      });
    }
  };

  // Data for pie chart showing transaction types
  const transactionTypeData = transactions.reduce((acc, tx) => {
    const existingType = acc.find(item => item.name === tx.transaction_type);
    if (existingType) {
      existingType.value += tx.amount;
    } else {
      acc.push({ name: tx.transaction_type, value: tx.amount });
    }
    return acc;
  }, [] as Array<{name: string, value: number}>);

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">My Earnings</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            onClick={handleExport}
          >
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading earnings data...</span>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-2xl font-bold">Ksh{summary.totalEarnings.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-2xl font-bold">Ksh{summary.pendingPayouts.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-2xl font-bold">{summary.completedSessions}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Per Session</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-2xl font-bold">Ksh{summary.avgPerSession.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="transactions">
            <TabsList className="mb-6">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="charts">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    A detailed list of all your earnings transactions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {transactions.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No transactions found for the selected period.</p>
                    </div>
                  ) : (
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactions.map(tx => (
                            <TableRow key={tx.id}>
                              <TableCell>
                                {format(new Date(tx.created_at), 'MMM dd, yyyy')}
                              </TableCell>
                              <TableCell>{tx.description || 'N/A'}</TableCell>
                              <TableCell className="capitalize">
                                {tx.transaction_type.replace('_', ' ')}
                              </TableCell>
                              <TableCell>Ksh{tx.amount.toLocaleString()}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  tx.status === 'completed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : tx.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {tx.status}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground">
                  Showing transactions for {timeRange === 'month' 
                    ? 'the current month' 
                    : timeRange === '3months' 
                    ? 'the last 3 months' 
                    : timeRange === '6months'
                    ? 'the last 6 months'
                    : 'the last year'
                  }
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="charts">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Earnings</CardTitle>
                    <CardDescription>
                      Your earnings trend over time.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      {monthlyData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={monthlyData}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value) => `Ksh${value}`} />
                            <Bar dataKey="amount" fill="#3B82F6" />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-muted-foreground">No data available</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction Types</CardTitle>
                    <CardDescription>
                      Breakdown of your earnings by transaction type.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      {transactionTypeData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={transactionTypeData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {transactionTypeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value}`} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-muted-foreground">No data available</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default TherapistEarnings;

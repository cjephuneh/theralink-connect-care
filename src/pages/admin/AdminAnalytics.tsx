
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const transactionData = [
  { month: 'Jan', income: 4000 },
  { month: 'Feb', income: 5000 },
  { month: 'Mar', income: 7000 },
  { month: 'Apr', income: 8500 },
  { month: 'May', income: 10000 },
  { month: 'Jun', income: 9000 },
];

const pieData = [
  { name: 'Video Sessions', value: 450 },
  { name: 'Chat Sessions', value: 300 },
  { name: 'In-Person', value: 150 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminAnalytics = () => {
  const [period, setPeriod] = useState('monthly');
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Financial Analytics</h1>
      
      <div className="flex items-center mb-6">
        <div className="space-x-1">
          <button 
            className={`px-3 py-1 rounded ${period === 'monthly' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            onClick={() => setPeriod('monthly')}
          >
            Monthly
          </button>
          <button 
            className={`px-3 py-1 rounded ${period === 'quarterly' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            onClick={() => setPeriod('quarterly')}
          >
            Quarterly
          </button>
          <button 
            className={`px-3 py-1 rounded ${period === 'yearly' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            onClick={() => setPeriod('yearly')}
          >
            Yearly
          </button>
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Platform revenue for the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={transactionData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#8884d8" name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Session Type Distribution</CardTitle>
            <CardDescription>Breakdown of appointment types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$43,500</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$85.50</div>
            <p className="text-xs text-muted-foreground">+3.2% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Therapist Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$32,625</div>
            <p className="text-xs text-muted-foreground">75% of total revenue</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
          <CardDescription>Overall platform financial health</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            This dashboard shows the financial overview for TheraLink. The data presented here is simulated for demonstration purposes. In a production environment, this would display real-time financial data from your actual transactions.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-1">Gross Revenue (YTD)</h3>
              <p className="text-lg font-bold">$175,450</p>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-1">Platform Fees</h3>
              <p className="text-lg font-bold">$43,862.50</p>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-1">Net Profit</h3>
              <p className="text-lg font-bold">$37,283.13</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;


import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Settings, 
  Globe, 
  Mail, 
  Bell, 
  Shield, 
  Database, 
  Users,
  FileText,
  CreditCard,
  Palette,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const platformSettingsSchema = z.object({
  platform_name: z.string().min(1, "Platform name is required"),
  platform_description: z.string().min(10, "Description must be at least 10 characters"),
  platform_email: z.string().email("Valid email is required"),
  support_email: z.string().email("Valid email is required"),
  maintenance_mode: z.boolean(),
  registration_enabled: z.boolean(),
  email_notifications: z.boolean(),
  sms_notifications: z.boolean(),
});

const paymentSettingsSchema = z.object({
  paystack_public_key: z.string().min(1, "Paystack public key is required"),
  paystack_secret_key: z.string().min(1, "Paystack secret key is required"),
  default_currency: z.string().min(1, "Currency is required"),
  minimum_withdrawal: z.coerce.number().min(1),
  platform_fee_percentage: z.coerce.number().min(0).max(100),
});

const AdminContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const { toast } = useToast();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const platformForm = useForm<z.infer<typeof platformSettingsSchema>>({
    resolver: zodResolver(platformSettingsSchema),
    defaultValues: {
      platform_name: "TheraLink",
      platform_description: "Connecting you with licensed therapists and peer support",
      platform_email: "hello@theralink.com",
      support_email: "support@theralink.com",
      maintenance_mode: false,
      registration_enabled: true,
      email_notifications: true,
      sms_notifications: false,
    },
  });

  const paymentForm = useForm<z.infer<typeof paymentSettingsSchema>>({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues: {
      paystack_public_key: "pk_test_",
      paystack_secret_key: "sk_test_",
      default_currency: "NGN",
      minimum_withdrawal: 1000,
      platform_fee_percentage: 10,
    },
  });

  useEffect(() => {
    if (profile && profile.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access this page.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
  }, [profile, navigate, toast]);

  const onPlatformSubmit = async (values: z.infer<typeof platformSettingsSchema>) => {
    setIsLoading(true);
    try {
      // Here you would typically save to your settings table
      console.log('Platform settings:', values);
      
      toast({
        title: "Settings Updated",
        description: "Platform settings have been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update platform settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onPaymentSubmit = async (values: z.infer<typeof paymentSettingsSchema>) => {
    setIsLoading(true);
    try {
      // Here you would typically save to your settings table or Supabase secrets
      console.log('Payment settings:', values);
      
      toast({
        title: "Payment Settings Updated",
        description: "Payment configuration has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const systemStats = {
    totalUsers: 245,
    activeTherapists: 12,
    pendingApprovals: 5,
    totalTransactions: 89,
    systemHealth: "Good",
    lastBackup: "2 hours ago",
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Platform Settings</h1>
          <p className="text-muted-foreground">Manage platform configuration and system settings</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            System Healthy
          </Badge>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{systemStats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Therapists</p>
                <p className="text-2xl font-bold">{systemStats.activeTherapists}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
                <p className="text-2xl font-bold">{systemStats.pendingApprovals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold">{systemStats.totalTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-cyan-500" />
              <div>
                <p className="text-sm text-muted-foreground">System Health</p>
                <p className="text-lg font-bold text-green-600">{systemStats.systemHealth}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-muted-foreground">Last Backup</p>
                <p className="text-sm font-medium">{systemStats.lastBackup}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="platform" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="platform" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Platform
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="platform">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Platform Configuration
              </CardTitle>
              <CardDescription>
                Configure basic platform settings and features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...platformForm}>
                <form onSubmit={platformForm.handleSubmit(onPlatformSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={platformForm.control}
                      name="platform_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Platform Name</FormLabel>
                          <FormControl>
                            <Input placeholder="TheraLink" {...field} />
                          </FormControl>
                          <FormDescription>
                            The name of your platform
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={platformForm.control}
                      name="platform_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Platform Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="hello@theralink.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            Main contact email for the platform
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={platformForm.control}
                    name="platform_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Connecting you with licensed therapists and peer support" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          A brief description of what your platform does
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={platformForm.control}
                    name="support_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Support Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="support@theralink.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          Email address for user support inquiries
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Platform Features</h3>
                    
                    <FormField
                      control={platformForm.control}
                      name="maintenance_mode"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Maintenance Mode</FormLabel>
                            <FormDescription>
                              Temporarily disable the platform for maintenance
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={platformForm.control}
                      name="registration_enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">User Registration</FormLabel>
                            <FormDescription>
                              Allow new users to register on the platform
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Platform Settings
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Configuration
              </CardTitle>
              <CardDescription>
                Configure payment processing and fee settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">API Keys</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSecrets(!showSecrets)}
                  className="flex items-center gap-2"
                >
                  {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showSecrets ? 'Hide' : 'Show'} Keys
                </Button>
              </div>

              <Form {...paymentForm}>
                <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={paymentForm.control}
                      name="paystack_public_key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Paystack Public Key</FormLabel>
                          <FormControl>
                            <Input 
                              type={showSecrets ? "text" : "password"}
                              placeholder="pk_test_..." 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Your Paystack public key
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={paymentForm.control}
                      name="paystack_secret_key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Paystack Secret Key</FormLabel>
                          <FormControl>
                            <Input 
                              type={showSecrets ? "text" : "password"}
                              placeholder="sk_test_..." 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Your Paystack secret key (keep secure)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={paymentForm.control}
                      name="default_currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Currency</FormLabel>
                          <FormControl>
                            <Input placeholder="NGN" {...field} />
                          </FormControl>
                          <FormDescription>
                            Platform currency (e.g., NGN, USD)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={paymentForm.control}
                      name="minimum_withdrawal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Withdrawal</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="1000" {...field} />
                          </FormControl>
                          <FormDescription>
                            Minimum amount for withdrawals
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={paymentForm.control}
                      name="platform_fee_percentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Platform Fee (%)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="100" placeholder="10" {...field} />
                          </FormControl>
                          <FormDescription>
                            Platform commission percentage
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Payment Settings
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure how the platform sends notifications to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <FormField
                  control={platformForm.control}
                  name="email_notifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Email Notifications</FormLabel>
                        <FormDescription>
                          Send notifications via email to users
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={platformForm.control}
                  name="sms_notifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">SMS Notifications</FormLabel>
                        <FormDescription>
                          Send notifications via SMS to users
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">Notification Templates</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Customize email and SMS templates for different events
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">Edit Welcome Email</Button>
                    <Button variant="outline" size="sm">Edit Appointment Reminder</Button>
                    <Button variant="outline" size="sm">Edit Payment Confirmation</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security policies and access controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">Password Policy</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Set requirements for user passwords
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Minimum 8 characters</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Require uppercase letter</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Require number</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Require special character</span>
                    </label>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">Session Management</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure user session settings
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Session Timeout (minutes)</label>
                      <Input type="number" defaultValue="60" className="mt-1" />
                    </div>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Force logout on browser close</span>
                    </label>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">Access Control</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage IP restrictions and access policies
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">Manage IP Whitelist</Button>
                    <Button variant="outline" size="sm">View Access Logs</Button>
                    <Button variant="outline" size="sm">Configure 2FA</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminContent;

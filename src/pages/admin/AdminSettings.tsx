
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Database, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  CreditCard,
  Save,
  RefreshCw,
  Server,
  Users,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PlatformSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  setting_type: string;
  description: string;
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<PlatformSetting[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('*')
        .order('setting_key');

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('platform_settings')
        .update({ setting_value: value, updated_at: new Date().toISOString() })
        .eq('setting_key', key);

      if (error) throw error;

      setSettings(prev => 
        prev.map(setting => 
          setting.setting_key === key 
            ? { ...setting, setting_value: value }
            : setting
        )
      );

      toast({
        title: "Setting Updated",
        description: `${key} has been updated successfully`,
      });
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSetting = (key: string) => {
    const setting = settings.find(s => s.setting_key === key);
    return setting?.setting_value;
  };

  const systemStats = {
    uptime: "99.9%",
    totalUsers: 245,
    activeUsers: 189,
    storageUsed: "2.4 GB",
    apiCalls: "45,678",
    lastBackup: "2 hours ago"
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Platform Settings</h1>
          <p className="text-muted-foreground">Configure and manage your platform</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Server className="h-3 w-3 text-green-500" />
          System Online
        </Badge>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-blue-600">Uptime</p>
                <p className="text-xl font-bold text-blue-800">{systemStats.uptime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-green-600">Active Users</p>
                <p className="text-xl font-bold text-green-800">{systemStats.activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-purple-600">Storage</p>
                <p className="text-xl font-bold text-purple-800">{systemStats.storageUsed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm text-orange-600">API Calls</p>
                <p className="text-xl font-bold text-orange-800">{systemStats.apiCalls}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-teal-600" />
              <div>
                <p className="text-sm text-teal-600">Last Backup</p>
                <p className="text-sm font-bold text-teal-800">{systemStats.lastBackup}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-rose-600" />
              <div>
                <p className="text-sm text-rose-600">Total Users</p>
                <p className="text-xl font-bold text-rose-800">{systemStats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Platform Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Platform Name</label>
                  <Input 
                    value={getSetting('platform_name') || ''} 
                    onChange={(e) => updateSetting('platform_name', e.target.value)}
                    placeholder="TheraLink"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default Currency</label>
                  <Input 
                    value={getSetting('default_currency') || ''} 
                    onChange={(e) => updateSetting('default_currency', e.target.value)}
                    placeholder="NGN"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Platform Features</h3>
                
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="text-base font-medium">Maintenance Mode</div>
                    <div className="text-sm text-muted-foreground">
                      Temporarily disable platform access for maintenance
                    </div>
                  </div>
                  <Switch
                    checked={getSetting('maintenance_mode') === 'true'}
                    onCheckedChange={(checked) => updateSetting('maintenance_mode', checked.toString())}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="text-base font-medium">User Registration</div>
                    <div className="text-sm text-muted-foreground">
                      Allow new users to register on the platform
                    </div>
                  </div>
                  <Switch
                    checked={getSetting('registration_enabled') === 'true'}
                    onCheckedChange={(checked) => updateSetting('registration_enabled', checked.toString())}
                  />
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
                Security & Access Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4 bg-blue-50">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password Policy
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Minimum 8 characters required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Require uppercase letter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Require number</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4 bg-green-50">
                <h4 className="font-medium mb-2">Session Management</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Session Timeout (minutes)</label>
                    <Input type="number" defaultValue="60" className="mt-1" />
                  </div>
                  <div className="flex items-center space-x-2 mt-6">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Force logout on browser close</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4 bg-purple-50">
                <h4 className="font-medium mb-2">API Security</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">Regenerate API Keys</Button>
                  <Button variant="outline" size="sm">View Access Logs</Button>
                  <Button variant="outline" size="sm">Configure Rate Limiting</Button>
                </div>
              </div>
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
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <div className="text-base font-medium">Email Notifications</div>
                  <div className="text-sm text-muted-foreground">
                    Send notifications via email to users
                  </div>
                </div>
                <Switch
                  checked={getSetting('email_notifications') === 'true'}
                  onCheckedChange={(checked) => updateSetting('email_notifications', checked.toString())}
                />
              </div>

              <div className="rounded-lg border p-4">
                <h4 className="font-medium mb-4">Notification Templates</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">Welcome Email Template</Button>
                  <Button variant="outline" size="sm">Appointment Reminder</Button>
                  <Button variant="outline" size="sm">Payment Confirmation</Button>
                  <Button variant="outline" size="sm">Password Reset Email</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Configuration
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSecrets(!showSecrets)}
                >
                  {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showSecrets ? 'Hide' : 'Show'} Keys
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Paystack Public Key</label>
                  <Input 
                    type={showSecrets ? "text" : "password"}
                    placeholder="pk_test_..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Paystack Secret Key</label>
                  <Input 
                    type={showSecrets ? "text" : "password"}
                    placeholder="sk_test_..."
                    className="mt-1"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Platform Fee (%)</label>
                  <Input 
                    type="number" 
                    value={getSetting('platform_fee_percentage') || ''} 
                    onChange={(e) => updateSetting('platform_fee_percentage', e.target.value)}
                    placeholder="10"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Minimum Withdrawal</label>
                  <Input type="number" placeholder="1000" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Maximum Transaction</label>
                  <Input type="number" placeholder="1000000" className="mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Platform Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Theme Settings</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      🌞 Light Theme (Default)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      🌙 Dark Theme
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      🎨 Custom Theme
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Brand Colors</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-12 bg-blue-500 rounded border"></div>
                    <div className="h-12 bg-green-500 rounded border"></div>
                    <div className="h-12 bg-purple-500 rounded border"></div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Logo & Branding</h4>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <p className="text-muted-foreground">Click to upload platform logo</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Upload Logo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <Card>
        <CardContent className="p-4">
          <Button disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save All Settings
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;

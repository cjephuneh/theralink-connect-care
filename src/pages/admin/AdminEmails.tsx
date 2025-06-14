
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mail, Send, Users, Calendar, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const AdminEmails = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSendEmail = async () => {
    if (!subject || !message || !recipientType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get recipient IDs based on type
      let recipientIds: string[] = [];
      if (recipientType !== 'all') {
        const { data } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', recipientType);
        recipientIds = data?.map(p => p.id) || [];
      }

      // Store admin email record
      const { error: emailError } = await supabase
        .from('admin_emails')
        .insert({
          admin_id: user?.id,
          recipient_type: recipientType,
          recipient_ids: recipientIds.length > 0 ? recipientIds : null,
          subject,
          message,
        });

      if (emailError) throw emailError;

      // Create notifications for recipients
      const notifications = recipientIds.map(userId => ({
        id: crypto.randomUUID(),
        user_id: userId,
        title: subject,
        message: message,
        type: 'admin_announcement',
        is_read: false,
      }));

      if (notifications.length > 0) {
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert(notifications);

        if (notificationError) throw notificationError;
      }

      toast({
        title: "Email Sent Successfully",
        description: `Message sent to ${recipientType === 'all' ? 'all users' : recipientIds.length + ' ' + recipientType + 's'}`,
      });

      // Reset form
      setSubject('');
      setMessage('');
      setRecipientType('');
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const recipientOptions = [
    { value: 'client', label: 'Clients', icon: Users },
    { value: 'therapist', label: 'Therapists', icon: Users },
    { value: 'friend', label: 'Friends', icon: Users },
    { value: 'all', label: 'All Users', icon: Users },
  ];

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Email Center</h1>
          <p className="text-muted-foreground">Send notifications and announcements to users</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Mail className="h-3 w-3" />
          Notification System
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Composer */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Compose Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Recipients</label>
                <Select value={recipientType} onValueChange={setRecipientType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipient group" />
                  </SelectTrigger>
                  <SelectContent>
                    {recipientOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <option.icon className="h-4 w-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter message subject"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="min-h-[200px]"
                />
              </div>

              <Button 
                onClick={handleSendEmail} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Calendar className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Notification
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Clients</span>
                <Badge variant="secondary">245</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Therapists</span>
                <Badge variant="secondary">12</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Friends</span>
                <Badge variant="secondary">18</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <CheckCircle className="mr-2 h-4 w-4" />
                Template Library
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Email
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminEmails;

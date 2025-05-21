
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserIcon, Mail, Clock } from "lucide-react";
import { format } from "date-fns";

const AdminMessages = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const fetchMessages = async () => {
    setLoading(true);
    try {
      // Fetch messages first
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;
      
      if (!messagesData || messagesData.length === 0) {
        setMessages([]);
        setLoading(false);
        return;
      }

      // Fetch all unique user IDs from the messages
      const userIds = new Set([
        ...messagesData.map(message => message.sender_id),
        ...messagesData.map(message => message.receiver_id)
      ].filter(Boolean));

      // Fetch profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', Array.from(userIds));

      if (profilesError) throw profilesError;

      // Create a map of user IDs to profiles for quick lookup
      const profilesMap = (profilesData || []).reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {});

      // Combine messages with profile data
      const enrichedMessages = messagesData.map(message => {
        const senderProfile = profilesMap[message.sender_id] || { full_name: 'Unknown', email: 'unknown' };
        const receiverProfile = profilesMap[message.receiver_id] || { full_name: 'Unknown', email: 'unknown' };
        
        return {
          ...message,
          sender: senderProfile,
          receiver: receiverProfile
        };
      });

      setMessages(enrichedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filterMessages = () => {
    if (activeTab === "all") return messages;
    if (activeTab === "unread") return messages.filter(message => !message.is_read);
    return messages;
  };

  const markAsRead = async (messageId) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) throw error;
      
      fetchMessages();
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Admin Messages Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Messages</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
            </TabsList>
          </Tabs>

          {loading ? (
            <div className="flex justify-center p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Sent At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterMessages().length > 0 ? (
                  filterMessages().map((message) => (
                    <TableRow key={message.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserIcon size={16} />
                          <span className="font-medium">{message.sender?.full_name || 'Unknown'}</span>
                          <span className="text-xs text-muted-foreground">({message.sender?.email || 'unknown'})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserIcon size={16} />
                          <span className="font-medium">{message.receiver?.full_name || 'Unknown'}</span>
                          <span className="text-xs text-muted-foreground">({message.receiver?.email || 'unknown'})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="link" className="p-0 h-auto">
                              {message.content.length > 30 ? message.content.substring(0, 30) + "..." : message.content}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Message</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <p className="whitespace-pre-wrap">{message.content}</p>
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock size={12} className="mr-1" />
                                {message.created_at && format(new Date(message.created_at), 'PPpp')}
                              </div>
                              <div className="flex justify-between">
                                <div className="flex items-center gap-2">
                                  <UserIcon size={12} className="text-muted-foreground" />
                                  <span className="text-xs">From: {message.sender?.full_name || 'Unknown'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail size={12} className="text-muted-foreground" />
                                  <span className="text-xs">{message.sender?.email || 'unknown'}</span>
                                </div>
                              </div>
                              <div className="flex justify-between">
                                <div className="flex items-center gap-2">
                                  <UserIcon size={12} className="text-muted-foreground" />
                                  <span className="text-xs">To: {message.receiver?.full_name || 'Unknown'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail size={12} className="text-muted-foreground" />
                                  <span className="text-xs">{message.receiver?.email || 'unknown'}</span>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock size={14} className="text-muted-foreground" />
                          {message.created_at && format(new Date(message.created_at), 'PP')}
                          <span className="text-xs text-muted-foreground">
                            {message.created_at && format(new Date(message.created_at), 'p')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {message.is_read ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800">Read</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-100 text-amber-800">Unread</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {!message.is_read && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => markAsRead(message.id)}
                          >
                            Mark as Read
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No messages found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMessages;

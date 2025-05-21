
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Search, 
  MessageSquare, 
  Eye, 
  RefreshCw,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminMessages = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      // Get messages from both sender and receiver perspective
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(id, full_name:profiles(full_name), email:profiles(email)),
          receiver:receiver_id(id, full_name:profiles(full_name), email:profiles(email))
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Process to make it easier to display
      const processedMessages = data?.map(msg => ({
        ...msg,
        sender_name: msg.sender?.full_name?.full_name || msg.sender?.email || 'Unknown',
        receiver_name: msg.receiver?.full_name?.full_name || msg.receiver?.email || 'Unknown',
      }));
      
      setMessages(processedMessages || []);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const viewMessage = (message: any) => {
    setSelectedMessage(message);
  };

  const filteredMessages = messages.filter(message => 
    message.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.sender_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.receiver_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">System Messages</h1>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search messages..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          onClick={fetchMessages} 
          variant="outline" 
          size="icon" 
          className="h-10 w-10"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Messages</CardTitle>
          <CardDescription>
            View all communication between users on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Message Preview</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
                      <p className="mt-2 text-gray-500">Loading messages...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredMessages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <p className="text-gray-500">No messages found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMessages.map((message) => (
                    <TableRow key={message.id} className={!message.is_read ? "bg-primary/5" : ""}>
                      <TableCell>{message.sender_name}</TableCell>
                      <TableCell>{message.receiver_name}</TableCell>
                      <TableCell>
                        {message.content.length > 30
                          ? `${message.content.substring(0, 30)}...`
                          : message.content}
                      </TableCell>
                      <TableCell>{new Date(message.created_at).toLocaleString()}</TableCell>
                      <TableCell>
                        {message.is_read ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Read
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Unread
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => viewMessage(message)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Message</DialogTitle>
            <DialogDescription>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div>
                  <span className="font-medium">From:</span> {selectedMessage?.sender_name}
                </div>
                <div>
                  <span className="font-medium">To:</span> {selectedMessage?.receiver_name}
                </div>
                <div>
                  <span className="font-medium">Sent:</span> {selectedMessage && new Date(selectedMessage.created_at).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Status:</span> {selectedMessage?.is_read ? 'Read' : 'Unread'}
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 p-4 bg-muted rounded-md whitespace-pre-wrap">
            {selectedMessage?.content}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMessages;

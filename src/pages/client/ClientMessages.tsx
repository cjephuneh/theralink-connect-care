
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, Send, User } from "lucide-react";

const ClientMessages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [therapists, setTherapists] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedTherapistId, setSelectedTherapistId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch the user's therapists and messages
  useEffect(() => {
    if (!user) return;

    const fetchTherapists = async () => {
      try {
        // Get therapists the client has had appointments with
        // Modified query to avoid the problematic join
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select('therapist_id')
          .eq('client_id', user.id)
          .order('created_at', { ascending: false });

        if (appointmentsError) throw appointmentsError;
        
        if (!appointmentsData || appointmentsData.length === 0) {
          setTherapists([]);
          setIsLoading(false);
          return;
        }
        
        // Extract unique therapist IDs
        const uniqueTherapistIds = [...new Set(appointmentsData.map(a => a.therapist_id))];
        
        // Fetch therapist profiles separately
        const { data: therapistProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, profile_image_url')
          .in('id', uniqueTherapistIds);
          
        if (profilesError) throw profilesError;
        
        if (therapistProfiles && therapistProfiles.length > 0) {
          setTherapists(therapistProfiles);
          // Select the first therapist by default
          setSelectedTherapistId(therapistProfiles[0].id);
        }
      } catch (error) {
        console.error('Error fetching therapists:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTherapists();
  }, [user]);

  // Fetch messages when a therapist is selected
  useEffect(() => {
    if (!user || !selectedTherapistId) return;

    const fetchMessages = async () => {
      try {
        // Get messages between the client and the selected therapist
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedTherapistId}),and(sender_id.eq.${selectedTherapistId},receiver_id.eq.${user.id})`)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);

        // Mark messages from therapist as read
        const unreadMessages = data
          .filter((msg: any) => msg.sender_id === selectedTherapistId && !msg.is_read)
          .map((msg: any) => msg.id);
        
        if (unreadMessages.length > 0) {
          await supabase
            .from('messages')
            .update({ is_read: true })
            .in('id', unreadMessages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `sender_id=eq.${selectedTherapistId},receiver_id=eq.${user.id}`
      }, payload => {
        // Add the new message to state
        setMessages(current => [...current, payload.new]);
        
        // Mark the message as read
        supabase
          .from('messages')
          .update({ is_read: true })
          .eq('id', payload.new.id);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedTherapistId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTherapistId) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: selectedTherapistId,
          content: newMessage.trim(),
          is_read: false
        });

      if (error) throw error;
      
      // Clear the input
      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMessageDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: Record<string, any[]> = {};
    messages.forEach(message => {
      const date = formatMessageDate(message.created_at);
      if (!groups[date]) groups[date] = [];
      groups[date].push(message);
    });
    return groups;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-[60vh] w-full" />
      </div>
    );
  }

  if (therapists.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground" />
        <p className="text-muted-foreground mt-4">You don't have any messages yet</p>
        <p className="text-sm text-muted-foreground">Book an appointment to message a therapist</p>
        <Button asChild variant="outline" className="mt-4">
          <a href="/therapists">Find a Therapist</a>
        </Button>
      </div>
    );
  }

  const groupedMessages = groupMessagesByDate();

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <h2 className="text-2xl font-bold mb-6">Messages</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 min-h-0">
        {/* Therapist List */}
        <div className="border rounded-md overflow-y-auto">
          <div className="p-3 border-b">
            <h3 className="font-medium">Your Therapists</h3>
          </div>
          <div className="divide-y">
            {therapists && therapists.map((therapist) => (
              <div
                key={therapist.id}
                className={`p-3 flex items-center cursor-pointer hover:bg-accent ${
                  selectedTherapistId === therapist.id ? 'bg-accent' : ''
                }`}
                onClick={() => setSelectedTherapistId(therapist.id)}
              >
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={therapist.profile_image_url} />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{therapist.full_name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Area */}
        <div className="lg:col-span-3 flex flex-col border rounded-md">
          {selectedTherapistId && (
            <>
              {/* Message Header */}
              <div className="p-3 border-b flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage 
                    src={therapists.find(t => t.id === selectedTherapistId)?.profile_image_url} 
                  />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">
                  {therapists.find(t => t.id === selectedTherapistId)?.full_name}
                </span>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                {Object.entries(groupedMessages).map(([date, msgs]) => (
                  <div key={date}>
                    <div className="text-center my-4">
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">
                        {date}
                      </span>
                    </div>
                    {msgs.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex mb-4 ${
                          message.sender_id === user.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div 
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            message.sender_id === user.id 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}
                        >
                          <p className="break-words">{message.content}</p>
                          <span className={`text-xs block text-right mt-1 ${
                            message.sender_id === user.id 
                              ? 'text-primary-foreground/70' 
                              : 'text-muted-foreground'
                          }`}>
                            {formatMessageTime(message.created_at)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Message Input */}
              <div className="border-t p-3">
                <div className="flex items-end">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 resize-none"
                    rows={2}
                  />
                  <Button 
                    type="button" 
                    size="icon"
                    className="ml-2" 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientMessages;

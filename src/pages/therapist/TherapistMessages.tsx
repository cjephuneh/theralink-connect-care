
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  MessageCircle, 
  Send, 
  Paperclip, 
  MoreVertical,
  Phone,
  Video,
  Info,
  Star,
  X,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Conversation {
  id: string;
  client: string;
  avatar: string | null;
  lastMessage: string;
  time: string;
  unread: boolean;
  status: string;
  clientId: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  sender: 'client' | 'therapist';
  senderName?: string;
  senderAvatar?: string;
}

interface ClientInfo {
  name: string;
  avatar: string | null;
  email: string;
  phone: string;
  nextAppointment: string | null;
  therapySince: string;
  primaryConcerns: string[];
  notes: string;
}

const TherapistMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showClientInfo, setShowClientInfo] = useState(false);
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.clientId);
      fetchClientInfo(activeConversation.clientId);
    }
  }, [activeConversation]);

  const fetchConversations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get unique clients who have messages with this therapist
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .select('sender_id, receiver_id, content, created_at, is_read')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (messageError) throw messageError;

      if (!messageData || messageData.length === 0) {
        setLoading(false);
        return;
      }

      // Extract unique clients
      const uniqueClientIds = new Set<string>();
      messageData.forEach(msg => {
        const clientId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        if (clientId !== user.id) {
          uniqueClientIds.add(clientId);
        }
      });

      // Get client profiles
      const conversationsData: Conversation[] = [];
      
      for (const clientId of uniqueClientIds) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, profile_image_url')
          .eq('id', clientId)
          .single();
        
        if (profileError) {
          console.error(`Error fetching client profile for ${clientId}:`, profileError);
          continue;
        }
        
        // Get last message
        const clientMessages = messageData.filter(msg => 
          msg.sender_id === clientId || msg.receiver_id === clientId
        ).sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        const lastMsg = clientMessages[0];
        const hasUnread = clientMessages.some(msg => msg.receiver_id === user.id && !msg.is_read);
        
        conversationsData.push({
          id: clientId,
          clientId: clientId,
          client: profileData?.full_name || 'Unknown Client',
          avatar: profileData?.profile_image_url || null,
          lastMessage: lastMsg.content,
          time: format(new Date(lastMsg.created_at), 'MMM dd'),
          unread: hasUnread,
          status: 'offline' // We'll assume offline by default
        });
      }
      
      setConversations(conversationsData);
      
      // Set active conversation to the first one if not set
      if (conversationsData.length > 0 && !activeConversation) {
        setActiveConversation(conversationsData[0]);
      }
      
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast({
        title: "Error",
        description: "Failed to load conversations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (clientId: string) => {
    if (!user || !clientId) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('id, sender_id, receiver_id, content, created_at')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${clientId}),and(sender_id.eq.${clientId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
      
      if (error) throw error;

      if (data) {
        // Mark unread messages as read
        const unreadMessageIds = data
          .filter(msg => msg.receiver_id === user.id && !msg.is_read)
          .map(msg => msg.id);
          
        if (unreadMessageIds.length > 0) {
          await supabase
            .from('messages')
            .update({ is_read: true })
            .in('id', unreadMessageIds);
        }
        
        // Format messages for display
        const formattedMessages: Message[] = await Promise.all(data.map(async msg => {
          const isClientSender = msg.sender_id !== user.id;
          
          // Get sender profile if needed
          let senderName = isClientSender ? activeConversation?.client : 'You';
          let senderAvatar = isClientSender ? activeConversation?.avatar : null;
          
          return {
            id: msg.id,
            senderId: msg.sender_id,
            content: msg.content,
            timestamp: format(new Date(msg.created_at), 'h:mm a'),
            sender: isClientSender ? 'client' : 'therapist',
            senderName,
            senderAvatar
          };
        }));
        
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive"
      });
    }
  };

  const fetchClientInfo = async (clientId: string) => {
    if (!user || !clientId) return;
    
    try {
      // Get client profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, email, profile_image_url')
        .eq('id', clientId)
        .single();
      
      if (profileError) throw profileError;
      
      // Get next appointment
      const { data: appointments, error: appointmentError } = await supabase
        .from('appointments')
        .select('start_time')
        .eq('client_id', clientId)
        .eq('therapist_id', user.id)
        .gt('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(1);
      
      if (appointmentError) throw appointmentError;
      
      // Get first appointment date for "therapy since"
      const { data: firstAppointment, error: firstAppointmentError } = await supabase
        .from('appointments')
        .select('start_time')
        .eq('client_id', clientId)
        .eq('therapist_id', user.id)
        .order('start_time', { ascending: true })
        .limit(1);
      
      if (firstAppointmentError) throw firstAppointmentError;
      
      // Get session notes for concerns
      const { data: notes, error: notesError } = await supabase
        .from('session_notes')
        .select('title, content')
        .eq('client_id', clientId)
        .eq('therapist_id', user.id)
        .limit(1);
      
      if (notesError) throw notesError;
      
      setClientInfo({
        name: profile.full_name || 'Unknown Client',
        avatar: profile.profile_image_url,
        email: profile.email || 'No email provided',
        phone: 'Not provided', // This could be added to profiles table later
        nextAppointment: appointments && appointments.length > 0 
          ? format(new Date(appointments[0].start_time), 'MMM dd, yyyy \'at\' h:mm a')
          : null,
        therapySince: firstAppointment && firstAppointment.length > 0
          ? format(new Date(firstAppointment[0].start_time), 'MMMM yyyy')
          : 'N/A',
        primaryConcerns: ['Not specified'], // This would need to come from a proper data source
        notes: notes && notes.length > 0 ? notes[0].content : 'No notes available'
      });
      
    } catch (error) {
      console.error("Error fetching client info:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !user || !activeConversation) return;
    
    setSendingMessage(true);
    try {
      // Save the message to the database
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: activeConversation.clientId,
          content: messageInput,
          is_read: false
        })
        .select();
      
      if (error) throw error;
      
      // Add the sent message to the messages display
      if (data && data.length > 0) {
        const newMsg: Message = {
          id: data[0].id,
          senderId: user.id,
          content: messageInput,
          timestamp: format(new Date(), 'h:mm a'),
          sender: 'therapist'
        };
        
        setMessages(prev => [...prev, newMsg]);
        
        // Update the last message in the conversation list
        setConversations(conversations.map(conv => {
          if (conv.id === activeConversation.id) {
            return {
              ...conv,
              lastMessage: messageInput,
              time: format(new Date(), 'MMM dd')
            };
          }
          return conv;
        }));
      }
      
      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const filteredConversations = conversations.filter(
    conv => conv.client.toLowerCase().includes(searchInput.toLowerCase())
  );

  if (loading && conversations.length === 0) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-160px)]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading your messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-160px)]">
      <div className="flex h-full rounded-lg border overflow-hidden">
        {/* Conversations Sidebar */}
        <div className="w-full md:w-1/3 lg:w-1/4 border-r flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search messages" 
                className="pl-9" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>
          <Tabs defaultValue="all" className="w-full">
            <div className="px-4 pt-2">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
                <TabsTrigger value="flagged" className="flex-1">Flagged</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="mt-0">
              <ScrollArea className="h-[calc(100vh-260px)]">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <h3 className="font-medium">No conversations yet</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Messages from your clients will appear here
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredConversations.map(conversation => (
                      <div
                        key={conversation.id}
                        className={`flex items-center p-4 gap-3 cursor-pointer hover:bg-accent/50 transition-colors ${
                          activeConversation?.id === conversation.id ? "bg-accent" : ""
                        }`}
                        onClick={() => setActiveConversation(conversation)}
                      >
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={conversation.avatar || undefined} />
                            <AvatarFallback>{conversation.client.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                            conversation.status === "online" ? "bg-green-500" : "bg-gray-400"
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium truncate">{conversation.client}</h4>
                            <span className="text-xs text-muted-foreground">{conversation.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage}
                          </p>
                        </div>
                        {conversation.unread && (
                          <Badge variant="default" className="h-2 w-2 rounded-full p-0 bg-thera-600"></Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="unread">
              <div className="p-8 text-center">
                <MessageCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <h3 className="font-medium">No unread messages</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You've caught up on all your messages
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="flagged">
              <div className="p-8 text-center">
                <Star className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <h3 className="font-medium">No flagged messages</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Flag important messages for follow-up
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex flex-col flex-1">
          {!activeConversation ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <h2 className="text-xl font-medium mb-2">No conversation selected</h2>
                <p className="text-muted-foreground">
                  Select a conversation from the sidebar to start messaging
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={activeConversation.avatar || undefined} />
                    <AvatarFallback>{activeConversation.client.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <h3 className="font-medium">{activeConversation.client}</h3>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span className={`h-2 w-2 rounded-full mr-1 ${
                        activeConversation.status === "online" ? "bg-green-500" : "bg-gray-400"
                      }`}></span>
                      <span>{activeConversation.status === "online" ? "Online" : "Offline"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground"
                    onClick={() => setShowClientInfo(!showClientInfo)}
                  >
                    <Info className="h-5 w-5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View client profile</DropdownMenuItem>
                      <DropdownMenuItem>Schedule appointment</DropdownMenuItem>
                      <DropdownMenuItem>Search in conversation</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Clear conversation</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-center">
                    <div>
                      <MessageCircle className="h-10 w-10 mx-auto text-muted-foreground/30 mb-4" />
                      <p className="text-muted-foreground">
                        No messages yet. Start the conversation!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "therapist" ? "justify-end" : "justify-start"}`}
                      >
                        {message.sender === "client" && (
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={message.senderAvatar || undefined} />
                            <AvatarFallback>{activeConversation.client.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          <div className={`max-w-md rounded-lg p-3 ${
                            message.sender === "therapist"
                              ? "bg-thera-600 text-white rounded-tr-none"
                              : "bg-muted rounded-tl-none"
                          }`}>
                            {message.content}
                          </div>
                          <div className={`text-xs text-muted-foreground mt-1 ${
                            message.sender === "therapist" ? "text-right" : ""
                          }`}>
                            {message.timestamp}
                          </div>
                        </div>
                        {message.sender === "therapist" && (
                          <Avatar className="h-8 w-8 ml-2">
                            <AvatarFallback>{profile?.full_name?.[0] || "T"}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-end space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <Paperclip className="h-5 w-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent side="top" align="start" className="w-72">
                      <div className="grid gap-3">
                        <Button variant="outline" className="w-full justify-start">
                          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="17" r=".5" fill="currentColor"/>
                          </svg>
                          Send a resource
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                            <path d="M21 15l-5-5L5 21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Upload image
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Send document
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Textarea 
                    placeholder="Type a message..." 
                    className="min-h-[60px] flex-1 resize-none"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || sendingMessage}
                  >
                    {sendingMessage ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Send
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Client Info Panel (conditional) */}
        {showClientInfo && clientInfo && (
          <div className="hidden lg:block w-1/4 border-l overflow-auto">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Client Information</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground"
                  onClick={() => setShowClientInfo(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 flex flex-col items-center">
              <Avatar className="h-20 w-20">
                <AvatarImage src={clientInfo.avatar || undefined} />
                <AvatarFallback>{clientInfo.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-medium mt-3">{clientInfo.name}</h2>
              <p className="text-sm text-muted-foreground">Client since {clientInfo.therapySince}</p>
              
              <div className="w-full mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Next Appointment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{clientInfo.nextAppointment || 'No upcoming appointments'}</p>
                  </CardContent>
                </Card>
                
                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Contact Information</h4>
                    <div className="text-sm space-y-1">
                      <p>Email: {clientInfo.email}</p>
                      <p>Phone: {clientInfo.phone}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Primary Concerns</h4>
                    <div className="flex flex-wrap gap-1">
                      {clientInfo.primaryConcerns.map((concern, index) => (
                        <Badge key={index} variant="outline" className="bg-muted/40">
                          {concern}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Notes</h4>
                    <p className="text-sm text-muted-foreground">{clientInfo.notes}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 w-full flex flex-col gap-2">
                <Button variant="outline" className="w-full">View Full Profile</Button>
                <Button variant="outline" className="w-full">View Session History</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistMessages;

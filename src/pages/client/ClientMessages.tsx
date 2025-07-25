import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ClientMessages = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [therapists, setTherapists] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]); // Optional: if you want to support friends
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [partnerType, setPartnerType] = useState<"therapist" | "friend" | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch therapists
  useEffect(() => {
    if (!user) return;

    const fetchTherapists = async () => {
      try {
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from("appointments")
          .select("therapist_id")
          .eq("client_id", user.id);

        if (appointmentsError) throw appointmentsError;

 

        const therapistIds = [...new Set(appointmentsData.map((a) => a.therapist_id))];

        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, full_name, profile_image_url")
          .in("id", therapistIds);

        if (profilesError) throw profilesError;

        setTherapists(profiles);
        if (profiles.length > 0) {
          setSelectedPartnerId(profiles[0].id);
          setPartnerType("therapist");
        }
      } catch (error) {
        console.error("Error fetching therapists:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTherapists();
  }, [user]);

  // Fetch messages
  useEffect(() => {
    if (!user || !selectedPartnerId) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(
            `and(sender_id.eq.${user.id},receiver_id.eq.${selectedPartnerId}),and(sender_id.eq.${selectedPartnerId},receiver_id.eq.${user.id})`
          )
          .order("created_at", { ascending: true });

        if (error) throw error;

        setMessages(data || []);

        // Mark unread messages as read
        const unread = data
          .filter((msg: any) => msg.sender_id === selectedPartnerId && !msg.is_read)
          .map((msg: any) => msg.id);

        if (unread.length > 0) {
          await supabase.from("messages").update({ is_read: true }).in("id", unread);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // Real-time updates
    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${user.id}`,
        },
        (payload) => {
          if (
            payload.new.sender_id === selectedPartnerId ||
            payload.new.receiver_id === selectedPartnerId
          ) {
            setMessages((prev) => [...prev, payload.new]);

            // Auto-mark as read
            supabase.from("messages").update({ is_read: true }).eq("id", payload.new.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedPartnerId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedPartnerId) return;

    try {
      const { error } = await supabase.from("messages").insert({
        sender_id: user.id,
        receiver_id: selectedPartnerId,
        content: newMessage.trim(),
        is_read: false,
      });

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error("Send message failed:", error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();
  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const groupedMessages = messages.reduce((acc: any, msg: any) => {
    const date = formatDate(msg.created_at);
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

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

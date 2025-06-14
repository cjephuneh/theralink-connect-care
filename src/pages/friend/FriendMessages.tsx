
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const FriendMessages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [sendLoading, setSendLoading] = useState(false);

  // Fetch all messages where user is sender OR receiver
  const { data: messages = [], refetch, isLoading } = useQuery({
    queryKey: ["friend-messages-list", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Send new message (for demo: send to self)
  const handleSend = async () => {
    if (!message.trim()) return;
    setSendLoading(true);
    const { error } = await supabase.from("messages").insert([
      {
        sender_id: user.id,
        receiver_id: user.id, // For demo, send to self. Update logic to send to others.
        content: message,
      },
    ]);
    setSendLoading(false);
    if (!error) {
      setMessage("");
      refetch();
    } else {
      toast({
        title: "Failed to send",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>
            <MessageCircle className="inline mr-2" /> Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6 max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div>Loading...</div>
            ) : messages.length === 0 ? (
              <div className="text-muted-foreground text-center">
                No messages yet.
              </div>
            ) : (
              messages.map((msg: any) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_id === user.id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-xs ${
                      msg.sender_id === user.id
                        ? "bg-primary text-white"
                        : "bg-muted/70 text-black"
                    }`}
                  >
                    {msg.content}
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <form
            className="flex gap-2"
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
          >
            <Input
              placeholder="Type your message..."
              value={message}
              disabled={sendLoading}
              onChange={e => setMessage(e.target.value)}
            />
            <Button
              type="submit"
              disabled={sendLoading || !message.trim()}
              className="px-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FriendMessages;

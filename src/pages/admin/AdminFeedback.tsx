
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminFeedback = () => {
  const [feedbackMessages, setFeedbackMessages] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        // Fetch feedback messages
        const { data: feedback, error: feedbackError } = await supabase
          .from("feedback")
          .select("*, profiles(full_name, email)")
          .order("created_at", { ascending: false });

        if (feedbackError) throw feedbackError;
        setFeedbackMessages(feedback || []);

        // Fetch contact messages
        const { data: contacts, error: contactsError } = await supabase
          .from("contact_messages")
          .select("*")
          .order("created_at", { ascending: false });

        if (contactsError) throw contactsError;
        setContactMessages(contacts || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error fetching data",
          description: "There was a problem fetching messages.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const markFeedbackAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("feedback")
        .update({ is_read: true })
        .eq("id", id);

      if (error) throw error;

      setFeedbackMessages(
        feedbackMessages.map((msg) =>
          msg.id === id ? { ...msg, is_read: true } : msg
        )
      );

      toast({
        title: "Success",
        description: "Feedback marked as read",
      });
    } catch (error) {
      console.error("Error marking feedback as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark feedback as read",
        variant: "destructive",
      });
    }
  };

  const markContactAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ is_read: true })
        .eq("id", id);

      if (error) throw error;

      setContactMessages(
        contactMessages.map((msg) =>
          msg.id === id ? { ...msg, is_read: true } : msg
        )
      );

      toast({
        title: "Success",
        description: "Contact message marked as read",
      });
    } catch (error) {
      console.error("Error marking contact as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark contact as read",
        variant: "destructive",
      });
    }
  };

  const getFeedbackTypeLabel = (type: string) => {
    switch (type) {
      case "client":
        return "Client Dashboard";
      case "therapist":
        return "Therapist Dashboard";
      case "friend":
        return "Friend Dashboard";
      case "admin":
        return "Admin Dashboard";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Feedback & Contact Messages</h1>
      
      <Tabs defaultValue="feedback">
        <TabsList className="mb-6">
          <TabsTrigger value="feedback">User Feedback</TabsTrigger>
          <TabsTrigger value="contact">Contact Messages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feedback">
          <div className="grid grid-cols-1 gap-6">
            {isLoading ? (
              <div className="text-center py-10">Loading messages...</div>
            ) : feedbackMessages.length === 0 ? (
              <div className="text-center py-10">No feedback messages found.</div>
            ) : (
              feedbackMessages.map((feedback) => (
                <Card key={feedback.id} className={!feedback.is_read ? "border-primary" : ""}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          <MessageSquare className="h-5 w-5 mr-2" />
                          {getFeedbackTypeLabel(feedback.dashboard_type)} Feedback
                          {!feedback.is_read && (
                            <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                              New
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription>
                          From: {feedback.profiles?.full_name || "Anonymous"} ({feedback.profiles?.email || "No email"})
                          {feedback.rating && (
                            <span className="ml-2">
                              Rating: {feedback.rating}/5
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(feedback.created_at).toLocaleDateString()} at{" "}
                        {new Date(feedback.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{feedback.message}</p>
                    {!feedback.is_read && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => markFeedbackAsRead(feedback.id)}
                      >
                        <Check className="h-4 w-4 mr-1" /> Mark as Read
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="contact">
          <div className="grid grid-cols-1 gap-6">
            {isLoading ? (
              <div className="text-center py-10">Loading messages...</div>
            ) : contactMessages.length === 0 ? (
              <div className="text-center py-10">No contact messages found.</div>
            ) : (
              contactMessages.map((contact) => (
                <Card key={contact.id} className={!contact.is_read ? "border-primary" : ""}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          {contact.subject}
                          {!contact.is_read && (
                            <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                              New
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription>
                          From: {contact.name} ({contact.email})
                        </CardDescription>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(contact.created_at).toLocaleDateString()} at{" "}
                        {new Date(contact.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{contact.message}</p>
                    {!contact.is_read && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => markContactAsRead(contact.id)}
                      >
                        <Check className="h-4 w-4 mr-1" /> Mark as Read
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminFeedback;

import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { 
  Send,
  Paperclip,
  Video,
  Calendar,
  Clock,
  Smile,
  Image,
  FileText,
  MoreVertical,
  Phone,
  Lock,
  ArrowLeftCircle,
  MessageCircle
} from "lucide-react";

const formatMessageDate = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  
  // Same day
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Same week
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);
  if (date > weekAgo) {
    return date.toLocaleDateString([], { weekday: 'long' }) + `, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Different week
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + `, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

const ChatPage = () => {
  const { therapistId } = useParams<{ therapistId: string }>();
  const [therapist, setTherapist] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Load therapist data and messages
  useEffect(() => {
    setLoading(true);
    
    const fetchChatData = async () => {
      try {
        // TODO: Replace with API calls to fetch therapist and messages
        // const therapistResponse = await fetch(`/api/therapists/${therapistId}`);
        // const therapistData = await therapistResponse.json();
        // setTherapist(therapistData);
        
        // const messagesResponse = await fetch(`/api/messages?therapistId=${therapistId}`);
        // const messagesData = await messagesResponse.json();
        // setMessages(messagesData);
        
        setTherapist(null); // Set to null for now since we removed mock data
        setMessages([]);
      } catch (error) {
        console.error("Error fetching chat data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchChatData();
  }, [therapistId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const sendMessage = () => {
    if (inputMessage.trim() === "") return;
    
    const newMessage = {
      id: Date.now(),
      senderId: "client",
      receiverId: therapist?.id,
      content: inputMessage,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setMessages([...messages, newMessage]);
    setInputMessage("");
    
    // TODO: Replace with actual WebSocket or API call to send message
    // In a real implementation, you would:
    // 1. Send the message to your backend
    // 2. Wait for confirmation
    // 3. Update the UI with the confirmed message
    // 4. Handle responses via WebSocket or polling
    
    // This setTimeout simulates a response from the therapist
    if (therapist) {
      setTimeout(() => {
        const responseMessage = {
          id: Date.now() + 1,
          senderId: therapist.id,
          receiverId: "client",
          content: "Thanks for your message! I'll get back to you as soon as possible.",
          timestamp: new Date().toISOString(),
          read: false
        };
        
        setMessages(prevMessages => [...prevMessages, responseMessage]);
      }, 1500);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center h-screen animation-fade-in">
        <div className="w-full max-w-4xl h-96 flex items-center justify-center">
          <div className="flex flex-col items-center animate-pulse-subtle">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <MessageCircle className="h-8 w-8 text-primary/40" />
            </div>
            <p className="text-muted-foreground">Loading conversation...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!therapist) {
    return (
      <div className="container mx-auto px-4 py-12 animation-fade-in">
        <div className="bg-card p-8 rounded-xl shadow-sm text-center">
          <h2 className="text-2xl font-bold mb-4">Therapist Not Found</h2>
          <p className="text-muted-foreground mb-6">We couldn't find the therapist you're looking for.</p>
          <Button asChild>
            <Link to="/therapists">Back to Therapist Directory</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 animation-fade-in">
      <div className="max-w-5xl mx-auto h-[85vh] flex flex-col">
        <Card className="overflow-hidden flex-1 flex flex-col rounded-xl card-shadow">
          <CardHeader className="flex flex-row items-center justify-between p-4 bg-card border-b border-border">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2 md:hidden"
                asChild
              >
                <Link to="/dashboard">
                  <ArrowLeftCircle className="h-5 w-5" />
                </Link>
              </Button>
              <div className="relative">
                {/* TODO: Replace with actual therapist image */}
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-3 border border-border flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-gray-400" />
                </div>
                {/* TODO: Replace with actual status indicator */}
                <span className={`absolute bottom-0 right-2 w-3 h-3 rounded-full border-2 border-white bg-gray-400`} />
              </div>
              
              <div>
                {/* TODO: Replace with actual therapist name */}
                <h2 className="font-bold">Therapist Name</h2>
                <p className="text-xs text-muted-foreground">
                  {/* TODO: Replace with actual status */}
                  <span>Status unknown</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-muted-foreground hover:text-primary"
              >
                <Link to={`/video/${therapistId}`}>
                  <Video className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-muted-foreground hover:text-primary"
              >
                <Link to={`/call/${therapistId}`}>
                  <Phone className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-muted-foreground hover:text-primary"
              >
                <Link to={`/therapists/${therapistId}/book`}>
                  <Calendar className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 overflow-y-auto flex-1 bg-muted/30">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-center mb-4">
                <span className="bg-accent px-4 py-1.5 rounded-full text-xs text-primary-foreground/70 flex items-center">
                  <Lock className="h-3 w-3 mr-1.5" /> End-to-end encrypted conversation
                </span>
              </div>
              
              {messages.map((message) => {
                const isClient = message.senderId === "client";
                return (
                  <div 
                    key={message.id} 
                    className={`flex ${isClient ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex flex-col max-w-[80%] md:max-w-[70%]">
                      <div 
                        className={`rounded-2xl p-4 ${
                          isClient 
                            ? "bg-primary text-primary-foreground rounded-tr-none" 
                            : "bg-card rounded-tl-none"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <span className={`text-xs mt-1 ${isClient ? "text-right" : ""} text-muted-foreground`}>
                        {formatMessageDate(message.timestamp)}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          
          <CardFooter className="p-4 border-t border-border bg-card">
            <div className="flex items-center w-full gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary"
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              
              <div className="relative flex-1">
                <Input 
                  placeholder="Type a message..." 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="pr-24 rounded-full"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 p-1 text-muted-foreground hover:text-primary"
                  >
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 p-1 text-muted-foreground hover:text-primary"
                  >
                    <Image className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 p-1 text-muted-foreground hover:text-primary"
                  >
                    <FileText className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <Button
                size="icon"
                onClick={sendMessage}
                disabled={inputMessage.trim() === ""}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="mt-2 text-xs text-center text-muted-foreground w-full">
              <p>Response times may vary. For urgent matters, please use emergency services.</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;
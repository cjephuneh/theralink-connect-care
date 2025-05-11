
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

// Mock therapist data
const mockTherapists = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    title: "Licensed Clinical Psychologist",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    status: "online",
    lastActive: "Just now"
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    title: "Licensed Marriage & Family Therapist",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    status: "offline",
    lastActive: "3 hours ago"
  },
  {
    id: "3",
    name: "Dr. Amara Okafor",
    title: "Clinical Social Worker",
    image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    status: "away",
    lastActive: "20 minutes ago"
  },
];

// Mock message data
const mockMessages = [
  {
    id: 1,
    senderId: "client",
    receiverId: "1",
    content: "Hello Dr. Johnson, I've been feeling anxious about my upcoming job interview. Do you have any techniques I could use to stay calm?",
    timestamp: "2025-05-10T14:30:00Z",
    read: true
  },
  {
    id: 2,
    senderId: "1",
    receiverId: "client",
    content: "Hi there! It's completely normal to feel anxious about interviews. One technique you might find helpful is the 4-7-8 breathing method. Inhale for 4 seconds, hold for 7, and exhale for 8. This can help regulate your nervous system.",
    timestamp: "2025-05-10T14:35:00Z",
    read: true
  },
  {
    id: 3,
    senderId: "client",
    receiverId: "1",
    content: "I'll try that, thank you. I'm also worried about blanking on questions. Any advice for that?",
    timestamp: "2025-05-10T14:40:00Z",
    read: true
  },
  {
    id: 4,
    senderId: "1",
    receiverId: "client",
    content: "That's a common concern! I recommend the STAR method for answering interview questions: Situation, Task, Action, Result. Prepare a few stories from your experience that showcase your skills. If you do blank momentarily, it's okay to take a breath and say, 'That's a great question, let me think about that for a moment.'",
    timestamp: "2025-05-10T14:45:00Z",
    read: true
  },
  {
    id: 5,
    senderId: "1",
    receiverId: "client",
    content: "Would you like to schedule a quick session before your interview to practice some techniques together?",
    timestamp: "2025-05-10T14:47:00Z",
    read: false
  },
];

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
  
  // Load therapist data
  useEffect(() => {
    setLoading(true);
    // In a real app, this would be an API call to get therapist details and message history
    setTimeout(() => {
      const found = mockTherapists.find(t => t.id === therapistId);
      setTherapist(found || null);
      
      if (found) {
        // Filter messages for this therapist
        const filteredMessages = mockMessages.filter(
          m => (m.senderId === found.id && m.receiverId === "client") || 
               (m.senderId === "client" && m.receiverId === found.id)
        );
        setMessages(filteredMessages);
      }
      
      setLoading(false);
    }, 800);
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
      receiverId: therapist.id,
      content: inputMessage,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setMessages([...messages, newMessage]);
    setInputMessage("");
    
    // Mock response after a delay (in a real app, this would be a WebSocket message from the server)
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
                <img 
                  src={therapist.image} 
                  alt={therapist.name}
                  className="w-12 h-12 rounded-full object-cover mr-3 border border-border"
                />
                <span className={`absolute bottom-0 right-2 w-3 h-3 rounded-full border-2 border-white ${
                  therapist.status === 'online' ? 'bg-green-500' : 
                  therapist.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                }`} />
              </div>
              
              <div>
                <h2 className="font-bold">{therapist.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {therapist.status === 'online' ? (
                    <span className="text-green-500">Online now</span>
                  ) : (
                    <span>Last active {therapist.lastActive}</span>
                  )}
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
                <Link to={`/video/${therapist.id}`}>
                  <Video className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-muted-foreground hover:text-primary"
              >
                <Link to={`/call/${therapist.id}`}>
                  <Phone className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-muted-foreground hover:text-primary"
              >
                <Link to={`/therapists/${therapist.id}/book`}>
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

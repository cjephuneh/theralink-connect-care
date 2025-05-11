
import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

// Mock therapist data
const mockTherapists = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "3",
    name: "Dr. Amara Okafor",
    image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
  },
];

// Mock user ID
const currentUserId = "current-user";

const ChatPage = () => {
  const { therapistId } = useParams<{ therapistId: string }>();
  const [therapist, setTherapist] = useState<any | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Load therapist data
  useEffect(() => {
    setLoading(true);
    // In a real app, this would be an API call
    setTimeout(() => {
      const found = mockTherapists.find(t => t.id === therapistId);
      setTherapist(found || null);
      
      // Load sample messages
      if (found) {
        const sampleMessages: Message[] = [
          {
            id: "1",
            senderId: found.id,
            text: `Hello! This is ${found.name}. How can I help you today?`,
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          },
          {
            id: "2",
            senderId: currentUserId,
            text: "Hi doctor, I've been feeling anxious lately and would like to schedule a session to talk about it.",
            timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
          },
          {
            id: "3",
            senderId: found.id,
            text: "I'm sorry to hear you're feeling anxious. I have some availability this week for a session. Would you prefer video or in-person?",
            timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000),
          },
        ];
        setMessages(sampleMessages);
      }
      
      setLoading(false);
    }, 800); // Simulate loading
  }, [therapistId]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Send message function
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      text: newMessage.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    
    // Simulate therapist response after a delay
    setTimeout(() => {
      const therapistMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        senderId: therapist?.id || "",
        text: "Thank you for your message. I'll get back to you as soon as I can. For urgent concerns, please use the crisis support feature.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, therapistMessage]);
    }, 1000);
  };
  
  // Format timestamp
  const formatTime = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="w-full max-w-4xl h-96 flex items-center justify-center">
          <div className="animate-pulse-subtle">
            <p className="text-gray-500">Loading conversation...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!therapist) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
          <h2 className="text-2xl font-bold mb-4">Therapist Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the conversation you're looking for.</p>
          <Button asChild>
            <a href="/therapists">Back to Therapist Directory</a>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Chat header */}
        <div className="bg-thera-600 text-white p-4 flex items-center">
          <img 
            src={therapist.image} 
            alt={therapist.name}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div>
            <h1 className="font-medium">{therapist.name}</h1>
            <p className="text-xs opacity-90">End-to-end encrypted messaging</p>
          </div>
        </div>
        
        {/* Chat messages */}
        <div className="h-[60vh] overflow-y-auto p-4 bg-gray-50">
          {messages.map((message) => {
            const isCurrentUser = message.senderId === currentUserId;
            
            return (
              <div 
                key={message.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
              >
                {!isCurrentUser && (
                  <img 
                    src={therapist.image} 
                    alt={therapist.name}
                    className="w-8 h-8 rounded-full object-cover mr-2 mt-1"
                  />
                )}
                <div 
                  className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                    isCurrentUser 
                      ? 'bg-thera-600 text-white rounded-br-none' 
                      : 'bg-white border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <p>{message.text}</p>
                  <p 
                    className={`text-xs mt-1 text-right ${
                      isCurrentUser ? 'text-thera-100' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Message input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <Input 
              placeholder="Type your message..." 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-grow"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-thera-600 hover:bg-thera-700"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Messages are end-to-end encrypted and protected by HIPAA standards. 
            Response times may vary—for urgent concerns, please use our crisis support services.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

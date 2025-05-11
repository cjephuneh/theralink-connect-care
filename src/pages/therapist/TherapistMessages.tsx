
import { useState } from "react";
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
  Star
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

// Mock data for conversations
const conversations = [
  {
    id: 1,
    client: "Sarah Johnson",
    avatar: "/placeholder.svg",
    lastMessage: "Thank you for your help with my anxiety techniques.",
    time: "10:24 AM",
    unread: true,
    status: "online"
  },
  {
    id: 2,
    client: "Michael Chen",
    avatar: "/placeholder.svg",
    lastMessage: "I've been practicing mindfulness as you suggested.",
    time: "Yesterday",
    unread: false,
    status: "offline"
  },
  {
    id: 3,
    client: "Emily Davis",
    avatar: "/placeholder.svg",
    lastMessage: "Looking forward to our session next week.",
    time: "Yesterday",
    unread: false,
    status: "online"
  },
  {
    id: 4,
    client: "David Wilson",
    avatar: "/placeholder.svg",
    lastMessage: "I felt much better after our last session.",
    time: "Monday",
    unread: false,
    status: "offline"
  },
  {
    id: 5,
    client: "Jessica Brown",
    avatar: "/placeholder.svg",
    lastMessage: "Can we reschedule our appointment?",
    time: "05/05",
    unread: false,
    status: "offline"
  }
];

// Mock data for the active conversation
const messages = [
  {
    id: 1,
    senderId: 1,
    content: "Good morning Dr. Morgan! I wanted to thank you for our session yesterday.",
    timestamp: "10:15 AM",
    sender: "client"
  },
  {
    id: 2,
    senderId: "therapist",
    content: "Good morning Sarah! I'm glad you found it helpful. How have you been feeling since our session?",
    timestamp: "10:18 AM",
    sender: "therapist"
  },
  {
    id: 3,
    senderId: 1,
    content: "Much better, actually. I've been using those breathing techniques you taught me when I feel anxious, and they've been helping a lot.",
    timestamp: "10:20 AM",
    sender: "client"
  },
  {
    id: 4,
    senderId: "therapist",
    content: "That's wonderful to hear! Consistency with the breathing exercises will make a big difference over time. Have you noticed any specific situations where they've been most effective?",
    timestamp: "10:22 AM",
    sender: "therapist"
  },
  {
    id: 5,
    senderId: 1,
    content: "Yes, especially during my morning commute on the subway. That used to be a big trigger for me, but I've been able to stay much more calm by focusing on my breathing.",
    timestamp: "10:24 AM",
    sender: "client"
  }
];

// Client info for the selected conversation
const clientInfo = {
  name: "Sarah Johnson",
  avatar: "/placeholder.svg",
  email: "sarah.johnson@example.com",
  phone: "(555) 123-4567",
  nextAppointment: "May 15, 2025 at 3:00 PM",
  therapySince: "January 2025",
  primaryConcerns: ["Anxiety", "Work Stress", "Relationships"],
  notes: "Responds well to CBT techniques. Has shown significant improvement in managing anxiety triggers."
};

const TherapistMessages = () => {
  const [activeConversation, setActiveConversation] = useState(conversations[0]);
  const [messageInput, setMessageInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showClientInfo, setShowClientInfo] = useState(false);

  const filteredConversations = conversations.filter(
    conv => conv.client.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log("Sending message:", messageInput);
      // In a real app, you would add the message to the state or send to API
      setMessageInput("");
    }
  };

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
                <div className="divide-y">
                  {filteredConversations.map(conversation => (
                    <div
                      key={conversation.id}
                      className={`flex items-center p-4 gap-3 cursor-pointer hover:bg-accent/50 transition-colors ${
                        activeConversation.id === conversation.id ? "bg-accent" : ""
                      }`}
                      onClick={() => setActiveConversation(conversation)}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={conversation.avatar} />
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
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <Avatar className="h-10 w-10">
                <AvatarImage src={activeConversation.avatar} />
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
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "therapist" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "client" && (
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={activeConversation.avatar} />
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
                      <AvatarFallback>DR</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
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
                disabled={!messageInput.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>

        {/* Client Info Panel (conditional) */}
        {showClientInfo && (
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
                <AvatarImage src={clientInfo.avatar} />
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
                    <p className="text-sm">{clientInfo.nextAppointment}</p>
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

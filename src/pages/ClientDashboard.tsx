
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  MessageCircle,
  Video,
  User,
  Settings,
  Bell,
  FileText,
  Star,
  ChevronRight,
  Users,
  BarChart,
  Shield,
  Sparkles,
  CheckCircle,
} from "lucide-react";

// Mock data
const upcomingAppointments = [
  {
    id: 1,
    therapistId: 1,
    therapistName: "Dr. Sarah Johnson",
    therapistImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    date: "2025-05-15T14:00:00Z",
    duration: 50,
    type: "video",
    status: "confirmed"
  },
  {
    id: 2,
    therapistId: 3,
    therapistName: "Dr. Amara Okafor",
    therapistImage: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    date: "2025-05-20T10:30:00Z",
    duration: 50,
    type: "video",
    status: "confirmed"
  }
];

const recentMessages = [
  {
    id: 1,
    therapistId: 1,
    therapistName: "Dr. Sarah Johnson",
    therapistImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    timestamp: "2025-05-10T14:47:00Z",
    preview: "Would you like to schedule a quick session before your interview to practice some techniques together?",
    unread: true
  },
  {
    id: 2,
    therapistId: 2,
    therapistName: "Dr. Michael Chen",
    therapistImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    timestamp: "2025-05-09T09:15:00Z",
    preview: "I've shared some resources on mindfulness that you might find helpful. Let me know your thoughts after reviewing them.",
    unread: false
  }
];

const recommendedTherapists = [
  {
    id: 4,
    name: "Dr. Robert Garcia",
    title: "Licensed Mental Health Counselor",
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    rating: 4.7,
    specialties: ["Anxiety", "Stress", "Work-Life Balance"],
    matchScore: 94
  },
  {
    id: 5,
    name: "Dr. Jasmine Patel",
    title: "Clinical Psychologist",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    rating: 4.9,
    specialties: ["Anxiety", "Cultural Issues", "Self-Esteem"],
    matchScore: 92
  }
];

const wellnessGoals = [
  { id: 1, title: "Practice deep breathing daily", progress: 60, streak: 5 },
  { id: 2, title: "Journal thoughts before bed", progress: 40, streak: 3 },
  { id: 3, title: "Daily positive affirmation", progress: 80, streak: 8 }
];

const formatAppointmentDate = (dateStr: string) => {
  const date = new Date(dateStr);
  
  const dayOfWeek = date.toLocaleString('default', { weekday: 'long' });
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  const time = date.toLocaleString('default', { hour: '2-digit', minute: '2-digit' });
  
  return {
    dayOfWeek,
    monthDay: `${month} ${day}`,
    time
  };
};

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
    return `Yesterday`;
  }
  
  // Same week
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);
  if (date > weekAgo) {
    return date.toLocaleDateString([], { weekday: 'short' });
  }
  
  // Different week
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const user = { name: "Alex Taylor" }; // Mock user data
  
  return (
    <div className="container mx-auto px-4 py-8 animation-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}</h1>
        <p className="text-muted-foreground">
          Your mental health dashboard
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="overview" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: <Users className="h-5 w-5" />, text: "Find Therapist", href: "/therapists", color: "bg-primary/10 text-primary" },
                { icon: <Calendar className="h-5 w-5" />, text: "Schedule Session", href: "/appointments/new", color: "bg-green-100 text-green-600" },
                { icon: <MessageCircle className="h-5 w-5" />, text: "Messages", href: "/messages", color: "bg-blue-100 text-blue-600" },
                { icon: <FileText className="h-5 w-5" />, text: "Resources", href: "/resources", color: "bg-purple-100 text-purple-600" }
              ].map((action, idx) => (
                <Card key={idx} className="border-none shadow-none hover:bg-card/80 transition-colors cursor-pointer">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mb-3`}>
                      {action.icon}
                    </div>
                    <p className="font-medium">{action.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Upcoming Appointments */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Upcoming Appointments</CardTitle>
                    <CardDescription>Your scheduled sessions</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild className="text-sm px-3">
                    <Link to="/appointments">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => {
                    const formattedDate = formatAppointmentDate(appointment.date);
                    return (
                      <Card key={appointment.id} className="overflow-hidden">
                        <div className="flex items-center p-3 bg-card border">
                          <div className="flex-shrink-0 w-10">
                            <div className="flex flex-col items-center justify-center h-full">
                              <div className={`rounded-full w-2 h-2 ${appointment.type === 'video' ? 'bg-primary' : 'bg-secondary'}`}></div>
                              <div className="h-full w-0.5 bg-muted my-1"></div>
                            </div>
                          </div>
                          
                          <div className="flex-shrink-0 text-right mr-4">
                            <p className="font-medium text-xs text-muted-foreground">{formattedDate.dayOfWeek}</p>
                            <p className="font-bold">{formattedDate.monthDay}</p>
                            <p className="text-sm">{formattedDate.time}</p>
                          </div>
                          
                          <div className="flex-1 ml-2">
                            <div className="flex items-center">
                              <img 
                                src={appointment.therapistImage} 
                                alt={appointment.therapistName}
                                className="w-10 h-10 rounded-full object-cover mr-3"
                              />
                              <div>
                                <h4 className="font-medium">{appointment.therapistName}</h4>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3 mr-1" /> 
                                  <span>{appointment.duration} minutes</span>
                                  <span className="mx-2">•</span>
                                  {appointment.type === 'video' ? (
                                    <Video className="h-3 w-3 mr-1 text-primary" />
                                  ) : (
                                    <MessageCircle className="h-3 w-3 mr-1 text-secondary" />
                                  )}
                                  <span className={appointment.type === 'video' ? 'text-primary' : 'text-secondary'}>
                                    {appointment.type === 'video' ? 'Video Session' : 'Chat Session'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex-shrink-0">
                            <Button 
                              variant="outline" 
                              size="sm"
                              asChild
                            >
                              <Link to={`/${appointment.type}/${appointment.therapistId}`}>
                                Join
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })
                ) : (
                  <div className="text-center p-8">
                    <p className="text-muted-foreground mb-4">No upcoming appointments</p>
                    <Button asChild>
                      <Link to="/therapists">Find a Therapist</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Recent Messages & Recommended Therapists (2-column layout) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Messages */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Recent Messages</CardTitle>
                      <CardDescription>Conversations with your therapists</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="text-sm px-3">
                      <Link to="/messages">View All</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentMessages.map((message) => (
                    <div key={message.id} className="flex items-center justify-between border-b border-border pb-3 last:border-b-0 last:pb-0">
                      <div className="flex items-center">
                        <div className="relative">
                          <img 
                            src={message.therapistImage} 
                            alt={message.therapistName}
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                          {message.unread && (
                            <span className="absolute top-0 right-2 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card"></span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">{message.therapistName}</h4>
                            <span className="text-xs text-muted-foreground ml-2">
                              {formatMessageDate(message.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">{message.preview}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="ml-2"
                        asChild
                      >
                        <Link to={`/chat/${message.therapistId}`}>
                          <MessageCircle className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/messages">View All Messages</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Recommended Therapists */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Recommended for You</CardTitle>
                      <CardDescription>Personalized therapist matches</CardDescription>
                    </div>
                    <div className="flex items-center text-xs">
                      <Sparkles className="h-3 w-3 text-yellow-500 mr-1" />
                      <span className="text-muted-foreground">AI-Powered</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recommendedTherapists.map((therapist) => (
                    <div key={therapist.id} className="flex items-center border-b border-border pb-3 last:border-b-0 last:pb-0">
                      <img 
                        src={therapist.image} 
                        alt={therapist.name}
                        className="w-12 h-12 rounded-full object-cover mr-3"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{therapist.name}</h4>
                        <p className="text-xs text-muted-foreground">{therapist.title}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {therapist.specialties.slice(0, 2).map((specialty, idx) => (
                            <span key={idx} className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                              {specialty}
                            </span>
                          ))}
                          {therapist.specialties.length > 2 && (
                            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                              +{therapist.specialties.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary mb-2">
                          {therapist.matchScore}% match
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          asChild
                        >
                          <Link to={`/therapists/${therapist.id}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/therapists">Find More Therapists</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Wellness Goals */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Wellness Goals</CardTitle>
                    <CardDescription>Your progress on set tasks</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <BarChart className="h-4 w-4 mr-2" /> Progress Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {wellnessGoals.map((goal) => (
                    <div key={goal.id}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-secondary" />
                          <span>{goal.title}</span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span className="font-medium">{goal.streak} day streak</span>
                          <Star className="h-3 w-3 text-yellow-500 ml-1 fill-yellow-500" />
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-secondary"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-end mt-1">
                        <span className="text-xs text-muted-foreground">{goal.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appointments">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Appointments</h2>
              <Button asChild>
                <Link to="/therapists">Book New Session</Link>
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <h3 className="font-medium text-lg">Upcoming Sessions</h3>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" /> Calendar View
                    </Button>
                  </div>
                  
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => {
                        const formattedDate = formatAppointmentDate(appointment.date);
                        return (
                          <Card key={appointment.id} className="overflow-hidden border-l-4 border-l-primary">
                            <div className="flex items-center p-4">
                              <div className="flex-shrink-0 text-right mr-4">
                                <p className="font-medium text-xs text-muted-foreground">{formattedDate.dayOfWeek}</p>
                                <p className="font-bold">{formattedDate.monthDay}</p>
                                <p className="text-sm">{formattedDate.time}</p>
                              </div>
                              
                              <div className="flex-1 ml-2">
                                <div className="flex items-center">
                                  <img 
                                    src={appointment.therapistImage} 
                                    alt={appointment.therapistName}
                                    className="w-12 h-12 rounded-full object-cover mr-3"
                                  />
                                  <div>
                                    <h4 className="font-medium">{appointment.therapistName}</h4>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <Clock className="h-3 w-3 mr-1" /> 
                                      <span>{appointment.duration} minutes</span>
                                      <span className="mx-2">•</span>
                                      {appointment.type === 'video' ? (
                                        <Video className="h-3 w-3 mr-1 text-primary" />
                                      ) : (
                                        <MessageCircle className="h-3 w-3 mr-1 text-secondary" />
                                      )}
                                      <span className={appointment.type === 'video' ? 'text-primary' : 'text-secondary'}>
                                        {appointment.type === 'video' ? 'Video Session' : 'Chat Session'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex flex-shrink-0 gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                >
                                  Reschedule
                                </Button>
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  asChild
                                >
                                  <Link to={`/${appointment.type}/${appointment.therapistId}`}>
                                    Join Session
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center p-8 bg-muted/40 rounded-lg">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-lg font-medium mb-2">No upcoming appointments</p>
                      <p className="text-muted-foreground mb-4">Your scheduled sessions will appear here</p>
                      <Button asChild>
                        <Link to="/therapists">Find a Therapist</Link>
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-4 pb-2 border-b border-border mt-8">
                    <h3 className="font-medium text-lg">Past Sessions</h3>
                    <Button variant="ghost" size="sm">View All History</Button>
                  </div>
                  
                  <div className="text-center p-4">
                    <p className="text-muted-foreground">Your past session history will appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="messages">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Messages</h2>
            </div>
            
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {recentMessages.length > 0 ? (
                  <div>
                    {recentMessages.map((message, idx) => (
                      <div key={message.id} className={`flex items-center p-5 ${idx !== recentMessages.length - 1 ? 'border-b border-border' : ''}`}>
                        <div className="relative">
                          <img 
                            src={message.therapistImage} 
                            alt={message.therapistName}
                            className="w-12 h-12 rounded-full object-cover mr-4"
                          />
                          {message.unread && (
                            <span className="absolute top-0 right-3 w-3 h-3 bg-primary rounded-full border-2 border-card"></span>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{message.therapistName}</h4>
                            <span className="text-xs text-muted-foreground">
                              {formatMessageDate(message.timestamp)}
                            </span>
                          </div>
                          <p className={`text-sm ${message.unread ? 'text-foreground font-medium' : 'text-muted-foreground'} line-clamp-1`}>
                            {message.preview}
                          </p>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="ml-2"
                          asChild
                        >
                          <Link to={`/chat/${message.therapistId}`}>
                            <ChevronRight className="h-5 w-5" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-lg font-medium mb-2">No messages yet</p>
                    <p className="text-muted-foreground mb-4">When you have conversations with therapists, they'll appear here</p>
                    <Button asChild>
                      <Link to="/therapists">Find a Therapist</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="progress">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Wellness Journey</h2>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" /> Export Report
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[
                { title: "Sessions Completed", value: "8", icon: <CheckCircle className="h-8 w-8 text-secondary" /> },
                { title: "Wellness Goals", value: "3/5", icon: <Star className="h-8 w-8 text-yellow-500" /> },
                { title: "Days Since Started", value: "32", icon: <Calendar className="h-8 w-8 text-primary" /> }
              ].map((stat, idx) => (
                <Card key={idx}>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-4xl font-bold">{stat.value}</p>
                    </div>
                    {stat.icon}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Wellness Goals Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {wellnessGoals.map((goal) => (
                    <div key={goal.id}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 mr-2 text-secondary" />
                          <span className="font-medium">{goal.title}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="font-medium">{goal.streak} day streak</span>
                          <Star className="h-4 w-4 text-yellow-500 ml-2 fill-yellow-500" />
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                        <div 
                          className="h-full bg-secondary"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-muted-foreground">Started May 1, 2025</span>
                        <span className="text-xs font-medium">{goal.progress}% complete</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Sparkles className="h-4 w-4 mr-2" /> Add New Goal
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Therapy Notes & Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted/40 p-6 rounded-lg text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-lg font-medium mb-2">Therapy notes will appear here</p>
                    <p className="text-muted-foreground mb-4">
                      Your therapist may share notes and resources after your sessions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientDashboard;

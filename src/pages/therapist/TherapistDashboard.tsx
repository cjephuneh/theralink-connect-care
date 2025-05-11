
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, ChevronRight, Clock, MessageCircle, Users, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// Mock data for upcoming appointments
const upcomingAppointments = [
  {
    id: 1,
    client: "Sarah Johnson",
    avatar: "/placeholder.svg",
    date: "Today",
    time: "3:00 PM",
    type: "video"
  },
  {
    id: 2,
    client: "Michael Chen",
    avatar: "/placeholder.svg",
    date: "Today",
    time: "4:30 PM",
    type: "video"
  },
  {
    id: 3,
    client: "Emily Davis",
    avatar: "/placeholder.svg",
    date: "Tomorrow",
    time: "10:00 AM",
    type: "chat"
  }
];

// Mock data for recent messages
const recentMessages = [
  {
    id: 1,
    client: "Sarah Johnson",
    avatar: "/placeholder.svg",
    message: "Thank you for your help with my anxiety techniques.",
    time: "10:24 AM",
    unread: true
  },
  {
    id: 2,
    client: "David Wilson",
    avatar: "/placeholder.svg",
    message: "I felt much better after our last session.",
    time: "Yesterday",
    unread: false
  }
];

// Mock data for statistics
const statistics = {
  totalClients: 24,
  activeClients: 18,
  upcomingSessions: 7,
  completedSessions: 142,
  clientRetention: 85,
  messageResponseRate: 92
};

const TherapistDashboard = () => {
  const [timeFrame, setTimeFrame] = useState<"week" | "month" | "year">("week");
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Dr. Morgan. Here's what's happening today.</p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Clients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.activeClients} currently active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Sessions
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.upcomingSessions}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingAppointments.filter(a => a.date === "Today").length} today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Client Retention
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.clientRetention}%</div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
              <div
                className="h-1.5 rounded-full bg-primary"
                style={{ width: `${statistics.clientRetention}%` }}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Response Rate
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.messageResponseRate}%</div>
            <Progress value={statistics.messageResponseRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Appointments */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>
              You have {upcomingAppointments.length} upcoming appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={appointment.avatar} />
                      <AvatarFallback>{appointment.client.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{appointment.client}</p>
                      <div className="flex items-center text-sm text-muted-foreground gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>{appointment.date} at {appointment.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={appointment.type === "video" ? "default" : "outline"}>
                      {appointment.type === "video" ? (
                        <Video className="h-3 w-3 mr-1" />
                      ) : (
                        <MessageCircle className="h-3 w-3 mr-1" />
                      )}
                      {appointment.type === "video" ? "Video" : "Chat"}
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/${appointment.type}/${appointment.id}`}>
                        Join
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button asChild variant="outline" className="w-full mt-2">
                <Link to="/therapist/appointments" className="flex items-center justify-center">
                  View All Appointments
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Messages */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>
              You have {recentMessages.filter(m => m.unread).length} unread messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-center space-x-4 rounded-lg border p-3 ${
                    message.unread ? "bg-accent/30" : ""
                  } hover:bg-accent/50 transition-colors`}
                >
                  <Avatar>
                    <AvatarImage src={message.avatar} />
                    <AvatarFallback>{message.client.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{message.client}</p>
                      <span className="text-xs text-muted-foreground">{message.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {message.message}
                    </p>
                  </div>
                  {message.unread && (
                    <Badge className="h-2 w-2 rounded-full p-0" />
                  )}
                </div>
              ))}
              
              <Button asChild variant="outline" className="w-full mt-2">
                <Link to="/therapist/messages" className="flex items-center justify-center">
                  View All Messages
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Analytics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Analytics</CardTitle>
            <Tabs defaultValue="week" onValueChange={(value) => setTimeFrame(value as "week" | "month" | "year")}>
              <TabsList>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <CardDescription>
            {timeFrame === "week" && "Your activity during the past 7 days"}
            {timeFrame === "month" && "Your activity during the past 30 days"}
            {timeFrame === "year" && "Your activity during the past 12 months"}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <div className="h-[200px] flex items-center justify-center text-center">
            <div className="text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="font-medium">Analytics data visualization will appear here</p>
              <p className="text-sm">Session hours, client growth, and revenue over time</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Links */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Button asChild variant="outline" className="h-auto py-4 gap-4 justify-start">
          <Link to="/therapist/clients">
            <Users className="h-6 w-6" />
            <div className="text-left">
              <p className="font-medium">View Clients</p>
              <p className="text-xs text-muted-foreground">Manage your client list</p>
            </div>
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="h-auto py-4 gap-4 justify-start">
          <Link to="/therapist/appointments">
            <Calendar className="h-6 w-6" />
            <div className="text-left">
              <p className="font-medium">Schedule Sessions</p>
              <p className="text-xs text-muted-foreground">Manage your availability</p>
            </div>
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="h-auto py-4 gap-4 justify-start">
          <Link to="/therapist/documents">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-6 w-6"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
              <path d="M10 9H8" />
            </svg>
            <div className="text-left">
              <p className="font-medium">Documents</p>
              <p className="text-xs text-muted-foreground">Forms and client records</p>
            </div>
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="h-auto py-4 gap-4 justify-start">
          <Link to="/therapist/settings">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-6 w-6"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <div className="text-left">
              <p className="font-medium">Settings</p>
              <p className="text-xs text-muted-foreground">Preferences and account</p>
            </div>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default TherapistDashboard;


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Users, 
  MessageCircle, 
  DollarSign, 
  ArrowUp, 
  ArrowDown,
  Clock,
  Star 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

const TherapistDashboard = () => {
  // Mock data - in a real app, this would come from API
  const upcomingAppointments = [
    { id: 1, client: "Sarah Johnson", time: "Today, 3:00 PM", type: "Video", status: "Confirmed" },
    { id: 2, client: "Michael Chen", time: "Today, 4:30 PM", type: "Video", status: "Confirmed" },
    { id: 3, client: "Emily Davis", time: "Tomorrow, 10:00 AM", type: "Chat", status: "Pending" }
  ];
  
  const recentMessages = [
    { id: 1, client: "Sarah Johnson", preview: "Thank you for yesterday's session...", time: "2 hours ago" },
    { id: 2, client: "David Wilson", preview: "I've been practicing the techniques...", time: "Yesterday" }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, Dr. Morgan</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your practice today.</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <Button asChild>
            <Link to="/therapist/appointments/new">
              <Calendar className="mr-2 h-4 w-4" /> New Appointment
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-thera-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">3</div>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">18</div>
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unread Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">7</div>
              <MessageCircle className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">$3,240</div>
              <div className="flex items-center text-green-500">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span className="text-xs font-medium">12%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Appointments</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/therapist/appointments">View all</Link>
              </Button>
            </div>
            <CardDescription>You have {upcomingAppointments.length} appointments scheduled.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map(appointment => (
                <div key={appointment.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-3">
                    <div className="bg-muted p-2 rounded-full">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{appointment.client}</p>
                      <p className="text-sm text-muted-foreground">{appointment.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Recent Messages</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/therapist/messages">View all</Link>
              </Button>
            </div>
            <CardDescription>You have {recentMessages.length} unread messages.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.map(message => (
                <Link 
                  key={message.id} 
                  to={`/therapist/messages/${message.id}`}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0 hover:bg-accent/50 p-2 rounded-md"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-muted p-2 rounded-full">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{message.client}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{message.preview}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">{message.time}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance and Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Client Satisfaction</CardTitle>
            <CardDescription>Average rating from client feedback.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="text-3xl font-bold">4.8</div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400" />
                  <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400" />
                  <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400" />
                  <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400" />
                  <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400 opacity-60" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Communication</span>
                  <span className="font-medium">96%</span>
                </div>
                <Progress value={96} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Availability</span>
                  <span className="font-medium">88%</span>
                </div>
                <Progress value={88} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Treatment Effectiveness</span>
                  <span className="font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session Statistics</CardTitle>
            <CardDescription>Monthly breakdown of session types.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-muted/50 p-4 rounded-md">
                <p className="text-2xl font-bold">42</p>
                <p className="text-sm text-muted-foreground">Video Sessions</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-md">
                <p className="text-2xl font-bold">28</p>
                <p className="text-sm text-muted-foreground">Chat Sessions</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-md">
                <p className="text-2xl font-bold">70</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-thera-600 mr-2"></div>
                  Video
                </span>
                <span>60%</span>
              </div>
              <Progress value={60} className="h-2 bg-muted" />
              
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  Chat
                </span>
                <span>40%</span>
              </div>
              <Progress value={40} className="h-2 bg-muted" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TherapistDashboard;

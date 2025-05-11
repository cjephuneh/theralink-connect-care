
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon, 
  Video, 
  MessageSquare,
  Filter,
  Clock,
  Check,
  X,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

// Mock appointment data
const appointments = [
  {
    id: 1,
    client: "Sarah Johnson",
    date: "2025-05-12",
    time: "15:00",
    duration: 50,
    type: "video",
    status: "confirmed",
    notes: "Follow-up on anxiety management techniques"
  },
  {
    id: 2,
    client: "Michael Chen",
    date: "2025-05-12",
    time: "16:30",
    duration: 50,
    type: "video",
    status: "confirmed",
    notes: "Initial consultation"
  },
  {
    id: 3,
    client: "Emily Davis",
    date: "2025-05-13",
    time: "10:00",
    duration: 30,
    type: "chat",
    status: "pending",
    notes: "Weekly check-in"
  },
  {
    id: 4,
    client: "David Wilson",
    date: "2025-05-14",
    time: "13:30",
    duration: 50,
    type: "video",
    status: "confirmed",
    notes: "Discuss progress and adjust treatment plan"
  },
  {
    id: 5,
    client: "Jessica Brown",
    date: "2025-05-15",
    time: "11:00",
    duration: 50,
    type: "video",
    status: "confirmed",
    notes: "Monthly session"
  }
];

const TherapistAppointments = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"calendar" | "list">("list");
  
  // Filter appointments for the selected date
  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return date.toISOString().split('T')[0];
  };
  
  const todaysAppointments = date 
    ? appointments.filter(app => app.date === formatDate(date))
    : [];

  // Appointments for list view by status
  const confirmedAppointments = appointments.filter(app => app.status === "confirmed");
  const pendingAppointments = appointments.filter(app => app.status === "pending");
  
  const formatAppointmentTime = (time: string, duration: number) => {
    const [hours, minutes] = time.split(':');
    const startTime = new Date();
    startTime.setHours(parseInt(hours), parseInt(minutes));
    
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + duration);
    
    const startFormatted = startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const endFormatted = endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    
    return `${startFormatted} - ${endFormatted}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground mt-1">Manage your upcoming client sessions.</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => setView(view === "calendar" ? "list" : "calendar")}>
            {view === "calendar" ? "List View" : "Calendar View"}
          </Button>
          <Button asChild>
            <Link to="/therapist/appointments/new">
              <CalendarIcon className="mr-2 h-4 w-4" /> New Appointment
            </Link>
          </Button>
        </div>
      </div>

      {view === "calendar" ? (
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>
                {date?.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todaysAppointments.length > 0 ? (
                <div className="space-y-4">
                  {todaysAppointments.map(appointment => (
                    <div 
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          appointment.type === 'video' ? 'bg-thera-100 text-thera-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {appointment.type === 'video' ? 
                            <Video className="h-5 w-5" /> : 
                            <MessageSquare className="h-5 w-5" />
                          }
                        </div>
                        <div>
                          <p className="font-medium">{appointment.client}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatAppointmentTime(appointment.time, appointment.duration)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant={appointment.status === 'confirmed' ? 'default' : 'outline'}>
                          {appointment.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">No appointments scheduled</h3>
                  <p className="text-muted-foreground mt-1">You don't have any appointments for this day.</p>
                  <Button className="mt-4" asChild>
                    <Link to="/therapist/appointments/new">
                      Schedule an Appointment
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Tabs defaultValue="upcoming" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
          </div>
          
          <TabsContent value="upcoming" className="space-y-4">
            {confirmedAppointments.map(appointment => (
              <Card key={appointment.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${
                        appointment.type === 'video' ? 'bg-thera-100' : 'bg-blue-100'
                      }`}>
                        {appointment.type === 'video' ? (
                          <Video className="h-6 w-6 text-thera-600" />
                        ) : (
                          <MessageSquare className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{appointment.client}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>
                            {new Date(appointment.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <Clock className="h-4 w-4 ml-3 mr-1" />
                          <span>{formatAppointmentTime(appointment.time, appointment.duration)}</span>
                        </div>
                        {appointment.notes && (
                          <p className="text-sm mt-2">{appointment.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-2">
                      {appointment.type === 'video' ? (
                        <Button variant="default" className="bg-thera-600" asChild>
                          <Link to={`/video/${appointment.id}`}>
                            <Video className="h-4 w-4 mr-2" /> Join Video
                          </Link>
                        </Button>
                      ) : (
                        <Button variant="default" className="bg-blue-600" asChild>
                          <Link to={`/chat/${appointment.id}`}>
                            <MessageSquare className="h-4 w-4 mr-2" /> Open Chat
                          </Link>
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Client Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit Appointment</DropdownMenuItem>
                          <DropdownMenuItem>Add Session Notes</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Cancel Appointment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-4">
            {pendingAppointments.map(appointment => (
              <Card key={appointment.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${
                        appointment.type === 'video' ? 'bg-thera-100' : 'bg-blue-100'
                      }`}>
                        {appointment.type === 'video' ? (
                          <Video className="h-6 w-6 text-thera-600" />
                        ) : (
                          <MessageSquare className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{appointment.client}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>
                            {new Date(appointment.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <Clock className="h-4 w-4 ml-3 mr-1" />
                          <span>{formatAppointmentTime(appointment.time, appointment.duration)}</span>
                        </div>
                        {appointment.notes && (
                          <p className="text-sm mt-2">{appointment.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-2">
                      <Button variant="default" className="bg-green-600">
                        <Check className="h-4 w-4 mr-2" /> Confirm
                      </Button>
                      <Button variant="outline" className="border-destructive text-destructive">
                        <X className="h-4 w-4 mr-2" /> Decline
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="past" className="text-center py-10">
            <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-medium mt-4">No past appointments to show</h3>
            <p className="text-muted-foreground mt-1">Past appointments will appear here.</p>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default TherapistAppointments;

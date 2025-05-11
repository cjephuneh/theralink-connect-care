
import { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CalendarCheck, MessageCircle, Video, FileText, Settings, ChevronRight, User, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  
  // Mock upcoming sessions
  const upcomingSessions = [
    {
      id: 1,
      therapist: {
        id: 1,
        name: "Dr. Sarah Johnson",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        specialty: "Clinical Psychologist"
      },
      date: "May 15, 2025",
      time: "2:00 PM",
      type: "video"
    },
    {
      id: 2,
      therapist: {
        id: 3,
        name: "Dr. Amara Okafor",
        image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        specialty: "Clinical Social Worker"
      },
      date: "May 20, 2025",
      time: "11:00 AM",
      type: "video"
    },
  ];
  
  // Mock past sessions
  const pastSessions = [
    {
      id: 3,
      therapist: {
        id: 2,
        name: "Dr. Michael Chen",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        specialty: "Marriage & Family Therapist"
      },
      date: "May 8, 2025",
      time: "3:30 PM",
      type: "video"
    },
    {
      id: 4,
      therapist: {
        id: 1,
        name: "Dr. Sarah Johnson",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        specialty: "Clinical Psychologist"
      },
      date: "May 1, 2025",
      time: "2:00 PM",
      type: "video"
    },
  ];
  
  // Mock therapists
  const myTherapists = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      specialty: "Clinical Psychologist",
      sessionCount: 5,
      nextSession: "May 15, 2025"
    },
    {
      id: 3,
      name: "Dr. Amara Okafor",
      image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      specialty: "Clinical Social Worker",
      sessionCount: 1,
      nextSession: "May 20, 2025"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      specialty: "Marriage & Family Therapist",
      sessionCount: 3,
      nextSession: null
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 animation-fade-in">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-64 shrink-0">
          <div className="bg-card rounded-xl border border-border/50 shadow-sm p-6 space-y-6 sticky top-24">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Welcome back,</p>
                <h2 className="font-semibold">Alex Taylor</h2>
              </div>
            </div>
            
            <nav className="space-y-1">
              {[
                { name: "Dashboard", href: "/dashboard", icon: <CalendarCheck className="h-4 w-4" />, active: true },
                { name: "Messages", href: "/messages", icon: <MessageCircle className="h-4 w-4" /> },
                { name: "Documents", href: "/documents", icon: <FileText className="h-4 w-4" /> },
                { name: "Account", href: "/account", icon: <Settings className="h-4 w-4" /> }
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                    item.active 
                      ? "bg-primary text-white" 
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
              ))}
            </nav>
            
            <div className="pt-4 border-t border-border/50">
              <Button asChild variant="outline" className="w-full">
                <Link to="/therapists" className="flex items-center">
                  Find New Therapist
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 space-y-6">
          {/* Welcome message */}
          <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-xl">
            <h1 className="text-2xl font-bold mb-2">Welcome to your dashboard</h1>
            <p className="opacity-90 max-w-xl">
              Here you can manage your appointments, chat with your therapists, and track your progress.
            </p>
          </div>
          
          {/* Next session card */}
          {upcomingSessions.length > 0 && (
            <Card className="border border-border/50">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  Your Next Session
                </h2>
                
                <div className="flex flex-col md:flex-row gap-6 items-center bg-muted/50 p-4 rounded-xl">
                  <div className="flex items-center gap-4">
                    <img 
                      src={upcomingSessions[0].therapist.image}
                      alt={upcomingSessions[0].therapist.name}
                      className="w-16 h-16 rounded-full object-cover border border-border/50"
                    />
                    <div>
                      <h3 className="font-medium">{upcomingSessions[0].therapist.name}</h3>
                      <p className="text-sm text-muted-foreground">{upcomingSessions[0].therapist.specialty}</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-wrap gap-4 md:justify-end">
                    <div className="bg-card px-4 py-2 rounded-lg border border-border/50 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-sm">{upcomingSessions[0].date}</span>
                    </div>
                    <div className="bg-card px-4 py-2 rounded-lg border border-border/50 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm">{upcomingSessions[0].time}</span>
                    </div>
                    <Button asChild className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                      <Link to={`/video/${upcomingSessions[0].therapist.id}`}>
                        <Video className="h-4 w-4 mr-2" />
                        Join Session
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Sessions tabs */}
          <Card className="border border-border/50">
            <CardContent className="p-6">
              <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Your Sessions</h2>
                  <TabsList>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="past">Past</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="upcoming" className="space-y-4">
                  {upcomingSessions.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No upcoming sessions</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        You don't have any sessions scheduled.
                      </p>
                      <Button asChild>
                        <Link to="/therapists">Find a Therapist</Link>
                      </Button>
                    </div>
                  ) : (
                    upcomingSessions.map((session) => (
                      <div 
                        key={session.id}
                        className="bg-muted/50 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <img 
                            src={session.therapist.image}
                            alt={session.therapist.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-medium">{session.therapist.name}</h3>
                            <p className="text-sm text-muted-foreground">{session.therapist.specialty}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{session.date}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{session.time}</span>
                          </div>
                          <Button asChild size="sm">
                            <Link to={`/video/${session.therapist.id}`}>
                              Join
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
                
                <TabsContent value="past" className="space-y-4">
                  {pastSessions.map((session) => (
                    <div 
                      key={session.id}
                      className="bg-muted/50 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <img 
                          src={session.therapist.image}
                          alt={session.therapist.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-medium">{session.therapist.name}</h3>
                          <p className="text-sm text-muted-foreground">{session.therapist.specialty}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{session.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{session.time}</span>
                        </div>
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/therapists/${session.therapist.id}/book`}>
                            Book Again
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* My Therapists */}
          <Card className="border border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">My Therapists</h2>
                <Button asChild variant="outline" size="sm">
                  <Link to="/therapists">Find More</Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myTherapists.map((therapist) => (
                  <div 
                    key={therapist.id}
                    className="bg-muted/50 p-4 rounded-xl flex flex-col gap-4 border border-border/50 hover:border-primary/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={therapist.image}
                        alt={therapist.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium">{therapist.name}</h3>
                        <p className="text-xs text-muted-foreground">{therapist.specialty}</p>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <p>Sessions: {therapist.sessionCount}</p>
                      {therapist.nextSession && (
                        <p>Next: {therapist.nextSession}</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-auto">
                      <Button asChild size="sm" variant="outline" className="flex-1">
                        <Link to={`/chat/${therapist.id}`}>
                          Message
                        </Link>
                      </Button>
                      <Button asChild size="sm" className="flex-1">
                        <Link to={`/therapists/${therapist.id}/book`}>
                          Book
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Progress tracking */}
          <Card className="border border-border/50">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Your Progress</h2>
              <div className="bg-accent/30 p-4 rounded-xl text-center py-8">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Track your wellness journey</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
                  Complete mood assessments to track your progress over time and share insights with your therapist.
                </p>
                <Button>Start Assessment</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;

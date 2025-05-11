
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Video,
  MessageCircle,
  User,
  Star,
  ArrowRight
} from "lucide-react";

// Mock upcoming sessions data
const upcomingSessions = [
  {
    id: "session-1",
    therapistId: "1",
    therapistName: "Dr. Sarah Johnson",
    therapistImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    date: "Monday, May 13, 2024",
    time: "10:00 AM",
    type: "video",
    duration: 50
  },
  {
    id: "session-2",
    therapistId: "3",
    therapistName: "Dr. Amara Okafor",
    therapistImage: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    date: "Friday, May 17, 2024",
    time: "3:00 PM",
    type: "video",
    duration: 50
  }
];

// Mock past sessions data
const pastSessions = [
  {
    id: "past-1",
    therapistId: "1",
    therapistName: "Dr. Sarah Johnson",
    therapistImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    date: "Monday, May 6, 2024",
    time: "10:00 AM",
    type: "video",
    duration: 50,
    reviewed: true,
    rating: 5
  },
  {
    id: "past-2",
    therapistId: "2",
    therapistName: "Dr. Michael Chen",
    therapistImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    date: "Wednesday, April 24, 2024",
    time: "2:00 PM",
    type: "video",
    duration: 50,
    reviewed: false
  },
  {
    id: "past-3",
    therapistId: "3",
    therapistName: "Dr. Amara Okafor",
    therapistImage: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    date: "Friday, April 19, 2024",
    time: "11:00 AM",
    type: "video",
    duration: 50,
    reviewed: true,
    rating: 4
  }
];

// Mock messages data
const messages = [
  {
    id: "msg-1",
    therapistId: "1",
    therapistName: "Dr. Sarah Johnson",
    therapistImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    lastMessage: "Looking forward to our session on Monday!",
    timestamp: "2 hours ago",
    unread: 1
  },
  {
    id: "msg-2",
    therapistId: "3",
    therapistName: "Dr. Amara Okafor",
    therapistImage: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    lastMessage: "Please let me know if you need to reschedule our upcoming session.",
    timestamp: "Yesterday",
    unread: 0
  }
];

// Mock user data
const user = {
  name: "Alex Taylor",
  email: "alex.taylor@example.com",
  image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
  memberSince: "April 2024",
  sessionsCompleted: 3,
  preferredTherapists: [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
    },
    {
      id: "3",
      name: "Dr. Amara Okafor",
      image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
    }
  ]
};

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left sidebar - User info */}
        <div className="w-full md:w-1/4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-3">
                  <img 
                    src={user.image} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500 mb-4">
                  <p>Member since: {user.memberSince}</p>
                  <p>Sessions completed: {user.sessionsCompleted}</p>
                </div>
                
                <h3 className="text-sm font-medium mb-2">Your Therapists</h3>
                <div className="space-y-3">
                  {user.preferredTherapists.map(therapist => (
                    <Link 
                      key={therapist.id} 
                      to={`/therapists/${therapist.id}`}
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md"
                    >
                      <img 
                        src={therapist.image} 
                        alt={therapist.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm">{therapist.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  asChild
                  variant="outline" 
                  className="w-full"
                >
                  <Link to="/account">
                    <User className="mr-2 h-4 w-4" /> Manage Account
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content area */}
        <div className="w-full md:w-3/4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>
            
            {/* Overview tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Upcoming session card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Calendar className="mr-2 h-5 w-5 text-thera-600" />
                      Next Session
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {upcomingSessions.length > 0 ? (
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <img 
                            src={upcomingSessions[0].therapistImage} 
                            alt={upcomingSessions[0].therapistName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium">
                              {upcomingSessions[0].therapistName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {upcomingSessions[0].date}, {upcomingSessions[0].time}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button 
                            asChild
                            className="flex-1 bg-thera-600 hover:bg-thera-700"
                          >
                            <Link to={`/video/${upcomingSessions[0].therapistId}`}>
                              <Video className="mr-2 h-4 w-4" /> Join Session
                            </Link>
                          </Button>
                          <Button
                            asChild
                            variant="outline"
                            className="flex-1"
                          >
                            <Link to={`/therapists/${upcomingSessions[0].therapistId}`}>
                              Profile
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500 mb-4">No upcoming sessions</p>
                        <Button
                          asChild
                        >
                          <Link to="/therapists">
                            Find a Therapist
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Recent messages card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <MessageCircle className="mr-2 h-5 w-5 text-thera-600" />
                      Recent Messages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {messages.length > 0 ? (
                      <div className="space-y-4">
                        {messages.slice(0, 1).map(message => (
                          <Link 
                            key={message.id}
                            to={`/chat/${message.therapistId}`}
                            className="flex items-start gap-3 hover:bg-gray-50 p-2 rounded-md"
                          >
                            <div className="relative">
                              <img 
                                src={message.therapistImage} 
                                alt={message.therapistName}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              {message.unread > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                                  {message.unread}
                                </span>
                              )}
                            </div>
                            <div className="flex-grow">
                              <div className="flex justify-between items-start">
                                <p className="font-medium">{message.therapistName}</p>
                                <p className="text-xs text-gray-500">{message.timestamp}</p>
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2">{message.lastMessage}</p>
                            </div>
                          </Link>
                        ))}
                        
                        <Button 
                          asChild
                          variant="outline" 
                          className="w-full"
                        >
                          <Link to="/messages">
                            View All Messages <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500">No messages yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Past sessions section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-thera-600" />
                    Past Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pastSessions.length > 0 ? (
                    <div className="space-y-4">
                      {pastSessions.slice(0, 2).map(session => (
                        <div 
                          key={session.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border-b border-gray-100 last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <img 
                              src={session.therapistImage} 
                              alt={session.therapistName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium">{session.therapistName}</p>
                              <p className="text-sm text-gray-500">
                                {session.date}, {session.time}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 ml-auto">
                            {session.reviewed ? (
                              <div className="flex items-center text-sm text-gray-500">
                                <span className="mr-1">Rating:</span>
                                <div className="flex">
                                  {Array.from({ length: session.rating }).map((_, i) => (
                                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                              >
                                Leave Review
                              </Button>
                            )}
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                            >
                              <Link to={`/chat/${session.therapistId}`}>
                                <MessageCircle className="h-4 w-4 mr-1" /> Message
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <Button 
                        asChild
                        variant="outline" 
                        className="w-full"
                      >
                        <Link to="/sessions/past">
                          View All Past Sessions <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No past sessions</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Sessions tab */}
            <TabsContent value="sessions">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingSessions.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {upcomingSessions.map(session => (
                        <div 
                          key={session.id}
                          className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <img 
                              src={session.therapistImage} 
                              alt={session.therapistName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium">{session.therapistName}</p>
                              <p className="text-sm text-gray-600">
                                {session.date}, {session.time} ({session.duration} min)
                              </p>
                              <p className="text-xs text-thera-600 mt-1 flex items-center">
                                <Video className="h-3 w-3 mr-1" /> Video Session
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 sm:ml-auto">
                            <Button 
                              asChild
                              variant="outline" 
                              className="flex-1 sm:flex-initial"
                            >
                              <Link to={`/sessions/${session.id}/reschedule`}>
                                Reschedule
                              </Link>
                            </Button>
                            <Button 
                              asChild
                              className="flex-1 sm:flex-initial bg-thera-600 hover:bg-thera-700"
                            >
                              <Link to={`/video/${session.therapistId}`}>
                                <Video className="mr-2 h-4 w-4" /> Join
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500 mb-4">No upcoming sessions scheduled</p>
                      <Button 
                        asChild
                      >
                        <Link to="/therapists">
                          Find a Therapist
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Past Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  {pastSessions.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {pastSessions.map(session => (
                        <div 
                          key={session.id}
                          className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <img 
                              src={session.therapistImage} 
                              alt={session.therapistName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium">{session.therapistName}</p>
                              <p className="text-sm text-gray-600">
                                {session.date}, {session.time} ({session.duration} min)
                              </p>
                              <p className="text-xs text-gray-500 mt-1 flex items-center">
                                <Video className="h-3 w-3 mr-1" /> Video Session
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 sm:ml-auto">
                            {session.reviewed ? (
                              <div className="flex items-center">
                                <span className="text-sm text-gray-500 mr-1">Rating:</span>
                                <div className="flex">
                                  {Array.from({ length: session.rating }).map((_, i) => (
                                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <Button 
                                size="sm"
                                variant="outline" 
                              >
                                Leave Review
                              </Button>
                            )}
                            <Button 
                              asChild
                              size="sm"
                              variant="outline"
                            >
                              <Link to={`/therapists/${session.therapistId}/book`}>
                                Book Again
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No past sessions</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Messages tab */}
            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                  <CardDescription>
                    Your secure conversations with therapists
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {messages.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {messages.map(message => (
                        <Link
                          key={message.id}
                          to={`/chat/${message.therapistId}`}
                          className="block py-4 first:pt-0 last:pb-0 hover:bg-gray-50 rounded-md"
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative">
                              <img 
                                src={message.therapistImage} 
                                alt={message.therapistName}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              {message.unread > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                                  {message.unread}
                                </span>
                              )}
                            </div>
                            <div className="flex-grow">
                              <div className="flex justify-between items-start">
                                <p className="font-medium">{message.therapistName}</p>
                                <p className="text-xs text-gray-500">{message.timestamp}</p>
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2">{message.lastMessage}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No messages yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;

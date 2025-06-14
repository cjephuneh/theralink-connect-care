import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, MessageSquare, Star, Clock, User, Mail, Calendar, Filter, Search, BarChart3, TrendingUp, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminFeedback = () => {
  const [feedbackMessages, setFeedbackMessages] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRating, setFilterRating] = useState("all");
  const [stats, setStats] = useState({
    totalFeedback: 0,
    totalContacts: 0,
    unreadFeedback: 0,
    unreadContacts: 0,
    averageRating: 0,
    totalRatings: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch feedback messages first
      const { data: feedback, error: feedbackError } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });

      if (feedbackError) throw feedbackError;

      // Get unique user IDs from feedback
      const userIds = feedback?.map(f => f.user_id).filter(Boolean) || [];
      
      // Fetch profiles for these users if any exist
      let profilesData = [];
      if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, full_name, email, role")
          .in("id", userIds);

        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
        } else {
          profilesData = profiles || [];
        }
      }

      // Create profiles map
      const profilesMap = profilesData.reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {});

      // Combine feedback with profiles
      const feedbackWithProfiles = feedback?.map(fb => ({
        ...fb,
        profiles: profilesMap[fb.user_id] || null
      })) || [];

      setFeedbackMessages(feedbackWithProfiles);

      // Fetch contact messages
      const { data: contacts, error: contactsError } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (contactsError) throw contactsError;
      setContactMessages(contacts || []);

      // Calculate stats
      const unreadFeedback = feedbackWithProfiles.filter(f => !f.is_read).length;
      const unreadContacts = contacts?.filter(c => !c.is_read).length || 0;
      const ratingsData = feedbackWithProfiles.filter(f => f.rating !== null);
      const averageRating = ratingsData.length > 0 
        ? ratingsData.reduce((sum, f) => sum + f.rating, 0) / ratingsData.length 
        : 0;

      setStats({
        totalFeedback: feedbackWithProfiles.length,
        totalContacts: contacts?.length || 0,
        unreadFeedback,
        unreadContacts,
        averageRating,
        totalRatings: ratingsData.length
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error fetching data",
        description: "There was a problem fetching messages.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markFeedbackAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("feedback")
        .update({ is_read: true })
        .eq("id", id);

      if (error) throw error;

      setFeedbackMessages(prev =>
        prev.map(msg => msg.id === id ? { ...msg, is_read: true } : msg)
      );

      setStats(prev => ({
        ...prev,
        unreadFeedback: prev.unreadFeedback - 1
      }));

      toast({
        title: "Success",
        description: "Feedback marked as read",
      });
    } catch (error) {
      console.error("Error marking feedback as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark feedback as read",
        variant: "destructive",
      });
    }
  };

  const markContactAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ is_read: true })
        .eq("id", id);

      if (error) throw error;

      setContactMessages(prev =>
        prev.map(msg => msg.id === id ? { ...msg, is_read: true } : msg)
      );

      setStats(prev => ({
        ...prev,
        unreadContacts: prev.unreadContacts - 1
      }));

      toast({
        title: "Success",
        description: "Contact message marked as read",
      });
    } catch (error) {
      console.error("Error marking contact as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark contact as read",
        variant: "destructive",
      });
    }
  };

  const getFeedbackTypeLabel = (type: string) => {
    const labels = {
      client: "Client Dashboard",
      therapist: "Therapist Dashboard",
      friend: "Friend Dashboard",
      admin: "Admin Dashboard"
    };
    return labels[type as keyof typeof labels] || "Unknown";
  };

  const getFilteredFeedback = () => {
    return feedbackMessages.filter(feedback => {
      const matchesSearch = !searchTerm || 
        feedback.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === "all" || 
        (filterStatus === "read" && feedback.is_read) ||
        (filterStatus === "unread" && !feedback.is_read);
      
      const matchesRating = filterRating === "all" || 
        (filterRating === "with-rating" && feedback.rating !== null) ||
        (filterRating === "no-rating" && feedback.rating === null);

      return matchesSearch && matchesStatus && matchesRating;
    });
  };

  const getFilteredContacts = () => {
    return contactMessages.filter(contact => {
      const matchesSearch = !searchTerm || 
        contact.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === "all" || 
        (filterStatus === "read" && contact.is_read) ||
        (filterStatus === "unread" && !contact.is_read);

      return matchesSearch && matchesStatus;
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Feedback & Communications Center</h1>
        <p className="text-muted-foreground">
          Monitor user feedback, contact messages, and platform communication
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Feedback</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalFeedback}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Contact Messages</p>
                <p className="text-2xl font-bold text-green-900">{stats.totalContacts}</p>
              </div>
              <Mail className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Average Rating</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {stats.averageRating.toFixed(1)}
                </p>
                <p className="text-xs text-yellow-600">from {stats.totalRatings} ratings</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Unread Items</p>
                <p className="text-2xl font-bold text-red-900">
                  {stats.unreadFeedback + stats.unreadContacts}
                </p>
                <p className="text-xs text-red-600">
                  {stats.unreadFeedback} feedback, {stats.unreadContacts} contacts
                </p>
              </div>
              <Clock className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages, names, or emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Messages</SelectItem>
                <SelectItem value="unread">Unread Only</SelectItem>
                <SelectItem value="read">Read Only</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Feedback</SelectItem>
                <SelectItem value="with-rating">With Rating</SelectItem>
                <SelectItem value="no-rating">No Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="feedback" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="feedback" className="relative">
            User Feedback
            {stats.unreadFeedback > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                {stats.unreadFeedback}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="contact" className="relative">
            Contact Messages
            {stats.unreadContacts > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                {stats.unreadContacts}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="feedback">
          <div className="space-y-4">
            {getFilteredFeedback().length === 0 ? (
              <Card>
                <CardContent className="text-center py-10">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No feedback messages found</p>
                  <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
                </CardContent>
              </Card>
            ) : (
              getFilteredFeedback().map((feedback) => (
                <Card key={feedback.id} className={`transition-all duration-200 hover:shadow-md ${!feedback.is_read ? "border-l-4 border-l-primary bg-primary/5" : ""}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <CardTitle className="flex items-center gap-2">
                          <MessageSquare className="h-5 w-5" />
                          {getFeedbackTypeLabel(feedback.dashboard_type)} Feedback
                          {!feedback.is_read && (
                            <Badge variant="default">New</Badge>
                          )}
                          {feedback.rating && (
                            <div className="flex items-center gap-1 ml-2">
                              {renderStars(feedback.rating)}
                              <span className="text-sm text-muted-foreground ml-1">
                                {feedback.rating}/5
                              </span>
                            </div>
                          )}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {feedback.profiles?.full_name || "Anonymous User"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {feedback.profiles?.email || "No email"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">
                              {feedback.profiles?.role || "Unknown"}
                            </Badge>
                          </div>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(feedback.created_at).toLocaleDateString()} at{" "}
                        {new Date(feedback.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 p-4 rounded-lg mb-4">
                      <p className="whitespace-pre-wrap">{feedback.message}</p>
                    </div>
                    {!feedback.is_read && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markFeedbackAsRead(feedback.id)}
                        className="flex items-center gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Mark as Read
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="contact">
          <div className="space-y-4">
            {getFilteredContacts().length === 0 ? (
              <Card>
                <CardContent className="text-center py-10">
                  <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No contact messages found</p>
                  <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
                </CardContent>
              </Card>
            ) : (
              getFilteredContacts().map((contact) => (
                <Card key={contact.id} className={`transition-all duration-200 hover:shadow-md ${!contact.is_read ? "border-l-4 border-l-primary bg-primary/5" : ""}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <CardTitle className="flex items-center gap-2">
                          <Mail className="h-5 w-5" />
                          {contact.subject}
                          {!contact.is_read && (
                            <Badge variant="default">New</Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {contact.name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {contact.email}
                          </div>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(contact.created_at).toLocaleDateString()} at{" "}
                        {new Date(contact.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 p-4 rounded-lg mb-4">
                      <p className="whitespace-pre-wrap">{contact.message}</p>
                    </div>
                    {!contact.is_read && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markContactAsRead(contact.id)}
                        className="flex items-center gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Mark as Read
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminFeedback;

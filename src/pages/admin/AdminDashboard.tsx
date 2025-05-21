
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertCircle, MessageSquare, Users, Calendar, DollarSign, FileText, BookOpen, UserCog, Heart, BarChart2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const AdminDashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    therapists: 0,
    friends: 0,
    appointments: 0,
    transactions: 0,
    sessionNotes: 0,
    unreadFeedback: 0,
    unreadMessages: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Count all users
        const { count: usersCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        // Count therapists
        const { count: therapistsCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "therapist");
          
        // Count friends
        const { count: friendsCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "friend");

        // Count appointments
        const { count: appointmentsCount } = await supabase
          .from("appointments")
          .select("*", { count: "exact", head: true });

        // Count transactions
        const { count: transactionsCount } = await supabase
          .from("transactions")
          .select("*", { count: "exact", head: true });
          
        // Count session notes
        const { count: sessionNotesCount } = await supabase
          .from("session_notes")
          .select("*", { count: "exact", head: true });

        // Count unread feedback
        const { count: unreadFeedbackCount } = await supabase
          .from("feedback")
          .select("*", { count: "exact", head: true })
          .eq("is_read", false);

        // Count unread contact messages
        const { count: unreadMessagesCount } = await supabase
          .from("contact_messages")
          .select("*", { count: "exact", head: true })
          .eq("is_read", false);

        setStats({
          users: usersCount || 0,
          therapists: therapistsCount || 0,
          friends: friendsCount || 0,
          appointments: appointmentsCount || 0,
          transactions: transactionsCount || 0,
          sessionNotes: sessionNotesCount || 0,
          unreadFeedback: unreadFeedbackCount || 0,
          unreadMessages: unreadMessagesCount || 0
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <div className="p-10 text-center">Loading dashboard data...</div>;
  }

  return (
    <div className="container max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        Welcome back, {profile?.full_name || "Administrator"} - Complete system control panel
      </p>

      {stats.unreadFeedback > 0 || stats.unreadMessages > 0 ? (
        <Card className="mb-6 border-amber-500">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-amber-500/20 rounded-full">
                <AlertCircle className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h3 className="font-medium">Attention Required</h3>
                <p className="text-sm text-muted-foreground">
                  You have {stats.unreadFeedback + stats.unreadMessages} unread messages 
                  ({stats.unreadFeedback} feedback, {stats.unreadMessages} contact)
                </p>
                <Button asChild variant="outline" size="sm" className="mt-2">
                  <Link to="/admin/feedback">View Messages</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-muted-foreground mr-2" />
              <p className="text-2xl font-bold">{stats.users}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Therapists</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <UserCog className="h-4 w-4 text-muted-foreground mr-2" />
              <p className="text-2xl font-bold">{stats.therapists}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Friends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Heart className="h-4 w-4 text-muted-foreground mr-2" />
              <p className="text-2xl font-bold">{stats.friends}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
              <p className="text-2xl font-bold">{stats.appointments}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
              <p className="text-2xl font-bold">{stats.transactions}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Session Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-4 w-4 text-muted-foreground mr-2" />
              <p className="text-2xl font-bold">{stats.sessionNotes}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 text-muted-foreground mr-2" />
              <p className="text-2xl font-bold">{stats.unreadFeedback + stats.unreadMessages}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
              <p className="text-sm font-medium">All Systems Operational</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage platform users</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Link to="/admin/users">
                <Users className="h-5 w-5 mb-1" />
                <span>Manage Users</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Link to="/admin/therapists">
                <UserCog className="h-5 w-5 mb-1" />
                <span>Manage Therapists</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Link to="/admin/friends">
                <Heart className="h-5 w-5 mb-1" />
                <span>Manage Friends</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Link to="/admin/notifications">
                <AlertCircle className="h-5 w-5 mb-1" />
                <span>User Notifications</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Appointment Management</CardTitle>
            <CardDescription>Monitor and manage appointments</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Link to="/admin/appointments">
                <Calendar className="h-5 w-5 mb-1" />
                <span>All Appointments</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Link to="/admin/session-notes">
                <FileText className="h-5 w-5 mb-1" />
                <span>Session Notes</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Financial Management</CardTitle>
            <CardDescription>Monitor payments and transactions</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Link to="/admin/transactions">
                <DollarSign className="h-5 w-5 mb-1" />
                <span>Transactions</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Link to="/admin/analytics">
                <BarChart2 className="h-5 w-5 mb-1" />
                <span>Financial Reports</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Communication</CardTitle>
            <CardDescription>User feedback and messages</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Link to="/admin/feedback">
                <MessageSquare className="h-5 w-5 mb-1" />
                <span>
                  Feedback & Messages 
                  {(stats.unreadFeedback + stats.unreadMessages > 0) && 
                    <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                      {stats.unreadFeedback + stats.unreadMessages}
                    </span>
                  }
                </span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Link to="/admin/messages">
                <MessageSquare className="h-5 w-5 mb-1" />
                <span>System Messages</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
            <CardDescription>Manage website content</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Link to="/admin/content">
                <BookOpen className="h-5 w-5 mb-1" />
                <span>Blog & Content</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Link to="/admin/settings">
                <UserCog className="h-5 w-5 mb-1" />
                <span>System Settings</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

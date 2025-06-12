
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertCircle, MessageSquare, Users, Calendar, DollarSign, FileText, BookOpen, UserCog, Heart, BarChart2, Star, CheckCircle, Clock, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

const AdminDashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    therapists: 0,
    friends: 0,
    clients: 0,
    appointments: 0,
    transactions: 0,
    sessionNotes: 0,
    unreadFeedback: 0,
    unreadMessages: 0,
    reviews: 0,
    pendingTherapists: 0,
    pendingFriends: 0,
    totalRevenue: 0,
    averageRating: 0,
    completedAppointments: 0,
    cancelledAppointments: 0
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

        // Count clients
        const { count: clientsCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "client");

        // Count appointments
        const { count: appointmentsCount } = await supabase
          .from("appointments")
          .select("*", { count: "exact", head: true });

        // Count completed appointments
        const { count: completedAppointmentsCount } = await supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("status", "completed");

        // Count cancelled appointments
        const { count: cancelledAppointmentsCount } = await supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("status", "cancelled");

        // Count transactions and get total revenue
        const { count: transactionsCount, data: transactionData } = await supabase
          .from("transactions")
          .select("amount", { count: "exact" })
          .eq("status", "success");

        const totalRevenue = transactionData?.reduce((sum, transaction) => sum + Number(transaction.amount), 0) || 0;
          
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

        // Count reviews and get average rating
        const { count: reviewsCount, data: reviewData } = await supabase
          .from("reviews")
          .select("rating", { count: "exact" });

        const averageRating = reviewData?.length > 0 
          ? reviewData.reduce((sum, review) => sum + review.rating, 0) / reviewData.length 
          : 0;

        // Count pending therapists
        const { count: pendingTherapistsCount } = await supabase
          .from("therapist_details")
          .select("*", { count: "exact", head: true })
          .or("application_status.is.null,application_status.eq.pending");

        // Count pending friends (those without friend_details)
        const { data: allFriends } = await supabase
          .from("profiles")
          .select("id")
          .eq("role", "friend");

        const { data: friendsWithDetails } = await supabase
          .from("friend_details")
          .select("friend_id");

        const friendsWithDetailsIds = friendsWithDetails?.map(f => f.friend_id) || [];
        const pendingFriendsCount = allFriends?.filter(f => !friendsWithDetailsIds.includes(f.id)).length || 0;

        setStats({
          users: usersCount || 0,
          therapists: therapistsCount || 0,
          friends: friendsCount || 0,
          clients: clientsCount || 0,
          appointments: appointmentsCount || 0,
          transactions: transactionsCount || 0,
          sessionNotes: sessionNotesCount || 0,
          unreadFeedback: unreadFeedbackCount || 0,
          unreadMessages: unreadMessagesCount || 0,
          reviews: reviewsCount || 0,
          pendingTherapists: pendingTherapistsCount || 0,
          pendingFriends: pendingFriendsCount,
          totalRevenue: totalRevenue,
          averageRating: averageRating,
          completedAppointments: completedAppointmentsCount || 0,
          cancelledAppointments: cancelledAppointmentsCount || 0
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

  const pendingApprovals = stats.pendingTherapists + stats.pendingFriends;

  return (
    <div className="container max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        Welcome back, {profile?.full_name || "Administrator"} - Complete system control panel
      </p>

      {/* Alert for pending approvals */}
      {(pendingApprovals > 0 || stats.unreadFeedback > 0 || stats.unreadMessages > 0) && (
        <Card className="mb-6 border-amber-500">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-amber-500/20 rounded-full">
                <AlertCircle className="h-6 w-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Attention Required</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {pendingApprovals > 0 && (
                    <p>{pendingApprovals} pending approvals ({stats.pendingTherapists} therapists, {stats.pendingFriends} friends)</p>
                  )}
                  {(stats.unreadFeedback > 0 || stats.unreadMessages > 0) && (
                    <p>{stats.unreadFeedback + stats.unreadMessages} unread messages</p>
                  )}
                </div>
                <div className="flex gap-2 mt-2">
                  {pendingApprovals > 0 && (
                    <Button asChild variant="outline" size="sm">
                      <Link to="/admin/therapists">Review Approvals</Link>
                    </Button>
                  )}
                  {(stats.unreadFeedback > 0 || stats.unreadMessages > 0) && (
                    <Button asChild variant="outline" size="sm">
                      <Link to="/admin/feedback">View Messages</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Statistics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-4 w-4 text-muted-foreground mr-2" />
                <p className="text-2xl font-bold">{stats.users}</p>
              </div>
              <div className="text-xs text-muted-foreground">
                <div>{stats.clients} clients</div>
                <div>{stats.therapists} therapists</div>
                <div>{stats.friends} friends</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                <p className="text-2xl font-bold">{stats.appointments}</p>
              </div>
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>{stats.completedAppointments} completed</span>
                </div>
                <div className="flex items-center gap-1">
                  <XCircle className="h-3 w-3 text-red-500" />
                  <span>{stats.cancelledAppointments} cancelled</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
                <p className="text-2xl font-bold">₦{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="text-xs text-muted-foreground">
                <div>{stats.transactions} transactions</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reviews & Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-muted-foreground mr-2" />
                <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</p>
              </div>
              <div className="text-xs text-muted-foreground">
                <div>{stats.reviews} reviews</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Statistics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                <p className="text-2xl font-bold">{pendingApprovals}</p>
              </div>
              {pendingApprovals > 0 && (
                <Badge variant="destructive">{pendingApprovals}</Badge>
              )}
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
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 text-muted-foreground mr-2" />
                <p className="text-2xl font-bold">{stats.unreadFeedback + stats.unreadMessages}</p>
              </div>
              {(stats.unreadFeedback + stats.unreadMessages) > 0 && (
                <Badge variant="outline">{stats.unreadFeedback + stats.unreadMessages}</Badge>
              )}
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
      
      {/* Management Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage all platform users and approvals</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center relative">
              <Link to="/admin/therapists">
                <UserCog className="h-5 w-5 mb-1" />
                <span>Therapists</span>
                {stats.pendingTherapists > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                    {stats.pendingTherapists}
                  </Badge>
                )}
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Link to="/admin/users">
                <Users className="h-5 w-5 mb-1" />
                <span>All Users</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center relative">
              <Link to="/admin/friends">
                <Heart className="h-5 w-5 mb-1" />
                <span>Friends</span>
                {stats.pendingFriends > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                    {stats.pendingFriends}
                  </Badge>
                )}
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Link to="/admin/notifications">
                <AlertCircle className="h-5 w-5 mb-1" />
                <span>Notifications</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Appointment & Session Management</CardTitle>
            <CardDescription>Monitor appointments and session data</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Link to="/admin/appointments">
                <Calendar className="h-5 w-5 mb-1" />
                <span>Appointments</span>
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
            <CardTitle>Financial & Analytics</CardTitle>
            <CardDescription>Monitor revenue and platform analytics</CardDescription>
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
                <span>Analytics</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Communication & Feedback</CardTitle>
            <CardDescription>User feedback and platform communication</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Link to="/admin/feedback">
                <MessageSquare className="h-5 w-5 mb-1" />
                <span>
                  Feedback
                  {(stats.unreadFeedback + stats.unreadMessages > 0) && 
                    <Badge variant="destructive" className="ml-1 h-4 w-4 rounded-full p-0 text-xs flex items-center justify-center">
                      {stats.unreadFeedback + stats.unreadMessages}
                    </Badge>
                  }
                </span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Link to="/admin/messages">
                <MessageSquare className="h-5 w-5 mb-1" />
                <span>Messages</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Content & System</CardTitle>
            <CardDescription>Manage content and system settings</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Link to="/admin/content">
                <BookOpen className="h-5 w-5 mb-1" />
                <span>Content</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Link to="/admin/settings">
                <UserCog className="h-5 w-5 mb-1" />
                <span>Settings</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

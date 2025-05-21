
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageCircle, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import FeedbackForm from "@/components/feedback/FeedbackForm";

const FriendDashboard = () => {
  const { profile } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {profile?.full_name}</h2>
        <p className="text-muted-foreground">
          Thank you for being a Friend on TheraLink. You're making a positive impact by sharing your experiences.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Messages</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Session Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Track the positive difference you're making as a Friend. As you connect with clients, your impact metrics will appear here.</p>
          <div className="mt-4">
            <Button>Start Connecting</Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Feedback Form */}
      <FeedbackForm dashboardType="friend" />
    </div>
  );
};

export default FriendDashboard;

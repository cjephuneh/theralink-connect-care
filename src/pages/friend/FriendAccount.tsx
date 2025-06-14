
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const FriendAccount = () => {
  const { profile, user } = useAuth();

  return (
    <div className="max-w-lg mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>
            Manage your personal information for your Friend account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-muted-foreground text-xs">Full name</label>
              <div className="font-medium">{profile?.full_name || "Friend"}</div>
            </div>
            <div>
              <label className="text-muted-foreground text-xs">Email</label>
              <div className="font-medium">{profile?.email}</div>
            </div>
            <div>
              <label className="text-muted-foreground text-xs">Role</label>
              <div className="font-medium capitalize">{profile?.role || "friend"}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FriendAccount;

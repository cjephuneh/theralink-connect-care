
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, Users, CheckCircle, XCircle, Eye, Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Friend {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  profile_image_url: string;
  created_at: string;
  friend_details?: {
    areas_of_experience: string;
    personal_story: string;
    experience_description: string;
    communication_preferences: string;
  };
}

const AdminFriends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingFriends, setPendingFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    setIsLoading(true);
    try {
      // Get all friends
      const { data: friendsData, error: friendsError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'friend');

      if (friendsError) throw friendsError;

      // Get friend details
      const { data: detailsData } = await supabase
        .from('friend_details')
        .select('*');

      // Combine data
      const friendsWithDetails = friendsData.map(friend => ({
        ...friend,
        friend_details: detailsData?.find(d => d.friend_id === friend.id)
      }));

      // Separate approved and pending
      const approved = friendsWithDetails.filter(f => f.friend_details);
      const pending = friendsWithDetails.filter(f => !f.friend_details);

      setFriends(approved);
      setPendingFriends(pending);
    } catch (error) {
      console.error('Error fetching friends:', error);
      toast({
        title: "Error",
        description: "Failed to fetch friends data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const approveFriend = async (friendId: string) => {
    try {
      // For now, we'll create a basic friend_details entry
      // In a real app, this would be done when the friend completes their profile
      const { error } = await supabase
        .from('friend_details')
        .insert({
          friend_id: friendId,
          areas_of_experience: 'Pending completion',
          personal_story: 'Profile being completed',
          experience_description: 'Awaiting details',
          communication_preferences: 'Any'
        });

      if (error) throw error;

      toast({
        title: "Friend Approved",
        description: "Friend has been approved and can now access the platform",
      });

      fetchFriends();
    } catch (error) {
      console.error('Error approving friend:', error);
      toast({
        title: "Error",
        description: "Failed to approve friend",
        variant: "destructive",
      });
    }
  };

  const rejectFriend = async (friendId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', friendId);

      if (error) throw error;

      toast({
        title: "Friend Rejected",
        description: "Friend application has been rejected",
      });

      fetchFriends();
    } catch (error) {
      console.error('Error rejecting friend:', error);
      toast({
        title: "Error",
        description: "Failed to reject friend",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="p-10 text-center">Loading friends data...</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Friends Management</h1>
          <p className="text-muted-foreground">Manage friend applications and profiles</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            {pendingFriends.length} Pending
          </Badge>
          <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            {friends.length} Approved
          </Badge>
        </div>
      </div>

      {/* Pending Approvals */}
      {pendingFriends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Pending Friend Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingFriends.map((friend) => (
                <Card key={friend.id} className="border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar>
                        <AvatarImage src={friend.profile_image_url} />
                        <AvatarFallback>{friend.full_name?.charAt(0) || 'F'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{friend.full_name || 'Unnamed Friend'}</h3>
                        <p className="text-sm text-muted-foreground">{friend.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {friend.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3" />
                          {friend.phone}
                        </div>
                      )}
                      {friend.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-3 w-3" />
                          {friend.location}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => approveFriend(friend.id)}
                        className="flex-1"
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => rejectFriend(friend.id)}
                        className="flex-1"
                      >
                        <XCircle className="mr-1 h-3 w-3" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approved Friends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-500" />
            Approved Friends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {friends.map((friend) => (
              <Card key={friend.id} className="border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar>
                      <AvatarImage src={friend.profile_image_url} />
                      <AvatarFallback>{friend.full_name?.charAt(0) || 'F'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{friend.full_name || 'Unnamed Friend'}</h3>
                      <p className="text-sm text-muted-foreground">{friend.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {friend.friend_details?.areas_of_experience && (
                      <Badge variant="outline" className="text-xs">
                        {friend.friend_details.areas_of_experience}
                      </Badge>
                    )}
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="mr-1 h-3 w-3" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Friend Profile Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={friend.profile_image_url} />
                            <AvatarFallback>{friend.full_name?.charAt(0) || 'F'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-medium">{friend.full_name}</h3>
                            <p className="text-muted-foreground">{friend.email}</p>
                          </div>
                        </div>
                        
                        {friend.friend_details && (
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium">Areas of Experience</h4>
                              <p className="text-sm text-muted-foreground">
                                {friend.friend_details.areas_of_experience}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium">Personal Story</h4>
                              <p className="text-sm text-muted-foreground">
                                {friend.friend_details.personal_story}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium">Communication Preferences</h4>
                              <p className="text-sm text-muted-foreground">
                                {friend.friend_details.communication_preferences}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFriends;

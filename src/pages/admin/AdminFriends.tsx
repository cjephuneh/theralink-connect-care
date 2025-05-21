
import { useState, useEffect } from "react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  UserPlus, 
  Heart, 
  Eye, 
  ThumbsUp, 
  ThumbsDown, 
  RefreshCw,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminFriends = () => {
  const [friends, setFriends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    setIsLoading(true);
    try {
      // Get all users with role 'friend'
      const { data: friendUsers, error: friendError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'friend')
        .order('created_at', { ascending: false });
      
      if (friendError) throw friendError;
      
      // Get friend details for these users
      let friendsWithDetails = [];
      
      if (friendUsers && friendUsers.length > 0) {
        const { data: friendDetails, error: detailsError } = await supabase
          .from('friend_details')
          .select('*')
          .in('friend_id', friendUsers.map(user => user.id));
        
        if (detailsError) throw detailsError;
        
        // Combine user profile with friend details
        friendsWithDetails = friendUsers.map(user => {
          const details = friendDetails?.find(detail => detail.friend_id === user.id) || null;
          return {
            ...user,
            details,
            status: details ? 'Active' : 'Pending Profile'
          };
        });
      }
      
      setFriends(friendsWithDetails);
    } catch (error: any) {
      console.error('Error fetching friends:', error);
      toast({
        title: 'Error',
        description: 'Failed to load friends',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const viewFriendDetails = (friend: any) => {
    setSelectedFriend(friend);
  };

  const approveFriend = async (id: string) => {
    // This would typically update the status of a friend application
    toast({
      title: 'Friend Approved',
      description: 'Friend application has been approved',
    });
  };

  const rejectFriend = async (id: string) => {
    // This would typically update the status of a friend application
    toast({
      title: 'Friend Rejected',
      description: 'Friend application has been rejected',
    });
  };

  const filteredFriends = friends.filter(friend => 
    friend.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.details?.areas_of_experience?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Friends Management</h1>
      
      <Tabs defaultValue="all">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <TabsList>
            <TabsTrigger value="all">All Friends</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-4 items-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search friends..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              onClick={fetchFriends} 
              variant="outline" 
              size="icon" 
              className="h-10 w-10"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-thera-600 hover:bg-thera-700">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Friend
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Friend</DialogTitle>
                  <DialogDescription>
                    Friends need to be added through the user management section. Please use the User Management page to create a new user with the "friend" role.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button asChild variant="outline">
                    <a href="/admin/users">Go to User Management</a>
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      
        <TabsContent value="all">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>All Friends</CardTitle>
              <CardDescription>
                Manage peer support friends in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Areas of Experience</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
                          <p className="mt-2 text-gray-500">Loading friends...</p>
                        </TableCell>
                      </TableRow>
                    ) : filteredFriends.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          <p className="text-gray-500">No friends found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredFriends.map((friend) => (
                        <TableRow key={friend.id}>
                          <TableCell className="font-medium">{friend.full_name || 'N/A'}</TableCell>
                          <TableCell>{friend.email}</TableCell>
                          <TableCell>{friend.details?.areas_of_experience?.split(',').slice(0, 2).join(', ') || 'Not specified'}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              friend.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {friend.status}
                            </span>
                          </TableCell>
                          <TableCell>{new Date(friend.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => viewFriendDetails(friend)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              
                              {friend.status === 'Pending Profile' && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => approveFriend(friend.id)}
                                    className="text-green-600"
                                  >
                                    <ThumbsUp className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => rejectFriend(friend.id)}
                                    className="text-red-600"
                                  >
                                    <ThumbsDown className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="active">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Active Friends</CardTitle>
              <CardDescription>
                Friends who have completed their profiles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Areas of Experience</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
                          <p className="mt-2 text-gray-500">Loading friends...</p>
                        </TableCell>
                      </TableRow>
                    ) : filteredFriends.filter(f => f.status === 'Active').length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <p className="text-gray-500">No active friends found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredFriends
                        .filter(f => f.status === 'Active')
                        .map((friend) => (
                          <TableRow key={friend.id}>
                            <TableCell className="font-medium">{friend.full_name || 'N/A'}</TableCell>
                            <TableCell>{friend.email}</TableCell>
                            <TableCell>{friend.details?.areas_of_experience?.split(',').slice(0, 2).join(', ') || 'Not specified'}</TableCell>
                            <TableCell>{new Date(friend.created_at).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => viewFriendDetails(friend)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Pending Friends</CardTitle>
              <CardDescription>
                Friends who have not completed their profiles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
                          <p className="mt-2 text-gray-500">Loading friends...</p>
                        </TableCell>
                      </TableRow>
                    ) : filteredFriends.filter(f => f.status === 'Pending Profile').length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          <p className="text-gray-500">No pending friends found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredFriends
                        .filter(f => f.status === 'Pending Profile')
                        .map((friend) => (
                          <TableRow key={friend.id}>
                            <TableCell className="font-medium">{friend.full_name || 'N/A'}</TableCell>
                            <TableCell>{friend.email}</TableCell>
                            <TableCell>{new Date(friend.created_at).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => approveFriend(friend.id)}
                                  className="text-green-600"
                                >
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => rejectFriend(friend.id)}
                                  className="text-red-600"
                                >
                                  <ThumbsDown className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedFriend} onOpenChange={() => setSelectedFriend(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Heart className="mr-2 h-5 w-5 text-thera-600" />
              Friend Profile: {selectedFriend?.full_name || 'Unknown'}
            </DialogTitle>
            <DialogDescription>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div>
                  <span className="font-medium">Email:</span> {selectedFriend?.email}
                </div>
                <div>
                  <span className="font-medium">Joined:</span> {selectedFriend && new Date(selectedFriend.created_at).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Status:</span> {selectedFriend?.status}
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          
          {selectedFriend?.details ? (
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Areas of Experience</h3>
                <p className="text-sm bg-muted p-2 rounded">
                  {selectedFriend.details.areas_of_experience || 'Not specified'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Personal Story</h3>
                <p className="text-sm bg-muted p-2 rounded whitespace-pre-wrap">
                  {selectedFriend.details.personal_story || 'Not provided'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Experience Description</h3>
                <p className="text-sm bg-muted p-2 rounded whitespace-pre-wrap">
                  {selectedFriend.details.experience_description || 'Not provided'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Communication Preferences</h3>
                <p className="text-sm bg-muted p-2 rounded">
                  {selectedFriend.details.communication_preferences || 'Not specified'}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">This friend has not completed their profile yet.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFriends;

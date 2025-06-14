
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart, 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Friend {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  profile_image_url?: string;
  created_at: string;
  friend_details?: {
    experience_description?: string;
    areas_of_experience?: string;
    personal_story?: string;
    communication_preferences?: string;
  };
}

const AdminFriends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    filterFriends();
  }, [friends, searchTerm, statusFilter]);

  const fetchFriends = async () => {
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'friend');

      if (profilesError) throw profilesError;

      const { data: friendDetailsData, error: detailsError } = await supabase
        .from('friend_details')
        .select('*');

      if (detailsError) throw detailsError;

      // Combine profiles with friend details
      const combinedData = profilesData.map(profile => ({
        ...profile,
        friend_details: friendDetailsData.find(detail => detail.friend_id === profile.id)
      }));

      setFriends(combinedData);
    } catch (error) {
      console.error('Error fetching friends:', error);
      toast({
        title: "Error",
        description: "Failed to fetch friends data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterFriends = () => {
    let filtered = friends;

    if (searchTerm) {
      filtered = filtered.filter(friend =>
        friend.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFriends(filtered);
  };

  const getStatusBadge = (friend: Friend) => {
    if (friend.friend_details?.experience_description) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
    }
    return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending Setup</Badge>;
  };

  const sendMessage = async (friendId: string) => {
    // Implement message sending logic
    toast({
      title: "Message",
      description: "Message functionality would be implemented here.",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Friends Management</h1>
          <p className="text-muted-foreground">Manage community friends and their profiles</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {friends.length} Total Friends
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Friends</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{friends.length}</div>
            <p className="text-xs text-muted-foreground">Community volunteers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Friends</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {friends.filter(f => f.friend_details?.experience_description).length}
            </div>
            <p className="text-xs text-muted-foreground">With complete profiles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Setup</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {friends.filter(f => !f.friend_details?.experience_description).length}
            </div>
            <p className="text-xs text-muted-foreground">Incomplete profiles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {friends.filter(f => {
                const createdDate = new Date(f.created_at);
                const now = new Date();
                return createdDate.getMonth() === now.getMonth() && 
                       createdDate.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">New friends joined</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search friends by name, email, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Friends</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending Setup</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Friends Table */}
      <Card>
        <CardHeader>
          <CardTitle>Friends Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredFriends.map((friend) => (
              <div key={friend.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={friend.profile_image_url} />
                    <AvatarFallback>
                      {friend.full_name?.split(' ').map(n => n[0]).join('') || 'F'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{friend.full_name || 'No name provided'}</h3>
                      {getStatusBadge(friend)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {friend.email}
                      </div>
                      {friend.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {friend.phone}
                        </div>
                      )}
                      {friend.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {friend.location}
                        </div>
                      )}
                    </div>
                    {friend.friend_details?.areas_of_experience && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Experience:</strong> {friend.friend_details.areas_of_experience}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => sendMessage(friend.id)}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Send Email</DropdownMenuItem>
                      <DropdownMenuItem>View Activity</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        Deactivate Friend
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            
            {filteredFriends.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? 'No friends found matching your search.' : 'No friends registered yet.'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFriends;

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
  MessageCircle,
  UserCheck
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
  role: string;
  friend_details?: {
    experience_description?: string;
    areas_of_experience?: string;
    personal_story?: string;
    communication_preferences?: string;
  };
}

interface Client {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  profile_image_url?: string;
  created_at: string;
  role: string;
}

const AdminFriends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData();
  }, [friends, clients, searchTerm, statusFilter]);

  const fetchData = async () => {
    try {
      console.log('Fetching friends and clients...');
      
      // Fetch all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      console.log('All profiles fetched:', profilesData);

      // Filter friends and clients based on role
      const friendsData = profilesData?.filter(profile => profile.role === 'friend') || [];
      const clientsData = profilesData?.filter(profile => profile.role === 'client') || [];

      console.log('Friends found:', friendsData.length);
      console.log('Clients found:', clientsData.length);
      console.log('Friends data:', friendsData);
      console.log('Clients data:', clientsData);

      // Fetch friend details for friends
      if (friendsData.length > 0) {
        const { data: friendDetailsData, error: detailsError } = await supabase
          .from('friend_details')
          .select('*');

        if (detailsError) {
          console.error('Error fetching friend details:', detailsError);
        } else {
          console.log('Friend details fetched:', friendDetailsData);
        }

        // Combine friends with friend details
        const combinedFriendsData = friendsData.map(profile => ({
          ...profile,
          friend_details: friendDetailsData?.find(detail => detail.friend_id === profile.id)
        }));

        console.log('Combined friends data:', combinedFriendsData);
        setFriends(combinedFriendsData);
      } else {
        setFriends([]);
      }

      setClients(clientsData);
      console.log('Final state - Friends:', friendsData.length, 'Clients:', clientsData.length);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please check the console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterData = () => {
    console.log('Filtering data...');
    console.log('Search term:', searchTerm);
    console.log('Status filter:', statusFilter);
    console.log('Total friends before filter:', friends.length);
    console.log('Total clients before filter:', clients.length);

    // Filter friends
    let filteredF = [...friends];
    
    if (searchTerm) {
      filteredF = filteredF.filter(friend =>
        friend.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter === 'active') {
      filteredF = filteredF.filter(f => f.friend_details?.experience_description);
    } else if (statusFilter === 'pending') {
      filteredF = filteredF.filter(f => !f.friend_details?.experience_description);
    }

    console.log('Filtered friends:', filteredF.length);
    setFilteredFriends(filteredF);

    // Filter clients
    let filteredC = [...clients];
    
    if (searchTerm) {
      filteredC = filteredC.filter(client =>
        client.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    console.log('Filtered clients:', filteredC.length);
    setFilteredClients(filteredC);
  };

  const getStatusBadge = (friend: Friend) => {
    if (friend.friend_details?.experience_description) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
    }
    return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending Setup</Badge>;
  };

  const sendMessage = async (userId: string) => {
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
          <h1 className="text-3xl font-bold">Friends & Clients Management</h1>
          <p className="text-muted-foreground">Manage community friends and registered clients</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {friends.length} Friends
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <UserCheck className="h-3 w-3" />
            {clients.length} Clients
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
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
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
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {[...friends, ...clients].filter(u => {
                const createdDate = new Date(u.created_at);
                const now = new Date();
                return createdDate.getMonth() === now.getMonth() && 
                       createdDate.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">New registrations</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or location..."
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
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="active">Active Friends</SelectItem>
            <SelectItem value="pending">Pending Setup</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="friends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="friends" className="relative">
            Friends ({filteredFriends.length})
          </TabsTrigger>
          <TabsTrigger value="clients" className="relative">
            Clients ({filteredClients.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends">
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
                          {friend.full_name?.charAt(0) || friend.email?.charAt(0) || 'F'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{friend.full_name || friend.email}</h3>
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
                    {friends.length === 0 ? (
                      <div>
                        <p className="mb-2">No friends registered yet.</p>
                        <p className="text-sm">Users need to register with role 'friend' to appear here.</p>
                      </div>
                    ) : (
                      'No friends found matching your search.'
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Clients Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredClients.map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={client.profile_image_url} />
                        <AvatarFallback>
                          {client.full_name?.charAt(0) || client.email?.charAt(0) || 'C'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{client.full_name || client.email}</h3>
                          <Badge variant="default" className="bg-blue-100 text-blue-800">Client</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {client.email}
                          </div>
                          {client.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {client.phone}
                            </div>
                          )}
                          {client.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {client.location}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Joined {new Date(client.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => sendMessage(client.id)}
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
                          <DropdownMenuItem>View Appointments</DropdownMenuItem>
                          <DropdownMenuItem>View Activity</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Suspend Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
                
                {filteredClients.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    {clients.length === 0 ? (
                      <div>
                        <p className="mb-2">No clients registered yet.</p>
                        <p className="text-sm">Users need to register with role 'client' to appear here.</p>
                      </div>
                    ) : (
                      'No clients found matching your search.'
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminFriends;

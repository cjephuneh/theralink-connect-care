
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
  UserCheck,
  Stethoscope,
  Shield
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

interface UserProfile {
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
  therapist_details?: {
    education?: string;
    license_number?: string;
    license_type?: string;
    therapy_approaches?: string;
    languages?: string;
    application_status?: string;
  };
}

const AdminFriends = () => {
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const { toast } = useToast();

  // Separate users by role for easy access
  const friends = allUsers.filter(user => user.role === 'friend');
  const clients = allUsers.filter(user => user.role === 'client');
  const therapists = allUsers.filter(user => user.role === 'therapist');
  const admins = allUsers.filter(user => user.role === 'admin');

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [allUsers, searchTerm, roleFilter]);

  const fetchAllUsers = async () => {
    try {
      console.log('Fetching all users...');
      
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

      // Fetch friend details for friends
      const { data: friendDetailsData, error: friendDetailsError } = await supabase
        .from('friend_details')
        .select('*');

      if (friendDetailsError) {
        console.error('Error fetching friend details:', friendDetailsError);
      }

      // Fetch therapist details for therapists
      const { data: therapistDetailsData, error: therapistDetailsError } = await supabase
        .from('therapist_details')
        .select('*');

      if (therapistDetailsError) {
        console.error('Error fetching therapist details:', therapistDetailsError);
      }

      // Combine users with their additional details
      const combinedUsersData = profilesData?.map(profile => ({
        ...profile,
        friend_details: friendDetailsData?.find(detail => detail.friend_id === profile.id),
        therapist_details: therapistDetailsData?.find(detail => detail.therapist_id === profile.id)
      })) || [];

      console.log('Combined users data:', combinedUsersData);
      console.log(`Found ${combinedUsersData.length} total users:`);
      console.log(`- Admins: ${combinedUsersData.filter(u => u.role === 'admin').length}`);
      console.log(`- Therapists: ${combinedUsersData.filter(u => u.role === 'therapist').length}`);
      console.log(`- Friends: ${combinedUsersData.filter(u => u.role === 'friend').length}`);
      console.log(`- Clients: ${combinedUsersData.filter(u => u.role === 'client').length}`);

      setAllUsers(combinedUsersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please check the console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    console.log('Filtering users...');
    console.log('Search term:', searchTerm);
    console.log('Role filter:', roleFilter);

    let filtered = [...allUsers];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    console.log(`Filtered to ${filtered.length} users`);
    setFilteredUsers(filtered);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'therapist': return <Stethoscope className="h-4 w-4" />;
      case 'friend': return <Heart className="h-4 w-4" />;
      case 'client': return <UserCheck className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleBadge = (user: UserProfile) => {
    const roleColors = {
      admin: 'bg-red-100 text-red-800',
      therapist: 'bg-blue-100 text-blue-800',
      friend: 'bg-green-100 text-green-800',
      client: 'bg-purple-100 text-purple-800'
    };

    return (
      <Badge variant="secondary" className={roleColors[user.role as keyof typeof roleColors] || 'bg-gray-100 text-gray-800'}>
        {getRoleIcon(user.role)}
        <span className="ml-1 capitalize">{user.role}</span>
      </Badge>
    );
  };

  const getStatusBadge = (user: UserProfile) => {
    if (user.role === 'friend') {
      if (user.friend_details?.experience_description) {
        return <Badge variant="default" className="bg-green-100 text-green-800">Complete Profile</Badge>;
      }
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending Setup</Badge>;
    }
    
    if (user.role === 'therapist') {
      const status = user.therapist_details?.application_status || 'pending';
      if (status === 'approved') {
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>;
      }
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 capitalize">{status}</Badge>;
    }
    
    return <Badge variant="default" className="bg-blue-100 text-blue-800">Active</Badge>;
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
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage all platform users across different roles</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            {admins.length} Admins
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Stethoscope className="h-3 w-3" />
            {therapists.length} Therapists
          </Badge>
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
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allUsers.length}</div>
            <p className="text-xs text-muted-foreground">All platform users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Therapists</CardTitle>
            <Stethoscope className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{therapists.length}</div>
            <p className="text-xs text-muted-foreground">Healthcare providers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Friends</CardTitle>
            <Heart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{friends.length}</div>
            <p className="text-xs text-muted-foreground">Community supporters</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <UserCheck className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">Service users</p>
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
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
            <SelectItem value="therapist">Therapists</SelectItem>
            <SelectItem value="friend">Friends</SelectItem>
            <SelectItem value="client">Clients</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Users ({filteredUsers.length})</TabsTrigger>
          <TabsTrigger value="therapist">Therapists ({therapists.length})</TabsTrigger>
          <TabsTrigger value="friend">Friends ({friends.length})</TabsTrigger>
          <TabsTrigger value="client">Clients ({clients.length})</TabsTrigger>
          <TabsTrigger value="admin">Admins ({admins.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.profile_image_url} />
                        <AvatarFallback>
                          {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{user.full_name || user.email}</h3>
                          {getRoleBadge(user)}
                          {getStatusBadge(user)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {user.phone}
                            </div>
                          )}
                          {user.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {user.location}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Joined {new Date(user.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        {user.role === 'friend' && user.friend_details?.areas_of_experience && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Experience:</strong> {user.friend_details.areas_of_experience}
                          </p>
                        )}
                        {user.role === 'therapist' && user.therapist_details?.therapy_approaches && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Approaches:</strong> {user.therapist_details.therapy_approaches}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => sendMessage(user.id)}
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
                            {user.role === 'admin' ? 'Remove Admin' : 'Suspend Account'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
                
                {filteredUsers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    {allUsers.length === 0 ? (
                      <div>
                        <p className="mb-2">No users found.</p>
                        <p className="text-sm">Users will appear here as they register.</p>
                      </div>
                    ) : (
                      'No users found matching your search criteria.'
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Individual role tabs */}
        {['therapist', 'friend', 'client', 'admin'].map((role) => (
          <TabsContent key={role} value={role}>
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{role}s Directory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allUsers.filter(user => user.role === role).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                      {/* Same user card structure as above */}
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.profile_image_url} />
                          <AvatarFallback>
                            {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{user.full_name || user.email}</h3>
                            {getRoleBadge(user)}
                            {getStatusBadge(user)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {user.phone}
                              </div>
                            )}
                            {user.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {user.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => sendMessage(user.id)}
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
                              {role === 'admin' ? 'Remove Admin' : 'Suspend Account'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                  
                  {allUsers.filter(user => user.role === role).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <div>
                        <p className="mb-2">No {role}s registered yet.</p>
                        <p className="text-sm">Users need to register with role '{role}' to appear here.</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AdminFriends;

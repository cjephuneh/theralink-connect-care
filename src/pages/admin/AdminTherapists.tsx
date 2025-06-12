import { useState, useEffect } from 'react';
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
  CardDescription,
} from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Search, 
  RefreshCw, 
  FileEdit, 
  Loader2,
  CheckCircle,
  XCircle,
  Shield,
  FileText,
  Eye,
  AlertCircle,
  User,
  Mail,
  Calendar,
  GraduationCap,
  Award,
  Languages,
  CreditCard
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createNotification } from '@/utils/notifications';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const therapistFormSchema = z.object({
  bio: z.string().min(10, { message: "Bio must be at least 10 characters" }),
  specialization: z.string().min(3, { message: "Specialization is required" }),
  years_experience: z.coerce.number().min(0),
  hourly_rate: z.coerce.number().min(10, { message: "Hourly rate must be at least 10" }),
});

const AdminTherapists = () => {
  const [therapists, setTherapists] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [viewDetailsDialogOpen, setViewDetailsDialogOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof therapistFormSchema>>({
    resolver: zodResolver(therapistFormSchema),
    defaultValues: {
      bio: "",
      specialization: "",
      years_experience: 0,
      hourly_rate: 50,
    },
  });

  useEffect(() => {
    if (profile && profile.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access this page.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
    fetchAllData();
  }, [profile, navigate, toast]);

  useEffect(() => {
    if (selectedUser && selectedUser.role === 'therapist') {
      form.reset({
        bio: selectedUser.bio || "",
        specialization: selectedUser.specialization || "",
        years_experience: selectedUser.years_experience || 0,
        hourly_rate: selectedUser.hourly_rate || 50,
      });
    }
  }, [selectedUser, form]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // Fetch therapists with their profiles
      const { data: therapistData, error: therapistError } = await supabase
        .from('therapists')
        .select(`
          id, 
          bio, 
          specialization, 
          years_experience, 
          hourly_rate, 
          rating,
          created_at,
          profiles!inner (
            id,
            full_name, 
            email, 
            profile_image_url, 
            role, 
            created_at
          )
        `);
      
      if (therapistError) throw therapistError;

      // Get therapist details for verification info
      const therapistIds = therapistData?.map(t => t.id) || [];
      let therapistDetailsData = [];
      
      if (therapistIds.length > 0) {
        const { data: detailsData, error: detailsError } = await supabase
          .from('therapist_details')
          .select('*')
          .in('therapist_id', therapistIds);
        
        if (detailsError) throw detailsError;
        therapistDetailsData = detailsData || [];
      }

      const therapistsWithDetails = therapistData?.map(therapist => ({
        ...therapist,
        role: 'therapist',
        therapist_details: therapistDetailsData.find(d => d.therapist_id === therapist.id)
      })) || [];

      setTherapists(therapistsWithDetails);

      // Fetch clients
      const { data: clientData, error: clientError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'client')
        .order('created_at', { ascending: false });
      
      if (clientError) throw clientError;
      setClients(clientData || []);

      // Fetch friends with their details
      const { data: friendUsers, error: friendError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'friend')
        .order('created_at', { ascending: false });
      
      if (friendError) throw friendError;
      
      let friendsWithDetails = [];
      if (friendUsers && friendUsers.length > 0) {
        const { data: friendDetails, error: detailsError } = await supabase
          .from('friend_details')
          .select('*')
          .in('friend_id', friendUsers.map(user => user.id));
        
        if (detailsError) throw detailsError;
        
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

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (user: any) => {
    setSelectedUser(user);
    
    if (user.role === 'therapist') {
      const details = user.therapist_details;
      setUserDetails(details);
    } else if (user.role === 'friend') {
      setUserDetails(user.details);
    } else {
      setUserDetails(null);
    }
    
    setViewDetailsDialogOpen(true);
  };

  const handleVerifyTherapist = async (therapist: any) => {
    setSelectedUser(therapist);
    setUserDetails(therapist.therapist_details);
    setVerifyDialogOpen(true);
  };

  const handleVerificationAction = async (status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('therapist_details')
        .update({ application_status: status })
        .eq('therapist_id', selectedUser.id);
        
      if (error) throw error;
      
      await createNotification({
        user_id: selectedUser.id,
        title: status === 'approved' ? 'Your account is verified!' : 'Account verification update',
        message: status === 'approved' 
          ? 'Congratulations! Your therapist account has been verified. You can now start accepting clients.'
          : 'Your account verification was not approved. Please check your details and resubmit.',
        type: status === 'approved' ? 'verification_approved' : 'verification_rejected',
        action_url: '/therapist/account'
      });
      
      toast({
        title: status === 'approved' ? 'Therapist Verified' : 'Verification Rejected',
        description: `The therapist has been successfully ${status === 'approved' ? 'verified' : 'rejected'}.`,
      });
      
      setVerifyDialogOpen(false);
      fetchAllData();
    } catch (error: any) {
      console.error('Error updating verification status:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update verification status',
        variant: 'destructive',
      });
    }
  };

  const handleEditTherapist = (therapist: any) => {
    setSelectedUser(therapist);
    setEditDialogOpen(true);
  };

  const updateTherapist = async (values: z.infer<typeof therapistFormSchema>) => {
    try {
      const { error } = await supabase
        .from('therapists')
        .update({
          bio: values.bio,
          specialization: values.specialization,
          years_experience: values.years_experience,
          hourly_rate: values.hourly_rate,
        })
        .eq('id', selectedUser.id);
      
      if (error) throw error;
      
      toast({
        title: 'Therapist Updated',
        description: 'Therapist profile has been successfully updated',
      });
      
      setEditDialogOpen(false);
      fetchAllData();
    } catch (error: any) {
      console.error('Error updating therapist:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update therapist profile',
        variant: 'destructive',
      });
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'NA';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="outline">Pending</Badge>;
    
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const filteredTherapists = therapists.filter(therapist => 
    therapist.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    therapist.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    therapist.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredClients = clients.filter(client => 
    client.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFriends = friends.filter(friend => 
    friend.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.details?.areas_of_experience?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingTherapists = therapists.filter(t => 
    !t.therapist_details?.application_status || t.therapist_details?.application_status === 'pending'
  );

  const pendingFriends = friends.filter(f => f.status === 'Pending Profile');

  const UserTable = ({ users, type }: { users: any[], type: string }) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            {type === 'therapists' && <TableHead>Specialization</TableHead>}
            {type === 'therapists' && <TableHead>Experience</TableHead>}
            {type === 'therapists' && <TableHead>Rate</TableHead>}
            {type === 'therapists' && <TableHead>Status</TableHead>}
            {type === 'friends' && <TableHead>Areas of Experience</TableHead>}
            {type === 'friends' && <TableHead>Status</TableHead>}
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={type === 'clients' ? 4 : 8} className="h-24 text-center">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
                <p className="mt-2 text-gray-500">Loading {type}...</p>
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={type === 'clients' ? 4 : 8} className="h-24 text-center">
                <p className="text-gray-500">No {type} found</p>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profiles?.profile_image_url || user.profile_image_url} />
                      <AvatarFallback>{getInitials(user.profiles?.full_name || user.full_name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.profiles?.full_name || user.full_name}</div>
                      <div className="text-sm text-muted-foreground">{user.profiles?.email || user.email}</div>
                    </div>
                  </div>
                </TableCell>
                {type === 'therapists' && (
                  <>
                    <TableCell>{user.specialization || 'Not specified'}</TableCell>
                    <TableCell>{user.years_experience ? `${user.years_experience} years` : 'N/A'}</TableCell>
                    <TableCell>{user.hourly_rate ? `Ksh${user.hourly_rate}` : 'N/A'}</TableCell>
                    <TableCell>{getStatusBadge(user.therapist_details?.application_status)}</TableCell>
                  </>
                )}
                {type === 'friends' && (
                  <>
                    <TableCell>{user.details?.areas_of_experience?.split(',').slice(0, 2).join(', ') || 'Not specified'}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'Active' ? 'default' : 'outline'}>
                        {user.status}
                      </Badge>
                    </TableCell>
                  </>
                )}
                <TableCell>{new Date(user.profiles?.created_at || user.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(user)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    {type === 'therapists' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleVerifyTherapist(user)}
                          className="flex items-center gap-1"
                        >
                          <Shield className="h-4 w-4" />
                          Verify
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditTherapist(user)}
                        >
                          <FileEdit className="h-4 w-4" />
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
  );

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage therapists, clients, and friends</p>
        </div>
        <Button 
          onClick={fetchAllData} 
          variant="outline" 
          className="flex gap-2"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh All
        </Button>
      </div>

      {/* Pending Approvals Alert */}
      {(pendingTherapists.length > 0 || pendingFriends.length > 0) && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">
                Pending Approvals: {pendingTherapists.length} therapist(s) and {pendingFriends.length} friend(s) awaiting verification
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search users..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="therapists" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="therapists" className="relative">
            Therapists ({therapists.length})
            {pendingTherapists.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                {pendingTherapists.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="clients">Clients ({clients.length})</TabsTrigger>
          <TabsTrigger value="friends" className="relative">
            Friends ({friends.length})
            {pendingFriends.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                {pendingFriends.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="therapists">
          <Card>
            <CardHeader>
              <CardTitle>Therapists</CardTitle>
              <CardDescription>Manage therapist profiles and verification status</CardDescription>
            </CardHeader>
            <CardContent>
              <UserTable users={filteredTherapists} type="therapists" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Clients</CardTitle>
              <CardDescription>Manage client accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <UserTable users={filteredClients} type="clients" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="friends">
          <Card>
            <CardHeader>
              <CardTitle>Friends</CardTitle>
              <CardDescription>Manage peer support friends</CardDescription>
            </CardHeader>
            <CardContent>
              <UserTable users={filteredFriends} type="friends" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View User Details Dialog */}
      <Dialog open={viewDetailsDialogOpen} onOpenChange={setViewDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Details
            </DialogTitle>
            <DialogDescription>
              View complete user information and profile details.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* User Basic Info */}
              <div className="flex items-center gap-4 border-b pb-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedUser.profiles?.profile_image_url || selectedUser.profile_image_url} />
                  <AvatarFallback className="text-lg">{getInitials(selectedUser.profiles?.full_name || selectedUser.full_name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedUser.profiles?.full_name || selectedUser.full_name}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Mail className="h-4 w-4" />
                    <span>{selectedUser.profiles?.email || selectedUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(selectedUser.profiles?.created_at || selectedUser.created_at).toLocaleDateString()}</span>
                  </div>
                  <Badge className="mt-2" variant="secondary">
                    {selectedUser.role || selectedUser.profiles?.role}
                  </Badge>
                </div>
              </div>

              {/* Role-specific Details */}
              {selectedUser.role === 'therapist' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Professional Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Specialization</label>
                      <p>{selectedUser.specialization || 'Not specified'}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Experience</label>
                      <p>{selectedUser.years_experience ? `${selectedUser.years_experience} years` : 'Not specified'}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Hourly Rate</label>
                      <p>{selectedUser.hourly_rate ? `Ksh${selectedUser.hourly_rate}` : 'Not set'}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Rating</label>
                      <p>{selectedUser.rating || 'No ratings yet'}</p>
                    </div>
                  </div>
                  {selectedUser.bio && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Bio</label>
                      <p className="text-sm">{selectedUser.bio}</p>
                    </div>
                  )}

                  {userDetails && (
                    <div className="space-y-4 border-t pt-4">
                      <h4 className="text-lg font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Verification Details
                      </h4>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="credentials">
                          <AccordionTrigger className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            Professional Credentials
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Education</label>
                                <p>{userDetails.education || 'Not provided'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">License Type</label>
                                <p>{userDetails.license_type || 'Not provided'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">License Number</label>
                                <p>{userDetails.license_number || 'Not provided'}</p>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="services">
                          <AccordionTrigger className="flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Services & Approaches
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Therapy Approaches</label>
                                <p>{userDetails.therapy_approaches || 'Not provided'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Session Formats</label>
                                <p>{userDetails.session_formats || 'Not provided'}</p>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="additional">
                          <AccordionTrigger className="flex items-center gap-2">
                            <Languages className="h-4 w-4" />
                            Additional Information
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Languages</label>
                                <p>{userDetails.languages || 'Not provided'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Insurance</label>
                                <div className="flex items-center gap-2">
                                  <span>{userDetails.has_insurance ? 'Accepts Insurance' : 'No Insurance'}</span>
                                  {userDetails.has_insurance && userDetails.insurance_info && (
                                    <span className="text-sm text-muted-foreground">- {userDetails.insurance_info}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium">Verification Status</h5>
                            <p className="text-sm text-muted-foreground">Current application status</p>
                          </div>
                          {getStatusBadge(userDetails.application_status)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedUser.role === 'friend' && userDetails && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Friend Details</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Areas of Experience</label>
                      <p>{userDetails.areas_of_experience || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Experience Description</label>
                      <p>{userDetails.experience_description || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Personal Story</label>
                      <p>{userDetails.personal_story || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Communication Preferences</label>
                      <p>{userDetails.communication_preferences || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Therapist Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Therapist Profile</DialogTitle>
            <DialogDescription>
              Update the therapist's professional information.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src={selectedUser.profiles?.profile_image_url} />
                <AvatarFallback>{getInitials(selectedUser.profiles?.full_name)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{selectedUser.profiles?.full_name}</h3>
                <p className="text-muted-foreground">{selectedUser.profiles?.email}</p>
              </div>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(updateTherapist)} className="space-y-6">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Professional bio and background..." 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Describe the therapist's background, approach, and expertise.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialization</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g. Anxiety, Depression, CBT" {...field} />
                      </FormControl>
                      <FormDescription>
                        Main areas of clinical focus and expertise
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="years_experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormDescription>
                        Total years of professional practice
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="hourly_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hourly Rate (Ksh)</FormLabel>
                    <FormControl>
                      <Input type="number" min="10" step="0.01" {...field} />
                    </FormControl>
                    <FormDescription>
                      Standard rate charged per consultation hour
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Verify Therapist Dialog */}
      <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Verify Therapist Credentials
            </DialogTitle>
            <DialogDescription>
              Review the therapist's professional credentials before approving their account.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 border-b pb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.profiles?.profile_image_url} />
                  <AvatarFallback>{getInitials(selectedUser.profiles?.full_name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.profiles?.full_name}</h3>
                  <p className="text-muted-foreground">{selectedUser.profiles?.email}</p>
                  {selectedUser.specialization && (
                    <Badge variant="secondary" className="mt-1">{selectedUser.specialization}</Badge>
                  )}
                </div>
              </div>

              {!userDetails ? (
                <div className="p-6 bg-muted rounded-md text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <h3 className="text-lg font-medium">No Verification Details</h3>
                  <p className="text-muted-foreground mt-1">This therapist hasn't completed their verification details yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="credentials">
                      <AccordionTrigger>Professional Credentials</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 p-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Education</h4>
                              <p className="text-md">{userDetails.education || 'Not provided'}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">License Type</h4>
                              <p className="text-md">{userDetails.license_type || 'Not provided'}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">License Number</h4>
                            <p className="text-md">{userDetails.license_number || 'Not provided'}</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="approaches">
                      <AccordionTrigger>Therapy Approaches</AccordionTrigger>
                      <AccordionContent>
                        <div className="p-2">
                          <p>{userDetails.therapy_approaches || 'Not provided'}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="services">
                      <AccordionTrigger>Services Offered</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 p-2">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Session Formats</h4>
                            <p>{userDetails.session_formats || 'Not provided'}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Languages</h4>
                            <p>{userDetails.languages || 'Not provided'}</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="insurance">
                      <AccordionTrigger>Insurance & Payment</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 p-2">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium text-gray-500">Accepts Insurance:</h4>
                            <span>{userDetails.has_insurance ? 'Yes' : 'No'}</span>
                          </div>
                          {userDetails.has_insurance && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Insurance Information</h4>
                              <p>{userDetails.insurance_info || 'Not provided'}</p>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium text-gray-500">Hourly Rate:</h4>
                            <span>Ksh{selectedUser.hourly_rate || 'Not set'}</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-2">Current Status:</h3>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(userDetails.application_status)}
                      <span className="text-sm text-muted-foreground">
                        {userDetails.application_status === 'approved' 
                          ? 'This therapist is verified and active on the platform' 
                          : userDetails.application_status === 'rejected'
                          ? 'This therapist was previously rejected'
                          : 'This therapist is awaiting verification'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:justify-between">
                  <Button type="button" variant="outline" onClick={() => setVerifyDialogOpen(false)}>
                    Close
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="destructive" 
                      onClick={() => handleVerificationAction('rejected')}
                      className="flex items-center gap-1"
                      disabled={!userDetails}
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                    <Button 
                      variant="default" 
                      onClick={() => handleVerificationAction('approved')}
                      className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                      disabled={!userDetails}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTherapists;

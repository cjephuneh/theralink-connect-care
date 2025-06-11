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
  CardFooter
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
  Star, 
  FileEdit, 
  Trash2, 
  Users, 
  Loader2,
  CheckCircle,
  XCircle,
  UserCog,
  Shield,
  FileText,
  Eye,
  AlertCircle
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
  const [selectedTherapist, setSelectedTherapist] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [therapistDetails, setTherapistDetails] = useState<any>(null);
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
    // Check if user is admin
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
    if (selectedTherapist) {
      form.reset({
        bio: selectedTherapist.bio || "",
        specialization: selectedTherapist.specialization || "",
        years_experience: selectedTherapist.years_experience || 0,
        hourly_rate: selectedTherapist.hourly_rate || 50,
      });
    }
  }, [selectedTherapist, form]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // Fetch therapists with their profiles and details
      const { data: therapistData, error: therapistError } = await supabase
        .from('therapists')
        .select(`
          id, 
          bio, 
          specialization, 
          years_experience, 
          hourly_rate, 
          rating,
          profiles:id (full_name, email, profile_image_url, role, created_at)
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

      // Combine therapist data with their details
      const therapistsWithDetails = therapistData?.map(therapist => ({
        ...therapist,
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
      
      // Get friend details
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

  const fetchTherapistDetails = async (therapistId: string) => {
    try {
      const { data, error } = await supabase
        .from('therapist_details')
        .select('*')
        .eq('therapist_id', therapistId)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          setTherapistDetails(null);
        } else {
          throw error;
        }
      } else {
        setTherapistDetails(data);
      }
    } catch (error) {
      console.error('Error fetching therapist details:', error);
      toast({
        title: 'Error',
        description: 'Could not load therapist verification details',
        variant: 'destructive',
      });
    }
  };

  const handleVerifyTherapist = async (therapistId: string) => {
    await fetchTherapistDetails(therapistId);
    setSelectedTherapist(therapists.find(t => t.id === therapistId));
    setVerifyDialogOpen(true);
  };

  const handleVerificationAction = async (status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('therapist_details')
        .update({ application_status: status })
        .eq('therapist_id', selectedTherapist.id);
        
      if (error) throw error;
      
      await createNotification({
        user_id: selectedTherapist.id,
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
    setSelectedTherapist(therapist);
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
        .eq('id', selectedTherapist.id);
      
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

  const handleDeleteTherapist = async (therapistId: string) => {
    if (!confirm("Are you sure you want to delete this therapist? This will remove their profile but not their user account.")) return;
    
    try {
      const { error } = await supabase
        .from('therapists')
        .delete()
        .eq('id', therapistId);
      
      if (error) throw error;
      
      toast({
        title: 'Therapist Removed',
        description: 'Therapist has been successfully removed from the platform',
      });
      
      fetchAllData();
    } catch (error: any) {
      console.error('Error deleting therapist:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete therapist',
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

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
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
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">
                Pending Approvals: {pendingTherapists.length} therapist(s) and {pendingFriends.length} friend(s) awaiting verification
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="therapists" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="therapists" className="relative">
            Therapists
            {pendingTherapists.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {pendingTherapists.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="friends" className="relative">
            Friends
            {pendingFriends.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {pendingFriends.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="therapists">
          <Card>
            <CardHeader>
              <CardTitle>Therapists ({therapists.length})</CardTitle>
              <CardDescription>Manage therapist profiles and verification status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Therapist</TableHead>
                      <TableHead>Specialization</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
                          <p className="mt-2 text-gray-500">Loading therapists...</p>
                        </TableCell>
                      </TableRow>
                    ) : filteredTherapists.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          <p className="text-gray-500">No therapists found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTherapists.map((therapist) => (
                        <TableRow key={therapist.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={therapist.profiles?.profile_image_url} />
                                <AvatarFallback>{getInitials(therapist.profiles?.full_name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{therapist.profiles?.full_name}</div>
                                <div className="text-sm text-gray-500">{therapist.profiles?.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{therapist.specialization || 'Not specified'}</TableCell>
                          <TableCell>{therapist.years_experience ? `${therapist.years_experience} years` : 'N/A'}</TableCell>
                          <TableCell>{therapist.hourly_rate ? `₦${therapist.hourly_rate}` : 'N/A'}</TableCell>
                          <TableCell>
                            {getStatusBadge(therapist.therapist_details?.application_status)}
                          </TableCell>
                          <TableCell>{new Date(therapist.profiles?.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleVerifyTherapist(therapist.id)}
                                title="Verify credentials"
                              >
                                <Shield className="h-4 w-4 mr-1" />
                                Verify
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditTherapist(therapist)}
                              >
                                <FileEdit className="h-4 w-4" />
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

        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Clients ({clients.length})</CardTitle>
              <CardDescription>Manage client accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
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
                          <p className="mt-2 text-gray-500">Loading clients...</p>
                        </TableCell>
                      </TableRow>
                    ) : filteredClients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          <p className="text-gray-500">No clients found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredClients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={client.profile_image_url} />
                                <AvatarFallback>{getInitials(client.full_name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{client.full_name || 'N/A'}</div>
                                <div className="text-sm text-gray-500">Client</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{client.email}</TableCell>
                          <TableCell>{new Date(client.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
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

        <TabsContent value="friends">
          <Card>
            <CardHeader>
              <CardTitle>Friends ({friends.length})</CardTitle>
              <CardDescription>Manage peer support friends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Friend</TableHead>
                      <TableHead>Areas of Experience</TableHead>
                      <TableHead>Status</TableHead>
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
                    ) : filteredFriends.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <p className="text-gray-500">No friends found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredFriends.map((friend) => (
                        <TableRow key={friend.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={friend.profile_image_url} />
                                <AvatarFallback>{getInitials(friend.full_name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{friend.full_name || 'N/A'}</div>
                                <div className="text-sm text-gray-500">{friend.email}</div>
                              </div>
                            </div>
                          </TableCell>
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
                            <Button variant="outline" size="sm">
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
      </Tabs>

      {/* Edit Therapist Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Therapist Profile</DialogTitle>
            <DialogDescription>
              Update the therapist's professional information.
            </DialogDescription>
          </DialogHeader>

          {selectedTherapist && (
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src={selectedTherapist.profiles?.profile_image_url} />
                <AvatarFallback>{getInitials(selectedTherapist.profiles?.full_name)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{selectedTherapist.profiles?.full_name}</h3>
                <p className="text-gray-500">{selectedTherapist.profiles?.email}</p>
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
                    <FormLabel>Hourly Rate (₦)</FormLabel>
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
            <DialogTitle>Verify Therapist Credentials</DialogTitle>
            <DialogDescription>
              Review the therapist's professional credentials before approving their account.
            </DialogDescription>
          </DialogHeader>
          
          {selectedTherapist && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 border-b pb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedTherapist.profiles?.profile_image_url} />
                  <AvatarFallback>{getInitials(selectedTherapist.profiles?.full_name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedTherapist.profiles?.full_name}</h3>
                  <p className="text-gray-500">{selectedTherapist.profiles?.email}</p>
                  {selectedTherapist.specialization && (
                    <Badge variant="secondary" className="mt-1">{selectedTherapist.specialization}</Badge>
                  )}
                </div>
              </div>

              {!therapistDetails ? (
                <div className="p-6 bg-gray-50 rounded-md text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <h3 className="text-lg font-medium">No Verification Details</h3>
                  <p className="text-gray-500 mt-1">This therapist hasn't completed their verification details yet.</p>
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
                              <p className="text-md">{therapistDetails.education || 'Not provided'}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">License Type</h4>
                              <p className="text-md">{therapistDetails.license_type || 'Not provided'}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">License Number</h4>
                            <p className="text-md">{therapistDetails.license_number || 'Not provided'}</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="approaches">
                      <AccordionTrigger>Therapy Approaches</AccordionTrigger>
                      <AccordionContent>
                        <div className="p-2">
                          <p>{therapistDetails.therapy_approaches || 'Not provided'}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="services">
                      <AccordionTrigger>Services Offered</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 p-2">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Session Formats</h4>
                            <p>{therapistDetails.session_formats || 'Not provided'}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Languages</h4>
                            <p>{therapistDetails.languages || 'Not provided'}</p>
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
                            <span>{therapistDetails.has_insurance ? 'Yes' : 'No'}</span>
                          </div>
                          {therapistDetails.has_insurance && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Insurance Information</h4>
                              <p>{therapistDetails.insurance_info || 'Not provided'}</p>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium text-gray-500">Hourly Rate:</h4>
                            <span>₦{selectedTherapist.hourly_rate || 'Not set'}</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-2">Current Status:</h3>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(therapistDetails.application_status)}
                      <span className="text-sm text-gray-500">
                        {therapistDetails.application_status === 'approved' 
                          ? 'This therapist is verified and active on the platform' 
                          : therapistDetails.application_status === 'rejected'
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
                      disabled={!therapistDetails}
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                    <Button 
                      variant="default" 
                      onClick={() => handleVerificationAction('approved')}
                      className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                      disabled={!therapistDetails}
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

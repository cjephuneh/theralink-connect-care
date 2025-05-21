
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
  FileText
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createNotification } from '@/utils/notifications';

const therapistFormSchema = z.object({
  bio: z.string().min(10, { message: "Bio must be at least 10 characters" }),
  specialization: z.string().min(3, { message: "Specialization is required" }),
  years_experience: z.coerce.number().min(0),
  hourly_rate: z.coerce.number().min(10, { message: "Hourly rate must be at least 10" }),
});

const AdminTherapists = () => {
  const [therapists, setTherapists] = useState<any[]>([]);
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

    fetchTherapists();
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

  const fetchTherapists = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('therapists')
        .select(`
          id, 
          bio, 
          specialization, 
          years_experience, 
          hourly_rate, 
          rating,
          profiles:id (full_name, email, profile_image_url, role)
        `);
      
      if (error) throw error;
      setTherapists(data || []);
    } catch (error) {
      console.error('Error fetching therapists:', error);
      toast({
        title: 'Error',
        description: 'Failed to load therapists',
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
          // No data found - therapist hasn't completed onboarding
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
      // Update therapist_details with verification status
      const { error } = await supabase
        .from('therapist_details')
        .update({ application_status: status })
        .eq('therapist_id', selectedTherapist.id);
        
      if (error) throw error;
      
      // Send notification to therapist
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
      fetchTherapists();
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
      fetchTherapists();
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
      // Delete therapist record but keep the user account
      const { error } = await supabase
        .from('therapists')
        .delete()
        .eq('id', therapistId);
      
      if (error) throw error;
      
      toast({
        title: 'Therapist Removed',
        description: 'Therapist has been successfully removed from the platform',
      });
      
      fetchTherapists();
    } catch (error: any) {
      console.error('Error deleting therapist:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete therapist',
        variant: 'destructive',
      });
    }
  };

  const filteredTherapists = therapists.filter(therapist => 
    therapist.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    therapist.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    therapist.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    if (!name) return 'NA';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="outline">Unknown</Badge>;
    
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

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Therapist Management</h1>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search therapists..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          onClick={fetchTherapists} 
          variant="outline" 
          className="flex gap-2"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Therapists</CardTitle>
          <CardDescription>Manage therapist profiles and credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Therapist</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Hourly Rate</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
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
                        {therapist.rating ? (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                            <span>{therapist.rating.toFixed(1)}</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">No ratings</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {therapist.therapist_details?.application_status ? 
                          getStatusBadge(therapist.therapist_details.application_status) : 
                          <Badge variant="outline">Pending</Badge>
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleVerifyTherapist(therapist.id)}
                            title="Verify credentials"
                          >
                            <Shield className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleEditTherapist(therapist)}
                          >
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleDeleteTherapist(therapist.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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

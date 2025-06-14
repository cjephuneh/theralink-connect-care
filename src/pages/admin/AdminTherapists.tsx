import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  UserCog, 
  Users, 
  Search, 
  MoreVertical, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle,
  DollarSign,
  Star,
  Eye
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
import { TherapistDetailsModal } from '@/components/admin/TherapistDetailsModal';

interface Therapist {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  profile_image_url?: string;
  created_at: string;
  bio?: string;
  specialization?: string;
  years_experience?: number;
  hourly_rate?: number;
  rating?: number;
  preferred_currency?: string;
  therapist_details?: {
    license_number?: string;
    license_type?: string;
    therapy_approaches?: string;
    languages?: string;
    application_status?: string;
    is_verified?: boolean;
    preferred_currency?: string;
  };
}

const AdminTherapists = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [filteredTherapists, setFilteredTherapists] = useState<Therapist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTherapists();
  }, []);

  useEffect(() => {
    filterTherapists();
  }, [therapists, searchTerm, statusFilter]);

  const fetchTherapists = async () => {
    try {
      // Fetch therapist profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'therapist');

      if (profilesError) throw profilesError;

      // Fetch therapist data
      const { data: therapistData, error: therapistError } = await supabase
        .from('therapists')
        .select('*');

      if (therapistError) throw therapistError;

      // Fetch therapist details
      const { data: therapistDetailsData, error: detailsError } = await supabase
        .from('therapist_details')
        .select('*');

      if (detailsError) throw detailsError;

      // Combine all data
      const combinedData = profilesData.map(profile => {
        const therapistInfo = therapistData.find(t => t.id === profile.id);
        const detailsInfo = therapistDetailsData.find(d => d.therapist_id === profile.id);
        
        return {
          ...profile,
          ...therapistInfo,
          therapist_details: detailsInfo
        };
      });

      setTherapists(combinedData);
    } catch (error) {
      console.error('Error fetching therapists:', error);
      toast({
        title: "Error",
        description: "Failed to fetch therapists data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterTherapists = () => {
    let filtered = therapists;

    if (searchTerm) {
      filtered = filtered.filter(therapist =>
        therapist.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        therapist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        therapist.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        therapist.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(therapist => {
        switch (statusFilter) {
          case 'verified':
            return therapist.therapist_details?.is_verified;
          case 'pending':
            return therapist.therapist_details?.application_status === 'pending';
          case 'active':
            return therapist.therapist_details?.is_verified && therapist.therapist_details?.license_number;
          default:
            return true;
        }
      });
    }

    setFilteredTherapists(filtered);
  };

  const getStatusBadge = (therapist: Therapist) => {
    if (therapist.therapist_details?.is_verified) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Verified</Badge>;
    } else if (therapist.therapist_details?.application_status === 'pending') {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    } else {
      return <Badge variant="outline" className="bg-red-100 text-red-800">Unverified</Badge>;
    }
  };

  const updateTherapistStatus = async (therapistId: string, isVerified: boolean) => {
    try {
      const { error } = await supabase
        .from('therapist_details')
        .update({ 
          is_verified: isVerified,
          application_status: isVerified ? 'approved' : 'rejected'
        })
        .eq('therapist_id', therapistId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Therapist ${isVerified ? 'verified' : 'unverified'} successfully.`,
      });

      fetchTherapists();
    } catch (error) {
      console.error('Error updating therapist status:', error);
      toast({
        title: "Error",
        description: "Failed to update therapist status.",
        variant: "destructive",
      });
    }
  };

  const openTherapistDetails = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTherapist(null);
  };

  const handleStatusUpdate = () => {
    fetchTherapists();
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
          <h1 className="text-3xl font-bold">Therapist Management</h1>
          <p className="text-muted-foreground">Manage therapists, verify credentials, and monitor activity</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <UserCog className="h-3 w-3" />
            {therapists.length} Total Therapists
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Therapists</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{therapists.length}</div>
            <p className="text-xs text-muted-foreground">Registered therapists</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {therapists.filter(t => t.therapist_details?.is_verified).length}
            </div>
            <p className="text-xs text-muted-foreground">Active & verified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {therapists.filter(t => t.therapist_details?.application_status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting verification</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {therapists.filter(t => {
                const createdDate = new Date(t.created_at);
                const now = new Date();
                return createdDate.getMonth() === now.getMonth() && 
                       createdDate.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">New applications</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search therapists by name, email, specialization..."
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
            <SelectItem value="all">All Therapists</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="pending">Pending Review</SelectItem>
            <SelectItem value="active">Active</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Therapists Table */}
      <Card>
        <CardHeader>
          <CardTitle>Therapist Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTherapists.map((therapist) => (
              <div key={therapist.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={therapist.profile_image_url} />
                    <AvatarFallback>
                      {therapist.full_name?.split(' ').map(n => n[0]).join('') || 'T'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{therapist.full_name || 'No name provided'}</h3>
                      {getStatusBadge(therapist)}
                      {therapist.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-muted-foreground">{therapist.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {therapist.email}
                      </div>
                      {therapist.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {therapist.phone}
                        </div>
                      )}
                      {therapist.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {therapist.location}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {therapist.specialization && (
                        <span><strong>Specialization:</strong> {therapist.specialization}</span>
                      )}
                      {therapist.years_experience && (
                        <span><strong>Experience:</strong> {therapist.years_experience} years</span>
                      )}
                      {(therapist.hourly_rate || therapist.hourly_rate === 0) && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span>
                            {therapist.hourly_rate === 0 ? 'Free' : `${therapist.hourly_rate} ${therapist.preferred_currency || therapist.therapist_details?.preferred_currency || 'NGN'}`}
                          </span>
                        </div>
                      )}
                    </div>
                    {therapist.therapist_details?.license_type && (
                      <p className="text-sm text-muted-foreground">
                        <strong>License:</strong> {therapist.therapist_details.license_type} - {therapist.therapist_details.license_number}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openTherapistDetails(therapist)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  
                  {!therapist.therapist_details?.is_verified && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateTherapistStatus(therapist.id, true)}
                      className="text-green-600 border-green-600 hover:bg-green-50"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Verify
                    </Button>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => openTherapistDetails(therapist)}>
                        View Full Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>Send Email</DropdownMenuItem>
                      <DropdownMenuItem>View Appointments</DropdownMenuItem>
                      <DropdownMenuItem>View Earnings</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {therapist.therapist_details?.is_verified ? (
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => updateTherapistStatus(therapist.id, false)}
                        >
                          Revoke Verification
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem 
                          className="text-green-600"
                          onClick={() => updateTherapistStatus(therapist.id, true)}
                        >
                          Verify Therapist
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            
            {filteredTherapists.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? 'No therapists found matching your search.' : 'No therapists registered yet.'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Therapist Details Modal */}
      <TherapistDetailsModal
        therapist={selectedTherapist}
        isOpen={isModalOpen}
        onClose={closeModal}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default AdminTherapists;

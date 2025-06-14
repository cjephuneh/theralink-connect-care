
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  DollarSign,
  GraduationCap,
  Shield,
  MessageCircle,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Heart,
  BookOpen
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
    education?: string;
    insurance_info?: string;
    session_formats?: string;
    has_insurance?: boolean;
  };
}

interface TherapistDetailsModalProps {
  therapist: Therapist | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: () => void;
}

export const TherapistDetailsModal = ({ therapist, isOpen, onClose, onStatusUpdate }: TherapistDetailsModalProps) => {
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [earnings, setEarnings] = useState({ total: 0, thisMonth: 0 });
  const { toast } = useToast();

  useEffect(() => {
    if (therapist && isOpen) {
      fetchAdditionalData();
    }
  }, [therapist, isOpen]);

  const fetchAdditionalData = async () => {
    if (!therapist) return;

    try {
      // Fetch appointments
      const { data: appointmentsData } = await supabase
        .from('appointments')
        .select('*')
        .eq('therapist_id', therapist.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch reviews
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*')
        .eq('therapist_id', therapist.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch earnings from transactions
      const { data: transactionsData } = await supabase
        .from('transactions')
        .select('amount, created_at')
        .eq('therapist_id', therapist.id)
        .eq('status', 'completed');

      setAppointments(appointmentsData || []);
      setReviews(reviewsData || []);
      
      if (transactionsData) {
        const total = transactionsData.reduce((sum, t) => sum + Number(t.amount), 0);
        const thisMonth = transactionsData
          .filter(t => new Date(t.created_at).getMonth() === new Date().getMonth())
          .reduce((sum, t) => sum + Number(t.amount), 0);
        setEarnings({ total, thisMonth });
      }
    } catch (error) {
      console.error('Error fetching additional data:', error);
    }
  };

  const updateTherapistStatus = async (isVerified: boolean) => {
    if (!therapist) return;

    try {
      const { error } = await supabase
        .from('therapist_details')
        .update({ 
          is_verified: isVerified,
          application_status: isVerified ? 'approved' : 'rejected'
        })
        .eq('therapist_id', therapist.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Therapist ${isVerified ? 'verified' : 'unverified'} successfully.`,
      });

      onStatusUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating therapist status:', error);
      toast({
        title: "Error",
        description: "Failed to update therapist status.",
        variant: "destructive",
      });
    }
  };

  if (!therapist) return null;

  const getStatusBadge = () => {
    if (therapist.therapist_details?.is_verified) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Verified</Badge>;
    } else if (therapist.therapist_details?.application_status === 'pending') {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    } else {
      return <Badge variant="outline" className="bg-red-100 text-red-800">Unverified</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={therapist.profile_image_url} />
              <AvatarFallback>
                {therapist.full_name?.split(' ').map(n => n[0]).join('') || 'T'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{therapist.full_name || 'No name provided'}</h2>
              <div className="flex items-center gap-2 mt-1">
                {getStatusBadge()}
                {therapist.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{therapist.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{therapist.email}</span>
              </div>
              {therapist.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{therapist.phone}</span>
                </div>
              )}
              {therapist.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{therapist.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Joined {new Date(therapist.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Professional Information */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Professional Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {therapist.specialization && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Specialization</label>
                  <p className="text-sm">{therapist.specialization}</p>
                </div>
              )}
              {therapist.years_experience && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Experience</label>
                  <p className="text-sm">{therapist.years_experience} years</p>
                </div>
              )}
              {(therapist.hourly_rate || therapist.hourly_rate === 0) && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Hourly Rate</label>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    <span className="text-sm">
                      {therapist.hourly_rate === 0 ? 'Free' : `${therapist.hourly_rate} ${therapist.preferred_currency || therapist.therapist_details?.preferred_currency || 'NGN'}`}
                    </span>
                  </div>
                </div>
              )}
              {therapist.therapist_details?.education && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Education</label>
                  <p className="text-sm">{therapist.therapist_details.education}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* License Information */}
          {therapist.therapist_details && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                License & Verification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {therapist.therapist_details.license_type && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">License Type</label>
                    <p className="text-sm">{therapist.therapist_details.license_type}</p>
                  </div>
                )}
                {therapist.therapist_details.license_number && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">License Number</label>
                    <p className="text-sm">{therapist.therapist_details.license_number}</p>
                  </div>
                )}
                {therapist.therapist_details.therapy_approaches && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Therapy Approaches</label>
                    <p className="text-sm">{therapist.therapist_details.therapy_approaches}</p>
                  </div>
                )}
                {therapist.therapist_details.languages && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Languages</label>
                    <p className="text-sm">{therapist.therapist_details.languages}</p>
                  </div>
                )}
                {therapist.therapist_details.session_formats && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Session Formats</label>
                    <p className="text-sm">{therapist.therapist_details.session_formats}</p>
                  </div>
                )}
                {therapist.therapist_details.insurance_info && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Insurance</label>
                    <p className="text-sm">{therapist.therapist_details.insurance_info}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <Separator />

          {/* Bio */}
          {therapist.bio && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Bio
              </h3>
              <p className="text-sm text-muted-foreground">{therapist.bio}</p>
            </div>
          )}

          {/* Statistics */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground">Total Appointments</div>
                <div className="text-lg font-semibold">{appointments.length}</div>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground">Total Reviews</div>
                <div className="text-lg font-semibold">{reviews.length}</div>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground">Total Earnings</div>
                <div className="text-lg font-semibold">{earnings.total.toFixed(2)} NGN</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            {!therapist.therapist_details?.is_verified ? (
              <Button
                onClick={() => updateTherapistStatus(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Verify Therapist
              </Button>
            ) : (
              <Button
                onClick={() => updateTherapistStatus(false)}
                variant="destructive"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Revoke Verification
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

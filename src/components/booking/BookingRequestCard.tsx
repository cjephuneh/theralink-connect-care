import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Video, MapPin, User, MessageSquare, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface BookingRequest {
  id: string;
  client_id: string;
  therapist_id: string;
  requested_date: string;
  requested_time: string;
  session_type: string;
  duration: number;
  message: string | null;
  status: string;
  payment_required: boolean;
  payment_amount: number | null;
  currency: string;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
    profile_image_url: string | null;
  };
}

interface BookingRequestCardProps {
  bookingRequest: BookingRequest;
  userRole: 'client' | 'therapist';
  onUpdate: () => void;
}

export const BookingRequestCard = ({ bookingRequest, userRole, onUpdate }: BookingRequestCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  
  const { toast } = useToast();

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('booking_requests')
        .update({ status: 'accepted' })
        .eq('id', bookingRequest.id);

      if (error) throw error;

      toast({
        title: "Booking accepted!",
        description: "The appointment has been scheduled and the client has been notified.",
      });
      
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('booking_requests')
        .update({ 
          status: 'rejected',
          rejected_reason: rejectionReason
        })
        .eq('id', bookingRequest.id);

      if (error) throw error;

      // Create notification for client
      await supabase
        .from('notifications')
        .insert({
          id: crypto.randomUUID(),
          user_id: bookingRequest.client_id,
          title: 'Booking Request Rejected',
          message: `Your booking request has been rejected. ${rejectionReason ? `Reason: ${rejectionReason}` : ''}`,
          type: 'booking_rejected',
          action_url: '/client/appointments'
        });

      toast({
        title: "Booking rejected",
        description: "The client has been notified.",
      });
      
      setShowRejectionForm(false);
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('booking_requests')
        .update({ status: 'cancelled' })
        .eq('id', bookingRequest.id);

      if (error) throw error;

      toast({
        title: "Booking request cancelled",
        description: "Your booking request has been cancelled.",
      });
      
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="text-green-600 border-green-600">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-600">Rejected</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-gray-600 border-gray-600">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              {bookingRequest.profiles.profile_image_url ? (
                <img 
                  src={bookingRequest.profiles.profile_image_url} 
                  alt={bookingRequest.profiles.full_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <User className="h-5 w-5" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">
                {userRole === 'therapist' ? 'Request from' : 'Request to'} {bookingRequest.profiles.full_name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {format(new Date(bookingRequest.created_at), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
          {getStatusBadge(bookingRequest.status)}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {format(new Date(bookingRequest.requested_date), 'MMM dd, yyyy')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{bookingRequest.requested_time}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            {bookingRequest.session_type === 'online' ? (
              <Video className="h-4 w-4 text-muted-foreground" />
            ) : (
              <MapPin className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm capitalize">{bookingRequest.session_type}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{bookingRequest.duration} minutes</span>
          </div>
        </div>

        {bookingRequest.payment_required && bookingRequest.payment_amount && (
          <div className="bg-accent p-3 rounded-lg">
            <div className="text-sm font-medium">
              Payment Required: {bookingRequest.currency} {bookingRequest.payment_amount}
            </div>
          </div>
        )}

        {bookingRequest.message && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Message</span>
            </div>
            <p className="text-sm text-muted-foreground bg-accent p-3 rounded-lg">
              {bookingRequest.message}
            </p>
          </div>
        )}

        {showRejectionForm && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Rejection Reason (Optional)</label>
            <Textarea
              placeholder="Let the client know why you're rejecting this request..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
            />
          </div>
        )}
      </CardContent>

      {bookingRequest.status === 'pending' && (
        <CardFooter>
          {userRole === 'therapist' ? (
            <div className="flex gap-2 w-full">
              {showRejectionForm ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowRejectionForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={handleReject}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? "Rejecting..." : "Confirm Reject"}
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline"
                    onClick={() => setShowRejectionForm(true)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button 
                    onClick={handleAccept}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {isLoading ? "Accepting..." : "Accept"}
                  </Button>
                </>
              )}
            </div>
          ) : (
            <Button 
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Cancelling..." : "Cancel Request"}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
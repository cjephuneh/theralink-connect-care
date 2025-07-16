import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Video, MapPin, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  therapist: {
    id: string;
    full_name: string;
    hourly_rate: number;
    is_community_therapist: boolean;
    preferred_currency: string;
  };
}

export const BookingModal = ({ isOpen, onClose, therapist }: BookingModalProps) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionType, setSessionType] = useState("online");
  const [duration, setDuration] = useState("60");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const { user } = useUser();

  const isPaid = !therapist.is_community_therapist;
  const amount = isPaid ? (therapist.hourly_rate * (parseInt(duration) / 60)) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      // Create booking request
      const { data: bookingData, error: bookingError } = await supabase
        .from('booking_requests')
        .insert({
          client_id: user.id,
          therapist_id: therapist.id,
          requested_date: selectedDate,
          requested_time: selectedTime,
          session_type: sessionType,
          duration: parseInt(duration),
          message,
          payment_required: isPaid,
          payment_amount: amount,
          currency: therapist.preferred_currency || 'KES'
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // If it's a paid therapist, create payment intent
      if (isPaid) {
        const { error: paymentError } = await supabase
          .from('payment_intents')
          .insert({
            booking_request_id: bookingData.id,
            user_id: user.id,
            therapist_id: therapist.id,
            amount,
            currency: therapist.preferred_currency || 'KES',
          });

        if (paymentError) throw paymentError;
      }

      // Create notification for therapist
      await supabase
        .from('notifications')
        .insert({
          id: crypto.randomUUID(),
          user_id: therapist.id,
          title: 'New Booking Request',
          message: `You have a new booking request from a client`,
          type: 'booking_request',
          action_url: '/therapist/appointments'
        });

      toast({
        title: "Booking request sent!",
        description: isPaid 
          ? "Your booking request has been sent. Payment will be processed once the therapist accepts."
          : "Your booking request has been sent to the therapist.",
      });
      
      onClose();
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

  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Book Session with {therapist.full_name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="session-type">Session Type</Label>
              <Select value={sessionType} onValueChange={setSessionType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Online
                    </div>
                  </SelectItem>
                  <SelectItem value="in-person">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      In-Person
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Any specific requirements or topics you'd like to discuss..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          {isPaid && (
            <div className="bg-accent p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CreditCard className="h-4 w-4" />
                Payment Details
              </div>
              <div className="text-sm text-muted-foreground">
                Session cost: {therapist.preferred_currency || 'NGN'} {amount.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                Payment will be processed once the therapist accepts your booking.
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !selectedDate || !selectedTime}
              className="flex-1"
            >
              {isLoading ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
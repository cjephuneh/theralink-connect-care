
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  start_time: string;
  end_time: string;
  status: string;
  session_type: string;
  notes?: string;
  client_id: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

interface TherapistAppointmentsModalProps {
  therapistId: string | null;
  therapistName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const TherapistAppointmentsModal = ({ 
  therapistId, 
  therapistName, 
  isOpen, 
  onClose 
}: TherapistAppointmentsModalProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (therapistId && isOpen) {
      fetchAppointments();
    }
    // eslint-disable-next-line
  }, [therapistId, isOpen]);

  const fetchAppointments = async () => {
    if (!therapistId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          profiles!appointments_client_id_fkey (
            full_name,
            email
          )
        `)
        .eq('therapist_id', therapistId)
        .order('start_time', { ascending: false });

      if (error) throw error;

      // Fix: Convert profiles from array -> single object if array
      const transformed = (data ?? []).map((a: any) => ({
        ...a,
        profiles: Array.isArray(a.profiles) ? a.profiles[0] : a.profiles
      }));

      setAppointments(transformed);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch appointments.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Appointments for {therapistName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No appointments found for this therapist.
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {appointment.profiles?.full_name || 'Unknown Client'}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({appointment.profiles?.email})
                      </span>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(appointment.start_time).toLocaleString()} - 
                        {new Date(appointment.end_time).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div>
                      <span className="font-medium">Type:</span> {appointment.session_type}
                    </div>
                  </div>
                  
                  {appointment.notes && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Notes:</span> {appointment.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

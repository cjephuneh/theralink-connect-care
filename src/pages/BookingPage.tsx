import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CalendarClock, ChevronLeft, Clock, User, Video, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isValid, parseISO } from "date-fns";

type Availability = {
  date: string;
  slots: string[];
};

interface BookingTherapist {
  id: string;
  full_name: string;
  profile_image_url: string | null;
  hourly_rate: number;
  specialization: string;
  availability: any;
  is_community_therapist: boolean;
  bio: string;
}

const BookingPage = () => {
  const { therapistId } = useParams<{ therapistId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [therapist, setTherapist] = useState<BookingTherapist | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSessionType, setSelectedSessionType] = useState<'video' | 'chat'>('video');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    const fetchTherapist = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('therapists')
          .select(`
            *,
            profiles!inner (
              id,
              full_name,
              profile_image_url
            )
          `)
          .eq('id', therapistId)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Therapist not found');

        const therapistData: BookingTherapist = {
          id: data.id,
          full_name: data.profiles.full_name || '',
          profile_image_url: data.profiles.profile_image_url || null,
          hourly_rate: data.hourly_rate || 0,
          specialization: data.specialization || 'General Therapy',
          availability: data.availability,
          is_community_therapist: false,
          bio: data.bio || 'Professional therapist.'
        };

        setTherapist(therapistData);

        try {
          const availabilityData = typeof data.availability === 'string' 
            ? JSON.parse(data.availability) 
            : data.availability;
          
          if (Array.isArray(availabilityData) && availabilityData.length > 0) {
            const firstAvailableDate = parseISO(availabilityData[0].date);
            if (isValid(firstAvailableDate)) {
              setSelectedDate(firstAvailableDate);
            } else {
              setDefaultDate();
            }
          } else {
            setDefaultDate();
          }
        } catch (e) {
          setDefaultDate();
        }

      } catch (error) {
        console.error('Error fetching therapist:', error);
        let description = 'The therapist profile could not be found';
        if (error instanceof Error && error.message) {
          description = error.message;
        }
        toast({
          title: "Failed to load therapist",
          description: description,
          variant: "destructive",
        });
        navigate('/therapists');
      } finally {
        setLoading(false);
      }
    };

    const setDefaultDate = () => {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 1);
      setSelectedDate(defaultDate);
    };

    if (therapistId) fetchTherapist();
  }, [therapistId, toast, navigate]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date && isValid(date)) {
      setSelectedDate(date);
      setSelectedTime(null);
      setCalendarOpen(false);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBookSession = async () => {
    if (!therapist || !selectedDate || !selectedTime || !user) {
      toast({
        title: "Error",
        description: "Please select a date and time for your session",
        variant: "destructive",
      });
      return;
    }

    try {
      const sessionDuration = selectedSessionType === 'video' ? 50 : 30;
      const [hours, minutes] = selectedTime.split(':').map(Number);
      
      const startDateTime = new Date(selectedDate);
      startDateTime.setHours(hours, minutes, 0, 0);
      
      const endDateTime = new Date(startDateTime.getTime() + sessionDuration * 60000);

      const sessionDetails = {
        client_id: user.id,
        therapist_id: therapist.id,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        session_type: selectedSessionType,
        status: therapist.is_community_therapist ? 'confirmed' : 'scheduled',
        client_notes: additionalNotes || null
      };

      const { error } = await supabase
        .from('appointments')
        .insert([sessionDetails]);

      if (error) throw error;

      toast({
        title: "Booking successful!",
        description: therapist.is_community_therapist 
          ? "Your session has been confirmed." 
          : "Your session has been scheduled.",
      });

      navigate('/client/appointments');

    } catch (error) {
      console.error('Error booking session:', error);
      toast({
        title: "Booking failed",
        description: "Could not complete your booking",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Therapist Not Found</h2>
        <Button asChild>
          <Link to="/therapists">Back to Therapists</Link>
        </Button>
      </div>
    );
  }

  const formatDisplayDate = (date: Date | null) => {
    if (!date || !isValid(date)) return "Select a date";
    return format(date, "EEE, MMM d");
  };

  const formatDateForComparison = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  const formatCalendarDate = (date: Date | null) => {
    if (!date || !isValid(date)) return <span>Pick a date</span>;
    return format(date, "PPP");
  };

  const getCurrentDateSlots = () => {
    if (!selectedDate) return [];
    
    try {
      const availabilityData = typeof therapist.availability === 'string' 
        ? JSON.parse(therapist.availability) 
        : therapist.availability;
      
      if (Array.isArray(availabilityData)) {
        const selectedDateStr = formatDateForComparison(selectedDate);
        const dayData = availabilityData.find((day: any) => day.date === selectedDateStr);
        return dayData?.slots || [];
      }
      return [];
    } catch (e) {
      return ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
    }
  };

  const getAvailableDates = () => {
    try {
      const availabilityData = typeof therapist.availability === 'string' 
        ? JSON.parse(therapist.availability) 
        : therapist.availability;
      
      if (Array.isArray(availabilityData)) {
        return availabilityData.map((day: any) => {
          const date = parseISO(day.date);
          return isValid(date) ? date : null;
        }).filter(Boolean) as Date[];
      }
      return [];
    } catch (e) {
      const defaultDates = [];
      for (let i = 1; i <= 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        defaultDates.push(date);
      }
      return defaultDates;
    }
  };

  const currentDateSlots = getCurrentDateSlots();
  const availableDates = getAvailableDates();

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center mb-6 gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to={`/therapists/${therapist.id}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">
          Book Session with {therapist.full_name}
        </h1>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {therapist.profile_image_url ? (
              <img
                src={therapist.profile_image_url}
                alt={therapist.full_name}
                className="w-20 h-20 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                }}
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-10 w-10 text-gray-500" />
              </div>
            )}
            
            <div>
              <h2 className="text-xl font-bold">{therapist.full_name}</h2>
              <p className="text-muted-foreground mb-2">{therapist.specialization}</p>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  therapist.is_community_therapist 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {therapist.is_community_therapist ? 'Community Therapist' : `ksh${therapist.hourly_rate}/hr`}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-8">
            <div>
              <h3 className="font-medium mb-3">Session Type</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedSessionType('video')}
                  className={`p-4 border rounded-lg flex flex-col items-center ${
                    selectedSessionType === 'video' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <Video className="h-6 w-6 mb-2" />
                  <span>Video Session</span>
                  <span className="text-sm text-muted-foreground">
                    {therapist.is_community_therapist ? 'Free' : `ksh${therapist.hourly_rate}`}
                  </span>
                </button>
                
                <button
                  onClick={() => setSelectedSessionType('chat')}
                  className={`p-4 border rounded-lg flex flex-col items-center ${
                    selectedSessionType === 'chat' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <MessageCircle className="h-6 w-6 mb-2" />
                  <span>Chat Session</span>
                  <span className="text-sm text-muted-foreground">
                    {therapist.is_community_therapist ? 'Free' : `ksh${Math.round(therapist.hourly_rate * 0.7)}`}
                  </span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Select Date</h3>
              <div className="flex flex-col gap-4">
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarClock className="mr-2 h-4 w-4" />
                      {formatCalendarDate(selectedDate)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate || undefined}
                      onSelect={handleDateSelect}
                      disabled={(date) => {
                        const dateStr = formatDateForComparison(date);
                        return !availableDates.some(availDate => 
                          formatDateForComparison(availDate) === dateStr
                        );
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <div className="flex overflow-x-auto gap-2 pb-2">
                  {availableDates.map((date) => (
                    <button
                      key={date.toString()}
                      onClick={() => handleDateSelect(date)}
                      className={`min-w-[120px] p-3 text-center rounded-lg ${
                        selectedDate && formatDateForComparison(selectedDate) === formatDateForComparison(date)
                          ? 'bg-primary text-white'
                          : 'bg-muted/50 hover:bg-muted'
                      }`}
                    >
                      <div className="text-sm font-medium">
                        {formatDisplayDate(date)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {selectedDate && currentDateSlots.length > 0 && (
              <div>
                <h3 className="font-medium mb-3">Select Time</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {currentDateSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className={`p-3 text-center rounded-lg ${
                        selectedTime === time
                          ? 'bg-primary text-white'
                          : 'bg-muted/50 hover:bg-muted'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-medium mb-3">Additional Preferences (Optional)</h3>
              <Textarea
                placeholder="Let the therapist know if you have any specific preferences or topics you'd like to focus on..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t p-6">
          <Button variant="outline" asChild>
            <Link to={`/therapists/${therapist.id}`}>
              Cancel
            </Link>
          </Button>
          <Button 
            onClick={handleBookSession}
            disabled={!selectedDate || !selectedTime}
          >
            {therapist.is_community_therapist ? 'Confirm Booking' : 'Request Session'}
          </Button>
        </CardFooter>
      </Card>

      <div className="bg-muted/50 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 mt-0.5 text-primary" />
          <div>
            <h4 className="font-medium mb-1">Session Details</h4>
            <p className="text-sm text-muted-foreground">
              {selectedSessionType === 'video' ? 
                "50-minute video session via our secure platform" : 
                "30-minute text chat session"}
            </p>
            {therapist.is_community_therapist && (
              <p className="text-sm text-green-600 mt-2">
                Community therapists offer free or discounted sessions
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
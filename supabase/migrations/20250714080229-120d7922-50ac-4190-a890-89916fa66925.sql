-- Create booking_requests table to handle booking workflow
CREATE TABLE public.booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requested_date DATE NOT NULL,
  requested_time TIME NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('online', 'in-person')),
  duration INTEGER NOT NULL DEFAULT 60, -- minutes
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
  rejected_reason TEXT,
  payment_required BOOLEAN NOT NULL DEFAULT true,
  payment_amount NUMERIC(10,2),
  currency TEXT DEFAULT 'NGN',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for booking_requests
CREATE POLICY "Clients can create their own booking requests" 
ON public.booking_requests 
FOR INSERT 
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can view their own booking requests" 
ON public.booking_requests 
FOR SELECT 
USING (auth.uid() = client_id);

CREATE POLICY "Therapists can view requests made to them" 
ON public.booking_requests 
FOR SELECT 
USING (auth.uid() = therapist_id);

CREATE POLICY "Therapists can update requests made to them" 
ON public.booking_requests 
FOR UPDATE 
USING (auth.uid() = therapist_id);

CREATE POLICY "Clients can cancel their own pending requests" 
ON public.booking_requests 
FOR UPDATE 
USING (auth.uid() = client_id AND status = 'pending');

-- Create payment_intents table for tracking payments
CREATE TABLE public.payment_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_request_id UUID NOT NULL REFERENCES public.booking_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  payment_method TEXT NOT NULL DEFAULT 'paystack',
  payment_reference TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security for payment_intents
ALTER TABLE public.payment_intents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payment intents" 
ON public.payment_intents 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Therapists can view payment intents for their sessions" 
ON public.payment_intents 
FOR SELECT 
USING (auth.uid() = therapist_id);

-- Create video_sessions table for video call management
CREATE TABLE public.video_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id TEXT NOT NULL UNIQUE,
  room_token TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'ended')),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security for video_sessions
ALTER TABLE public.video_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view their video sessions" 
ON public.video_sessions 
FOR SELECT 
USING (auth.uid() = client_id OR auth.uid() = therapist_id);

CREATE POLICY "Participants can update their video sessions" 
ON public.video_sessions 
FOR UPDATE 
USING (auth.uid() = client_id OR auth.uid() = therapist_id);

-- Update existing appointments table to link with booking_requests
ALTER TABLE public.appointments 
ADD COLUMN booking_request_id UUID REFERENCES public.booking_requests(id) ON DELETE SET NULL;

-- Create function to update booking_requests updated_at
CREATE OR REPLACE FUNCTION public.update_booking_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for booking_requests
CREATE TRIGGER update_booking_requests_updated_at
BEFORE UPDATE ON public.booking_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_booking_requests_updated_at();

-- Create function to create appointment when booking is accepted
CREATE OR REPLACE FUNCTION public.handle_booking_acceptance()
RETURNS TRIGGER AS $$
BEGIN
    -- Only proceed if status changed to 'accepted'
    IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
        -- Create appointment
        INSERT INTO public.appointments (
            client_id,
            therapist_id,
            start_time,
            end_time,
            session_type,
            status,
            booking_request_id
        ) VALUES (
            NEW.client_id,
            NEW.therapist_id,
            (NEW.requested_date::TEXT || ' ' || NEW.requested_time::TEXT)::TIMESTAMPTZ,
            (NEW.requested_date::TEXT || ' ' || NEW.requested_time::TEXT)::TIMESTAMPTZ + INTERVAL '1 hour' * (NEW.duration / 60.0),
            NEW.session_type,
            'scheduled',
            NEW.id
        );

        -- Create notification for client
        INSERT INTO public.notifications (
            id,
            user_id,
            title,
            message,
            type,
            action_url
        ) VALUES (
            gen_random_uuid(),
            NEW.client_id,
            'Booking Accepted',
            'Your booking request has been accepted by the therapist.',
            'booking_accepted',
            '/client/appointments'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for booking acceptance
CREATE TRIGGER handle_booking_acceptance
AFTER UPDATE ON public.booking_requests
FOR EACH ROW
EXECUTE FUNCTION public.handle_booking_acceptance();

-- Create function to handle appointment cancellation
CREATE OR REPLACE FUNCTION public.handle_appointment_cancellation()
RETURNS TRIGGER AS $$
BEGIN
    -- When appointment is cancelled, create notifications
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
        -- Notify client if therapist cancelled
        IF auth.uid() = NEW.therapist_id THEN
            INSERT INTO public.notifications (
                id,
                user_id,
                title,
                message,
                type,
                action_url
            ) VALUES (
                gen_random_uuid(),
                NEW.client_id,
                'Appointment Cancelled',
                'Your therapist has cancelled the appointment.',
                'appointment_cancelled',
                '/client/appointments'
            );
        END IF;
        
        -- Notify therapist if client cancelled
        IF auth.uid() = NEW.client_id THEN
            INSERT INTO public.notifications (
                id,
                user_id,
                title,
                message,
                type,
                action_url
            ) VALUES (
                gen_random_uuid(),
                NEW.therapist_id,
                'Appointment Cancelled',
                'The client has cancelled the appointment.',
                'appointment_cancelled',
                '/therapist/appointments'
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for appointment cancellation
CREATE TRIGGER handle_appointment_cancellation
AFTER UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.handle_appointment_cancellation();
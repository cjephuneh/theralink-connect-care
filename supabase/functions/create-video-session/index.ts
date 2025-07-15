import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const { appointmentId } = await req.json();

    if (!appointmentId) {
      throw new Error('Appointment ID is required');
    }

    // Get appointment details
    const { data: appointment, error: appointmentError } = await supabaseClient
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .single();

    if (appointmentError || !appointment) {
      throw new Error('Appointment not found');
    }

    // Check if video session already exists
    const { data: existingSession } = await supabaseClient
      .from('video_sessions')
      .select('*')
      .eq('appointment_id', appointmentId)
      .single();

    if (existingSession) {
      return new Response(
        JSON.stringify({ 
          roomId: existingSession.room_id,
          sessionId: existingSession.id 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Create new video session
    const roomId = `room_${appointmentId}_${Date.now()}`;
    
    const { data: videoSession, error: sessionError } = await supabaseClient
      .from('video_sessions')
      .insert({
        appointment_id: appointmentId,
        client_id: appointment.client_id,
        therapist_id: appointment.therapist_id,
        room_id: roomId,
        status: 'scheduled'
      })
      .select()
      .single();

    if (sessionError) throw sessionError;

    // Create notifications for both participants
    await Promise.all([
      supabaseClient
        .from('notifications')
        .insert({
          id: crypto.randomUUID(),
          user_id: appointment.client_id,
          title: 'Video Session Ready',
          message: 'Your video session is ready to join.',
          type: 'video_session',
          action_url: `/video/${appointmentId}`
        }),
      supabaseClient
        .from('notifications')
        .insert({
          id: crypto.randomUUID(),
          user_id: appointment.therapist_id,
          title: 'Video Session Ready',
          message: 'Your video session is ready to join.',
          type: 'video_session',
          action_url: `/video/${appointmentId}`
        })
    ]);

    return new Response(
      JSON.stringify({ 
        roomId: videoSession.room_id,
        sessionId: videoSession.id 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error creating video session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
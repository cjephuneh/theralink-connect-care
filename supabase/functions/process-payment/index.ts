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

    const { bookingRequestId, paymentReference } = await req.json();

    if (!bookingRequestId || !paymentReference) {
      throw new Error('Missing required parameters');
    }

    // Get the booking request
    const { data: bookingRequest, error: bookingError } = await supabaseClient
      .from('booking_requests')
      .select('*')
      .eq('id', bookingRequestId)
      .single();

    if (bookingError || !bookingRequest) {
      throw new Error('Booking request not found');
    }

    // Update payment intent status
    const { error: paymentError } = await supabaseClient
      .from('payment_intents')
      .update({
        status: 'completed',
        payment_reference: paymentReference
      })
      .eq('booking_request_id', bookingRequestId);

    if (paymentError) throw paymentError;

    // Create transaction record
    const { error: transactionError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: bookingRequest.client_id,
        therapist_id: bookingRequest.therapist_id,
        amount: bookingRequest.payment_amount,
        transaction_type: 'payment',
        reference: paymentReference,
        status: 'completed',
        description: `Payment for therapy session - ${bookingRequest.session_type}`
      });

    if (transactionError) throw transactionError;

    // Create notification for successful payment
    await supabaseClient
      .from('notifications')
      .insert({
        id: crypto.randomUUID(),
        user_id: bookingRequest.client_id,
        title: 'Payment Processed',
        message: 'Your payment has been processed successfully. The therapist will be notified.',
        type: 'payment_success'
      });

    return new Response(
      JSON.stringify({ success: true, message: 'Payment processed successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error processing payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://oavljdrqfzliikfncrdd.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();

    switch (action) {
      case "initialize_transaction":
        return handleInitializeTransaction(data);
      case "verify_transaction":
        return handleVerifyTransaction(data);
      case "withdraw":
        return handleWithdraw(data);
      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function handleInitializeTransaction(data) {
  const { email, amount, callback_url, metadata } = data;

  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${paystackSecretKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      amount: amount * 100, // Paystack expects amount in kobo (100 kobo = 1 Naira)
      callback_url,
      metadata
    })
  });

  const responseData = await response.json();

  if (!responseData.status) {
    return new Response(
      JSON.stringify({ error: responseData.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Create transaction record in database
  const { error } = await supabase.from('transactions').insert({
    user_id: metadata.user_id,
    therapist_id: metadata.therapist_id || null,
    amount: amount,
    transaction_type: "deposit",
    reference: responseData.data.reference,
    status: "pending",
    description: metadata.description || "Wallet funding"
  });

  if (error) {
    console.error("Error creating transaction record:", error);
  }

  return new Response(
    JSON.stringify(responseData),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function handleVerifyTransaction(data) {
  const { reference } = data;

  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${paystackSecretKey}`,
      'Content-Type': 'application/json'
    }
  });

  const responseData = await response.json();

  if (!responseData.status) {
    return new Response(
      JSON.stringify({ error: responseData.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // If transaction is successful, update the transaction status and user's wallet
  if (responseData.data.status === "success") {
    // Get transaction record
    const { data: transactionData, error: transactionError } = await supabase
      .from('transactions')
      .select('*')
      .eq('reference', reference)
      .single();

    if (transactionError) {
      console.error("Error fetching transaction:", transactionError);
      return new Response(
        JSON.stringify({ error: "Transaction record not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update transaction status
    const { error: updateError } = await supabase
      .from('transactions')
      .update({ status: 'completed' })
      .eq('reference', reference);

    if (updateError) {
      console.error("Error updating transaction:", updateError);
    }

    // Update user wallet balance
    const { error: walletError } = await supabase.rpc('add_funds_to_wallet', {
      p_user_id: transactionData.user_id,
      p_amount: transactionData.amount
    });

    if (walletError) {
      console.error("Error updating wallet:", walletError);
      return new Response(
        JSON.stringify({ error: "Failed to update wallet balance" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }

  return new Response(
    JSON.stringify(responseData),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function handleWithdraw(data) {
  const { user_id, amount, therapist_id, appointment_id } = data;

  // Check if user has sufficient balance
  const { data: walletData, error: walletError } = await supabase
    .from('wallets')
    .select('balance')
    .eq('user_id', user_id)
    .single();

  if (walletError) {
    return new Response(
      JSON.stringify({ error: "Wallet not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (walletData.balance < amount) {
    return new Response(
      JSON.stringify({ error: "Insufficient balance" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Create transaction record for payment
  const reference = `payment_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  
  const { data: transactionData, error: transactionError } = await supabase
    .from('transactions')
    .insert({
      user_id,
      therapist_id,
      amount,
      transaction_type: "payment",
      reference,
      status: "completed",
      description: `Payment for session with therapist`
    })
    .select()
    .single();

  if (transactionError) {
    console.error("Error creating transaction:", transactionError);
    return new Response(
      JSON.stringify({ error: "Failed to create transaction" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Update appointment with payment info if an appointment ID is provided
  if (appointment_id) {
    const { error: appointmentError } = await supabase
      .from('appointments')
      .update({ payment_id: transactionData.id })
      .eq('id', appointment_id);

    if (appointmentError) {
      console.error("Error updating appointment:", appointmentError);
    }
  }

  // Deduct the amount from the user's wallet
  const { error: deductError } = await supabase.rpc('deduct_funds_from_wallet', {
    p_user_id: user_id,
    p_amount: amount
  });

  if (deductError) {
    console.error("Error deducting from wallet:", deductError);
    return new Response(
      JSON.stringify({ error: "Failed to process payment" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: "Payment processed successfully", 
      transaction_id: transactionData.id 
    }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

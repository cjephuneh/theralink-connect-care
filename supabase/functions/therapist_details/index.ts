
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TherapistDetailsData {
  therapistId: string;
  education: string;
  licenseNumber: string;
  licenseType: string;
  therapyApproaches: string;
  languages: string;
  insuranceInfo: string;
  sessionFormats: string;
  hasInsurance: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 200 });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      throw new Error("Missing Supabase environment variables");
    }

    // Create a Supabase client with the Auth context of the logged in user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get the JWT token from the auth header
    const token = authHeader.replace("Bearer ", "");
    
    // Verify the user with the admin client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
    const { data: user, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error("Invalid user token");
    }

    // Parse the request body
    const data: TherapistDetailsData = await req.json();
    
    // Call the insert_therapist_details function
    const { error } = await supabaseAdmin.rpc("insert_therapist_details", {
      p_therapist_id: data.therapistId,
      p_education: data.education,
      p_license_number: data.licenseNumber,
      p_license_type: data.licenseType,
      p_therapy_approaches: data.therapyApproaches,
      p_languages: data.languages,
      p_insurance_info: data.insuranceInfo,
      p_session_formats: data.sessionFormats,
      p_has_insurance: data.hasInsurance
    });

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, message: "Therapist details saved successfully" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error saving therapist details:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});

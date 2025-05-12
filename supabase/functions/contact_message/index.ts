
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  userId?: string | null;
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

    // Create a Supabase client with the service role key for admin access
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Parse the request body
    const data: ContactFormData = await req.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.subject || !data.message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    // Call the insert_contact_message function
    const { error } = await supabaseAdmin.rpc("insert_contact_message", {
      p_name: data.name,
      p_email: data.email,
      p_subject: data.subject,
      p_message: data.message,
      p_user_id: data.userId || null
    });

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, message: "Message sent successfully" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});

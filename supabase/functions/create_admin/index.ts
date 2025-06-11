
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  // Get environment variables
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const adminEmail = "admin@theralink.com";
  const adminPassword = "TheraLink2025!";

  try {
    // First, try to create the admin user
    const { data: { user }, error: createUserError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: "TheraLink Admin",
        role: "admin"
      },
    });

    if (createUserError && !createUserError.message.includes("already registered")) {
      throw createUserError;
    }

    // Get the user ID (either from creation or existing user)
    let userId = user?.id;
    
    if (!userId) {
      // If user already exists, get their ID
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({
        email: adminEmail
      });
      
      if (listError) throw listError;
      
      if (users && users.length > 0) {
        userId = users[0].id;
      }
    }

    if (!userId) {
      throw new Error("Could not create or find admin user");
    }

    // Ensure the profile has the admin role
    const { error: upsertError } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        email: adminEmail,
        full_name: "TheraLink Admin",
        role: "admin"
      }, {
        onConflict: "id"
      });

    if (upsertError) throw upsertError;

    return new Response(
      JSON.stringify({
        message: "Admin user ready",
        email: adminEmail,
        password: adminPassword,
        userId: userId
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Admin creation error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

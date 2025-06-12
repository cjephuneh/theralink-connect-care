
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
    console.log("=== ADMIN SETUP STARTING ===");
    
    // First, get all users to find existing admin
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error("Error listing users:", listError);
      throw listError;
    }
    
    console.log(`Found ${users?.length || 0} total users in system`);
    
    const existingUser = users?.find(user => user.email === adminEmail);
    let userId = existingUser?.id;
    let action = "";
    
    if (existingUser) {
      console.log(`Found existing user with ID: ${existingUser.id}`);
      action = "updated";
      
      // Delete the existing user first to ensure clean slate
      console.log("Deleting existing admin user to recreate...");
      const { error: deleteError } = await supabase.auth.admin.deleteUser(existingUser.id);
      
      if (deleteError) {
        console.error("Error deleting existing user:", deleteError);
        // Continue anyway, try to update
      } else {
        console.log("Successfully deleted existing user");
      }
    }
    
    // Always create a fresh admin user
    console.log("Creating fresh admin user...");
    const { data: { user }, error: createUserError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: "TheraLink Admin",
        role: "admin"
      },
    });

    if (createUserError) {
      console.error("Error creating user:", createUserError);
      throw createUserError;
    }
    
    if (!user?.id) {
      throw new Error("User creation succeeded but no user ID returned");
    }
    
    userId = user.id;
    console.log(`Successfully created admin user with ID: ${userId}`);

    // Ensure the profile has the admin role
    console.log("Creating/updating profile...");
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

    if (upsertError) {
      console.error("Error upserting profile:", upsertError);
      throw upsertError;
    }

    console.log("=== ADMIN SETUP COMPLETED SUCCESSFULLY ===");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Admin credentials are ready! You can now log in with the provided credentials.",
        email: adminEmail,
        password: adminPassword,
        userId: userId,
        action: existingUser ? "recreated" : "created",
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("=== ADMIN SETUP FAILED ===", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        details: "Check the function logs for more information",
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});


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
    console.log("Starting admin user creation/update process...");
    
    // First, try to find existing user by email
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error("Error listing users:", listError);
      throw listError;
    }
    
    const existingUser = users?.find(user => user.email === adminEmail);
    let userId = existingUser?.id;
    
    if (existingUser) {
      console.log("Found existing admin user, updating password...");
      
      // Update the existing user's password
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { 
          password: adminPassword,
          user_metadata: {
            full_name: "TheraLink Admin",
            role: "admin"
          }
        }
      );
      
      if (updateError) {
        console.error("Error updating user:", updateError);
        throw updateError;
      }
      
      console.log("Successfully updated existing user password");
    } else {
      console.log("Creating new admin user...");
      
      // Create new admin user
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
      
      userId = user?.id;
      console.log("Successfully created new admin user");
    }

    if (!userId) {
      throw new Error("Could not get user ID");
    }

    // Ensure the profile has the admin role
    console.log("Updating/creating profile...");
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

    console.log("Admin setup completed successfully!");

    return new Response(
      JSON.stringify({
        message: "Admin credentials are ready! You can now log in.",
        email: adminEmail,
        password: adminPassword,
        userId: userId,
        action: existingUser ? "updated" : "created"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Admin creation/update error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Check the function logs for more information"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

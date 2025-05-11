
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

serve(async (req) => {
  // Create Supabase admin client
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Create the admin user
    const { data: user, error: createError } = await supabase.auth.admin.createUser({
      email: "caleb@theralink.com",
      password: "thera!linked@1",
      email_confirm: true, // Auto confirm email
      user_metadata: {
        full_name: "Caleb Admin",
        role: "admin",
      },
    });

    if (createError) {
      throw createError;
    }

    // Update the profile data to ensure role is set to admin
    if (user) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", user.id);

      if (updateError) {
        throw updateError;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Admin user created successfully",
        user: user,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});


import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedOrigin =
  Deno.env.get("ALLOWED_ORIGIN") ?? "https://prashantshrestha410.com.np";

const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return Response.json(
      { error: "Method not allowed" },
      { status: 405, headers: corsHeaders }
    );
  }

  try {
    // 1. Verify authentication
    const authHeader = req.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json(
        { error: "Authentication required" },
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.slice(7);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase environment configuration is missing");
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user?.email_confirmed_at || !user.email) {
      return Response.json(
        { error: "Verified email required" },
        { status: 403, headers: corsHeaders }
      );
    }

    // 2. Read and validate form data
    const body = await req.json();

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const projectType = String(body.projectType ?? "Other").trim();
    const message = String(body.message ?? "").trim();
    const honeypot = String(body.website ?? "").trim();

    if (honeypot) {
      return Response.json(
        { success: true },
        { headers: corsHeaders }
      );
    }

    if (email !== user.email.toLowerCase()) {
      return Response.json(
        { error: "Verified email does not match" },
        { status: 403, headers: corsHeaders }
      );
    }

    if (
      name.length < 2 ||
      name.length > 100 ||
      message.length < 10 ||
      message.length > 5000 ||
      email.length > 254
    ) {
      return Response.json(
        { error: "Please check the form fields" },
        { status: 400, headers: corsHeaders }
      );
    }

    // 3. Check Resend configuration
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const recipient = Deno.env.get("CONTACT_TO_EMAIL");
    const from = Deno.env.get("CONTACT_FROM_EMAIL");

    if (!resendKey || !recipient || !from) {
      throw new Error("Email service configuration is missing");
    }

    // 4. Send contact notification through Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: email,
        subject: `Portfolio contact: ${name}`,
        text: `Name: ${name}
Email: ${email}
Project type: ${projectType}

Message:
${message}`,
      }),
    });

    // 5. Show actual Resend error in function logs
    if (!response.ok) {
      const resendError = await response.text();

      console.error(
        "Resend API error:",
        response.status,
        resendError
      );

      return Response.json(
        {
          error: "Email delivery failed",
          details: resendError,
        },
        { status: 502, headers: corsHeaders }
      );
    }

    const resendResult = await response.json();

    console.log("Resend accepted contact email:", resendResult.id);

    return Response.json(
      { success: true },
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error("Contact function error:", error);

    return Response.json(
      { error: "Unable to process your message right now" },
      { status: 500, headers: corsHeaders }
    );
  }
});
        

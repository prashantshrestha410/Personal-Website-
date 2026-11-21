
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
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char];
  });
}
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

    // Save contact message in Supabase
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!serviceRoleKey) {
  throw new Error("Database configuration is missing");
}

const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

const { error: dbError } = await supabaseAdmin
  .from("contact_messages")
  .insert({
    name,
    email,
    project_type: projectType,
    message,
  });

if (dbError) {
  console.error("Database save failed:", dbError);
  return Response.json(
    { error: "Could not save contact message" },
    { status: 500, headers: corsHeaders }
  );
}
    //act notification through Resend
    
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
  subject: `New Portfolio Inquiry — ${name}`,
  html: `
    <div style="background:#f5f2eb;padding:35px 15px;font-family:Arial,sans-serif;">
      <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e0d6;">

        <div style="background:#183f35;padding:28px 30px;color:#ffffff;">
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:2px;color:#d5b99a;">PORTFOLIO CONTACT</p>
          <h1 style="margin:0;font-size:25px;font-weight:600;">New message received</h1>
          <p style="margin:10px 0 0;color:#dce7df;font-size:14px;">Someone has contacted you through your website.</p>
        </div>

        <div style="padding:30px;">
          <h2 style="font-size:16px;color:#183f35;margin:0 0 18px;">Contact Details</h2>

          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr>
              <td style="padding:12px 0;color:#777;border-bottom:1px solid #eee;width:115px;">Name</td>
              <td style="padding:12px 0;color:#222;border-bottom:1px solid #eee;font-weight:600;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;color:#777;border-bottom:1px solid #eee;">Email</td>
              <td style="padding:12px 0;border-bottom:1px solid #eee;">
                <a href="mailto:${escapeHtml(email)}" style="color:#b56e4c;text-decoration:none;">${escapeHtml(email)}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0;color:#777;">Project Type</td>
              <td style="padding:12px 0;color:#222;">${escapeHtml(projectType)}</td>
            </tr>
          </table>

          <h2 style="font-size:16px;color:#183f35;margin:28px 0 12px;">Message</h2>
          <div style="background:#f8f7f3;border-left:4px solid #b56e4c;padding:18px;border-radius:5px;color:#333;font-size:14px;line-height:1.7;white-space:pre-wrap;overflow-wrap:anywhere;">${escapeHtml(message)}</div>
        </div>

        <div style="background:#f8f7f3;padding:20px 30px;text-align:center;border-top:1px solid #eee;">
          <p style="margin:0;color:#777;font-size:12px;">Received through</p>
          <a href="https://prashantshrestha410.com.np" style="color:#183f35;font-size:13px;text-decoration:none;font-weight:600;">prashantshrestha410.com.np</a>
        </div>

      </div>
    </div>
  `
}),
      

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
        

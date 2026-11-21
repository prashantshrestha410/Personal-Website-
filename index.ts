import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") ?? "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405, headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return Response.json({ error: "Authentication required" }, { status: 401, headers: corsHeaders });
    const token = authHeader.slice(7);
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user?.email_confirmed_at || !user.email) return Response.json({ error: "Verified email required" }, { status: 403, headers: corsHeaders });

    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const projectType = String(body.projectType ?? "Other").trim();
    const message = String(body.message ?? "").trim();
    const honeypot = String(body.website ?? "").trim();
    if (honeypot) return Response.json({ success: true }, { headers: corsHeaders });
    if (email !== user.email.toLowerCase()) return Response.json({ error: "Verified email does not match" }, { status: 403, headers: corsHeaders });
    if (name.length < 2 || name.length > 100 || message.length < 10 || message.length > 5000 || email.length > 254) {
      return Response.json({ error: "Please check the form fields" }, { status: 400, headers: corsHeaders });
    }

    const resendKey = Deno.env.get("RESEND_API_KEY");
    const recipient = Deno.env.get("CONTACT_TO_EMAIL");
    const from = Deno.env.get("CONTACT_FROM_EMAIL");
    if (!resendKey || !recipient || !from) throw new Error("Email service is not configured");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: email,
        subject: `Portfolio contact: ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nProject type: ${projectType}\n\nMessage:\n${message}`
      })
    });
    if (!response.ok) return Response.json({ error: "Email delivery failed" }, { status: 502, headers: corsHeaders });
    return Response.json({ success: true }, { headers: corsHeaders });
  } catch (_error) {
    return Response.json({ error: "Unable to process your message right now" }, { status: 500, headers: corsHeaders });
  }
});

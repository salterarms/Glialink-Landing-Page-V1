// ============================================================
// Calendly Webhook Handler
// ============================================================
// Receives booking events from Calendly and logs invitee data.
//
// Required env vars (server-only, no NEXT_PUBLIC_ prefix):
//   CALENDLY_WEBHOOK_SECRET   — from Calendly > Integrations > Webhooks
//
// Optional (for future Supabase write — see TODO below):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//
// Calendly webhook setup:
//   https://calendly.com/integrations/webhooks
//   Endpoint: https://glialink.com/api/calendly/webhook
//   Events: invitee.created, invitee.canceled
// ============================================================

import { createHmac, timingSafeEqual } from "crypto";
import { z } from "zod";
import { checkRateLimit } from "@/lib/ratelimit";

// ---------------------------------------------------------------------------
// Payload schema — validates the shape of what Calendly sends
// ---------------------------------------------------------------------------
const QuestionAnswerSchema = z.object({
  question: z.string(),
  answer: z.string().optional().default(""),
});

const InviteeSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  created_at: z.string(),
  canceled: z.boolean().optional().default(false),
  questions_and_answers: z.array(QuestionAnswerSchema).optional().default([]),
});

const WebhookPayloadSchema = z.object({
  event: z.enum(["invitee.created", "invitee.canceled"]),
  payload: z.object({
    event: z.string().url(), // Calendly event resource URI
    invitee: InviteeSchema,
  }),
});

// ---------------------------------------------------------------------------
// Signature verification
// ---------------------------------------------------------------------------
function verifySignature(
  rawBody: string,
  signatureHeader: string,
  secret: string
): boolean {
  // Calendly header format: "t=<timestamp>,v1=<hmac>"
  const parts = Object.fromEntries(
    signatureHeader.split(",").map((p) => p.split("=") as [string, string])
  );

  const timestamp = parts["t"];
  const receivedSig = parts["v1"];

  if (!timestamp || !receivedSig) return false;

  // Replay attack prevention — reject if older than 5 minutes
  const ageMs = Date.now() - parseInt(timestamp, 10) * 1000;
  if (ageMs > 5 * 60 * 1000) return false;

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  try {
    return timingSafeEqual(
      Buffer.from(receivedSig, "hex"),
      Buffer.from(expected, "hex")
    );
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------
export async function POST(req: Request) {
  // 1. Rate limit by IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  // 2. Read raw body (must be text for HMAC verification)
  const rawBody = await req.text();

  // 3. Verify Calendly webhook signature
  const secret = process.env.CALENDLY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[calendly/webhook] CALENDLY_WEBHOOK_SECRET is not set");
    return Response.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const signatureHeader = req.headers.get("calendly-webhook-signature") ?? "";
  if (!verifySignature(rawBody, signatureHeader, secret)) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  // 4. Parse and validate payload
  let parsed;
  try {
    parsed = WebhookPayloadSchema.parse(JSON.parse(rawBody));
  } catch (err) {
    console.error("[calendly/webhook] Invalid payload shape:", err);
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { event, payload } = parsed;
  const { name, email, created_at, questions_and_answers } = payload.invitee;

  console.log(`[calendly/webhook] ${event}`, {
    name,
    email,
    created_at,
    questions_and_answers,
  });

  // 5. Handle events
  if (event === "invitee.created") {
    // TODO: Write to Supabase when ready, e.g.:
    //   await supabase.from("bookings").insert({ name, email, created_at, questions_and_answers });
    //
    // For now, booking data is visible in:
    //   - Calendly dashboard (Scheduled Events > click invitee)
    //   - Server logs above
    //   - Calendly API: GET /scheduled_events/{uuid}/invitees

    console.log(`[calendly/webhook] New booking — ${name} <${email}>`);
  }

  if (event === "invitee.canceled") {
    // TODO: Update Supabase record if/when stored
    console.log(`[calendly/webhook] Canceled booking — ${name} <${email}>`);
  }

  return Response.json({ received: true }, { status: 200 });
}

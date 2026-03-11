// ============================================================
// Calendly Manual Polling Sync
// ============================================================
// Polls Calendly API for new bookings and stores them in Supabase.
// Call this endpoint on a schedule (e.g., via cron or Vercel Functions).
//
// Required env vars (server-only, no NEXT_PUBLIC_ prefix):
//   CALENDLY_ACCESS_TOKEN — from Calendly > Integrations > API Webhooks > Personal Access Tokens
//   CALENDLY_USER_URI — your Calendly user URI (e.g., "users/abc123def456")
//   NEXT_PUBLIC_SUPABASE_URL — your Supabase project URL
//   SUPABASE_SERVICE_ROLE_KEY — your Supabase service role key
//
// To call this endpoint periodically:
//   Option A: Use Vercel Cron Functions (Hobby/Pro plan): Call GET /api/calendly/sync
//   Option B: Use external service (EasyCron, Cron-job.org, etc.)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const calendlyToken = process.env.CALENDLY_ACCESS_TOKEN;
const calendlyUserUri = process.env.CALENDLY_USER_URI;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "⚠️ Supabase not configured. See SUPABASE_SETUP.md"
  );
}

if (!calendlyToken || !calendlyUserUri) {
  console.warn(
    "⚠️ Calendly not configured. See .env.example for CALENDLY_ACCESS_TOKEN and CALENDLY_USER_URI"
  );
}

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * GET /api/calendly/sync
 * Fetches events from Calendly and syncs invitees to Supabase
 */
export async function GET(request: NextRequest) {
  // Optional: Verify a secret header to prevent unauthorized calls
  const authHeader = request.headers.get("x-sync-secret");
  const expectedSecret = process.env.CALENDLY_SYNC_SECRET;
  
  if (expectedSecret && authHeader !== expectedSecret) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Validate configuration
  if (!calendlyToken || !calendlyUserUri) {
    return NextResponse.json(
      {
        error: "Calendly not configured",
        message: "Set CALENDLY_ACCESS_TOKEN and CALENDLY_USER_URI in environment variables",
      },
      { status: 500 }
    );
  }

  if (!supabase) {
    return NextResponse.json(
      {
        error: "Supabase not configured",
        message: "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY",
      },
      { status: 500 }
    );
  }

  try {
    console.log("[calendly/sync] Starting sync...");

    // Fetch all scheduled events for the user
    // Format: https://api.calendly.com/scheduled_events?user=https://api.calendly.com/users/UUID
    const userUri = `https://api.calendly.com/${calendlyUserUri}`;
    const scheduledEventsResponse = await fetch(
      `https://api.calendly.com/scheduled_events?user=${encodeURIComponent(userUri)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${calendlyToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!scheduledEventsResponse.ok) {
      throw new Error(`Calendly API error: ${scheduledEventsResponse.statusText}`);
    }

    const scheduledEventsData = (await scheduledEventsResponse.json()) as {
      collection: Array<{
        uri: string;
        name: string;
        start_time: string;
        end_time: string;
        status: string;
      }>;
    };

    const scheduledEvents = scheduledEventsData.collection || [];
    let totalSynced = 0;

    // For each scheduled event, fetch invitees
    for (const event of scheduledEvents) {
      const eventUri = event.uri;
      const eventName = event.name;
      const eventStartTime = event.start_time;

      // Fetch invitees for this scheduled event
      // Format: https://api.calendly.com/scheduled_events/{event-uuid}/invitees
      const inviteesResponse = await fetch(
        `${eventUri}/invitees`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${calendlyToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!inviteesResponse.ok) {
        console.warn(`Failed to fetch invitees for event ${eventName}`);
        continue;
      }

      const inviteesData = (await inviteesResponse.json()) as {
        collection: Array<{
          uri: string;
          created_at: string;
          email: string;
          name: string;
          status: string;
        }>;
      };

      const invitees = inviteesData.collection || [];

      // Only sync "active" (confirmed) bookings
      const activeInvitees = invitees.filter((inv) => inv.status === "active");

      for (const invitee of activeInvitees) {
        try {
          await supabase.from("calendly_bookings").upsert(
            {
              calendly_id: invitee.uri,
              name: invitee.name,
              email: invitee.email,
              booked_at: eventStartTime,
              event_name: eventName,
              event_uri: eventUri,
              synced_at: new Date().toISOString(),
            },
            { onConflict: "calendly_id" }
          );

          totalSynced++;
          console.log(`✅ Synced: ${invitee.name} <${invitee.email}>`);
        } catch (err) {
          console.error(`❌ Failed to sync invitee ${invitee.email}:`, err);
        }
      }
    }

    console.log(`[calendly/sync] ✅ Sync complete. Total synced: ${totalSynced}`);

    return NextResponse.json(
      {
        success: true,
        message: `Successfully synced ${totalSynced} bookings`,
        synced: totalSynced,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[calendly/sync] ❌ Error:", error);
    return NextResponse.json(
      {
        error: "Sync failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Optional: POST endpoint for manual triggers
 */
export async function POST(request: NextRequest) {
  // Same logic as GET, just for manual POST requests
  return GET(request);
}

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/survey
 * Stores post-signup survey responses in Supabase.
 *
 * Responses are stored as JSONB so new questions can be added at any time
 * without database migrations. The email field links back to email_signups.
 *
 * Current expected fields (all optional beyond email):
 *   careerStage, field, institutionType, biggestChallenge
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase not configured. See SUPABASE_SETUP.md');
}

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Keys we strip from the JSONB blob (handled as top-level columns or metadata)
const META_KEYS = new Set(['email', 'variant', 'timestamp', 'user_agent']);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ── Validate email ────────────────────────────────────────────────────
    if (!body.email || typeof body.email !== 'string' || !body.email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const email = body.email.toLowerCase().trim();

    if (!supabase) {
      console.log(`📋 Survey (no backend): ${email}`);
      return NextResponse.json(
        { success: true, message: 'Supabase not configured', email },
        { status: 201 }
      );
    }

    // ── Build JSONB response blob ─────────────────────────────────────────
    // Explicitly pull known fields first so they're always present,
    // then spread any additional fields the form might add in future.
    const responses: Record<string, unknown> = {
      careerStage:      body.careerStage      || null,
      field:            body.field            || null,
      institutionType:  body.institutionType  || null,
      biggestChallenge: body.biggestChallenge || null,
    };

    // Catch any future fields automatically (forward-compatible)
    for (const [key, value] of Object.entries(body)) {
      if (!META_KEYS.has(key) && !(key in responses)) {
        responses[key] = value;
      }
    }

    // ── Insert ────────────────────────────────────────────────────────────
    const { data, error } = await supabase
      .from('survey_responses')
      .insert([
        {
          email,
          responses,
          variant: body.variant || 'control',
        },
      ])
      .select('id, email, created_at');

    if (error) {
      console.error('❌ Supabase insert error:', error);
      throw error;
    }

    console.log(`✅ Survey saved: ${email}`);

    return NextResponse.json(
      {
        success: true,
        id: data[0].id,
        email: data[0].email,
        timestamp: data[0].created_at,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error in /api/survey:', error);
    return NextResponse.json({ error: 'Failed to save survey' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, { status: 200 });
}

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/signup
 * Stores waitlist signups (name, institution, email, phone) + UTM metadata.
 *
 * Required fields: name, institution, email
 * Optional fields: phone, utm_*, referrer, user_agent, variant
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase not configured. See SUPABASE_SETUP.md');
}

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Sanitize a plain text string — trim + cap length
function sanitizeText(value: unknown, maxLen = 255): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim().slice(0, maxLen);
  return trimmed || null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ── Validate required fields ──────────────────────────────────────────
    const email = sanitizeText(body.email, 255)?.toLowerCase();
    if (!email || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const name = sanitizeText(body.name, 255);
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const institution = sanitizeText(body.institution, 255);
    if (!institution) {
      return NextResponse.json({ error: 'Institution is required' }, { status: 400 });
    }

    // ── Optional fields ───────────────────────────────────────────────────
    // Phone: store as-is (formats vary globally), trim only
    const phone = sanitizeText(body.phone, 30);

    // If Supabase not configured, log and return success gracefully
    if (!supabase) {
      console.log(`📧 Signup (no backend): ${name} <${email}> — ${institution}`);
      return NextResponse.json(
        { success: true, message: 'Supabase not configured', email },
        { status: 201 }
      );
    }

    // ── Insert ────────────────────────────────────────────────────────────
    const { data, error } = await supabase
      .from('email_signups')
      .insert([
        {
          name,
          institution,
          email,
          phone,                                    // nullable
          variant:      body.variant      || 'control',
          utm_source:   body.utm_source   || null,
          utm_medium:   body.utm_medium   || null,
          utm_campaign: body.utm_campaign || null,
          utm_term:     body.utm_term     || null,
          utm_content:  body.utm_content  || null,
          referrer:     body.referrer     || null,
          user_agent:   body.user_agent   || null,
        },
      ])
      .select('id, email, created_at');

    if (error) {
      // Duplicate email → friendly message (unique constraint violation = code 23505)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This email is already on the waitlist.' },
          { status: 409 }
        );
      }
      console.error('❌ Supabase insert error:', error);
      throw error;
    }

    console.log(`✅ Signup saved: ${name} <${email}>`);

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
    console.error('❌ Error in /api/signup:', error);
    return NextResponse.json({ error: 'Failed to save signup' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, { status: 200 });
}

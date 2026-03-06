import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/signup
 * Stores email signup with UTM parameters in Supabase
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase not configured. See SUPABASE_SETUP.md');
}

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate email
    if (!body.email || typeof body.email !== 'string' || !body.email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const email = body.email.toLowerCase().trim();

    // If Supabase not configured, still return success
    if (!supabase) {
      console.log(`📧 Email signup (no backend): ${email}`);
      return NextResponse.json(
        {
          success: true,
          message: 'Supabase not configured',
          email,
        },
        { status: 201 }
      );
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('email_signups')
      .insert([
        {
          email,
          variant: body.variant || 'control',
          utm_source: body.utm_source || null,
          utm_medium: body.utm_medium || null,
          utm_campaign: body.utm_campaign || null,
          utm_term: body.utm_term || null,
          utm_content: body.utm_content || null,
          referrer: body.referrer || null,
          user_agent: body.user_agent || null,
        },
      ])
      .select();

    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }

    console.log(`✅ Signup saved: ${email}`);

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
    console.error('❌ Error:', error);
    return NextResponse.json(
      { error: 'Failed to save signup' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, { status: 200 });
}

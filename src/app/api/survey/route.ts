import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/survey
 * Stores survey responses with flexible JSONB in Supabase
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
      console.log(`📋 Survey response (no backend): ${email}`);
      return NextResponse.json(
        {
          success: true,
          message: 'Supabase not configured',
          email,
        },
        { status: 201 }
      );
    }

    // Build flexible responses object
    const responses = {
      careerStage: body.careerStage,
      field: body.field,
      interestReason: body.interestReason,
      institutionType: body.institutionType,
      // Any additional fields automatically stored
      ...Object.entries(body).reduce((acc, [key, value]) => {
        if (!['email', 'variant', 'timestamp'].includes(key)) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, unknown>),
    };

    // Insert into Supabase
    const { data, error } = await supabase
      .from('survey_responses')
      .insert([
        {
          email,
          responses,
          variant: body.variant || 'control',
        },
      ])
      .select();

    if (error) {
      console.error('❌ Supabase error:', error);
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
    console.error('❌ Error:', error);
    return NextResponse.json(
      { error: 'Failed to save survey' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, { status: 200 });
}

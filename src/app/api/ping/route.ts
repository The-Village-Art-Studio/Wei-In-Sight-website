import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * KEEP-ALIVE PING ROUTE
 *
 * Called by a GitHub Actions cron job every 4 days to prevent
 * Supabase from auto-pausing the project (7-day inactivity limit on free tier).
 *
 * This endpoint makes an actual database query — that's the only thing
 * that counts as "activity" for Supabase's pause logic.
 *
 * Protected by CRON_SECRET to prevent external abuse.
 */
export async function GET(request: Request) {
  // ── Auth check ──────────────────────────────────────────────
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // ── Create a one-off Supabase client ────────────────────────
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({
      status: 'error',
      message: 'Supabase env vars not configured',
    }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // ── Execute a real DB query (the actual keep-alive) ─────────
  const timestamp = new Date().toISOString();

  const { data, error } = await supabase
    .from('site_settings')
    .select('id')
    .limit(1);

  if (error) {
    console.error('[keep-alive] Supabase query failed:', error.message);
    return NextResponse.json({
      status: 'error',
      timestamp,
      message: error.message,
    }, { status: 502 });
  }

  return NextResponse.json({
    status: 'active',
    ping: 'pong',
    timestamp,
    db_rows_returned: data?.length ?? 0,
    message: 'Supabase keep-alive: database pinged successfully',
  });
}

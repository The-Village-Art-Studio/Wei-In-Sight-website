import { NextResponse } from 'next/server';

/**
 * KEEP-ALIVE PING ROUTE
 * Purpose: This endpoint can be called by an external cron job (e.g., GitHub Actions, Cron-job.org)
 * to keep the Next.js server and the Supabase connection warm, preventing the project from auto-pausing.
 */
export async function GET() {
  const timestamp = new Date().toISOString();
  
  // In the future, we can add a simple database query here to ensure the DB connection is also warm.
  // e.g., await supabase.from('site_settings').select('id').limit(1);

  return NextResponse.json({
    status: 'active',
    ping: 'pong',
    timestamp,
    message: 'Supabase keep-alive active'
  }, { status: 200 });
}

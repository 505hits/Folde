import { NextResponse } from 'next/server';

// KIE requires a reachable callback URL for music generation. The dashboard
// polls KIE for the playable track, so acknowledging the callback is enough
// while keeping the provider's delivery reliable.
export async function POST(request) {
  try {
    const payload = await request.json().catch(() => null);
    console.info('KIE music callback received:', payload?.data?.task_id || payload?.taskId || 'unknown task');
  } catch (error) {
    console.warn('KIE music callback could not be read:', error);
  }
  return NextResponse.json({ received: true });
}

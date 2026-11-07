import { database, ownedOrder } from '@/lib/server-database';

export async function GET(request) {
  try {
    const params = new URL(request.url).searchParams;
    const slug = params.get('slug');
    if (!slug) return Response.json({ error: 'Wedding is required.' }, { status: 400 });
    const db = database();
    let order;
    if (params.get('preview') === 'true') {
      const access = await ownedOrder(request, slug, db);
      if (access.error) return Response.json({ error: access.error }, { status: access.status });
      order = access.order;
    } else {
      const result = await db.from('orders').select('slug,details,paid,status,plan,theme,couple').eq('slug', slug).maybeSingle();
      if (result.error) return Response.json({ error: 'Unable to load invitation.' }, { status: 503 });
      order = result.data;
      if (!order?.paid || order.status !== 'Live') return Response.json({ error: 'Invitation is not available.' }, { status: 404 });
    }
    if (!order) return Response.json({ error: 'Invitation not found.' }, { status: 404 });
    const details = { ...(params.get('preview') === 'true' ? order.details : (order.details?.publishedData || order.details)) };
    delete details._seatingPlan;
    delete details.publishedData;
    return Response.json({ invitation: { ...details, slug, themeId: details.themeId || order.theme } }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return Response.json({ error: 'Unable to load invitation.' }, { status: 503 }); }
}

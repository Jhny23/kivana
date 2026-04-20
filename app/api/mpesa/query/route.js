import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const checkoutRequestId = searchParams.get('checkoutRequestId');

    if (!checkoutRequestId) {
      return Response.json({ error: 'checkoutRequestId required' }, { status: 400 });
    }

    console.log('Polling for:', checkoutRequestId);

    // Check payment_confirmations table first — fastest signal
    const { data: confirmation } = await supabaseAdmin
      .from('payment_confirmations')
      .select('status, mpesa_receipt')
      .eq('checkout_request_id', checkoutRequestId)
      .maybeSingle();

    if (confirmation?.status === 'confirmed') {
      // Also get the order
      const { data: order } = await supabaseAdmin
        .from('orders')
        .select('id, status')
        .eq('payment_reference', checkoutRequestId)
        .maybeSingle();

      return Response.json({
        status: 'confirmed',
        orderId: order?.id || null,
        orderNumber: order ? `KIV-${order.id.slice(0, 8).toUpperCase()}` : null,
      });
    }

    // Check orders table
    const { data: order } = await supabaseAdmin
      .from('orders')
      .select('id, status, payment_reference')
      .eq('payment_reference', checkoutRequestId)
      .maybeSingle();

    console.log('Order status:', order?.status);

    if (order?.status === 'confirmed') {
      return Response.json({
        status: 'confirmed',
        orderId: order.id,
        orderNumber: `KIV-${order.id.slice(0, 8).toUpperCase()}`,
      });
    }

    if (order?.status === 'payment_failed') {
      return Response.json({ status: 'failed' });
    }

    return Response.json({ status: 'pending' });

  } catch (err) {
    console.error('Query error:', err.message);
    return Response.json({ status: 'pending' });
  }
}
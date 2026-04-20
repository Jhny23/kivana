import { getAccessToken } from '../token/route';
import { supabaseAdmin } from '@/lib/supabase';

function generateTimestamp() {
  const now    = new Date();
  const year   = now.getFullYear();
  const month  = String(now.getMonth() + 1).padStart(2, '0');
  const day    = String(now.getDate()).padStart(2, '0');
  const hour   = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hour}${minute}${second}`;
}

function generatePassword(timestamp) {
  const str = `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`;
  return Buffer.from(str).toString('base64');
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const checkoutRequestId = searchParams.get('checkoutRequestId');

    if (!checkoutRequestId) {
      return Response.json({ error: 'checkoutRequestId required' }, { status: 400 });
    }

    console.log('Querying status for:', checkoutRequestId);

    // Check database first
    const { data: order } = await supabaseAdmin
      .from('orders')
      .select('id, status, payment_reference')
      .or(`payment_reference.eq.${checkoutRequestId},payment_reference.ilike.%${checkoutRequestId}%`)
      .maybeSingle();

    console.log('DB order:', order);

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

    // Query Safaricom
    try {
      const token     = await getAccessToken();
      const timestamp = generateTimestamp();
      const password  = generatePassword(timestamp);

      const res = await fetch(
        'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            BusinessShortCode: process.env.MPESA_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            CheckoutRequestID: checkoutRequestId,
          }),
          cache: 'no-store',
        }
      );

      // Read as text first — Safaricom sometimes returns HTML on errors
      const text = await res.text();
      console.log('Safaricom query raw response:', text);

      // If it's not JSON, treat as pending
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.log('Safaricom returned non-JSON — treating as pending');
        return Response.json({ status: 'pending' });
      }

      console.log('Safaricom query parsed:', data);

      // Payment successful
      if (data.ResultCode === '0' || data.ResultCode === 0) {
        if (order) {
          await supabaseAdmin
            .from('orders')
            .update({ status: 'confirmed' })
            .eq('id', order.id);
        }
        return Response.json({
          status: 'confirmed',
          orderId: order?.id || null,
        });
      }

      // Cancelled
      if (data.ResultCode === '1032') {
        return Response.json({ status: 'cancelled' });
      }

      // Not processed yet
      if (data.errorCode === '500.001.1001') {
        return Response.json({ status: 'pending' });
      }

      // Still pending
      return Response.json({ status: 'pending' });

    } catch (safaricomErr) {
      console.error('Safaricom fetch error:', safaricomErr.message);
      // Don't fail — just keep polling
      return Response.json({ status: 'pending' });
    }

  } catch (err) {
    console.error('Query route error:', err.message);
    return Response.json({ status: 'pending' });
  }
}
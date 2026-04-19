import { getAccessToken } from '../token/route';
import { supabaseAdmin } from '@/lib/supabase';

function generateTimestamp() {
  const now = new Date();
  const year   = now.getFullYear();
  const month  = String(now.getMonth() + 1).padStart(2, '0');
  const day    = String(now.getDate()).padStart(2, '0');
  const hour   = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '00');
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
      return Response.json(
        { error: 'checkoutRequestId is required' },
        { status: 400 }
      );
    }

    // First check our database — if order is confirmed, payment succeeded
    const { data: order } = await supabaseAdmin
      .from('orders')
      .select('id, status, payment_reference')
      .eq('payment_reference', checkoutRequestId)
      .maybeSingle();

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

    // If not in DB yet — query Safaricom directly
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
      }
    );

    const data = await res.json();
    console.log('Query response:', data);

    // ResultCode 0 = success
    if (data.ResultCode === '0' || data.ResultCode === 0) {
      return Response.json({ status: 'confirmed' });
    }

    // 1032 = cancelled by user
    if (data.ResultCode === '1032') {
      return Response.json({ status: 'cancelled' });
    }

    // Still pending
    return Response.json({ status: 'pending' });

  } catch (err) {
    console.error('Query error:', err.message);
    return Response.json({ status: 'pending' });
  }
}
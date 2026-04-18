import { supabaseAdmin } from '@/lib/supabase';
import { sendOrderConfirmation, sendOrderNotification } from '@/lib/email';

export async function POST(request) {
  try {
    const body = await request.json();

    const { items, shipping, payment, subtotal, discount, shippingCost, tax, total } = body;

    if (!items || !shipping || !payment || !total) {
      return Response.json({ error: 'Missing required order fields' }, { status: 400 });
    }

    // 1. Save order to Supabase
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([{
        customer_name: `${shipping.firstName} ${shipping.lastName}`,
        customer_email: shipping.email,
        phone: shipping.phone,
        shipping,
        items,
        subtotal: parseFloat(subtotal),
        discount: parseFloat(discount || 0),
        shipping_cost: parseFloat(shippingCost || 0),
        tax: parseFloat(tax),
        total: parseFloat(total),
        payment_method: payment.method,
        payment_reference: payment.reference || payment.checkoutId || null,
        status: 'confirmed',
      }])
      .select()
      .single();

    if (orderError) {
      console.error('Error saving order:', orderError);
      return Response.json({ error: 'Could not save order' }, { status: 500 });
    }

    console.log('Order saved:', order.id);

    // 2. Decrement stock
    for (const item of items) {
      const { error: stockError } = await supabaseAdmin.rpc(
        'decrement_stock',
        { p_slug: item.slug, p_qty: item.qty }
      );
      if (stockError) console.error(`Stock error for ${item.slug}:`, stockError);
    }

    // 3. Send emails (non-blocking — don't fail the order if email fails)
    Promise.all([
      sendOrderConfirmation(order),
      sendOrderNotification(order),
    ]).catch(err => console.error('Email sending failed:', err));

    return Response.json({
      success: true,
      orderId: order.id,
      orderNumber: `KIV-${order.id.slice(0, 8).toUpperCase()}`,
    });

  } catch (err) {
    console.error('Orders API error:', err.message);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
import { supabaseAdmin } from '@/lib/supabase';
import { sendOrderConfirmation, sendOrderNotification } from '@/lib/email';

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('M-Pesa callback received:', JSON.stringify(body, null, 2));

    const stk = body?.Body?.stkCallback;

    if (!stk) {
      return Response.json({ ResultCode: 1, ResultDesc: 'Invalid callback' });
    }

    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stk;

    // ResultCode 0 = success, anything else = failed/cancelled
    if (ResultCode !== 0) {
      console.log(`Payment failed or cancelled: ${ResultDesc}`);

      // Update any pending order with this checkoutRequestId
      await supabaseAdmin
        .from('orders')
        .update({ status: 'payment_failed' })
        .eq('payment_reference', CheckoutRequestID);

      return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }
    // Store confirmation in a separate lightweight table
// so the frontend can pick it up even after timeout
await supabaseAdmin
  .from('payment_confirmations')
  .upsert([{
    checkout_request_id: CheckoutRequestID,
    status: 'confirmed',
    mpesa_receipt: mpesaReceiptNo,
    confirmed_at: new Date().toISOString(),
  }], { onConflict: 'checkout_request_id' });

    // Extract payment details from callback metadata
    const items    = CallbackMetadata?.Item || [];
    const getMeta  = name => items.find(i => i.Name === name)?.Value;

    const amount          = getMeta('Amount');
    const mpesaReceiptNo  = getMeta('MpesaReceiptNumber');
    const phoneNumber     = getMeta('PhoneNumber');
    const transactionDate = getMeta('TransactionDate');

    console.log('Payment successful:', {
      amount,
      mpesaReceiptNo,
      phoneNumber,
      CheckoutRequestID,
    });

    // Find the pending order by checkoutRequestId and confirm it
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'confirmed',
        payment_reference: mpesaReceiptNo,
      })
      .eq('payment_reference', CheckoutRequestID)
      .select()
      .single();

    if (orderError || !order) {
      console.error('Could not find order for CheckoutRequestID:', CheckoutRequestID);
      return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    console.log('Order confirmed:', order.id);

    // Send confirmation emails
    await Promise.all([
      sendOrderConfirmation(order),
      sendOrderNotification(order),
    ]);

    // Must respond with ResultCode 0 — tells Safaricom we received it
    return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' });

  } catch (err) {
    console.error('Callback error:', err.message);
    // Always return success to Safaricom — never let this fail
    return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }
}
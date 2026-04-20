import { getAccessToken } from '../token/route';

function generateTimestamp() {
  const now = new Date();
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

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, amount, orderReference } = body;

    if (!phone || !amount) {
      return Response.json(
        { error: 'Phone and amount are required' },
        { status: 400 }
      );
    }

    // Format phone — must be 254XXXXXXXXX
    let formattedPhone = phone.replace(/\D/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.slice(1);
    }
    if (formattedPhone.startsWith('+')) {
      formattedPhone = formattedPhone.slice(1);
    }

    // Amount must be a whole number
    const formattedAmount = Math.ceil(parseFloat(amount));

    const token     = await getAccessToken();
    const timestamp = generateTimestamp();
    const password  = generatePassword(timestamp);

    const stkBody = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: formattedAmount,
      PartyA: formattedPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: orderReference || 'HELB',
      TransactionDesc: 'Student Upkeep Payment',
    };

    console.log('STK Push request:', stkBody);

    const res = await fetch(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stkBody),
      }
    );

    const data = await res.json();
    console.log('STK Push response:', data);

    if (data.ResponseCode !== '0') {
      return Response.json(
        { error: data.errorMessage || data.ResponseDescription || 'STK push failed' },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      checkoutRequestId: data.CheckoutRequestID,
      merchantRequestId: data.MerchantRequestID,
    });

  } catch (err) {
    console.error('STK Push error:', err.message);
    return Response.json(
      { error: 'Failed to initiate M-Pesa payment' },
      { status: 500 }
    );
  }
}
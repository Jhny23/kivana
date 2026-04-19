export async function getAccessToken() {
  const credentials = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64');

  const res = await fetch(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    {
      method: 'GET',
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    }
  );

  const data = await res.json();

  if (!data.access_token) {
    throw new Error('Failed to get M-Pesa access token');
  }

  return data.access_token;
}
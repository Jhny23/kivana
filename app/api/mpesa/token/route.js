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
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }
  );

  const text = await res.text();
  console.log('Token response status:', res.status);
  console.log('Token response body:', text);

  if (!res.ok) {
    throw new Error(`Token request failed: ${res.status} — ${text}`);
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Token response is not JSON: ${text}`);
  }

  if (!data.access_token) {
    throw new Error(`No access token in response: ${text}`);
  }

  return data.access_token;
}
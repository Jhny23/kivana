import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Newsletter body received:', body);

    const { email } = body;

    if (!email || !email.includes('@')) {
      return Response.json({ error: 'Valid email required' }, { status: 400 });
    }

    console.log('Attempting to insert email:', email);
    console.log('supabaseAdmin:', supabaseAdmin ? 'exists' : 'UNDEFINED');

    const { data, error } = await supabaseAdmin
      .from('subscribers')
      .upsert([{ email, source: 'homepage' }], { onConflict: 'email' })
      .select();

    console.log('Insert result - data:', data, 'error:', error);

    if (error) {
      console.error('Supabase error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });

  } catch (err) {
    console.error('Caught error:', err.message, err.stack);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
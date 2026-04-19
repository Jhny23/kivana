import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return Response.json(
        { error: 'Valid email required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('subscribers')
      .upsert([{ email, source: 'homepage' }], { onConflict: 'email' });

    if (error) {
      console.error('Supabase error:', error);
      return Response.json(
        { error: 'Could not save subscriber' },
        { status: 500 }
      );
    }

    return Response.json({ success: true });

  } catch (err) {
    console.error('Newsletter route error:', err.message);
    return Response.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
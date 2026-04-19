import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return Response.json(
        { error: 'Name, email and message are required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('messages')
      .insert([{ name, email, subject, message }]);

    if (error) {
      console.error('Supabase error:', error);
      return Response.json(
        { error: 'Could not save message' },
        { status: 500 }
      );
    }

    return Response.json({ success: true });

  } catch (err) {
    console.error('Contact route error:', err.message);
    return Response.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
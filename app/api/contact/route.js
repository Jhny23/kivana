import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Notify you by email — reply goes straight to the customer
    resend.emails.send({
      from: 'Kivana Contact <onboarding@resend.dev>',
      to: 'jonnykimeu@gmail.com',
      replyTo: email,
      subject: `New message from ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;padding:32px;background:#F9EDEA;">
          <h2 style="font-family:Georgia,serif;color:#2A0800;margin:0 0 20px;">New Contact Message</h2>
          <p style="color:#775144;font-size:14px;margin:0 0 6px;"><strong>From:</strong> ${name}</p>
          <p style="color:#775144;font-size:14px;margin:0 0 6px;"><strong>Email:</strong> ${email}</p>
          <p style="color:#775144;font-size:14px;margin:0 0 20px;"><strong>Subject:</strong> ${subject || 'No subject'}</p>
          <div style="background:#fff;padding:20px;border-left:3px solid #C09891;">
            <p style="color:#2A0800;font-size:14px;line-height:1.8;margin:0;">${message}</p>
          </div>
          <p style="color:#9A8D96;font-size:12px;margin-top:20px;">
            Hit reply to respond directly to ${name}.
          </p>
        </div>
      `,
    }).catch(err => console.error('Contact notification error:', err));

    return Response.json({ success: true });

  } catch (err) {
    console.error('Contact route error:', err.message);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
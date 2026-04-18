import { saveMessage } from '@/lib/db';

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

    const saved = await saveMessage({ name, email, subject, message });

    if (!saved) {
      return Response.json(
        { error: 'Could not save message' },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    return Response.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
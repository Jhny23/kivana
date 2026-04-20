import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('slug, stock, price, name, badge, active')
      .eq('active', true);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ data });

  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
import { supabase } from './supabase';

// Fetch all active products
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('id');

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data;
}

// Fetch a single product by slug
export async function getProductBySlug(slug) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }
  return data;
}

// Fetch products by category
export async function getProductsByCategory(category) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .eq('category', category)
    .order('id');

  if (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
  return data;
}

// Save a new order — called from payment webhooks
export async function saveOrder(orderData) {
  const { data, error } = await supabaseAdmin.from('orders').insert([orderData]).select().single();
  if (error) {
    console.error('Error saving order:', error);
    return null;
  }
  return data;
}

// Decrement stock after a confirmed order
// Uses a transaction to prevent race conditions
export async function decrementStock(items) {
  for (const item of items) {
    const { error } = await supabaseAdmin.rpc('decrement_stock', {
      p_slug: item.slug,
      p_qty: item.qty,
    });
    if (error) console.error(`Stock error for ${item.slug}:`, error);
  }
}

// Save newsletter subscriber
export async function saveSubscriber(email, source = 'homepage') {
  const { error } = await supabaseAdmin
    .from('subscribers')
    .upsert([{ email, source }], { onConflict: 'email' });

  if (error) {
    console.error('Error saving subscriber:', error);
    return false;
  }
  return true;
}

// Save contact message
export async function saveMessage({ name, email, subject, message }) {
  const { error } = await supabaseAdmin
    .from('messages')
    .insert([{ name, email, subject, message }]);

  if (error) {
    console.error('Error saving message:', error);
    return false;
  }
  return true;
}
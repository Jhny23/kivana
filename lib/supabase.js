import { createClient } from '@supabase/supabase-js';

// Browser-safe client — uses the anon key
// Safe to use in client components and pages
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Server-only client — uses the service role key
// Only ever call this inside API routes (app/api/...)
// NEVER import this into a client component
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
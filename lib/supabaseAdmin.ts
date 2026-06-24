import { createClient } from '@supabase/supabase-js';

// Server-only admin client that bypasses Row Level Security.
// NEVER expose this in client-side code.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default supabaseAdmin;

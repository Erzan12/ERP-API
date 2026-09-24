import { createClient } from '@supabase/supabase-js';

export const SUPABASE_BUCKETS = {
  DOCUMENTS: 'documents',
  AVATARS: 'avatars',
};

// Use the SERVICE ROLE key on the backend (never expose this to the frontend).
// It bypasses Row Level Security, which is what you want for a trusted server.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_KEY exists:', !!process.env.SUPABASE_KEY);

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL and SUPABASE_KEY must be configured');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export function buildFileUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

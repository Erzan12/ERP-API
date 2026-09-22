import { createClient } from '@supabase/supabase-js';

export const SUPABASE_BUCKETS = {
    DOCUMENTS: 'documents',
    AVATARS: 'avatars',
};

// Use the SERVICE ROLE key on the backend (never expose this to the frontend).
// It bypasses Row Level Security, which is what you want for a trusted server.
export const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
);

export function buildFileUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
}
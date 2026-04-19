import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

/**
 * Supabase Client Scaffold
 * This will be fully initialized when environment variables are provided.
 * We use placeholders to ensure the build doesn't crash on Vercel when env vars are missing.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Shared types for the content model (based on DATABASE_SCHEMA_PLANNING.md)
export type SectionKey = 'sight' | 'sound' | 'touch' | 'voice' | 'dream' | 'heart' | 'pulse';

export interface ContentEntry {
  id: string;
  title: string;
  slug: string;
  section_key: SectionKey;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
}

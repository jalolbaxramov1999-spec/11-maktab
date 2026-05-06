import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export function getSupabase() {
  if (!supabaseClient) {
    let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mlkqvocrgkvkgrqzayag.supabase.co';
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_HiACTNbBX5iXbUCVNGecQw_82ll65Lc';

    // URL'ni tozalash: oxiridagi / yoki /rest/v1/ qismlarini olib tashlash
    supabaseUrl = supabaseUrl.replace(/\/$/, '').replace(/\/rest\/v1$/, '');

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase URL va Anon Key topilmadi. Iltimos, Secrets panelida VITE_SUPABASE_URL va VITE_SUPABASE_ANON_KEY o\'zgaruvchilarini sozlang.');
    }

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}

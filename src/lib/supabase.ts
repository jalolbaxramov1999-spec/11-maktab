import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export function getSupabase() {
  if (!supabaseClient) {
    let supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || 'https://mlkqvocrgkvkgrqzayag.supabase.co').trim();
    let supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_HiACTNbBX5iXbUCVNGecQw_82ll65Lc').trim();

    // URL'ni tozalash: oxiridagi / yoki /rest/v1/ qismlarini olib tashlash
    supabaseUrl = supabaseUrl.replace(/\/+$/, '').replace(/\/rest\/v1\/?$/, '');

    if (!supabaseUrl || supabaseUrl === 'undefined' || !supabaseAnonKey || supabaseAnonKey === 'undefined') {
      throw new Error(`Supabase URL bo'sh yoki noto'g'ri. URL: ${supabaseUrl.substring(0, 5)}... Key: ${supabaseAnonKey.substring(0, 5)}...`);
    }

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}

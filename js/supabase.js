// ─── Supabase credentials ─────────────────────────────────────────────────────
// Project URL: found in your Supabase dashboard URL bar
//   e.g. https://ztsoegzstbiyqpgbnztn.supabase.co
// Key: use the Publishable key (Settings → API Keys → Publishable key)
const SUPABASE_URL = 'https://ztsoegzstbiyqpgbnztn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_AC7hG1ET9EkONElCbFux3A_Zb4iD5v7';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


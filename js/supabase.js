// Credentials are loaded from js/config.js (gitignored)
// Copy js/config.example.js → js/config.js and fill in your values

const { createClient } = supabase;
const db = createClient(KIWI_SUPABASE_URL, KIWI_SUPABASE_KEY);

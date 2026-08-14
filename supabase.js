const SUPABASE_URL = "SUA_URL";
const SUPABASE_KEY = "SUA_ANON_KEY";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
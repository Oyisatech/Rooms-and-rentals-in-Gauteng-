// GAUTENG ROOMS & RENTALS
// Supabase connection

const SUPABASE_URL = "https://gspretktrrsqrxgomzro.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_0_9XD53jgUzwHCFHJ6FNpw_PEWn3vXC";

const client = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

window.supabaseClient = client;

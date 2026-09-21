import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAPI = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseAPI) {
  console.warn("[Resummetry] Supabase environment variables are not configured.");
}

export const supabase = createClient(supabaseUrl || "https://example.supabase.co", supabaseAPI || "public-anon-placeholder");

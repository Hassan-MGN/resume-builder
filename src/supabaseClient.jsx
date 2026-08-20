import {createClient} from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAPI = import.meta.env.VITE_SUPABASE_API_KEY;

console.log("Supabse URL:", supabaseUrl)

export const supabase = createClient(supabaseUrl, supabaseAPI)
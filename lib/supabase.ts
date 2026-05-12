// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Singleton — ek hi instance poori app mein
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // lead form ke liye auth session ki zaroorat nahi
  },
});

export default supabase;

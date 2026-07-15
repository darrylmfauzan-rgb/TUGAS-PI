import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Ganti teks di bawah ini dengan URL dan Key asli Anda
const SUPABASE_URL = "https://agycjmvndowlzhmaftca.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_-p2_tS9I2Tyv6lAzr00Fcg_1lBqKdUm";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);

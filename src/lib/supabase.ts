import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env["SUPABASE_URL"] ||
  (typeof import.meta !== "undefined" && import.meta.env?.["VITE_SUPABASE_URL"]) ||
  "https://hdgfmncycavoqjfeleem.supabase.co";

const supabaseAnonKey =
  process.env["SUPABASE_ANON_KEY"] ||
  (typeof import.meta !== "undefined" && import.meta.env?.["VITE_SUPABASE_ANON_KEY"]) ||
  "sb_publishable_ogNczthN8mfe4kIczXC7yA_GMrzwixl";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SupabaseOrder {
  id: string;
  order_id?: string;
  payment_id?: string;
  product_name: string;
  variant_name?: string;
  amount: number;
  quantity?: number;
  customer_email?: string;
  customer_phone?: string;
  keys_delivered?: string[];
  status: string;
  created_at?: string;
}

export interface SupabaseStoreSettings {
  id?: string;
  key: string;
  value: any;
  updated_at?: string;
}

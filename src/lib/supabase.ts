import { createClient } from "@supabase/supabase-js";

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env.local file."
  );
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Test connection to Supabase
 * Returns true if connection is successful, false otherwise
 */
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("registrations")
      .select("count")
      .limit(1);

    if (error) {
      console.error("Supabase connection test failed:", error.message);
      return false;
    }

    console.log("✅ Supabase connection successful!");
    return true;
  } catch (error) {
    console.error("❌ Supabase connection failed:", error);
    return false;
  }
}

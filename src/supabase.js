import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://urpetpgyzshuallpaqfx.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVycGV0cGd5enNodWFsbHBhcWZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NjY2MDAsImV4cCI6MjA1NjI0MjYwMH0.D0ZnZIuXS90Wq4e4r-1zjFH8rS_lMFxyw8YDk9Eg_6s";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

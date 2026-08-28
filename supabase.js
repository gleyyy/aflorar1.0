const SUPABASE_URL = "https://atnfazrohqgsgrzuyzup.supabase.co/rest/v1/";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0bmZhenJvaHFnc2dyenV5enVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNDkyNTgsImV4cCI6MjEwMTkyNTI1OH0.JTXEgmCIBWA23M9k62-7x4OKmBJQ7ZVtPhyeUrMeQcU";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

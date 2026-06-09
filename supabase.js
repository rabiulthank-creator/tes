const SUPABASE_URL = "https://kwyowiftpvbrhzyktczv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3eW93aWZ0cHZicmh6eWt0Y3p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NjYwOTEsImV4cCI6MjA5NDE0MjA5MX0.MCxW0TuIHhpWryPh9dvx6V3ouPNE-kGaAV7VruoKwbE";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

async function isAdmin() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) return false;
  
  const { data, error } = await supabaseClient
    .from('admins')
    .select('role')
    .eq('email', user.email)
    .maybeSingle();
  
  if(error || !data) return false;
  return data.role === 'admin';
}

async function requireAdmin() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) {
    window.location.href = "admin-login.html";
    return false;
  }
  
  const isAdminUser = await isAdmin();
  if (!isAdminUser) {
    alert("Access denied. Admin privileges required.");
    window.location.href = "index.html";
    return false;
  }
  return true;
}

async function getCurrentUser() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  return user;
}

function generateSlug(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}
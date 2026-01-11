import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce' 
  }
});

// Auth helper functions
export const auth = {
  // --- ADDED THIS: Fixes the TypeError in main.jsx ---
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },

  signUp: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    return { data, error };
  },

  verifyOtp: async (params) => {
    const { data, error } = await supabase.auth.verifyOtp(params);
    return { data, error };
  },

  resend: async (params) => {
    const { data, error } = await supabase.auth.resend(params);
    return { data, error };
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  },

  updatePassword: async (password) => {
    const { data, error } = await supabase.auth.updateUser({
      password
    });
    return { data, error };
  }
};

// Database helper functions
export const db = {
  select: async (table, columns = '*', filters = {}) => {
    let query = supabase.from(table).select(columns);
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        query = query.eq(key, value);
      }
    });
    const { data, error } = await query;
    return { data, error };
  },

  insert: async (table, data) => {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select();
    return { data: result, error };
  },

  update: async (table, data, filters = {}) => {
    let query = supabase.from(table).update(data);
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        query = query.eq(key, value);
      }
    });
    const { data: result, error } = await query.select();
    return { data: result, error };
  },

  delete: async (table, filters = {}) => {
    let query = supabase.from(table).delete();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        query = query.eq(key, value);
      }
    });
    const { error } = await query;
    return { error };
  }
};
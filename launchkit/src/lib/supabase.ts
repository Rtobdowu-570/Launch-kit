import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create client if env vars are available, otherwise create a dummy client
// This allows the app to run without Supabase configured
let supabase: any = null
let supabaseAdmin: any = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

  // Server-side client with service role key for admin operations
  supabaseAdmin = typeof window === 'undefined' 
    ? createClient<Database>(
        supabaseUrl,
        process.env.SUPABASE_SERVICE_ROLE_KEY || '',
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      )
    : null
} else {
  // Provide a mock client for development without Supabase
  console.warn('Supabase environment variables not configured. Running in mock mode.')
  
  const mockClient = {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
      signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      resetPasswordForEmail: async () => ({ data: null, error: new Error('Supabase not configured') }),
      updateUser: async () => ({ data: null, error: new Error('Supabase not configured') }),
    },
    from: () => ({
      select: async () => ({ data: null, error: new Error('Supabase not configured') }),
      insert: async () => ({ data: null, error: new Error('Supabase not configured') }),
      update: async () => ({ data: null, error: new Error('Supabase not configured') }),
      delete: async () => ({ data: null, error: new Error('Supabase not configured') }),
      upsert: async () => ({ data: null, error: new Error('Supabase not configured') }),
    }),
  }
  
  supabase = mockClient
  supabaseAdmin = null
}

export { supabase, supabaseAdmin }

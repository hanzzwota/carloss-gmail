import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client (untuk backend operations)
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY || 'placeholder-key'

if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
  console.warn('Supabase credentials not configured for server')
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Client-side Supabase client (untuk frontend operations)
const supabasePublicKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'placeholder-key'

if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
  console.warn('Supabase credentials not configured for client')
}

export const supabaseClient = createClient(supabaseUrl, supabasePublicKey)

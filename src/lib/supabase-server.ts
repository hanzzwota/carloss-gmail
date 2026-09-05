import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client (untuk backend operations)
const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY || ''

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Supabase credentials not configured for server')
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Client-side Supabase client (untuk frontend operations)
const supabasePublicKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''

if (!supabaseUrl || !supabasePublicKey) {
  console.warn('Supabase credentials not configured for client')
}

export const supabaseClient = createClient(supabaseUrl, supabasePublicKey)

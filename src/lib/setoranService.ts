import { supabaseClient } from './supabaseClient'

// Types
export interface Setoran {
  id: string
  user_id?: string
  user_name: string
  amount: number
  payment_method: string
  notes?: string
  ip_address?: string
  user_agent?: string
  created_at: string
  status: 'pending' | 'confirmed' | 'rejected'
}

// Submit setoran dari user (dari IP/device berbeda)
export async function submitSetoran(data: {
  user_name: string
  amount: number
  payment_method: string
  notes?: string
}): Promise<{ success: boolean; data?: Setoran; error?: string }> {
  try {
    // Get user's IP address dan user agent
    const ipResponse = await fetch('https://api.ipify.org?format=json')
    const ipData = await ipResponse.json()
    const ip_address = ipData.ip

    const user_agent = navigator.userAgent

    // Insert ke Supabase table "setoran"
    const { data: insertedData, error } = await supabaseClient
      .from('setoran')
      .insert([
        {
          user_name: data.user_name,
          amount: data.amount,
          payment_method: data.payment_method,
          notes: data.notes || null,
          ip_address,
          user_agent,
          status: 'pending',
        },
      ])
      .select()

    if (error) {
      console.error('Error submitting setoran:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: insertedData?.[0] as Setoran }
  } catch (err) {
    console.error('Error in submitSetoran:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

// Fetch semua setoran untuk admin (tanpa filter)
export async function fetchAllSetoran(): Promise<{
  success: boolean
  data?: Setoran[]
  error?: string
}> {
  try {
    const { data, error } = await supabaseClient
      .from('setoran')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching setoran:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data as Setoran[] }
  } catch (err) {
    console.error('Error in fetchAllSetoran:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

// Fetch setoran by status (untuk admin filter)
export async function fetchSetoranByStatus(status: string): Promise<{
  success: boolean
  data?: Setoran[]
  error?: string
}> {
  try {
    const { data, error } = await supabaseClient
      .from('setoran')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching setoran by status:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data as Setoran[] }
  } catch (err) {
    console.error('Error in fetchSetoranByStatus:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

// Update setoran status (admin action)
export async function updateSetoranStatus(
  id: string,
  status: 'confirmed' | 'rejected'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseClient
      .from('setoran')
      .update({ status })
      .eq('id', id)

    if (error) {
      console.error('Error updating setoran:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('Error in updateSetoranStatus:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

// Delete setoran (admin action)
export async function deleteSetoran(id: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const { error } = await supabaseClient
      .from('setoran')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting setoran:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('Error in deleteSetoran:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

// Get stats (total, pending, confirmed)
export async function getSetoranStats(): Promise<{
  success: boolean
  stats?: {
    total: number
    pending: number
    confirmed: number
    rejected: number
    total_amount: number
  }
  error?: string
}> {
  try {
    const { data, error } = await supabaseClient
      .from('setoran')
      .select('*')

    if (error) {
      console.error('Error fetching stats:', error)
      return { success: false, error: error.message }
    }

    const setoran = data as Setoran[]
    const stats = {
      total: setoran.length,
      pending: setoran.filter((s) => s.status === 'pending').length,
      confirmed: setoran.filter((s) => s.status === 'confirmed').length,
      rejected: setoran.filter((s) => s.status === 'rejected').length,
      total_amount: setoran.reduce((sum, s) => sum + s.amount, 0),
    }

    return { success: true, stats }
  } catch (err) {
    console.error('Error in getSetoranStats:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

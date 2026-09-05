/**
 * API Handler untuk weather data dengan Supabase
 * Contoh: /api/weather
 */

import { supabaseServer } from '../lib/supabase-server'

interface WeatherRequest {
  city: string
  userId?: string
}

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

// Fetch weather dan simpan ke Supabase
export async function handleWeatherRequest(
  req: WeatherRequest
): Promise<ApiResponse> {
  try {
    const { city, userId } = req

    if (!city) {
      return {
        success: false,
        error: 'City parameter is required',
      }
    }

    // Fetch from OpenWeatherMap
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${process.env.VITE_OPENWEATHER_API_KEY}&units=metric`
    )

    if (!weatherResponse.ok) {
      throw new Error('Failed to fetch weather data')
    }

    const weatherData = await weatherResponse.json()

    // Jika ada userId, simpan ke Supabase
    if (userId) {
      try {
        await supabaseServer
          .from('weather_searches')
          .insert({
            user_id: userId,
            city: city,
            weather_data: weatherData,
            searched_at: new Date().toISOString(),
          })
      } catch (dbError) {
        console.error('Error saving to database:', dbError)
        // Continue even if DB insert fails
      }
    }

    return {
      success: true,
      data: weatherData,
    }
  } catch (error) {
    console.error('Error handling weather request:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Get user's weather search history dari Supabase
export async function getUserWeatherHistory(
  userId: string
): Promise<ApiResponse> {
  try {
    const { data, error } = await supabaseServer
      .from('weather_searches')
      .select('*')
      .eq('user_id', userId)
      .order('searched_at', { ascending: false })
      .limit(10)

    if (error) {
      throw error
    }

    return {
      success: true,
      data: data || [],
    }
  } catch (error) {
    console.error('Error fetching weather history:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

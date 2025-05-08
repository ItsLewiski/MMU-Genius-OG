import { createClient } from "@supabase/supabase-js"

// Environment variables are already set in the project
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a single instance of the Supabase client for the browser
let supabaseClient: ReturnType<typeof createClient> | null = null

// Client-side Supabase client (singleton pattern)
export const getSupabaseClient = () => {
  if (!supabaseClient && typeof window !== "undefined") {
    // Check if both URL and key are available
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase URL or Anon Key is missing")
      return null
    }

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}

// Server-side Supabase client (for server components and API routes)
export const supabaseServer = (() => {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.error("Server-side Supabase URL or Key is missing")
    // Return null instead of throwing an error to prevent build failures
    return null
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
})()

// Helper to get user profile after authentication
export async function getUserProfile(userId: string) {
  const supabase = getSupabaseClient()

  if (!supabase) {
    throw new Error("Supabase client not initialized")
  }

  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching user profile:", error)
    throw error
  }

  return data
}

// Helper to create or update user profile
export async function upsertUserProfile(profile: {
  id: string
  name?: string
  phone?: string
  role?: string
  avatar?: string
  join_date?: string
  last_active?: string
}) {
  const supabase = getSupabaseClient()

  if (!supabase) {
    throw new Error("Supabase client not initialized")
  }

  const { data, error } = await supabase.from("profiles").upsert(profile).select()

  if (error) {
    console.error("Error upserting user profile:", error)
    throw error
  }

  return data
}

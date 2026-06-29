/**
 * lib/supabaseServer.js
 * Server-side Supabase client for RLS-safe operations.
 * Uses @supabase/ssr to read chunked auth cookies set by the browser client.
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import {
  assertSupabasePublicEnv,
  getSupabaseAnonKey,
  getSupabaseUrl,
} from './supabasePublic'

/**
 * Create a Supabase client for server-side operations.
 */
export async function createClient() {
  assertSupabasePublicEnv()
  const cookieStore = await cookies()

  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Server Components cannot always write cookies; middleware refreshes sessions.
        }
      },
    },
  })
}

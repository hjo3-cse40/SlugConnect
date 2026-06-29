/**
 * lib/supabaseMiddleware.js
 * Refreshes the Supabase session and syncs auth cookies on each request.
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { getSupabaseAnonKey, getSupabaseUrl } from './supabasePublic'

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  await supabase.auth.getUser()

  return supabaseResponse
}

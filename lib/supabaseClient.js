/**
 * lib/supabaseClient.js
 * Browser Supabase client — @supabase/ssr handles cookie chunking for server-side auth.
 */

import { createBrowserClient } from '@supabase/ssr'
import {
  assertSupabasePublicEnv,
  getSupabaseAnonKey,
  getSupabaseUrl,
} from './supabasePublic'

assertSupabasePublicEnv()

export const supabase = createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey())

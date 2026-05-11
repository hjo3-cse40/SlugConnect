/**
 * Shared NEXT_PUBLIC Supabase URL + anon key for browser and server bundles.
 */

/** Strip accidental /rest/v1 or trailing slashes from pasted URLs */
export function normalizeSupabaseUrl(url) {
  let u = (url || '').trim()
  u = u.replace(/\/+$/, '')
  u = u.replace(/\/rest\/v1\/?$/i, '')
  return u
}

export function getSupabaseUrl() {
  return normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || '')
}

export function getSupabaseAnonKey() {
  return (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim()
}

export function getProjectRef() {
  const url = getSupabaseUrl()
  try {
    const host = new URL(url).hostname
    return host.split('.')[0] || ''
  } catch {
    return url.split('//')[1]?.split('.')[0] || ''
  }
}

export function assertSupabasePublicEnv() {
  const url = getSupabaseUrl()
  const anonKey = getSupabaseAnonKey()
  if (!url || !anonKey) {
    throw new Error(
      'Missing Supabase configuration: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (see .env.example).'
    )
  }
  if (!/^https:\/\/.+\.supabase\.co\/?$/i.test(url)) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL should look like https://YOUR_PROJECT_REF.supabase.co (no /rest/v1 path).'
    )
  }
}

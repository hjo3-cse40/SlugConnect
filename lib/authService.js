/**
 * lib/authService.js
 * Authentication service for client-side auth operations
 * Handles sign up and sign in with Supabase Auth
 */

import { supabase } from './supabaseClient'

/**
 * Sign up a new user with email and password
 * @param {string} email - User email (must be @ucsc.edu)
 * @param {string} password - User password
 * @returns {Promise<{user: User | null, error: Error | null}>}
 */
export async function signUp(email, password) {
  try {
    // Validate UCSC email domain
    if (!email.endsWith('@ucsc.edu')) {
      throw new Error('Please use your UCSC email address.')
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/onboarding` : undefined,
      },
    })

    if (error) throw error

    // Check if email confirmation is required
    const needsConfirmation = data.user && !data.user.email_confirmed_at

    return { 
      user: data.user, 
      needsConfirmation,
      error: null 
    }
  } catch (error) {
    console.error('Sign up error:', error)
    return { user: null, needsConfirmation: false, error }
  }
}

/**
 * Sign in an existing user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{user: User | null, error: Error | null}>}
 */
export async function signInWithPassword(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return { user: data.user, error: null }
  } catch (error) {
    console.error('Sign in error:', error)
    return { user: null, error }
  }
}

/**
 * Sign out the current user
 * @returns {Promise<{error: Error | null}>}
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Sign out error:', error)
    return { error }
  }
}

/**
 * Get the current authenticated user
 * @returns {Promise<{user: User | null, error: Error | null}>}
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return { user, error: null }
  } catch (error) {
    console.error('Get user error:', error)
    return { user: null, error }
  }
}

/**
 * Resend confirmation email
 * @param {string} email - User email
 * @returns {Promise<{error: Error | null}>}
 */
export async function resendConfirmationEmail(email) {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/onboarding` : undefined,
      },
    })
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Resend confirmation error:', error)
    return { error }
  }
}

/**
 * Explicitly sync the current session to cookies for server-side access
 * This is useful after email confirmation when the session is established from URL tokens
 * @returns {Promise<{success: boolean, error: Error | null}>}
 */
export async function syncSessionToCookies() {
  try {
    if (typeof window === 'undefined') {
      return { success: false, error: new Error('Cannot sync cookies on server') }
    }

    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) throw error
    
    if (!session) {
      return { success: false, error: new Error('No session to sync') }
    }

    // Sync to cookie (same logic as in supabaseClient.js)
    const supabaseURL = 'https://tokhxfjhspcmlhebafxi.supabase.co'
    const projectRef = supabaseURL.split('//')[1]?.split('.')[0] || 'tokhxfjhspcmlhebafxi'
    const authCookieName = `sb-${projectRef}-auth-token`
    
    const expires = new Date()
    expires.setFullYear(expires.getFullYear() + 1)
    document.cookie = `${authCookieName}=${encodeURIComponent(JSON.stringify({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at,
    }))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax; Secure`

    return { success: true, error: null }
  } catch (error) {
    console.error('Sync session to cookies error:', error)
    return { success: false, error }
  }
}


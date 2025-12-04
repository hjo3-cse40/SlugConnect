/**
 *  app/onboarding/page.js
 *  This file is responsible for displaying what is on the 
 * 'onboarding' page. Collects info from the user for their account
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { getCurrentUser, syncSessionToCookies } from '@/lib/authService'
import { createProfile } from '@/app/actions/profile'
import OnboardingCard from '@/components/OnboardingCard'

export default function OnboardingPage() {
  const router = useRouter()
  const [isAuthenticating, setIsAuthenticating] = useState(true)
  const [authError, setAuthError] = useState(null)

  // Handle email confirmation callback and ensure session is established
  useEffect(() => {
    async function establishSession() {
      try {
        // Check if there are auth tokens in the URL (from email confirmation)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const hasAuthTokens = hashParams.has('access_token') || hashParams.has('type')

        if (hasAuthTokens) {
          // Supabase should automatically detect and process tokens from URL
          // Wait a bit for the session to be established
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Get the session to ensure it's established
          const { data: { session }, error: sessionError } = await supabase.auth.getSession()
          
          if (sessionError) {
            console.error('Session error:', sessionError)
            setAuthError('Failed to establish session. Please try signing in.')
            setIsAuthenticating(false)
            return
          }

          if (!session) {
            // Wait a bit more and try again
            await new Promise(resolve => setTimeout(resolve, 1000))
            const { data: { session: retrySession }, error: retryError } = await supabase.auth.getSession()
            
            if (retryError || !retrySession) {
              setAuthError('Session not established. Please try signing in.')
              setIsAuthenticating(false)
              return
            }
          }

          // Explicitly sync session to cookies for server-side access
          const { success: syncSuccess, error: syncError } = await syncSessionToCookies()
          
          if (!syncSuccess) {
            console.warn('Failed to sync session to cookies:', syncError)
            // Continue anyway - the onAuthStateChange listener might have already synced it
          }
          
          // Clear the hash from URL for cleaner UX
          window.history.replaceState(null, '', window.location.pathname)
          
          // Wait a moment for cookies to be fully set
          await new Promise(resolve => setTimeout(resolve, 300))
        }

        // Verify user is authenticated (whether from email confirmation or already signed in)
        const { user, error: userError } = await getCurrentUser()
        
        if (userError || !user) {
          setAuthError('Not authenticated. Please sign in.')
          setIsAuthenticating(false)
          return
        }

        // If we didn't process auth tokens but user is authenticated, sync cookies anyway
        if (!hasAuthTokens) {
          await syncSessionToCookies()
        }
        
        setIsAuthenticating(false)
      } catch (error) {
        console.error('Error establishing session:', error)
        setAuthError('Failed to authenticate. Please try signing in.')
        setIsAuthenticating(false)
      }
    }

    establishSession()
  }, [])

  async function handleSubmit(profileData) {
    const { success, error } = await createProfile(profileData)
    
    if (!success) {
      throw new Error(error || 'Failed to create profile')
    }

    // Redirect to discover page on success
    router.push('/discover')
  }

  if (isAuthenticating) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm ring-1 ring-black/5 text-center">
          <p className="text-slate-700">Setting up your account...</p>
        </div>
      </main>
    )
  }

  if (authError) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm ring-1 ring-black/5 text-center">
          <p className="text-red-600 mb-4">{authError}</p>
          <button
            onClick={() => router.push('/')}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
          >
            Go to Sign In
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen grid place-items-center bg-slate-50 p-6">
      <OnboardingCard onSubmit={handleSubmit} />
    </main>
  )
}

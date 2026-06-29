/**
 *  app/page.js
 *  This file is responsible for displaying what 
 *  the user sees first (essentially the 'login' route).
 */

'use client'

import { useEffect } from 'react'
import { signInWithPassword, getCurrentUser } from '@/lib/authService'
import LoginCard from '@/components/LogInCard'

export default function Home() {
  // Check if user is already logged in
  useEffect(() => {
    async function checkAuth() {
      const { user } = await getCurrentUser()
      if (user) {
        window.location.replace('/discover')
      }
    }
    checkAuth()
  }, [])

  async function handleSignIn({ email, password }) {
    const { user, error } = await signInWithPassword(email, password)

    if (error) {
      throw new Error(error.message || 'Sign in failed')
    }

    if (user) {
      const { user: verifiedUser } = await getCurrentUser()
      if (verifiedUser) {
        // Full navigation so server receives auth cookies before protected layout runs
        window.location.assign('/discover')
        return
      }
      throw new Error('Session not established. Please try again.')
    }
  }

  return (
    <main className='min-h-screen grid place-items-center bg-gray-50 p-6'>
      <LoginCard onSignIn={handleSignIn} />
    </main>
  )
}

import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext()

// Module-level so their identity is stable across renders.
const signIn = (email, password) =>
  supabase.auth.signInWithPassword({ email, password })

// Deduped: Login and the non-HR check can both sign out at once, and a
// second concurrent call hits /logout after the session is gone (403).
let signOutPromise = null
const signOut = () => {
  if (!signOutPromise) {
    signOutPromise = supabase.auth.signOut().finally(() => {
      signOutPromise = null
    })
  }
  return signOutPromise
}

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  // Result of the HR check, tagged with the user it was run for
  const [hrCheck, setHrCheck] = useState({ userId: null, isHr: null })

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  // Being signed in isn't enough — the user must also be listed in hr_users.
  // Checked in its own effect (not inside onAuthStateChange) because
  // supabase-js can deadlock if the auth callback awaits other calls.
  const userId = session?.user?.id ?? null
  useEffect(() => {
    if (!userId) return

    let cancelled = false
    supabase.rpc('is_hr').then(({ data, error }) => {
      if (!cancelled) setHrCheck({ userId, isHr: !error && data === true })
    })

    return () => {
      cancelled = true
    }
  }, [userId])

  // null = still checking (or signed out)
  const isHr = userId && hrCheck.userId === userId ? hrCheck.isHr : null

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, isHr, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

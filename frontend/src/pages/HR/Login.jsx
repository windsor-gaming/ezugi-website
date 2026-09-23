import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import './Login.css'

const Login = () => {
  const { session, isHr, signIn, signOut } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Signed in but not an HR account (e.g. a leftover session) — sign them out.
  useEffect(() => {
    if (session && isHr === false) signOut()
  }, [session, isHr, signOut])

  if (session && isHr) {
    const redirectTo = location.state?.from?.pathname || '/hr'
    return <Navigate to={redirectTo} replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const { error: signInError } = await signIn(email, password)

    if (signInError) {
      setSubmitting(false)
      setError('Incorrect email or password.')
      return
    }

    const { data: hr } = await supabase.rpc('is_hr')
    setSubmitting(false)
    if (hr !== true) {
      await signOut()
      setError('This account does not have HR access.')
    }
  }

  return (
    <section className="hr-login">
      <form className="hr-login-form" onSubmit={handleSubmit}>
        <span className="hr-login-eyebrow">HR</span>
        <h1>Sign In</h1>

        <div className="hr-login-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </div>

        <div className="hr-login-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        {error && <p className="hr-login-error">{error}</p>}

        <button type="submit" className="hr-login-btn" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </section>
  )
}

export default Login

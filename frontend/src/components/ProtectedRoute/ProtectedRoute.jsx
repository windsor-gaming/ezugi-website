import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = () => {
  const { session, isHr, loading } = useAuth()

  if (loading || (session && isHr === null)) {
    return <div className="pr-loading">Loading...</div>
  }

  if (!session || !isHr) {
    return <Navigate to="/hr/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute

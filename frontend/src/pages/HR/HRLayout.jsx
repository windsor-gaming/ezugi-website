import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './HRLayout.css'

const HRLayout = () => {
  const { user, signOut } = useAuth()

  return (
    <div className="hr-layout">
      <header className="hr-header">
        <span className="hr-brand">Ezugi HR</span>
        <nav className="hr-nav">
          <NavLink to="/hr/vacancies" className={({ isActive }) => (isActive ? 'active' : '')}>
            Vacancies
          </NavLink>
          <NavLink to="/hr/applications" className={({ isActive }) => (isActive ? 'active' : '')}>
            Applications
          </NavLink>
          <NavLink to="/hr/reviews" className={({ isActive }) => (isActive ? 'active' : '')}>
            Reviews
          </NavLink>
        </nav>
        <div className="hr-header-right">
          <span className="hr-user-email">{user?.email}</span>
          <button className="hr-signout-btn" onClick={signOut}>
            Sign Out
          </button>
        </div>
      </header>

      <main className="hr-content">
        <Outlet />
      </main>
    </div>
  )
}

export default HRLayout

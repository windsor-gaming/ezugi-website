import React, { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import './ApplicationsList.css'

const statuses = ['new', 'reviewed', 'shortlisted', 'rejected']

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })

const ApplicationsList = () => {
  const [applications, setApplications] = useState([])
  const [vacancies, setVacancies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')

  const [vacancyFilter, setVacancyFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const [appsResult, vacanciesResult] = await Promise.all([
        supabase
          .from('applications')
          .select('*, vacancies(title)')
          .order('created_at', { ascending: false }),
        supabase.from('vacancies').select('id, title').order('title'),
      ])

      if (appsResult.error || vacanciesResult.error) {
        setError('Could not load applications.')
      } else {
        setApplications(appsResult.data)
        setVacancies(vacanciesResult.data)
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  const updateStatus = async (app, newStatus) => {
    setActionError('')
    const { error: updateError } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', app.id)

    if (updateError) {
      setActionError('Could not update the status. Please try again.')
      return
    }
    setApplications((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status: newStatus } : a))
    )
  }

  // The cvs bucket is private, so CVs are opened through a short-lived signed URL.
  const openCv = async (app) => {
    setActionError('')
    // Open the tab before the await so the browser doesn't treat it as a popup
    const cvWindow = window.open('', '_blank')
    const { data, error: urlError } = await supabase.storage
      .from('cvs')
      .createSignedUrl(app.cv_path, 60)

    if (urlError || !data) {
      cvWindow?.close()
      setActionError('Could not open this CV.')
      return
    }

    if (cvWindow) {
      cvWindow.opener = null
      cvWindow.location.href = data.signedUrl
    } else {
      window.location.href = data.signedUrl
    }
  }

  const deleteApplication = async (app) => {
    if (!window.confirm(`Delete the application from ${app.full_name}? This also deletes their CV.`)) {
      return
    }
    setActionError('')

    const { error: deleteError } = await supabase.from('applications').delete().eq('id', app.id)
    if (deleteError) {
      setActionError('Could not delete this application.')
      return
    }

    await supabase.storage.from('cvs').remove([app.cv_path])
    setApplications((prev) => prev.filter((a) => a.id !== app.id))
  }

  const filtered = applications.filter(
    (app) =>
      (vacancyFilter === 'all' ||
        (vacancyFilter === 'general' ? app.vacancy_id === null : app.vacancy_id === vacancyFilter)) &&
      (statusFilter === 'all' || app.status === statusFilter)
  )

  return (
    <div className="ap-page">
      <div className="ap-header">
        <h1>Applications</h1>
        <div className="ap-filters">
          <select
            aria-label="Filter by vacancy"
            value={vacancyFilter}
            onChange={(e) => setVacancyFilter(e.target.value)}
          >
            <option value="all">All vacancies</option>
            <option value="general">General applications (no vacancy)</option>
            {vacancies.map((v) => (
              <option key={v.id} value={v.id}>
                {v.title}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s[0].toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p className="ap-status-text">Loading...</p>}
      {error && <p className="ap-status-text ap-error">{error}</p>}
      {actionError && <p className="ap-status-text ap-error">{actionError}</p>}

      {!loading && !error && filtered.length === 0 && (
        <p className="ap-status-text">
          {applications.length === 0 ? 'No applications yet.' : 'No applications match these filters.'}
        </p>
      )}

      {!loading && filtered.length > 0 && (
        <div className="ap-table">
          <div className="ap-table-head">
            <span>Applicant</span>
            <span>Vacancy</span>
            <span>Received</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {filtered.map((app) => (
            <div className="ap-table-row-group" key={app.id}>
              <div className="ap-table-row">
                <span className="ap-name-cell">{app.full_name}</span>
                <span>{app.vacancies?.title || 'General Application'}</span>
                <span>{formatDate(app.created_at)}</span>
                <span>
                  <select
                    className={`ap-status-select ${app.status}`}
                    aria-label={`Status for ${app.full_name}`}
                    value={app.status}
                    onChange={(e) => updateStatus(app, e.target.value)}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s[0].toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </span>
                <span className="ap-actions">
                  <button
                    className="ap-action-btn"
                    onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                  >
                    {expandedId === app.id ? 'Hide' : 'Details'}
                  </button>
                  <button className="ap-action-btn" onClick={() => openCv(app)}>
                    View CV
                  </button>
                  <button className="ap-action-btn ap-delete-btn" onClick={() => deleteApplication(app)}>
                    Delete
                  </button>
                </span>
              </div>

              {expandedId === app.id && (
                <div className="ap-details">
                  <p>
                    <strong>Email:</strong> <a href={`mailto:${app.email}`}>{app.email}</a>
                  </p>
                  <p>
                    <strong>Phone:</strong> {app.phone || '—'}
                  </p>
                  <p className="ap-cover-note">
                    <strong>Cover note:</strong> {app.cover_note || '—'}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ApplicationsList

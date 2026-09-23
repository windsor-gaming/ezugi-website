import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../../lib/supabaseClient'
import './VacanciesList.css'

const VacanciesList = () => {
  const [vacancies, setVacancies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchVacancies = async () => {
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('vacancies')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError('Could not load vacancies.')
    } else {
      setVacancies(data)
      setError('')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchVacancies()
  }, [])

  const toggleStatus = async (job) => {
    const newStatus = job.status === 'active' ? 'inactive' : 'active'
    const { error: updateError } = await supabase
      .from('vacancies')
      .update({ status: newStatus })
      .eq('id', job.id)

    if (!updateError) {
      setVacancies((prev) =>
        prev.map((v) => (v.id === job.id ? { ...v, status: newStatus } : v))
      )
    }
  }

  const deleteVacancy = async (job) => {
    if (!window.confirm(`Delete "${job.title}"? This cannot be undone.`)) return

    const { error: deleteError } = await supabase.from('vacancies').delete().eq('id', job.id)
    if (!deleteError) {
      setVacancies((prev) => prev.filter((v) => v.id !== job.id))
    }
  }

  return (
    <div className="va-list-page">
      <div className="va-list-header">
        <h1>Vacancies</h1>
        <Link className="va-new-btn" to="/hr/vacancies/new">
          + New Vacancy
        </Link>
      </div>

      {loading && <p className="va-status-text">Loading...</p>}
      {error && <p className="va-status-text va-error">{error}</p>}

      {!loading && !error && vacancies.length === 0 && (
        <p className="va-status-text">No vacancies yet. Create your first one.</p>
      )}

      {!loading && vacancies.length > 0 && (
        <div className="va-table">
          <div className="va-table-head">
            <span>Title</span>
            <span>Area</span>
            <span>Location</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {vacancies.map((job) => (
            <div className="va-table-row" key={job.id}>
              <span className="va-title-cell">{job.title}</span>
              <span>{job.area}</span>
              <span>{job.location}</span>
              <span>
                <span className={`va-badge ${job.status}`}>{job.status}</span>
              </span>
              <span className="va-actions">
                <button className="va-action-btn" onClick={() => toggleStatus(job)}>
                  {job.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <Link className="va-action-btn" to={`/hr/vacancies/${job.id}/edit`}>
                  Edit
                </Link>
                <button className="va-action-btn va-delete-btn" onClick={() => deleteVacancy(job)}>
                  Delete
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VacanciesList

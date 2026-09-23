import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import ApplyForm from '../../components/ApplyForm/ApplyForm'
import './VacancyDetail.css'

const VacancyDetail = () => {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJob = async () => {
      const { data } = await supabase.from('vacancies').select('*').eq('id', id).single()
      setJob(data)
      setLoading(false)
    }

    fetchJob()
  }, [id])

  if (loading) {
    return (
      <section className="vd-page">
        <p className="vd-loading">Loading...</p>
      </section>
    )
  }

  if (!job) {
    return (
      <section className="vd-not-found">
        <h1>Vacancy not found</h1>
        <p>This vacancy may have closed or the link is incorrect.</p>
        <Link className="vd-back-link" to="/careers">
          ← Back to Careers
        </Link>
      </section>
    )
  }

  return (
    <section className="vd-page">
      <div className="vd-content">
        <Link className="vd-back-link" to="/careers">
          ← Back to Careers
        </Link>

        <span className="vd-area">{job.area}</span>
        <h1>{job.title}</h1>

        <div className="vd-meta">
          <span>{job.location}</span>
          <span>{job.type}</span>
        </div>

        {job.about && <p className="vd-about">{job.about}</p>}

        {job.responsibilities?.length > 0 && (
          <div className="vd-section">
            <h2>Responsibilities</h2>
            <ul>
              {job.responsibilities.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {job.requirements?.length > 0 && (
          <div className="vd-section">
            <h2>Requirements</h2>
            <ul>
              {job.requirements.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="vd-apply-section">
          <h2>Apply for this Role</h2>
          <ApplyForm vacancyId={job.id} />
        </div>
      </div>
    </section>
  )
}

export default VacancyDetail

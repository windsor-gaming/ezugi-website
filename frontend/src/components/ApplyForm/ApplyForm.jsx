import React, { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import './ApplyForm.css'

const MAX_CV_SIZE = 5 * 1024 * 1024 // 5MB

const emptyApplication = { fullName: '', email: '', phone: '', coverNote: '' }

// Shared by the per-vacancy Apply form (VacancyDetail) and the general
// "Send Your CV" form (Careers) — same fields, same upload + insert flow.
// vacancyId: the vacancy being applied to, or null for a general application
// (stored under the 'general/' folder instead of a vacancy folder).
const ApplyForm = ({ vacancyId = null, successMessage }) => {
  const [application, setApplication] = useState(emptyApplication)
  const [cvFile, setCvFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setApplication((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setSubmitError('')

    if (!file) {
      setCvFile(null)
      return
    }
    if (file.type !== 'application/pdf') {
      setSubmitError('CV must be a PDF file.')
      setCvFile(null)
      return
    }
    if (file.size > MAX_CV_SIZE) {
      setSubmitError('CV must be smaller than 5MB.')
      setCvFile(null)
      return
    }
    setCvFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    if (!cvFile) {
      setSubmitError('Please attach your CV (PDF).')
      return
    }

    setSubmitting(true)

    // Storage paths only allow a limited character set — strip anything else
    const safeName = cvFile.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-100)
    const folder = vacancyId || 'general'
    const filePath = `${folder}/${Date.now()}-${safeName}`
    const { error: uploadError } = await supabase.storage
      .from('cvs')
      .upload(filePath, cvFile, { contentType: 'application/pdf' })

    if (uploadError) {
      setSubmitError('Could not upload your CV. Please try again.')
      setSubmitting(false)
      return
    }

    const { error: insertError } = await supabase.from('applications').insert({
      vacancy_id: vacancyId,
      full_name: application.fullName,
      email: application.email,
      phone: application.phone,
      cover_note: application.coverNote,
      cv_path: filePath,
    })

    setSubmitting(false)

    if (insertError) {
      setSubmitError('Could not submit your application. Please try again.')
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <p className="af-success">
        {successMessage ||
          "Thank you for applying! Our HR team will review your application and get in touch if there's a match."}
      </p>
    )
  }

  return (
    <form className="af-form" onSubmit={handleSubmit}>
      <div className="af-field-row">
        <div className="af-field">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            value={application.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="af-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={application.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="af-field-row">
        <div className="af-field">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" value={application.phone} onChange={handleChange} />
        </div>
        <div className="af-field">
          <label htmlFor="cv">CV (PDF, max 5MB)</label>
          <input id="cv" type="file" accept="application/pdf" onChange={handleFileChange} required />
        </div>
      </div>

      <div className="af-field">
        <label htmlFor="coverNote">Cover Note (optional)</label>
        <textarea
          id="coverNote"
          name="coverNote"
          rows={4}
          value={application.coverNote}
          onChange={handleChange}
        />
      </div>

      {submitError && <p className="af-error">{submitError}</p>}

      <button type="submit" className="af-submit-btn" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  )
}

export default ApplyForm

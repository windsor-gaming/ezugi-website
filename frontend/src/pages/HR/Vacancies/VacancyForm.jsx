import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../../lib/supabaseClient'
import { careerAreas } from '../../../data/vacancies'
import './VacancyForm.css'

const emptyForm = {
  title: '',
  area: careerAreas[0],
  location: '',
  type: 'Full-time',
  summary: '',
  about: '',
  responsibilities: '',
  requirements: '',
  status: 'active',
}

const toLines = (arr) => (Array.isArray(arr) ? arr.join('\n') : '')
const toArray = (text) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

const VacancyForm = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return

    const loadVacancy = async () => {
      const { data, error: fetchError } = await supabase
        .from('vacancies')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError || !data) {
        setError('Could not load this vacancy.')
      } else {
        setForm({
          title: data.title,
          area: data.area,
          location: data.location,
          type: data.type,
          summary: data.summary,
          about: data.about || '',
          responsibilities: toLines(data.responsibilities),
          requirements: toLines(data.requirements),
          status: data.status,
        })
      }
      setLoading(false)
    }

    loadVacancy()
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      title: form.title,
      area: form.area,
      location: form.location,
      type: form.type,
      summary: form.summary,
      about: form.about,
      responsibilities: toArray(form.responsibilities),
      requirements: toArray(form.requirements),
      status: form.status,
    }

    const { error: saveError } = isEdit
      ? await supabase.from('vacancies').update(payload).eq('id', id)
      : await supabase.from('vacancies').insert(payload)

    setSaving(false)

    if (saveError) {
      setError('Could not save this vacancy. Please try again.')
      return
    }

    navigate('/hr/vacancies')
  }

  if (loading) return <p className="vf-status-text">Loading...</p>

  return (
    <div className="vf-page">
      <h1>{isEdit ? 'Edit Vacancy' : 'New Vacancy'}</h1>

      <form className="vf-form" onSubmit={handleSubmit}>
        <div className="vf-field-row">
          <div className="vf-field">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="vf-field">
            <label htmlFor="area">Career Area</label>
            <select id="area" name="area" value={form.area} onChange={handleChange}>
              {careerAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="vf-field-row">
          <div className="vf-field">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Colombo, Sri Lanka (Hybrid)"
              required
            />
          </div>
          <div className="vf-field">
            <label htmlFor="type">Type</label>
            <input
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
              placeholder="Full-time"
              required
            />
          </div>
        </div>

        <div className="vf-field">
          <label htmlFor="summary">Summary (shown on the Careers list)</label>
          <textarea
            id="summary"
            name="summary"
            rows={2}
            value={form.summary}
            onChange={handleChange}
            required
          />
        </div>

        <div className="vf-field">
          <label htmlFor="about">About the Role (shown on the vacancy detail page)</label>
          <textarea id="about" name="about" rows={3} value={form.about} onChange={handleChange} />
        </div>

        <div className="vf-field">
          <label htmlFor="responsibilities">Responsibilities (one per line)</label>
          <textarea
            id="responsibilities"
            name="responsibilities"
            rows={5}
            value={form.responsibilities}
            onChange={handleChange}
          />
        </div>

        <div className="vf-field">
          <label htmlFor="requirements">Requirements (one per line)</label>
          <textarea
            id="requirements"
            name="requirements"
            rows={5}
            value={form.requirements}
            onChange={handleChange}
          />
        </div>

        <div className="vf-field">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={form.status} onChange={handleChange}>
            <option value="active">Active (visible on Careers page)</option>
            <option value="inactive">Inactive (hidden)</option>
          </select>
        </div>

        {error && <p className="vf-error">{error}</p>}

        <div className="vf-actions">
          <button type="submit" className="vf-save-btn" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Vacancy'}
          </button>
          <button type="button" className="vf-cancel-btn" onClick={() => navigate('/hr/vacancies')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default VacancyForm

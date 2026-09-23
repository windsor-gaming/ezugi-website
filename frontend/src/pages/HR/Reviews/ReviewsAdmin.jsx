import React, { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import './ReviewsAdmin.css'

const emptyForm = {
  author_name: '',
  author_title: '',
  rating: '',
  content: '',
  status: 'draft',
}

const ReviewsAdmin = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // editingId: null = form closed, 'new' = creating, otherwise the review's id
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error: fetchError } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        setError('Could not load reviews.')
      } else {
        setReviews(data)
      }
      setLoading(false)
    }

    fetchReviews()
  }, [])

  const openNew = () => {
    setForm(emptyForm)
    setFormError('')
    setEditingId('new')
  }

  const openEdit = (review) => {
    setForm({
      author_name: review.author_name,
      author_title: review.author_title || '',
      rating: review.rating ? String(review.rating) : '',
      content: review.content,
      status: review.status,
    })
    setFormError('')
    setEditingId(review.id)
  }

  const closeForm = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')

    const payload = {
      author_name: form.author_name,
      author_title: form.author_title || null,
      rating: form.rating ? Number(form.rating) : null,
      content: form.content,
      status: form.status,
    }

    const { data, error: saveError } =
      editingId === 'new'
        ? await supabase.from('reviews').insert(payload).select().single()
        : await supabase.from('reviews').update(payload).eq('id', editingId).select().single()

    setSaving(false)

    if (saveError) {
      setFormError('Could not save this review. Please try again.')
      return
    }

    setReviews((prev) =>
      editingId === 'new' ? [data, ...prev] : prev.map((r) => (r.id === data.id ? data : r))
    )
    closeForm()
  }

  const toggleStatus = async (review) => {
    const newStatus = review.status === 'published' ? 'draft' : 'published'
    const { error: updateError } = await supabase
      .from('reviews')
      .update({ status: newStatus })
      .eq('id', review.id)

    if (!updateError) {
      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, status: newStatus } : r))
      )
    }
  }

  const deleteReview = async (review) => {
    if (!window.confirm(`Delete the review from ${review.author_name}? This cannot be undone.`)) return

    const { error: deleteError } = await supabase.from('reviews').delete().eq('id', review.id)
    if (!deleteError) {
      setReviews((prev) => prev.filter((r) => r.id !== review.id))
      if (editingId === review.id) closeForm()
    }
  }

  return (
    <div className="ra-page">
      <div className="ra-header">
        <h1>Reviews</h1>
        {editingId === null && (
          <button className="ra-new-btn" onClick={openNew}>
            + New Review
          </button>
        )}
      </div>

      {editingId !== null && (
        <form className="ra-form" onSubmit={handleSubmit}>
          <h2>{editingId === 'new' ? 'New Review' : 'Edit Review'}</h2>

          <div className="ra-field-row">
            <div className="ra-field">
              <label htmlFor="author_name">Name</label>
              <input
                id="author_name"
                name="author_name"
                value={form.author_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="ra-field">
              <label htmlFor="author_title">Title / Company (optional)</label>
              <input
                id="author_title"
                name="author_title"
                value={form.author_title}
                onChange={handleChange}
                placeholder="CEO, Acme Ltd"
              />
            </div>
          </div>

          <div className="ra-field">
            <label htmlFor="content">Review</label>
            <textarea
              id="content"
              name="content"
              rows={4}
              value={form.content}
              onChange={handleChange}
              required
            />
          </div>

          <div className="ra-field-row">
            <div className="ra-field">
              <label htmlFor="rating">Rating (optional)</label>
              <select id="rating" name="rating" value={form.rating} onChange={handleChange}>
                <option value="">No rating</option>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {'★'.repeat(n)} ({n})
                  </option>
                ))}
              </select>
            </div>
            <div className="ra-field">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange}>
                <option value="published">Published (visible on Home page)</option>
                <option value="draft">Draft (hidden)</option>
              </select>
            </div>
          </div>

          {formError && <p className="ra-error">{formError}</p>}

          <div className="ra-form-actions">
            <button type="submit" className="ra-save-btn" disabled={saving}>
              {saving ? 'Saving...' : editingId === 'new' ? 'Create Review' : 'Save Changes'}
            </button>
            <button type="button" className="ra-cancel-btn" onClick={closeForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading && <p className="ra-status-text">Loading...</p>}
      {error && <p className="ra-status-text ra-error">{error}</p>}

      {!loading && !error && reviews.length === 0 && (
        <p className="ra-status-text">No reviews yet. Add your first one.</p>
      )}

      {!loading && reviews.length > 0 && (
        <div className="ra-list">
          {reviews.map((review) => (
            <div className="ra-card" key={review.id}>
              <div className="ra-card-top">
                <div>
                  <span className="ra-author">{review.author_name}</span>
                  {review.author_title && <span className="ra-author-title">{review.author_title}</span>}
                </div>
                <span className={`ra-badge ${review.status}`}>{review.status}</span>
              </div>
              {review.rating && (
                <span className="ra-stars" aria-label={`${review.rating} out of 5`}>
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </span>
              )}
              <p className="ra-content">{review.content}</p>
              <div className="ra-actions">
                <button className="ra-action-btn" onClick={() => toggleStatus(review)}>
                  {review.status === 'published' ? 'Unpublish' : 'Publish'}
                </button>
                <button className="ra-action-btn" onClick={() => openEdit(review)}>
                  Edit
                </button>
                <button className="ra-action-btn ra-delete-btn" onClick={() => deleteReview(review)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ReviewsAdmin

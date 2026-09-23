import React, { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import './Contact.css'

const services = ['Technology Solutions', 'Digital Marketing', 'Staff Augmentation', 'BPO', 'Other']

const ADDRESS = 'Astoria Tower 3, Floor 6, Office 2, Colombo 3, Western Province, Sri Lanka'
const MAP_SRC = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`

const socialLinks = [
  {
    name: 'LinkedIn',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M7.5 10v6.5M7.5 7.6v.01M12 16.5V13a2.2 2.2 0 014.4 0v3.5M12 12.8v3.7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 21v-7h2.5l.5-3H14V9c0-.9.3-1.5 1.7-1.5H17V4.8c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.2V11H8v3h2.6v7H14z" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
      </svg>
    ),
  },
]

const Contact = () => {
  const heroRef = useRef(null)
  const [heroVisible, setHeroVisible] = useState(false)

  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    telephone: '',
    selectedServices: [],
    message: '',
    website: '', // honeypot — left blank by real visitors, hidden via CSS
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeroVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    if (heroRef.current) observer.observe(heroRef.current)
    return () => observer.disconnect()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const toggleService = (service) => {
    setForm((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(service)
        ? prev.selectedServices.filter((s) => s !== service)
        : [...prev.selectedServices, service],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitting(true)

    // Sent server-side (Supabase Edge Function -> Resend) so the enquiry
    // is emailed to HR directly — no mail app is opened on the visitor's end.
    const { error } = await supabase.functions.invoke('send-contact-email', {
      body: {
        name: form.name,
        company: form.company,
        email: form.email,
        telephone: form.telephone,
        services: form.selectedServices,
        message: form.message,
        website: form.website,
      },
    })

    setSubmitting(false)

    if (error) {
      setSubmitError('Could not send your enquiry. Please try again, or email us directly.')
      return
    }

    setSubmitted(true)
  }

  return (
    <>
      <section className="ct-hero" ref={heroRef}>
        <div className={`ct-hero-content ${heroVisible ? 'in-view' : ''}`}>
          <span className="ct-eyebrow">Contact</span>
          <h1>Let's Talk About Your Business</h1>
          <p className="ct-lead">
            Whether you need a technology development team, digital marketing support,
            additional professionals or an outsourced business process, Ezugi can design an
            engagement model around your requirements.
          </p>
        </div>
        <div className={`ct-hero-image ${heroVisible ? 'in-view' : ''}`}>
          <img
            src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1000&q=80"
            alt="Ezugi office reception"
          />
        </div>
      </section>

      <section className="ct-main">
        <form className="ct-form" onSubmit={handleSubmit}>
          <h2>Tell Us What You Need</h2>

          {submitted ? (
            <p className="ct-success">
              Thank you — your enquiry has been sent. We'll get back to you shortly.
            </p>
          ) : (
            <>
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={handleChange}
            className="ct-honeypot"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <div className="ct-field-row">
            <div className="ct-field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="ct-field">
              <label htmlFor="company">Company</label>
              <input
                id="company"
                name="company"
                type="text"
                value={form.company}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="ct-field-row">
            <div className="ct-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="ct-field">
              <label htmlFor="telephone">Telephone</label>
              <input
                id="telephone"
                name="telephone"
                type="tel"
                value={form.telephone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="ct-field">
            <label>Service</label>
            <div className="ct-checkbox-group">
              {services.map((service) => (
                <label className="ct-checkbox" key={service}>
                  <input
                    type="checkbox"
                    checked={form.selectedServices.includes(service)}
                    onChange={() => toggleService(service)}
                  />
                  {service}
                </label>
              ))}
            </div>
          </div>

          <div className="ct-field">
            <label htmlFor="message">Tell us about your requirement</label>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>
          {submitError && <p className="ct-error">{submitError}</p>}

          <button type="submit" className="ct-submit-btn" disabled={submitting}>
            {submitting ? 'Sending...' : 'Submit Enquiry'}
          </button>
            </>
          )}
        </form>

        <aside className="ct-info">
          <div className="ct-info-block">
            <h3>Visit Us</h3>
            <p className="ct-address">{ADDRESS}</p>
          </div>

          <div className="ct-map">
            <iframe
              title="Ezugi office location"
              src={MAP_SRC}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="ct-info-block">
            <h3>Follow Us</h3>
            <div className="ct-social-row">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="ct-social-icon"
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </>
  )
}

export default Contact

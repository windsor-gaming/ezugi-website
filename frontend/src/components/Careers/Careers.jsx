import React, { useEffect, useRef, useState } from 'react'
import './Careers.css'

/* ------------------------------------------------------------------
   CONTENT — update the link and image paths as needed.
------------------------------------------------------------------- */
const VACANCIES_URL = '/careers/vacancies'

const HERO_IMAGES = [
  // TODO: replace with Ezugi office / team photos
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=80',
  'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=900&q=80',
]

const GROUPS = [
  { id: 'all', label: 'All Areas' },
  { id: 'tech', label: 'Technology' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'ops', label: 'Operations' },
]

/* Simple line icons (24×24, stroke = currentColor) */
const ICONS = {
  code: <path d="M8 6 2 12l6 6M16 6l6 6-6 6M14 4l-4 16" />,
  check: <><path d="M9 11l3 3 8-8" /><path d="M20 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h11" /></>,
  cloud: <path d="M17.5 19a4.5 4.5 0 1 0-1.4-8.8A6 6 0 0 0 4.3 12.5 3.5 3.5 0 0 0 6.5 19z" />,
  support: <><circle cx="12" cy="12" r="9" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" /></>,
  megaphone: <path d="M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1zM16 8a5 5 0 0 1 0 8M19 5a9 9 0 0 1 0 14" />,
  pen: <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />,
  headset: <><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z" /></>,
  briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 13h20" /></>,
  folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
}

const AREAS = [
  { title: 'Software Engineering', group: 'tech', icon: 'code' },
  { title: 'QA & Testing', group: 'tech', icon: 'check' },
  { title: 'DevOps & Cloud', group: 'tech', icon: 'cloud' },
  { title: 'IT Support', group: 'tech', icon: 'support' },
  { title: 'Digital Marketing', group: 'marketing', icon: 'megaphone' },
  { title: 'Creative & Content', group: 'marketing', icon: 'pen' },
  { title: 'Customer Support', group: 'ops', icon: 'headset' },
  { title: 'Business Operations', group: 'ops', icon: 'briefcase' },
  { title: 'Administration', group: 'ops', icon: 'folder' },
]

const GROUP_LABEL = { tech: 'Technology', marketing: 'Marketing', ops: 'Operations' }

/* ------------------------------------------------------------------ */

const useInView = (threshold = 0.2) => {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, inView]
}

const Icon = ({ name }) => (
  <svg
    viewBox="0 0 24 24"
    width="26"
    height="26"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {ICONS[name]}
  </svg>
)

const Careers = () => {
  const [heroRef, heroIn] = useInView(0.15)
  const [areasRef, areasIn] = useInView(0.1)
  const [ctaRef, ctaIn] = useInView(0.3)
  const [filter, setFilter] = useState('all')

  return (
    <main className="careers">
      {/* ---------- Hero ---------- */}
      <section ref={heroRef} className="cr-hero">
        <div className={`cr-hero-text cr-reveal ${heroIn ? 'in-view' : ''}`}>
          <span className="cr-eyebrow">Careers</span>
          <h1>
            Build Your Career <span className="cr-accent">With Ezugi</span>
          </h1>
          <p className="cr-lead cr-lead--strong">
            Join a growing organization working with technology, digital
            marketing and global business operations.
          </p>
          <p className="cr-lead">
            We provide opportunities for professionals who want to develop
            their skills, work with international clients and build long-term
            careers.
          </p>
          <a className="cr-btn" href={VACANCIES_URL}>
            View Current Vacancies <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className={`cr-hero-images cr-reveal ${heroIn ? 'in-view' : ''}`}>
          <div className="cr-hero-img cr-hero-img-1">
            <img src={HERO_IMAGES[0]} alt="Ezugi team at work" />
          </div>
          <div className="cr-hero-img cr-hero-img-2">
            <img src={HERO_IMAGES[1]} alt="Ezugi colleagues collaborating" />
          </div>
          <div className="cr-hero-badge">
            <strong>9</strong>
            <span>career areas<br />to grow in</span>
          </div>
        </div>
      </section>

      {/* ---------- Marquee ---------- */}
      <div className="cr-marquee" aria-hidden="true">
        <div className="cr-marquee-track">
          {[...AREAS, ...AREAS].map((a, i) => (
            <span key={i}>
              {a.title}
              <i className="cr-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* ---------- Career Areas ---------- */}
      <section ref={areasRef} className={`cr-areas cr-reveal ${areasIn ? 'in-view' : ''}`}>
        <div className="cr-areas-head">
          <span className="cr-eyebrow">Career Areas</span>
          <h2>Find where you fit</h2>

          <div className="cr-filters" role="tablist" aria-label="Filter career areas">
            {GROUPS.map((g) => (
              <button
                key={g.id}
                type="button"
                role="tab"
                aria-selected={filter === g.id}
                className={`cr-filter ${filter === g.id ? 'is-active' : ''}`}
                onClick={() => setFilter(g.id)}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div className="cr-grid">
          {AREAS.map((a, i) => {
            const dim = filter !== 'all' && filter !== a.group
            return (
              <a
                key={a.title}
                href={VACANCIES_URL}
                className={`cr-card ${dim ? 'is-dim' : ''}`}
                style={{ '--i': i }}
                tabIndex={dim ? -1 : 0}
              >
                <span className="cr-card-icon"><Icon name={a.icon} /></span>
                <span className="cr-card-group">{GROUP_LABEL[a.group]}</span>
                <span className="cr-card-title">{a.title}</span>
                <span className="cr-card-arrow" aria-hidden="true">→</span>
              </a>
            )
          })}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section ref={ctaRef} className={`cr-cta cr-reveal ${ctaIn ? 'in-view' : ''}`}>
        <div>
          <h2>Ready to take the next step?</h2>
          <p>Explore our open roles and find the opportunity that fits your ambitions.</p>
        </div>
        <a className="cr-btn cr-btn--light" href={VACANCIES_URL}>
          View Current Vacancies <span aria-hidden="true">→</span>
        </a>
      </section>
    </main>
  )
}

export default Careers
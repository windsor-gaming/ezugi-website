import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { careerAreas } from '../../data/vacancies'
import { supabase } from '../../lib/supabaseClient'
import ApplyForm from '../../components/ApplyForm/ApplyForm'
import './Careers.css'

const whyCards = [
  {
    title: 'Work With International Clients',
    text: 'Build experience delivering technology, marketing and operations work for organizations around the world.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M3 12h18M12 3c2.5 2.5 3.8 5.8 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.8-3.8-9s1.3-6.5 3.8-9z" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    title: 'Grow Across Multiple Disciplines',
    text: 'Technology, digital marketing and business operations all under one roof , room to specialize or broaden your skills.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    title: 'Flexible, People-First Teams',
    text: 'We build teams around real business needs, giving people the flexibility to grow as those teams evolve.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="17" cy="9" r="2.6" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M2.5 20c.6-3.4 3-5.5 5.5-5.5s4.9 2.1 5.5 5.5M14.5 20c.4-2.6 1.9-4.3 4-4.6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Long-Term Career Development',
    text: 'Opportunities to develop your skills and build a long-term career, not just a short-term assignment.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 18l6-7 4 4 8-9" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 6h5v5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const applySteps = [
  {
    step: '01',
    title: 'Apply Online',
    text: 'Find a role that fits and submit your CV in a couple of minutes. no account needed.',
  },
  {
    step: '02',
    title: 'We Review',
    text: 'Our HR team reviews every application against the role and gets back to shortlisted candidates.',
  },
  {
    step: '03',
    title: 'Interview & Offer',
    text: "We'll walk you through next steps, interviews and, if it's a match, an offer to join the team.",
  },
]

const areaIcons = {
  'Software Engineering': (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5L2 12l6 7M16 5l6 7-6 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  'QA & Testing': (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  'DevOps & Cloud': (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 18a4.5 4.5 0 01-.5-9 5.5 5.5 0 0110.7-1.8A4 4 0 0117.5 15H17" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 18h10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  ),
  'IT Support': (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 13a8 8 0 0116 0" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="2.5" y="13" width="4" height="6" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="17.5" y="13" width="4" height="6" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M19.5 19v1a3 3 0 01-3 3h-3" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  ),
  'Digital Marketing': (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 11v2a1 1 0 001 1h2l5 4V6L6 10H4a1 1 0 00-1 1z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <path d="M16 9a3 3 0 010 6M18.5 6.5a7 7 0 010 11" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  ),
  'Creative & Content': (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 19l7-7 3 3-7 7H12v-3z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <path d="M18.5 5.5a2.1 2.1 0 013 3L20 10l-3-3 1.5-1.5z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <path d="M3 21c.5-3 2-5 5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  ),
  'Customer Support': (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 12a9 9 0 10-4.5 7.8L21 21l-1.2-4.5A8.96 8.96 0 0021 12z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
    </svg>
  ),
  'Business Operations': (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="8" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  Administration: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M9 8h6M9 12h6M9 16h3" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  ),
}

const Careers = () => {
  const heroRef = useRef(null)
  const vacanciesRef = useRef(null)
  const [heroVisible, setHeroVisible] = useState(false)
  const [vacanciesVisible, setVacanciesVisible] = useState(false)
  const [activeArea, setActiveArea] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [vacancies, setVacancies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showGeneralForm, setShowGeneralForm] = useState(false)

  useEffect(() => {
    const observers = []

    const observe = (ref, setVisible) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        },
        { threshold: 0.15 }
      )
      if (ref.current) observer.observe(ref.current)
      observers.push(observer)
    }

    observe(heroRef, setHeroVisible)
    observe(vacanciesRef, setVacanciesVisible)

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  useEffect(() => {
    const fetchVacancies = async () => {
      const { data } = await supabase
        .from('vacancies')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      setVacancies(data || [])
      setLoading(false)
    }

    fetchVacancies()
  }, [])

  const scrollToVacancies = () => {
    vacanciesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleAreaClick = (area) => {
    setActiveArea((prev) => (prev === area ? 'All' : area))
    scrollToVacancies()
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    scrollToVacancies()
  }

  const query = searchQuery.trim().toLowerCase()
  const filteredVacancies = vacancies
    .filter((v) => activeArea === 'All' || v.area === activeArea)
    .filter(
      (v) =>
        !query ||
        v.title.toLowerCase().includes(query) ||
        v.area.toLowerCase().includes(query) ||
        v.location.toLowerCase().includes(query)
    )

  return (
    <>
      <section className="cp-hero" ref={heroRef}>
        <div className={`cp-hero-content ${heroVisible ? 'in-view' : ''}`}>
          <span className="cp-eyebrow">Careers</span>
          <h1>Build Your Career With Ezugi</h1>
          <p className="cp-lead">
            Join a growing organization working with technology, digital marketing and global
            business operations.
          </p>
          <p className="cp-lead">
            We provide opportunities for professionals who want to develop their skills, work
            with international clients and build long-term careers.
          </p>

          <button type="button" className="cp-scroll-btn" onClick={scrollToVacancies}>
            View Open Positions
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4v16M5 13l7 7 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </section>

      <section className="cp-why">
        <h2>Why Join Ezugi</h2>
        <div className="cp-why-grid">
          {whyCards.map((card) => (
            <div className="cp-why-card" key={card.title}>
              <div className="cp-why-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cp-people">
        <div className="cp-people-image">
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80"
            alt="Ezugi team working together"
          />
        </div>
        <div className="cp-people-text">
          <span className="cp-eyebrow">Our People</span>
          <h2>People Power Our Services</h2>
          <p className="cp-lead">
            Our strength is our people. Ezugi brings together professionals across Technology,
            Digital Marketing and Business Operations.
          </p>
          <p className="cp-lead">
            We build teams around our clients' requirements and provide the flexibility to scale
            those teams as their businesses evolve giving our people room to grow alongside them.
          </p>
        </div>
      </section>

      <section className="cp-areas">
        <span className="cp-eyebrow">Explore</span>
        <h2>Browse by Career Area</h2>
        <p className="cp-lead cp-areas-lead">
          Pick an area to jump straight to matching open positions.
        </p>
        <div className="cp-areas-grid">
          {careerAreas.map((area) => (
            <button className="cp-area-card" key={area} onClick={() => handleAreaClick(area)}>
              <span className="cp-area-icon">{areaIcons[area]}</span>
              <span className="cp-area-name">{area}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="cp-process">
        <h2>How to Apply</h2>
        <div className="cp-process-grid">
          {applySteps.map((s) => (
            <div className="cp-process-card" key={s.step}>
              <span className="cp-process-step">{s.step}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cp-vacancies" ref={vacanciesRef} id="open-positions">
        <div className={`cp-vacancies-inner ${vacanciesVisible ? 'in-view' : ''}`}>
          <h2>Current Vacancies</h2>

          <div className="cp-search-wrap">
            <form className="cp-search-form" onSubmit={handleSearchSubmit} role="search">
              <svg className="cp-search-icon" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                placeholder="Search job title, area or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search vacancies"
              />
              <button type="submit" className="cp-search-btn">
                Search
              </button>
            </form>
          </div>

          <div className="cp-filters">
            <button
              className={`cp-filter ${activeArea === 'All' ? 'active' : ''}`}
              onClick={() => setActiveArea('All')}
            >
              All
            </button>
            {careerAreas.map((area) => (
              <button
                key={area}
                className={`cp-filter ${activeArea === area ? 'active' : ''}`}
                onClick={() => setActiveArea(area)}
              >
                {area}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="cp-empty">Loading vacancies...</p>
          ) : filteredVacancies.length > 0 ? (
            <div className="cp-vacancy-list">
              {filteredVacancies.map((job) => (
                <div className="cp-vacancy-card" key={job.id}>
                  <div className="cp-vacancy-header">
                    <h3>{job.title}</h3>
                    <span className="cp-vacancy-area">{job.area}</span>
                  </div>
                  <div className="cp-vacancy-meta">
                    <span>{job.location}</span>
                    <span>{job.type}</span>
                  </div>
                  <p className="cp-vacancy-summary">{job.summary}</p>
                  <Link className="cp-apply-btn" to={`/careers/${job.id}`}>
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="cp-empty">No vacancies match your search right now. Check back soon.</p>
          )}

          <div className="cp-talent-cta">
            <h3>Don't See the Right Role?</h3>
            <p>
              We're always happy to hear from good people. Send us your CV and we'll reach out
              when a matching opportunity opens up.
            </p>
            {showGeneralForm ? (
              <ApplyForm successMessage="Thank you! We've received your CV and will reach out if a matching opportunity opens up." />
            ) : (
              <button type="button" className="cp-scroll-btn" onClick={() => setShowGeneralForm(true)}>
                Send Your CV
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default Careers

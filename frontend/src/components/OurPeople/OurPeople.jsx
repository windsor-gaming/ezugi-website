import React, { useEffect, useRef, useState } from 'react'
import './OurPeople.css'
 
/* ------------------------------------------------------------------
   CONTENT — swap the image paths once the professional photos are ready.
   Leave `image: null` to show the branded initials placeholder.
------------------------------------------------------------------- */
const TEAMS = [
  {
    id: 'tech',
    title: 'Technology',
    roles: ['Software Engineers', 'QA Engineers', 'DevOps', 'Cloud', 'Data'],
    // TODO: replace with IT team photo
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80',
    alt: 'Ezugi technology team',
  },
  {
    id: 'marketing',
    title: 'Marketing',
    roles: ['Digital Marketing', 'Social Media', 'SEO', 'Content', 'Creative'],
    // TODO: replace with Maleesha, Waruni & Krishan photo
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80',
    alt: 'Ezugi marketing team',
  },
  {
    id: 'ops',
    title: 'Business Operations',
    roles: ['Customer Support', 'Administration', 'Sales Support', 'Back Office'],
    // TODO: replace with operations team photo
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&q=80',
    alt: 'Ezugi business operations team',
  },
]
 
const LEADERSHIP = [
  { name: 'Full Name', role: 'Chief Executive Officer', tag: 'CEO', image: null },
  { name: 'Full Name', role: 'Chief Financial Officer', tag: 'CFO', image: null },
  { name: 'Full Name', role: 'Chief People Officer', tag: 'CPO', image: null },
]
 
const CORPORATE = [
  { name: 'Waruni', role: 'Corporate Team', image: null },
  { name: 'Maleesha', role: 'Corporate Team', image: null },
  { name: 'Dhanushka', role: 'Corporate Team', image: null },
]
 
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
 
const initials = (name) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
 
const PersonCard = ({ person, index, variant }) => (
  <article
    className={`op-person op-person--${variant}`}
    style={{ '--i': index }}
  >
    <div className="op-person-photo">
      {person.image ? (
        <img src={person.image} alt={`${person.name}, ${person.role}`} loading="lazy" />
      ) : (
        <div className="op-person-placeholder" aria-hidden="true">
          <span>{person.tag || initials(person.name)}</span>
        </div>
      )}
    </div>
    <div className="op-person-meta">
      <h4>{person.name}</h4>
      <p>{person.role}</p>
    </div>
  </article>
)
 
const OurPeople = () => {
  const [introRef, introIn] = useInView()
  const [teamsRef, teamsIn] = useInView(0.15)
  const [leadRef, leadIn] = useInView(0.15)
  const [corpRef, corpIn] = useInView(0.15)
  const [active, setActive] = useState(0)
 
  return (
    <section className="our-people" id="our-people">
      {/* ---------- Intro ---------- */}
      <header ref={introRef} className={`op-intro reveal ${introIn ? 'in-view' : ''}`}>
        <div>
          <span className="op-eyebrow">Our People</span>
          <h2>
            People Power <span className="op-accent">Our Services</span>
          </h2>
        </div>
        <div className="op-intro-copy">
          <p className="op-lead op-lead--strong">Our strength is our people.</p>
          <p className="op-lead">
            Ezugi brings together professionals across technology, marketing
            and business operations.
          </p>
        </div>
      </header>
 
       {/* ---------- Teams accordion ---------- */}
      <div
        ref={teamsRef}
        className={`op-teams reveal ${teamsIn ? 'in-view' : ''}`}
        role="tablist"
        aria-label="Our teams"
      >
        {TEAMS.map((team, i) => {
          const isActive = active === i
          return (
            <button
              key={team.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`op-team ${isActive ? 'is-active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              <img src={team.image} alt={team.alt} loading="lazy" />
              <span className="op-team-shade" aria-hidden="true" />
 
              <span className="op-team-body">
                <span className="op-team-title">{team.title}</span>
                <span className="op-team-roles">
                  {team.roles.map((r) => (
                    <span key={r} className="op-chip">{r}</span>
                  ))}
                </span>
              </span>
            </button>
          )
        })}
      </div>
 
      {/* ---------- Statement ---------- */}
      <p className={`op-statement reveal ${teamsIn ? 'in-view' : ''}`}>
        We build teams around our clients' requirements and provide the
        flexibility to <span className="intro-highlight">scale those teams</span> as their businesses evolve.
      </p>
 
      {/* ---------- Leadership ---------- */}
      <div ref={leadRef} className={`op-group reveal ${leadIn ? 'in-view' : ''}`}>
        <div className="op-group-head">
          <span className="op-eyebrow">Leadership</span>
          <h3>The Minds Behind Our Growth</h3>
        </div>
        <div className="op-grid op-grid--lead">
          {LEADERSHIP.map((p, i) => (
            <PersonCard key={p.role} person={p} index={i} variant="lead" />
          ))}
        </div>
      </div>
 
      {/* ---------- Corporate Division ---------- */}
      <div ref={corpRef} className={`op-group op-group--corp reveal ${corpIn ? 'in-view' : ''}`}>
        <div className="op-group-head">
          <span className="op-eyebrow">Corporate Division</span>
          <h3>Corporate Team</h3>
        </div>
        <div className="op-grid op-grid--corp">
          {CORPORATE.map((p, i) => (
            <PersonCard key={p.name} person={p} index={i} variant="corp" />
          ))}
        </div>
      </div>
    </section>
  )
}
 
export default OurPeople
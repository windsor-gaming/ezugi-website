import React, { useEffect, useRef, useState } from 'react'
import './HowItWorks.css'

const steps = [
  {
    number: '01',
    title: 'Discover',
    tag: 'Strategy & Research',
    duration: '1–2 weeks',
    description:
      'We start by understanding your business, your users, and the problem you\u2019re actually trying to solve — not just the feature you asked for. This is where assumptions get tested and priorities get clear.',
    deliverables: [
      'Stakeholder interviews & workshops',
      'User research and competitive analysis',
      'Technical feasibility assessment',
      'Defined project scope and success metrics',
    ],
  },
  {
    number: '02',
    title: 'Design',
    tag: 'UX / UI',
    duration: '2–4 weeks',
    description:
      'We map out the experience end to end — user flows, wireframes, and interface design — so every screen has a purpose before a single line of code gets written. You review and refine at every stage.',
    deliverables: [
      'User flow diagrams & information architecture',
      'Interactive prototypes',
      'Visual design system (colors, type, components)',
      'Usability testing with real users',
    ],
  },
  {
    number: '03',
    title: 'Build',
    tag: 'Engineering',
    duration: '6–12 weeks',
    description:
      'Our engineers turn approved designs into working software — clean architecture, tested code, and infrastructure that scales with you as you grow. You get visibility into progress the whole way through.',
    deliverables: [
      'Sprint-based development with regular demos',
      'Automated testing & code review',
      'Scalable cloud infrastructure setup',
      'Staging environment for early feedback',
    ],
  },
  {
    number: '04',
    title: 'Launch & Grow',
    tag: 'Support & Iteration',
    duration: 'Ongoing',
    description:
      'We ship, monitor, and keep improving — using real usage data to guide what comes next. Launch isn\u2019t the finish line; it\u2019s where we start learning what actually works for your users.',
    deliverables: [
      'Production deployment & monitoring setup',
      'Performance tracking and analytics',
      '24/7 support and incident response',
      'Iterative feature releases based on data',
    ],
  },
]

const HowItWorks = () => {
  const sectionRef = useRef(null)
  const [fillPercent, setFillPercent] = useState(0)
  const [visibleSteps, setVisibleSteps] = useState([])

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const sectionHeight = rect.height

      const start = viewportHeight * 0.8
      const raw = (start - rect.top) / (sectionHeight - viewportHeight * 0.4)
      const clamped = Math.min(Math.max(raw, 0), 1)

      setFillPercent(clamped * 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observers = []
    const nodes = sectionRef.current?.querySelectorAll('.hiw-step')

    nodes?.forEach((node) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const index = Number(node.dataset.index)
            setVisibleSteps((prev) => (prev.includes(index) ? prev : [...prev, index]))
          }
        },
        { threshold: 0.4 }
      )
      observer.observe(node)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <section className="how-it-works" ref={sectionRef}>
      <div className="hiw-header">
        <span className="hiw-eyebrow">How It Works</span>
        <h2 className="hiw-title">From Idea to Impact</h2>
        <p className="hiw-subtitle">
          A simple, transparent process that keeps you involved at every step.
        </p>
      </div>

      <div className="hiw-timeline">
        <div className="hiw-line-track">
          <div className="hiw-line-fill" style={{ height: `${fillPercent}%` }} />
        </div>

        {steps.map((step, index) => (
          <div
            className={`hiw-step ${index % 2 === 0 ? 'left' : 'right'} ${
              visibleSteps.includes(index) ? 'in-view' : ''
            }`}
            data-index={index}
            key={index}
          >
            <div className="hiw-step-card">
  <div className="hiw-step-meta">
    <span className="hiw-step-tag">{step.tag}</span>
    <span className="hiw-step-duration">{step.duration}</span>
  </div>
  <h3 className="hiw-step-title">{step.title}</h3>
  <p className="hiw-step-description">{step.description}</p>
  <ul className="hiw-step-deliverables">
    {step.deliverables.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
</div>

            <div className="hiw-step-node">
              <span>{step.number}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HowItWorks
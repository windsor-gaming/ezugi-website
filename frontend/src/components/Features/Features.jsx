import React from 'react'
import './Features.css'

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <polyline points="8 6 2 12 8 18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="16 6 22 12 16 18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="14" y1="4" x2="10" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: 'Technology Expertise',
    description: 'Access experienced professionals across software engineering, cloud, DevOps, QA, data and enterprise technology.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="17" cy="8" r="2.6" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M15.5 14.2c2.7.4 4.8 2.7 4.8 5.8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
    title: 'Skilled Professionals',
    description: 'Build teams across technology, marketing, customer service and business operations.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="9" cy="6" r="2" fill="currentColor" />
        <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="16" cy="12" r="2" fill="currentColor" />
        <line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="11" cy="18" r="2" fill="currentColor" />
      </svg>
    ),
    title: 'Flexible Delivery ',
    description: 'Choose project-based, dedicated-team, staff augmentation or managed-service models.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
        <ellipse cx="12" cy="12" rx="4" ry="9" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" />
        <path d="M5.5 6.5c1.8 1.2 4.1 2 6.5 2s4.7-.8 6.5-2M5.5 17.5c1.8-1.2 4.1-2 6.5-2s4.7.8 6.5 2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
    title: 'Offshore Advantage',
    description: 'Access Sri Lankan professional talent through an efficient offshore delivery model.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 20h4V10H3v10zM10 20h4V4h-4v16zM17 20h4v14h-4V13z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
        <path d="M3 20h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: 'Scalable Operations',
    description: 'Increase or reduce your team according to business requirements.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>
    ),
    title: 'Global Business Focus',
    description: 'Our delivery approach is designed around the requirements of international organizations.',
  },
]

const Features = () => {
  return (
    <section className="features">
      <div className="features-header">
        <span className="features-eyebrow">Why Ezugi?</span>
        <h2 className="features-title">One Partner. Multiple Capabilities</h2>
        {/*<p className="features-subtitle">
          Everything we build starts with one question: how does this make things better for the people who use it?
        </p>*/}
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features
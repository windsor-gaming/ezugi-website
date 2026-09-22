import React, { useEffect, useRef, useState } from 'react'
import './Services.css'

const services = [
  {
    title: 'Consult & Design',
    description: 'We work with you to define strategy, map user needs, and design the right solution before a single line of code is written.',
    points: [
      'Discovery & research workshops',
      'UX/UI design and prototyping',
      'Technical architecture planning',
      'Roadmap & scope definition',
    ],
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20l9-9-9-9-9 9 9 9z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
        <circle cx="12" cy="11" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    title: 'Engineer & Build',
    description: 'Full-cycle software development — from architecture to deployment — built for scale, security, and speed.',
    points: [
      'Custom web & mobile development',
      'API design and integrations',
      'Cloud-native infrastructure',
      'Automated testing & CI/CD',
    ],
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Optimize & Support',
    description: 'Ongoing monitoring, performance tuning, and support that keeps your product improving long after launch.',
    points: [
      '24/7 monitoring & incident response',
      'Performance & cost optimization',
      'Feature iteration & maintenance',
      'Dedicated support team',
    ],
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
]

const industries = [
  'Banking & Financial Services',
  'Healthcare',
  'Retail & E-commerce',
  'Manufacturing',
  'Media & Entertainment',
  'Travel & Hospitality',
  'Insurance',
  'Logistics & Transportation',
]

const Services = () => {
  const [activeTab, setActiveTab] = useState('services')
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="services-industries" ref={sectionRef}>
      <div className={`si-header ${isVisible ? 'in-view' : ''}`}>
        <span className="si-eyebrow">What We Offer</span>
        <h2 className="si-title">Built for Every Business, Across Every Industry</h2>
      </div>

      <div className={`si-tabs ${isVisible ? 'in-view' : ''}`}>
        <button
          className={`si-tab ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          Services
        </button>
        <button
          className={`si-tab ${activeTab === 'industries' ? 'active' : ''}`}
          onClick={() => setActiveTab('industries')}
        >
          Industries
        </button>
      </div>

      <div className={`si-content ${isVisible ? 'in-view' : ''}`}>
        {activeTab === 'services' ? (
          <div className="si-services-grid">
            {services.map((service, index) => (
              <div className="si-service-card" key={index}>
                <div className="si-service-top">
                  <span className="si-service-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="si-service-icon">{service.icon}</div>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul className="si-service-points">
                  {service.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
                <a href="#" className="si-service-link">
                  Learn more
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="si-industries-grid">
            {industries.map((industry, index) => (
              <div className="si-industry-chip" key={index}>
                {industry}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Services
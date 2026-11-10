import React, { useEffect, useRef, useState } from 'react'
import './Industries.css'

const industries = [
  {
    title: 'Travel & Tourism',
    description: 'Technology, digital marketing, customer communication and back-office operations.',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&q=80',
  },
  {
    title: 'Technology & SaaS',
    description: 'Software development, engineering teams, cloud and technology operations.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&q=80',
  },
  {
    title: 'Financial & Professional Services',
    description: 'Technology, digital marketing, administrative and operational support.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80',
  },
  {
    title: 'E-Commerce & Digital Businesses',
    description: 'Technology platforms, digital marketing, customer support and business operations.',
    image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=900&q=80',
  },
  {
    title: 'Hospitality',
    description: 'Digital marketing, customer support and operational services.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80',
  },
  {
    title: 'Startups & Growing Businesses',
    description: 'Flexible technology teams, marketing support and scalable operational resources.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80',
  },
]

const Industries = () => {
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
    <section className="industries" ref={sectionRef}>
      <div className={`industries-header ${isVisible ? 'in-view' : ''}`}>
        <span className="industries-eyebrow">Industries We Serve</span>
        <h2 className="industries-title">Technology for Different Business Needs</h2>
        <p className="industries-subtitle">
          Our services can be adapted to organizations across multiple industries.
        </p>
      </div>

      <div className="industries-grid">
        {industries.map((industry, index) => (
          <div
            className={`industry-tile ${isVisible ? 'in-view' : ''}`}
            style={{ transitionDelay: isVisible ? `${index * 90}ms` : '0ms' }}
            key={industry.title}
          >
            <img src={industry.image} alt={industry.title} className="industry-tile-image" />
            <div className="industry-tile-overlay" />

            <div className="industry-tile-content">
              <h3 className="industry-tile-title">{industry.title}</h3>
              <p className="industry-tile-description">{industry.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Industries
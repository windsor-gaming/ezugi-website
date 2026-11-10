import React, { useEffect, useRef, useState } from 'react'
import './WhoWeAre.css'

const WhoWeAre = () => {
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
      { threshold: 0.2 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="who-we-are" ref={sectionRef}>
      <div className={`wwa-text ${isVisible ? 'in-view' : ''}`}>
        <span className="wwa-eyebrow">Who We Are?</span>
        <h2>Your Partner for Technology, Growth & Talent</h2>

        <p className="wwa-lead">
          Ezugi (Pvt) Ltd provides professional services to international
          organizations through a flexible offshore and onshore delivery
          model. Our objective is simple: give businesses access to the right
          technology, the right people and the right digital capabilities to
          grow their operations efficiently.
        </p>

        <p className="wwa-lead">
          Our teams work alongside client organizations to deliver technology
          projects, execute digital marketing initiatives, provide specialized
          professionals and manage selected business processes. Whether you
          need to develop a software platform, strengthen your digital
          presence or expand your operational team, Ezugi provides a flexible
          way to access the required expertise.
        </p>

        <div className="wwa-links">
          <a href="#">Learn more about us</a>
          <a href="#">Explore our services</a>
        </div>
      </div>

      <div className={`wwa-images ${isVisible ? 'in-view' : ''}`}>
        <div className="wwa-image wwa-image-1">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80"
            alt="Ezugi team collaborating"
          />
        </div>
        <div className="wwa-image wwa-image-2">
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80"
            alt="Ezugi professionals reviewing work"
          />
        </div>
      </div>
    </section>
  )
}

export default WhoWeAre
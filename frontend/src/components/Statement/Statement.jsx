import React, { useEffect, useRef, useState } from 'react'
import './Statement.css'

const Statement = () => {
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
    <section className="statement" ref={sectionRef}>
      <div className={`statement-text ${isVisible ? 'in-view' : ''}`}>
        <h2>
          The world is constantly changing, and businesses need more than
          just software — they need a partner who helps them move forward.
        </h2>
        <div className="statement-links">
          <a href="#">Learn more about us</a>
          <a href="#">Explore our work</a>
        </div>
      </div>

      <div className={`statement-images ${isVisible ? 'in-view' : ''}`}>
        <div className="statement-image statement-image-1">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80"
            alt="Team collaborating on software"
          />
        </div>
        <div className="statement-image statement-image-2">
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80"
            alt="Engineers reviewing a product"
          />
        </div>
      </div>
    </section>
  )
}

export default Statement
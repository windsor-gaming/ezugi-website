import React, { useEffect, useRef, useState } from 'react'
import './Intro.css'

const Intro = () => {
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
      { threshold: 0.3 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="intro" ref={sectionRef}>
      <p className={`intro-text ${isVisible ? 'in-view' : ''}`}>
        We are a Sri Lankan-based global business services company providing{' '}
        <span className="intro-highlight">Technology Solutions</span>,{' '}
        <span className="intro-highlight">Digital Marketing</span> and{' '}
        <span className="intro-highlight">Human Resources & BPO</span> services
        to organizations looking to build, grow and scale their operations.
      </p>
    </section>
  )
}

export default Intro
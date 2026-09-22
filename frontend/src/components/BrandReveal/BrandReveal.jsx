import React, { useEffect, useRef, useState } from 'react'
import './BrandReveal.css'

const letters = ['E', 'z', 'u', 'g', 'i']
const colors = ['var(--accent)', 'var(--text)', 'var(--accent-hover)', 'var(--text)', 'var(--accent)']

const BrandReveal = () => {
  const sectionRef = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const scrollableHeight = rect.height - viewportHeight

      if (scrollableHeight <= 0) return

      const raw = -rect.top / scrollableHeight
      const clamped = Math.min(Math.max(raw, 0), 1)
      setProgress(clamped)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="brand-reveal" ref={sectionRef}>
      <div className="brand-sticky">
        <h2 className="brand-word">
          {letters.map((letter, index) => {
            const step = 1 / letters.length
            const letterStart = index * step * 0.7
            const letterProgress = Math.min(
              Math.max((progress - letterStart) / (step * 1.3), 0),
              1
            )

            return (
              <span
                key={index}
                className="brand-letter"
                style={{
                  color: letterProgress > 0.5 ? colors[index] : 'transparent',
                  WebkitTextStroke:
                    letterProgress > 0.5 ? '0px transparent' : '1.5px var(--text)',
                  transform: `translateY(${(1 - letterProgress) * 40}px) scale(${
                    0.85 + letterProgress * 0.15
                  })`,
                  opacity: 0.3 + letterProgress * 0.7,
                }}
              >
                {letter}
              </span>
            )
          })}
        </h2>
      </div>
    </section>
  )
}

export default BrandReveal
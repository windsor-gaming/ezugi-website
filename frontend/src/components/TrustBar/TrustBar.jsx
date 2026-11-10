import React from 'react'
import './TrustBar.css'

const logos = [
  'Nexora',
  'Bytewave',
  'Corelink',
  'Vantix',
  'Streamly',
  'Pulsegrid',
  'Fortivo',
  'Quantara',
]

const TrustBar = () => {
  return (
    <section className="trust-bar">
      <p className="trust-label">Trusted by teams building the future</p>

      <div className="trust-marquee">
        <div className="trust-track">
          {logos.map((logo, index) => (
            <span className="trust-logo" key={`a-${index}`}>
              {logo}
            </span>
          ))}
          {logos.map((logo, index) => (
            <span className="trust-logo" key={`b-${index}`} aria-hidden="true">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustBar
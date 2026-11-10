import React, { useEffect, useRef, useState } from 'react'
import './DeliveryModel.css'

const stages = [
  {
    label: 'Client',
    tag: 'Strategic Control',
    items: ['Business Strategy', 'Requirements', 'Product Direction', 'Business Management'],
  },
  {
    label: 'Ezugi',
    tag: 'Execution Partner',
    items: ['Project Management', 'Technology', 'Digital Marketing', 'Staff Augmentation', 'BPO Operations'],
  },
  {
    label: 'Delivery',
    tag: 'Outcomes',
    items: ['Software', 'Digital Campaigns', 'Customer Support', 'Business Operations', 'Technology Services'],
  },
]

const DeliveryModel = () => {
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
    <section className={`delivery-model ${isVisible ? 'in-view' : ''}`} ref={sectionRef}>
      <div className="dm-header">
        <span className="dm-eyebrow">Our Delivery Model</span>
        <h2 className="dm-title">On-Shore + Off-Shore</h2>
        <p className="dm-subtitle">
          Ezugi's operating model connects the client's business requirements
          with our Sri Lankan delivery teams.
        </p>
      </div>

      <div className="dm-orbit">
        <svg className="dm-path-svg" viewBox="0 0 1200 240" preserveAspectRatio="none" aria-hidden="true">
          <path
            id="dm-path"
            className="dm-path-base"
            d="M 100 60 C 350 220, 500 20, 600 120 C 700 220, 850 20, 1100 60"
            fill="none"
          />
          <path
            className="dm-path-fill"
            d="M 100 60 C 350 220, 500 20, 600 120 C 700 220, 850 20, 1100 60"
            fill="none"
          />
          <circle className="dm-comet" r="5">
            <animateMotion dur="5s" repeatCount="indefinite" rotate="auto">
              <mpath href="#dm-path" />
            </animateMotion>
          </circle>
        </svg>

        {stages.map((stage, index) => (
          <div
            className="dm-node"
            style={{ transitionDelay: `${index * 250}ms` }}
            key={stage.label}
          >
            <div className={`dm-ring ${index === 1 ? 'dm-ring-primary' : ''}`}>
              <span className="dm-ring-number">{String(index + 1).padStart(2, '0')}</span>
            </div>

            <span className="dm-node-tag">{stage.tag}</span>
            <h3 className="dm-node-label">{stage.label}</h3>

            <div className="dm-node-pills">
              {stage.items.map((item, i) => (
                <span
                  className="dm-pill"
                  style={{ transitionDelay: `${index * 250 + 400 + i * 80}ms` }}
                  key={item}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="dm-footnote">
        This model enables businesses to maintain strategic control while
        leveraging Ezugi's professional teams for execution and delivery.
      </p>
    </section>
  )
}

export default DeliveryModel
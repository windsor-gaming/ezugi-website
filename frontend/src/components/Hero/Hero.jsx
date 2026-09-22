import React, { useRef, useState } from 'react'
import './Hero.css'

const Hero = () => {
  const videoRef = useRef(null)
  const [isMuted, setIsMuted] = useState(true)

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
    }
  }

  return (
    <section className="hero-video">
      <video
        ref={videoRef}
        className="hero-video-bg"
        src="/videos/hero.mp4"
        poster="/videos/hero-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="hero-video-overlay" />

      <div className="hero-video-content">
        <h1 className="hero-title">Technology. Marketing. People.</h1>
        <p className="hero-subtitle">
          Enabling Global Businesses Through Technology, Digital Growth and Talent.
        </p>
        <div className="hero-actions">
          <a href="#" className="hero-cta">Get Started</a>
          <a href="#" className="hero-cta-secondary">Our Services</a>
        </div>
      </div>

      
    </section>
  )
}

export default Hero
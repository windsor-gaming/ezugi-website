import React, { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import './Reviews.css'

const Reviews = () => {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .from('reviews')
        .select('id, author_name, author_title, rating, content')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (data) setReviews(data)
    }

    fetchReviews()
  }, [])

  useEffect(() => {
    if (reviews.length === 0) return

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
  }, [reviews.length])

  // Hide the whole section until HR has published at least one review
  if (reviews.length === 0) return null

  return (
    <section className="reviews" ref={sectionRef}>
      <div className={`rv-heading ${isVisible ? 'in-view' : ''}`}>
        <span className="rv-eyebrow">Testimonials</span>
        <h2>What Our Clients Say</h2>
      </div>

      <div className={`rv-grid ${isVisible ? 'in-view' : ''}`}>
        {reviews.map((review) => (
          <figure className="rv-card" key={review.id}>
            {review.rating && (
              <span className="rv-stars" aria-label={`${review.rating} out of 5`}>
                {'★'.repeat(review.rating)}
                {'☆'.repeat(5 - review.rating)}
              </span>
            )}
            <blockquote>{review.content}</blockquote>
            <figcaption>
              <span className="rv-author">{review.author_name}</span>
              {review.author_title && <span className="rv-author-title">{review.author_title}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export default Reviews

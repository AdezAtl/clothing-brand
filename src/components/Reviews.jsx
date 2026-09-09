import React from 'react';
import { REVIEWS } from '../data/products';
import { Star, CheckCircle } from 'lucide-react';

export default function Reviews() {
  return (
    <section className="reviews-section" id="reviews" aria-labelledby="reviews-heading">
      <div className="container">
        <div style={{ maxWidth: '640px' }}>
          <div className="badge badge-terracotta" style={{ marginBottom: '8px' }}>
            Customer Feedback
          </div>
          <h2 id="reviews-heading">Verified Fit Notes from Ibadan</h2>
          <p style={{ marginTop: '8px' }}>
            Real reviews from customers who ordered bike delivery or tried pieces in our Challenge fitting room.
          </p>
        </div>

        <div className="review-grid">
          {REVIEWS.map((review) => (
            <article key={review.id} className="review-card">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div className="review-stars" aria-label="5 out of 5 stars">
                    ★★★★★
                  </div>
                  <span className="badge" style={{ fontSize: '0.68rem' }}>
                    <CheckCircle size={10} style={{ color: 'var(--color-evergreen)' }} />
                    Verified Order
                  </span>
                </div>

                <blockquote className="review-text">
                  "{review.text}"
                </blockquote>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
                <div className="review-author">{review.author}</div>
                <div className="review-meta">
                  {review.location} • <strong style={{ color: 'var(--color-ink)' }}>{review.piece}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

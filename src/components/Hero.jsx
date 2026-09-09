import React from 'react';
import { ArrowDown, Check, ShoppingBag, MapPin, Truck } from 'lucide-react';
import GarmentVisual from './GarmentVisual';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { formatNaira } from '../utils/formatters';

export default function Hero() {
  const { addToCart, setIsCartOpen } = useCart();
  const featured = PRODUCTS[0]; // Ankara wrap dress

  return (
    <section className="hero-section" aria-labelledby="hero-heading">
      <div className="container hero-grid">
        {/* Left Column: Factual Editorial Narrative */}
        <div>
          <div className="hero-lead-eyebrow">
            <span className="badge badge-terracotta">Ready-to-Wear</span>
            <span className="mono" style={{ color: 'var(--color-ink-muted)' }}>
              Challenge, Ibadan
            </span>
          </div>

          <h1 id="hero-heading" className="hero-title">
            Made to fit.<br />
            Delivered <em style={{ fontStyle: 'italic', color: 'var(--color-terracotta)' }}>today</em>.
          </h1>

          <p className="hero-description">
            Tailored dresses, two-piece sets, and clean-cut office workwear for women in Ibadan. 
            Try on pieces at our Challenge boutique, or order before 2:00 PM for same-day bike dispatch to Bodija, Akobo, Ring Road, and Oluyole.
          </p>

          <div className="hero-cta-group">
            <a href="#catalog" className="btn btn-primary btn-lg">
              <span>View In-Stock Pieces</span>
              <ArrowDown size={16} />
            </a>
            <a href="#visit" className="btn btn-secondary btn-lg">
              <MapPin size={16} />
              <span>Visit Challenge Store</span>
            </a>
          </div>

          {/* Verifiable Store Metric Strip */}
          <div className="hero-proof-bar">
            <div>
              <div className="proof-item-title">Same-Day</div>
              <div className="proof-item-label">Bike dispatch across Ibadan</div>
            </div>
            <div>
              <div className="proof-item-title">₦13k – ₦24k</div>
              <div className="proof-item-label">Direct boutique retail pricing</div>
            </div>
            <div>
              <div className="proof-item-title">UK 8 – 18</div>
              <div className="proof-item-label">Specific inch measurements</div>
            </div>
            <div>
              <div className="proof-item-title">Mon – Sat</div>
              <div className="proof-item-label">39 Oladoyinbo St, Challenge</div>
            </div>
          </div>
        </div>

        {/* Right Column: Weekly Standout Garment Frame */}
        <div className="hero-frame-container">
          <div className="hero-editorial-card">
            <div className="hero-visual-frame">
              <GarmentVisual
                pattern={featured.pattern}
                accentColor={featured.accentColor}
                className="w-full h-full"
              />
              <div style={{ position: 'absolute', top: 12, right: 12 }}>
                <span className="badge badge-evergreen">Featured Piece</span>
              </div>
            </div>

            <div className="hero-card-footer">
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-ink-muted)' }}>
                  {featured.category} • {featured.fabric}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600, marginTop: '2px' }}>
                  {featured.name}
                </div>
                <div className="mono" style={{ fontSize: '1rem', color: 'var(--color-evergreen)', fontWeight: 600, marginTop: '2px' }}>
                  {formatNaira(featured.price)}
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => addToCart(featured, 'M')}
                style={{ alignSelf: 'flex-end' }}
              >
                <ShoppingBag size={14} />
                <span>Add M to Bag</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

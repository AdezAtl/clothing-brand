import React, { useState } from 'react';
import { ShoppingBag, Check, MessageSquare, Info } from 'lucide-react';
import GarmentVisual from './GarmentVisual';
import { useCart } from '../context/CartContext';
import { formatNaira, buildWhatsAppInquiryUrl } from '../utils/formatters';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product, selectedSize);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article className="product-card" id={`item-${product.id}`}>
      <div className="card-media">
        <GarmentVisual pattern={product.pattern} accentColor={product.accentColor} />

        <div className="card-badges">
          <span className="badge">
            {product.stock > 0 ? `${product.stock} in stock` : 'Restocking'}
          </span>
          <span className="badge badge-terracotta" style={{ textTransform: 'capitalize' }}>
            {product.color.split('&')[0]}
          </span>
        </div>

        <div className="card-quick-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ flex: 1, background: 'rgba(255,255,255,0.92)' }}
            onClick={() => onQuickView(product)}
          >
            <Info size={13} />
            <span>Fit Details</span>
          </button>
          <a
            href={buildWhatsAppInquiryUrl(product, selectedSize)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm"
            style={{ background: 'rgba(255,255,255,0.92)' }}
            title="Ask about this piece on WhatsApp"
            aria-label={`Ask about ${product.name} on WhatsApp`}
          >
            <MessageSquare size={13} />
          </a>
        </div>
      </div>

      <div className="card-content">
        <div className="card-category-row">
          <span className="card-category">{product.category}</span>
          <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--color-ink-muted)' }}>
            {product.fabric.split('(')[0].trim()}
          </span>
        </div>

        <h3 className="card-title">{product.name}</h3>
        <p className="card-tagline">{product.tagline}</p>

        {/* Sizing selector pills */}
        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Select Size:
            </span>
            {product.measurements[selectedSize] && (
              <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--color-evergreen)' }}>
                {product.measurements[selectedSize].split('|')[0].trim()}
              </span>
            )}
          </div>

          <div className="size-selector">
            {product.sizes.map((sz) => (
              <button
                key={sz}
                type="button"
                className={`size-pill ${selectedSize === sz ? 'selected' : ''}`}
                onClick={() => setSelectedSize(sz)}
                aria-label={`Select size ${sz}`}
              >
                {sz}
              </button>
            ))}
          </div>

          <div className="card-footer">
            <span className="card-price">{formatNaira(product.price)}</span>
            <button
              type="button"
              className={`btn btn-sm ${justAdded ? 'btn-terracotta' : 'btn-primary'}`}
              onClick={handleAdd}
              disabled={product.stock === 0}
            >
              {justAdded ? (
                <>
                  <Check size={14} />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={14} />
                  <span>Add to Bag</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

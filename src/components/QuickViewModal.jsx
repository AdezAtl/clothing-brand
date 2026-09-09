import React, { useState } from 'react';
import { X, ShoppingBag, Check, MessageSquare, ShieldCheck } from 'lucide-react';
import GarmentVisual from './GarmentVisual';
import { useCart } from '../context/CartContext';
import { formatNaira, buildWhatsAppInquiryUrl } from '../utils/formatters';

export default function QuickViewModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || 'M');
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-overlay open" role="dialog" aria-modal="true">
      <div className="modal-box" style={{ maxWidth: '680px' }}>
        <div className="modal-header">
          <div>
            <span className="card-category">{product.category}</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>
              {product.name}
            </h3>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            aria-label="Close details"
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px', alignItems: 'flex-start' }}>
          <div style={{ background: 'var(--bg-subtle)', borderRadius: '6px', overflow: 'hidden', padding: '12px' }}>
            <GarmentVisual pattern={product.pattern} accentColor={product.accentColor} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-evergreen)' }}>
                {formatNaira(product.price)}
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-ink)', marginTop: '4px', lineHeight: 1.5 }}>
                {product.tagline}
              </p>
            </div>

            <div style={{ background: 'var(--bg-linen)', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '10px 12px', fontSize: '0.82rem' }}>
              <div><strong>Fabric:</strong> {product.fabric}</div>
              <div style={{ marginTop: '4px' }}><strong>Color:</strong> {product.color}</div>
              <div style={{ marginTop: '4px' }}><strong>Fit Note:</strong> {product.fit}</div>
            </div>

            {/* Sizing selection */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, color: 'var(--color-ink-muted)', marginBottom: '6px' }}>
                Select Your Size:
              </label>
              <div className="size-selector">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    className={`size-pill ${selectedSize === sz ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(sz)}
                    style={{ minWidth: '32px', height: '30px' }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
              {product.measurements[selectedSize] && (
                <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-ink-muted)', marginTop: '4px' }}>
                  Specs: {product.measurements[selectedSize]}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
              <button
                type="button"
                className={`btn btn-full ${added ? 'btn-terracotta' : 'btn-primary'}`}
                onClick={handleAdd}
              >
                {added ? (
                  <>
                    <Check size={16} />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>Add {selectedSize} to Bag ({formatNaira(product.price)})</span>
                  </>
                )}
              </button>

              <a
                href={buildWhatsAppInquiryUrl(product, selectedSize)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-full btn-sm"
              >
                <MessageSquare size={14} />
                <span>Ask about this in Challenge boutique</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

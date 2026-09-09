import React from 'react';
import { STORE_INFO } from '../data/products';
import { useCart } from '../context/CartContext';

export default function Footer({ onSelectCategory, onGoToAdmin }) {
  const { setIsSizingModalOpen } = useCart();

  return (
    <footer className="site-footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h4 style={{ color: 'var(--color-evergreen)' }}>Lola's Hub</h4>
            <p style={{ marginTop: '8px', maxWidth: '320px' }}>
              Ready-to-wear boutique tailored for Ibadan women. Physical storefront, private fitting rooms, and verified same-day bike dispatch.
            </p>
            <p style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--color-ink-muted)' }}>
              39, Oladoyinbo Street, Off Rainbow Junction, Felele Straight, Challenge, Ibadan, Oyo State, Nigeria (200254).
            </p>
          </div>

          <div className="footer-col">
            <h4>Collections</h4>
            <ul className="footer-links">
              <li>
                <a href="#catalog" onClick={() => onSelectCategory('Dresses')}>
                  Dresses
                </a>
              </li>
              <li>
                <a href="#catalog" onClick={() => onSelectCategory('Two-Piece')}>
                  Two-Piece Sets
                </a>
              </li>
              <li>
                <a href="#catalog" onClick={() => onSelectCategory('Workwear')}>
                  Office Workwear
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsSizingModalOpen(true)}
                  style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'var(--color-ink-muted)', cursor: 'pointer', textAlign: 'left' }}
                >
                  Size & Fit Guide
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Store Hours</h4>
            <p><strong>Monday – Saturday:</strong></p>
            <p>9:00 AM – 7:00 PM</p>
            <p style={{ marginTop: '8px' }}><strong>Sundays:</strong></p>
            <p>Closed for rest & fabric sourcing</p>
          </div>

          <div className="footer-col">
            <h4>Direct & Backoffice</h4>
            <ul className="footer-links">
              <li>
                <a href={STORE_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer">
                  WhatsApp Direct
                </a>
              </li>
              <li>
                <a href={STORE_INFO.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram (@_lolashub)
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onGoToAdmin}
                  style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'var(--color-terracotta)', fontWeight: 500, cursor: 'pointer', textAlign: 'left' }}
                >
                  Challenge Admin Portal →
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Lola's Hub. Ready-to-wear tailored for Ibadan women.</span>
          <span className="mono">Challenge • Bodija • Akobo • Ring Road</span>
        </div>
      </div>
    </footer>
  );
}

import React from 'react';
import { ShoppingBag, Ruler } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatNaira } from '../utils/formatters';

export default function Navbar({ onSelectCategory, activeCategory, onGoToAdmin }) {
  const { cart, totalItems, subtotal, setIsCartOpen, setIsSizingModalOpen } = useCart();

  return (
    <header className="site-nav">
      <div className="container site-nav-inner">
        <a href="#" className="site-logo" aria-label="Lola's Hub Home">
          Lola's Hub
          <span>IBADAN</span>
        </a>

        <nav className="nav-links" aria-label="Primary navigation">
          <a
            href="#catalog"
            className={`nav-link ${activeCategory === 'All Pieces' ? 'active' : ''}`}
            onClick={() => onSelectCategory('All Pieces')}
          >
            All Pieces
          </a>
          <a
            href="#catalog"
            className={`nav-link ${activeCategory === 'Dresses' ? 'active' : ''}`}
            onClick={() => onSelectCategory('Dresses')}
          >
            Dresses
          </a>
          <a
            href="#catalog"
            className={`nav-link ${activeCategory === 'Two-Piece' ? 'active' : ''}`}
            onClick={() => onSelectCategory('Two-Piece')}
          >
            Two-Piece Sets
          </a>
          <a
            href="#catalog"
            className={`nav-link ${activeCategory === 'Workwear' ? 'active' : ''}`}
            onClick={() => onSelectCategory('Workwear')}
          >
            Workwear
          </a>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setIsSizingModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}
          >
            <Ruler size={14} />
            Size Guide
          </button>
          <a href="#visit" className="nav-link">
            Visit Boutique
          </a>
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="btn btn-ghost btn-sm top-notice-hide-mobile"
            onClick={onGoToAdmin}
            style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)' }}
          >
            Admin Portal
          </button>
          <button
            type="button"
            className="cart-button"
            onClick={() => setIsCartOpen(true)}
            aria-label={`Open shopping bag with ${totalItems} items`}
          >
            <ShoppingBag size={17} />
            <span className="top-notice-hide-mobile" style={{ fontSize: '0.82rem', fontWeight: 500 }}>
              {cart.length > 0 ? formatNaira(subtotal) : 'Bag'}
            </span>
            <span className="cart-badge">{totalItems}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

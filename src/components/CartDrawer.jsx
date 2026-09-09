import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, MessageSquare, ArrowRight, ShieldCheck, Bike, Store, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatNaira, DELIVERY_OPTIONS, buildWhatsAppOrderUrl } from '../utils/formatters';
import GarmentVisual from './GarmentVisual';

export default function CartDrawer() {
  const {
    cart,
    totalItems,
    subtotal,
    total,
    selectedDelivery,
    setSelectedDelivery,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    updateQuantity,
    removeFromCart
  } = useCart();

  const handleWhatsAppOrder = () => {
    const url = buildWhatsAppOrderUrl({
      items: cart,
      delivery: selectedDelivery,
      customer: { name: '', phone: '', address: '' },
      subtotal,
      total
    });
    window.open(url, '_blank');
  };

  const handleProceedToPayment = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cart-overlay ${isCartOpen ? 'open' : ''}`}
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`cart-drawer ${isCartOpen ? 'open' : ''}`}
        aria-label="Your shopping bag"
        aria-modal="true"
        role="dialog"
      >
        <div className="cart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={18} />
            <h3>Your Shopping Bag</h3>
            <span className="badge badge-evergreen">{totalItems}</span>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close bag"
          >
            <X size={18} />
          </button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={40} style={{ color: 'var(--color-border-dark)', strokeWidth: 1.5 }} />
              <h4 style={{ marginTop: '16px' }}>Your bag is empty</h4>
              <p style={{ fontSize: '0.85rem' }}>
                Explore in-stock dresses, sets, and trousers tailored for Ibadan.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setIsCartOpen(false)}
              >
                Browse In-Stock Pieces
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.cartItemId} className="cart-item">
                <div className="cart-item-thumb">
                  <GarmentVisual
                    pattern={item.pattern}
                    accentColor={item.accentColor}
                    className="w-full h-full"
                  />
                </div>

                <div className="cart-item-info">
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 className="cart-item-title">{item.name}</h4>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="btn-ghost"
                        style={{ border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--color-ink-muted)' }}
                        aria-label={`Remove ${item.name} from bag`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="cart-item-meta" style={{ marginTop: '2px' }}>
                      Size: <strong>{item.size}</strong> • {item.fabric.split('(')[0].trim()}
                    </div>
                  </div>

                  <div className="cart-item-qty-row">
                    <div className="qty-controls">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateQuantity(item.cartItemId, -1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateQuantity(item.cartItemId, 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <span className="mono" style={{ fontWeight: 600, color: 'var(--color-evergreen)' }}>
                      {formatNaira(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            {/* Delivery Method Selection */}
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-ink-muted)', fontWeight: 600 }}>
                Delivery Method:
              </span>
              <div className="delivery-selector" style={{ marginTop: '6px' }}>
                {DELIVERY_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`delivery-option ${selectedDelivery.id === opt.id ? 'active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="deliveryOption"
                      checked={selectedDelivery.id === opt.id}
                      onChange={() => setSelectedDelivery(opt)}
                      style={{ marginTop: '3px' }}
                    />
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500 }}>
                        <span>{opt.title}</span>
                        <span className="mono">{opt.price === 0 ? 'FREE' : formatNaira(opt.price)}</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-muted)' }}>
                        {opt.eta}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Calculations */}
            <div className="cart-summary-row">
              <span>Subtotal ({totalItems} items)</span>
              <span className="mono">{formatNaira(subtotal)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Delivery</span>
              <span className="mono">
                {selectedDelivery.price === 0 ? 'Free (Challenge pickup)' : formatNaira(selectedDelivery.price)}
              </span>
            </div>
            <div className="cart-summary-row total">
              <span>Total</span>
              <span className="mono" style={{ color: 'var(--color-evergreen)' }}>
                {formatNaira(total)}
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
              <button
                type="button"
                className="btn btn-primary btn-full"
                onClick={handleProceedToPayment}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                className="btn btn-whatsapp btn-full"
                onClick={handleWhatsAppOrder}
              >
                <MessageSquare size={16} />
                <span>Or Order via WhatsApp</span>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-ink-muted)', marginTop: '4px' }}>
              <ShieldCheck size={14} style={{ color: 'var(--color-evergreen)' }} />
              <span>48-hour size exchange guarantee on all orders</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

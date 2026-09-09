import React, { useState } from 'react';
import { X, CheckCircle, Copy, Check, CreditCard, Landmark, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatNaira, buildWhatsAppOrderUrl } from '../utils/formatters';
import { StoreManager } from '../services/storeManager';

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    total,
    subtotal,
    selectedDelivery,
    clearCart
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState('transfer'); // 'transfer' | 'card'
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });

  if (!isCheckoutOpen) return null;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('0123456789');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!customer.name || !customer.phone) {
      alert('Please provide your name and phone number for delivery.');
      return;
    }

    setIsProcessing(true);
    // Simulate real gateway/order creation
    setTimeout(() => {
      const created = StoreManager.createOrder({
        customer: customer.name,
        phone: customer.phone,
        address: customer.address || 'Pickup at Challenge Boutique',
        items: cart.map(it => ({ name: it.name, size: it.size, quantity: it.quantity, price: it.price })),
        total,
        delivery: selectedDelivery.title,
        paymentMethod: paymentMethod === 'card' ? 'Online Card (Paystack)' : 'Bank Transfer'
      });
      setOrderId(created.id);
      setIsProcessing(false);
      setOrderComplete(true);
      clearCart();
    }, 1200);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setOrderComplete(false);
  };

  const handleWhatsAppReceipt = () => {
    const lines = [
      `*ORDER CONFIRMATION #${orderId}*`,
      `Customer: ${customer.name}`,
      `Phone: ${customer.phone}`,
      `Delivery: ${customer.address || 'Pickup at Challenge'}`,
      `Method: ${paymentMethod === 'card' ? 'Online Card Payment' : 'Direct Bank Transfer'}`,
      `Total: ${formatNaira(total)}`,
      `Please confirm receipt of order #${orderId}!`
    ];
    const text = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/2348140000000?text=${text}`, '_blank');
  };

  return (
    <div className="modal-overlay open" role="dialog" aria-modal="true">
      <div className="modal-box">
        <div className="modal-header">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>
            {orderComplete ? 'Order Confirmed' : 'Complete Your Order'}
          </h3>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={handleClose}
            aria-label="Close checkout"
          >
            <X size={18} />
          </button>
        </div>

        {orderComplete ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ display: 'inline-flex', padding: '12px', background: '#E8EFEA', borderRadius: '50%', color: 'var(--color-evergreen)', marginBottom: '16px' }}>
              <CheckCircle size={42} />
            </div>

            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
              Order #{orderId} Received!
            </h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}>
              Thank you, <strong>{customer.name}</strong>. We are preparing your pieces at our Challenge boutique.
            </p>

            <div style={{ background: 'var(--bg-linen)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '16px', textAlign: 'left', marginBottom: '24px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--color-ink-muted)' }}>Status:</span>
                <span className="badge badge-evergreen">Awaiting Dispatch</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--color-ink-muted)' }}>Dispatch Window:</span>
                <span style={{ fontWeight: 500 }}>{selectedDelivery.eta}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-ink-muted)' }}>Delivery Contact:</span>
                <span style={{ fontWeight: 500 }}>{customer.phone}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-whatsapp btn-full"
                onClick={handleWhatsAppReceipt}
              >
                <MessageSquare size={16} />
                <span>Notify Lola's Hub on WhatsApp</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-full"
                onClick={handleClose}
              >
                Back to Store
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder}>
            {/* Customer Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-ink-muted)' }}>
                1. Delivery Details
              </h4>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '4px', fontWeight: 500 }}>
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Funmilayo Adeleke"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '1px solid var(--color-border-dark)',
                    fontFamily: 'inherit',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '4px', fontWeight: 500 }}>
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0814 000 0000"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '1px solid var(--color-border-dark)',
                    fontFamily: 'inherit',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '4px', fontWeight: 500 }}>
                  Delivery Address / Landmark (Ibadan)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 14 Awolowo Avenue, Old Bodija, Ibadan"
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '1px solid var(--color-border-dark)',
                    fontFamily: 'inherit',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-ink-muted)', marginBottom: '10px' }}>
                2. Select Payment Method
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('transfer')}
                  style={{
                    padding: '12px',
                    border: `1.5px solid ${paymentMethod === 'transfer' ? 'var(--color-evergreen)' : 'var(--color-border)'}`,
                    background: paymentMethod === 'transfer' ? '#F3F7F4' : '#FFFFFF',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 500
                  }}
                >
                  <Landmark size={18} color="var(--color-evergreen)" />
                  <span>Bank Transfer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    padding: '12px',
                    border: `1.5px solid ${paymentMethod === 'card' ? 'var(--color-evergreen)' : 'var(--color-border)'}`,
                    background: paymentMethod === 'card' ? '#F3F7F4' : '#FFFFFF',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 500
                  }}
                >
                  <CreditCard size={18} color="var(--color-evergreen)" />
                  <span>Card / Paystack</span>
                </button>
              </div>

              {/* Payment Details Container */}
              {paymentMethod === 'transfer' ? (
                <div style={{ background: 'var(--bg-linen)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '14px', fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-evergreen)', marginBottom: '6px' }}>
                    Lola's Hub Official Account:
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--color-ink-muted)' }}>Bank:</span>
                    <span style={{ fontWeight: 500 }}>Access Bank PLC</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--color-ink-muted)' }}>Account Number:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="mono" style={{ fontWeight: 600 }}>0123456789</span>
                      <button
                        type="button"
                        onClick={handleCopyAccount}
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '2px 6px', fontSize: '0.72rem' }}
                        aria-label="Copy account number"
                      >
                        {copied ? <Check size={12} color="green" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-ink-muted)' }}>Account Name:</span>
                    <span style={{ fontWeight: 500 }}>LOLA'S HUB BOUTIQUE</span>
                  </div>
                </div>
              ) : (
                <div style={{ background: 'var(--bg-linen)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '14px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-evergreen)', fontWeight: 500 }}>
                    <ShieldCheck size={18} />
                    <span>Instant Secure Payment via Paystack</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', marginTop: '6px' }}>
                    Supports Mastercard, Visa, Verve, USSD, and Apple Pay.
                  </p>
                </div>
              )}
            </div>

            {/* Total summary */}
            <div style={{ padding: '12px 0', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)' }}>Total Amount to Pay:</div>
                <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-evergreen)' }}>
                  {formatNaira(total)}
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--color-ink-muted)' }}>
                Includes {selectedDelivery.title}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <span>Confirm Order ({formatNaira(total)})</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

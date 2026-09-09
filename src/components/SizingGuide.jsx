import React from 'react';
import { X, Ruler, CheckCircle, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { STORE_INFO } from '../data/products';

export default function SizingGuide() {
  const { isSizingModalOpen, setIsSizingModalOpen } = useCart();

  if (!isSizingModalOpen) return null;

  return (
    <div className="modal-overlay open" role="dialog" aria-modal="true">
      <div className="modal-box" style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ruler size={18} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>
              Size & Fit Verification
            </h3>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setIsSizingModalOpen(false)}
            aria-label="Close size guide"
          >
            <X size={18} />
          </button>
        </div>

        <div>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-ink-muted)', marginBottom: '16px' }}>
            All Lola's Hub garments are cut for Nigerian women's proportions with generous hip and bust ease. Measure around the fullest part of your bust and natural waistline.
          </p>

          <table className="measurement-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>UK Equivalent</th>
                <th>Bust (Inches)</th>
                <th>Waist (Inches)</th>
                <th>Hips (Inches)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>S</strong></td>
                <td>UK 8 – 10</td>
                <td>33" – 35"</td>
                <td>26" – 28"</td>
                <td>36" – 38"</td>
              </tr>
              <tr>
                <td><strong>M</strong></td>
                <td>UK 12</td>
                <td>36" – 38"</td>
                <td>29" – 31"</td>
                <td>39" – 41"</td>
              </tr>
              <tr>
                <td><strong>L</strong></td>
                <td>UK 14</td>
                <td>39" – 41"</td>
                <td>32" – 34"</td>
                <td>42" – 44"</td>
              </tr>
              <tr>
                <td><strong>XL</strong></td>
                <td>UK 16 – 18</td>
                <td>42" – 45"</td>
                <td>35" – 38"</td>
                <td>45" – 48"</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: '20px', background: 'var(--bg-linen)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--color-evergreen)', fontSize: '0.88rem', marginBottom: '6px' }}>
              <CheckCircle size={16} />
              <span>In-Shop Alteration & Exchange Guarantee</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-ink-muted)', lineHeight: 1.5 }}>
              Visit our boutique at 39 Oladoyinbo Street, Challenge to try on any piece in our fitting room. If an online order doesn't fit, exchange it within 48 hours or bring it into the shop for complimentary hem or waist adjustment.
            </p>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <a
              href={STORE_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-sm"
            >
              <MessageSquare size={14} />
              <span>Chat with Sizing Specialist</span>
            </a>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setIsSizingModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

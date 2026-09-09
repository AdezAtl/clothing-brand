import React from 'react';
import { Clock, MapPin, MessageCircle } from 'lucide-react';
import { STORE_INFO } from '../data/products';

export default function TopNotice() {
  return (
    <aside className="top-notice" aria-label="Store announcement">
      <div className="container top-notice-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={13} style={{ opacity: 0.8 }} />
          <span>
            <strong className="top-notice-highlight">Ibadan Same-Day:</strong> Order by 2:00 PM for bike dispatch today
          </span>
        </div>
        
        <div className="top-notice-hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={13} style={{ opacity: 0.8 }} />
            39 Oladoyinbo St, Challenge (Fitting Room Open)
          </span>
          <a
            href={STORE_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FFFFFF', textDecoration: 'underline' }}
          >
            <MessageCircle size={12} />
            Quick Sizing Help
          </a>
        </div>
      </div>
    </aside>
  );
}

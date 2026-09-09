import React from 'react';
import { MapPin, Clock, Shield, Phone, ExternalLink } from 'lucide-react';
import { STORE_INFO } from '../data/products';

export default function StoreVisit() {
  return (
    <section className="visit-section" id="visit" aria-labelledby="visit-heading">
      <div className="container">
        <div className="visit-card">
          <div>
            <div className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', borderColor: 'transparent', marginBottom: '12px' }}>
              Physical Fitting Room
            </div>
            <h2 id="visit-heading" style={{ color: '#FFFFFF', marginBottom: '12px' }}>
              Visit our boutique in Challenge, Ibadan.
            </h2>
            <p style={{ color: '#D6E2D9', fontSize: '0.95rem', maxWidth: '480px' }}>
              Step in to feel fabrics in person, try on different sizes in our private fitting room, and get instant hem adjustments before walking out.
            </p>

            <ul className="visit-details-list">
              <li className="visit-detail-item">
                <MapPin size={18} style={{ color: '#EFB08C', flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Address:</strong> 39, Oladoyinbo Street, Off Rainbow Junction, Felele Straight, Challenge, Ibadan (200254)
                </span>
              </li>
              <li className="visit-detail-item">
                <Clock size={18} style={{ color: '#EFB08C', flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Opening Hours:</strong> Monday through Saturday, 9:00 AM – 7:00 PM
                </span>
              </li>
              <li className="visit-detail-item">
                <Shield size={18} style={{ color: '#EFB08C', flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Guarantee:</strong> Complimentary sizing tweaks on all purchases
                </span>
              </li>
            </ul>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
              <a
                href={STORE_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-terracotta"
              >
                <span>Get Directions on WhatsApp</span>
              </a>
              <a
                href="https://maps.google.com/?q=39+Oladoyinbo+Street+Challenge+Ibadan"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }}
              >
                <span>Open in Google Maps</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <div className="visit-map-box">
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#EFB08C', fontWeight: 600 }}>
              Quick Neighborhood Reference
            </div>
            <div style={{ fontSize: '0.88rem', color: '#E8EFEA', lineHeight: 1.6 }}>
              From <strong>Challenge Roundabout</strong>, head down Felele Straight. Turn off Rainbow Junction into Oladoyinbo Street. Lola's Hub is located at No. 39 with visible frontage signboards.
            </div>

            <div style={{ background: 'rgba(0,0,0,0.15)', borderRadius: '4px', padding: '12px', marginTop: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#C3D5C7' }}>Dispatch Times to Common Destinations:</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginTop: '6px' }}>
                <span>Challenge / Felele:</span>
                <strong className="mono">15 – 25 mins</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginTop: '4px' }}>
                <span>Ring Road / Oluyole:</span>
                <strong className="mono">25 – 40 mins</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginTop: '4px' }}>
                <span>Bodija / Secretariat:</span>
                <strong className="mono">40 – 60 mins</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

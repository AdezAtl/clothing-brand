import React from 'react';

/**
 * Editorial garment illustrations for Lola's Hub catalog.
 * Distinctive tailoring lines, textures, and palettes.
 */
export default function GarmentVisual({ pattern, accentColor = '#1E4A2C', className = '' }) {
  switch (pattern) {
    case 'ankara-wrap':
      return (
        <svg className={className} viewBox="0 0 320 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Subtle warm halo */}
          <circle cx="230" cy="110" r="70" fill="#EAD9BA" opacity="0.6" />
          {/* Hanger */}
          <path d="M160 48 L160 66" stroke="#46423C" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M136 78 Q160 54 184 78" stroke="#46423C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="160" cy="46" r="4.5" fill="#46423C" />
          {/* Sleeves */}
          <path d="M118 120 L94 162 L120 174 L138 136 Z" fill="#1E4A2C" />
          <path d="M202 120 L226 162 L200 174 L182 136 Z" fill="#1E4A2C" />
          {/* Bodice */}
          <path d="M126 122 L194 122 L186 200 L134 200 Z" fill="#245735" />
          <path d="M138 122 L160 160 L182 122" stroke="#FBF9F5" strokeWidth="2.5" />
          {/* Ankara sash */}
          <path d="M134 144 L212 192 L206 208 L128 160 Z" fill="#C86D3B" />
          <path d="M186 200 L234 272 L224 280 L180 210 Z" fill="#C86D3B" />
          {/* Flare Skirt */}
          <path d="M134 200 L186 200 L232 340 L88 340 Z" fill="#1E4A2C" />
          {/* Center line & stitching */}
          <path d="M160 200 L160 340" stroke="#13331E" strokeWidth="1.8" opacity="0.4" />
          <path d="M96 332 L224 332" stroke="#FAF6EE" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.8" />
          {/* Pleat folds */}
          <path d="M120 216 L104 334" stroke="#13331E" strokeWidth="1.2" opacity="0.3" />
          <path d="M200 216 L216 334" stroke="#13331E" strokeWidth="1.2" opacity="0.3" />
        </svg>
      );

    case 'two-piece':
      return (
        <svg className={className} viewBox="0 0 320 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="90" cy="110" r="65" fill="#D6E5DB" opacity="0.6" />
          {/* Hanger */}
          <path d="M160 48 L160 66" stroke="#46423C" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M136 78 Q160 54 184 78" stroke="#46423C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="160" cy="46" r="4.5" fill="#46423C" />
          {/* Tunic Top */}
          <path d="M122 108 L198 108 L206 208 L114 208 Z" fill="#14402A" />
          {/* Boatneck */}
          <path d="M134 108 Q160 118 186 108" stroke="#FBF9F5" strokeWidth="2" fill="none" />
          {/* Side slit */}
          <path d="M114 184 L114 208" stroke="#0E2D1E" strokeWidth="2.5" />
          <path d="M206 184 L206 208" stroke="#0E2D1E" strokeWidth="2.5" />
          {/* Pants */}
          <path d="M124 218 L196 218 L204 350 L168 350 L160 258 L152 350 L116 350 Z" fill="#1A4F34" />
          {/* Taper creases */}
          <path d="M138 226 L134 346" stroke="#0E2D1E" strokeWidth="1.2" opacity="0.4" />
          <path d="M182 226 L186 346" stroke="#0E2D1E" strokeWidth="1.2" opacity="0.4" />
          {/* Button accents */}
          <circle cx="160" cy="144" r="2.5" fill="#C86D3B" />
          <circle cx="160" cy="168" r="2.5" fill="#C86D3B" />
        </svg>
      );

    case 'trouser':
      return (
        <svg className={className} viewBox="0 0 320 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="210" cy="140" r="70" fill="#E2E7ED" opacity="0.7" />
          {/* Trouser Hanger bar */}
          <path d="M160 62 L160 76" stroke="#46423C" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M110 90 L210 90" stroke="#46423C" strokeWidth="3" strokeLinecap="round" />
          <circle cx="160" cy="60" r="4.5" fill="#46423C" />
          {/* High Waistband */}
          <rect x="114" y="98" width="92" height="16" rx="2" fill="#1B2433" />
          <path d="M158 98 L158 114" stroke="#FAF9F5" strokeWidth="1.5" />
          {/* Trouser Legs */}
          <path d="M114 114 L206 114 L202 350 L166 350 L160 178 L154 350 L118 350 Z" fill="#243044" />
          {/* Front Creases */}
          <path d="M136 122 L136 346" stroke="#131B26" strokeWidth="1.5" />
          <path d="M184 122 L184 346" stroke="#131B26" strokeWidth="1.5" />
          {/* Side Slanted Pockets */}
          <path d="M116 124 L130 148" stroke="#FAF9F5" strokeWidth="1.5" opacity="0.7" />
          <path d="M204 124 L190 148" stroke="#FAF9F5" strokeWidth="1.5" opacity="0.7" />
        </svg>
      );

    case 'skirt':
      return (
        <svg className={className} viewBox="0 0 320 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="120" r="60" fill="#F4E2D8" opacity="0.7" />
          {/* Hanger */}
          <path d="M160 72 L160 86" stroke="#46423C" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M120 98 L200 98" stroke="#46423C" strokeWidth="3" strokeLinecap="round" />
          <circle cx="160" cy="70" r="4.5" fill="#46423C" />
          {/* Elastic Waistband */}
          <rect x="126" y="106" width="68" height="14" rx="2" fill="#B65328" />
          {/* Pleated Skirt Body */}
          <path d="M126 120 L194 120 L234 330 L86 330 Z" fill="#C86D3B" />
          {/* Knife Pleats */}
          {[106, 122, 138, 154, 170, 186, 202, 218].map((x, i) => (
            <path
              key={i}
              d={`M${130 + i * 8} 120 L${x} 328`}
              stroke="#98411C"
              strokeWidth="1.5"
              opacity="0.6"
            />
          ))}
          {/* Hem bottom */}
          <path d="M88 328 L232 328" stroke="#FAF9F5" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
        </svg>
      );

    case 'blazer':
      return (
        <svg className={className} viewBox="0 0 320 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="220" cy="110" r="65" fill="#E8E2D5" opacity="0.7" />
          {/* Hanger */}
          <path d="M160 48 L160 66" stroke="#46423C" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M136 78 Q160 54 184 78" stroke="#46423C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="160" cy="46" r="4.5" fill="#46423C" />
          {/* Sleeves */}
          <path d="M106 112 L84 220 L110 226 L124 130 Z" fill="#8C7D64" />
          <path d="M214 112 L236 220 L210 226 L196 130 Z" fill="#8C7D64" />
          {/* Blazer Torso */}
          <path d="M118 112 L202 112 L208 240 L112 240 Z" fill="#9C8D74" />
          {/* Notch Lapels */}
          <path d="M130 112 L150 162 L136 186 L154 186 L160 214 L160 112" fill="#756750" />
          <path d="M190 112 L170 162 L184 186 L166 186 L160 214 L160 112" fill="#6A5C47" />
          {/* Single Horn Button */}
          <circle cx="160" cy="216" r="4" fill="#3B2A1D" stroke="#EAE5DB" strokeWidth="1" />
          {/* Flap Pockets */}
          <rect x="122" y="210" width="26" height="8" rx="1" fill="#756750" />
          <rect x="172" y="210" width="26" height="8" rx="1" fill="#756750" />
        </svg>
      );

    case 'floral-dress':
      return (
        <svg className={className} viewBox="0 0 320 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="95" cy="115" r="65" fill="#DEE5EB" opacity="0.6" />
          {/* Hanger */}
          <path d="M160 48 L160 66" stroke="#46423C" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M136 78 Q160 54 184 78" stroke="#46423C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="160" cy="46" r="4.5" fill="#46423C" />
          {/* Sleeveless Bodice */}
          <path d="M132 114 L188 114 L182 178 L138 178 Z" fill="#2D3A4B" />
          {/* V-neck */}
          <path d="M144 114 L160 148 L176 114" stroke="#FBF9F5" strokeWidth="2" fill="none" />
          {/* Tiered A-Line Skirt */}
          <path d="M138 178 L182 178 L204 250 L116 250 Z" fill="#354458" />
          <path d="M114 250 L206 250 L228 340 L92 340 Z" fill="#2D3A4B" />
          {/* Tier gather line */}
          <path d="M115 250 L205 250" stroke="#C86D3B" strokeWidth="1.5" strokeDasharray="3 3" />
          {/* Floral Petal Accents */}
          <circle cx="160" cy="215" r="3" fill="#E8B54D" />
          <circle cx="140" cy="290" r="3" fill="#E8B54D" />
          <circle cx="180" cy="305" r="3" fill="#E8B54D" />
          <circle cx="155" cy="320" r="2.5" fill="#E8B54D" />
        </svg>
      );

    case 'denim-set':
      return (
        <svg className={className} viewBox="0 0 320 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="215" cy="115" r="65" fill="#D3DDE8" opacity="0.6" />
          {/* Hanger */}
          <path d="M160 48 L160 66" stroke="#46423C" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M136 78 Q160 54 184 78" stroke="#46423C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="160" cy="46" r="4.5" fill="#46423C" />
          {/* Cropped Denim Jacket */}
          <path d="M116 110 L204 110 L200 190 L120 190 Z" fill="#1F344D" />
          {/* Contrast Gold Stitching */}
          <path d="M160 110 L160 190" stroke="#C8963E" strokeWidth="1.5" />
          <path d="M122 188 L198 188" stroke="#C8963E" strokeWidth="1.5" />
          {/* Chest Pockets */}
          <rect x="126" y="132" width="20" height="20" rx="2" fill="#294463" stroke="#C8963E" strokeWidth="1" />
          <rect x="174" y="132" width="20" height="20" rx="2" fill="#294463" stroke="#C8963E" strokeWidth="1" />
          {/* Matching Denim Skirt */}
          <path d="M128 200 L192 200 L212 325 L108 325 Z" fill="#1F344D" />
          {/* Center Seam */}
          <path d="M160 200 L160 325" stroke="#C8963E" strokeWidth="1.5" strokeDasharray="4 3" />
        </svg>
      );

    case 'palazzo':
      return (
        <svg className={className} viewBox="0 0 320 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="105" cy="130" r="70" fill="#E4E8DF" opacity="0.6" />
          {/* Hanger */}
          <path d="M160 62 L160 76" stroke="#46423C" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M110 90 L210 90" stroke="#46423C" strokeWidth="3" strokeLinecap="round" />
          <circle cx="160" cy="60" r="4.5" fill="#46423C" />
          {/* High Fitted Waist */}
          <rect x="120" y="98" width="80" height="14" rx="2" fill="#3B4734" />
          {/* Wide Dramatic Palazzo Legs */}
          <path d="M120 112 L200 112 L228 350 L170 350 L160 200 L150 350 L92 350 Z" fill="#46543E" />
          {/* Deep Fluid Pleats */}
          <path d="M136 112 L120 346" stroke="#2D3728" strokeWidth="1.2" opacity="0.5" />
          <path d="M184 112 L200 346" stroke="#2D3728" strokeWidth="1.2" opacity="0.5" />
          <path d="M148 112 L140 346" stroke="#2D3728" strokeWidth="1.2" opacity="0.35" />
          <path d="M172 112 L180 346" stroke="#2D3728" strokeWidth="1.2" opacity="0.35" />
        </svg>
      );

    default:
      return (
        <svg className={className} viewBox="0 0 320 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="160" cy="180" r="60" fill="#EAE5DB" />
          <path d="M130 140 L190 140 L180 260 L140 260 Z" fill={accentColor} />
        </svg>
      );
  }
}

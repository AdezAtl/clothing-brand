/**
 * Lola's Hub — Curated Ready-to-Wear Catalog
 * Physical Store: 39 Oladoyinbo Street, Challenge, Ibadan
 * Direct Retail focus: ready-to-wear dresses, two-piece sets, and workwear.
 */

export const PRODUCTS = [
  {
    id: 'p1',
    name: 'Ankara Wrap Dress',
    tagline: 'Flattering crossover front with self-tie waist belt',
    category: 'Dresses',
    price: 18500,
    sizes: ['S', 'M', 'L'],
    stock: 6,
    fabric: '100% Wax Cotton Ankara',
    color: 'Forest Green & Gold Ochre',
    fit: 'True to size with adjustable crossover belt',
    measurements: {
      S: 'Bust 34" | Waist 27" | Length 44"',
      M: 'Bust 37" | Waist 30" | Length 45"',
      L: 'Bust 40" | Waist 33" | Length 46"'
    },
    accentColor: '#1E4A2C',
    pattern: 'ankara-wrap'
  },
  {
    id: 'p2',
    name: 'Emerald Two-Piece Set',
    tagline: 'Sleeveless boatneck tunic with tapered matching trousers',
    category: 'Two-Piece',
    price: 24000,
    sizes: ['M', 'L', 'XL'],
    stock: 5,
    fabric: 'Heavy Crepe Blend with breathable drape',
    color: 'Deep Emerald',
    fit: 'Relaxed top, elasticated back waistband on trousers',
    measurements: {
      M: 'Top Length 25" | Trouser Waist 29-31" | Inseam 30"',
      L: 'Top Length 26" | Trouser Waist 32-34" | Inseam 30.5"',
      XL: 'Top Length 27" | Trouser Waist 35-37" | Inseam 31"'
    },
    accentColor: '#14402A',
    pattern: 'two-piece'
  },
  {
    id: 'p3',
    name: 'Straight-Leg Office Trouser',
    tagline: 'High-waisted cut with clean front crease and side pockets',
    category: 'Workwear',
    price: 15500,
    sizes: ['28', '30', '32', '34'],
    stock: 12,
    fabric: 'Structured Suiting Poly-Viscose (Wrinkle-Resistant)',
    color: 'Midnight Navy',
    fit: 'High rise, tailored straight leg from knee to ankle',
    measurements: {
      '28': 'Waist 28" | Hips 37" | Inseam 31"',
      '30': 'Waist 30" | Hips 39" | Inseam 31.5"',
      '32': 'Waist 32" | Hips 41" | Inseam 32"',
      '34': 'Waist 34" | Hips 43" | Inseam 32"'
    },
    accentColor: '#1B2433',
    pattern: 'trouser'
  },
  {
    id: 'p4',
    name: 'Pleated Midi Skirt',
    tagline: 'Permanent knife pleats with enclosed comfort elastic waist',
    category: 'Dresses',
    price: 13000,
    sizes: ['S', 'M', 'L'],
    stock: 9,
    fabric: 'Chiffon-finish twill with full cotton lining',
    color: 'Terracotta Rust',
    fit: 'A-line flare, falls mid-calf on 5\'5" height',
    measurements: {
      S: 'Waist 26-28" | Length 33"',
      M: 'Waist 29-31" | Length 33.5"',
      L: 'Waist 32-34" | Length 34"'
    },
    accentColor: '#B65328',
    pattern: 'skirt'
  },
  {
    id: 'p5',
    name: 'Structured Blazer Top',
    tagline: 'Single-button tailored jacket with notch lapel',
    category: 'Workwear',
    price: 21000,
    sizes: ['S', 'M', 'L'],
    stock: 4,
    fabric: 'Textured Linen-Cotton Weave with satin lining',
    color: 'Bone Ivory & Tortoiseshell Buttons',
    fit: 'Tailored shoulder with slight boxy modern torso',
    measurements: {
      S: 'Shoulder 15.5" | Bust 35" | Length 26"',
      M: 'Shoulder 16.2" | Bust 38" | Length 26.5"',
      L: 'Shoulder 17.0" | Bust 41" | Length 27"'
    },
    accentColor: '#7A6B53',
    pattern: 'blazer'
  },
  {
    id: 'p6',
    name: 'Floral A-Line Dress',
    tagline: 'V-neck day dress with gathered tier and hidden pockets',
    category: 'Dresses',
    price: 17000,
    sizes: ['S', 'M', 'L'],
    stock: 8,
    fabric: 'Soft Viscose Voile (Breathable for sunny afternoons)',
    color: 'Navy & Golden Calendula',
    fit: 'Fitted bust, flowy skirt from imperial waist down',
    measurements: {
      S: 'Bust 34" | Waist 28" | Length 42"',
      M: 'Bust 37" | Waist 31" | Length 43"',
      L: 'Bust 40" | Waist 34" | Length 44"'
    },
    accentColor: '#2D3A4B',
    pattern: 'floral-dress'
  },
  {
    id: 'p7',
    name: 'Tailored Denim Two-Piece',
    tagline: 'Cropped boxy jacket with matching high-rise A-line skirt',
    category: 'Two-Piece',
    price: 22500,
    sizes: ['M', 'L'],
    stock: 5,
    fabric: '10.5oz Washed Indigo Denim (100% Cotton)',
    color: 'Deep Indigo with Contrast Stitching',
    fit: 'Sturdy structured denim with natural body',
    measurements: {
      M: 'Jacket Bust 38" | Skirt Waist 30" | Skirt Length 24"',
      L: 'Jacket Bust 41" | Skirt Waist 33" | Skirt Length 25"'
    },
    accentColor: '#1F344D',
    pattern: 'denim-set'
  },
  {
    id: 'p8',
    name: 'Wide-Leg Palazzo Trouser',
    tagline: 'Fluid pleated front trousers with deep slant pockets',
    category: 'Workwear',
    price: 14500,
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 11,
    fabric: 'Silky Modal Blend with heavyweight drop',
    color: 'Olive Khaki',
    fit: 'High rise, dramatic wide leg falling cleanly over flats or heels',
    measurements: {
      S: 'Waist 27" | Hips 40" | Leg Opening 22"',
      M: 'Waist 30" | Hips 43" | Leg Opening 23"',
      L: 'Waist 33" | Hips 46" | Leg Opening 24"',
      XL: 'Waist 36" | Hips 49" | Leg Opening 25"'
    },
    accentColor: '#3B4734',
    pattern: 'palazzo'
  }
];

export const CATEGORIES = ['All Pieces', 'Dresses', 'Two-Piece', 'Workwear'];

export const STORE_INFO = {
  name: "Lola's Hub",
  address: "39, Oladoyinbo Street, Off Rainbow Junction, Felele Straight, Challenge, Ibadan",
  postalCode: "200254",
  phone: "+234 814 000 0000",
  whatsappUrl: "https://wa.me/message/IEQ5S35IDPJQB1",
  whatsappNumber: "2348140000000",
  instagram: "https://www.instagram.com/_lolashub/",
  threads: "https://www.threads.net/@_lolashub",
  hours: "Monday – Saturday: 9:00 AM – 7:00 PM (Closed Sundays)",
  deliveryPromise: "Same-day delivery across Ibadan on orders placed before 2:00 PM",
  exchangePolicy: "48-hour size exchange window; free fit adjustments in our Challenge shop."
};

export const REVIEWS = [
  {
    id: 'r1',
    author: 'Adaobi N.',
    location: 'Bodija, Ibadan',
    piece: 'Ankara Wrap Dress',
    rating: 5,
    text: 'Ordered at 11:20 AM, bike delivery arrived at my office in Bodija by 2:45 PM. The bust measurement on the site matched my tape measure exactly.'
  },
  {
    id: 'r2',
    author: 'Toyin K.',
    location: 'Challenge, Ibadan',
    piece: 'Straight-Leg Office Trouser',
    rating: 5,
    text: 'Walked into the shop on Oladoyinbo Street after seeing their catalogue. The high-waist fit is clean, no gaping at the back, and the front crease holds all day.'
  },
  {
    id: 'r3',
    author: 'Folashade B.',
    location: 'Akobo, Ibadan',
    piece: 'Emerald Two-Piece Set',
    rating: 5,
    text: 'Wore this for an afternoon presentation. The crepe has substantial weight, not clingy or see-through in daylight. Very honest pricing for this cut.'
  },
  {
    id: 'r4',
    author: 'Chiamaka E.',
    location: 'Ring Road, Ibadan',
    piece: 'Structured Blazer Top',
    rating: 5,
    text: 'The shoulder structuring sits flat without bunching. Clean inner lining and real buttons. Much better fit than standard mall brands.'
  }
];

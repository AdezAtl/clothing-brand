export interface SeedCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isFeatured: boolean;
}

export interface SeedVariant {
  id: string;
  productId: string;
  sku: string;
  size: string;
  color: string;
  colorHex: string;
  priceOverride: number | null;
  stockQuantity: number;
}

export interface SeedProduct {
  id: string;
  categoryId: string | null;
  name: string;
  slug: string;
  description: string;
  basePrice: number; // in kobo (e.g. 8500000 = ₦85,000)
  frontImageUrl: string;
  backImageUrl: string;
  galleryUrls: string[];
  isActive: boolean;
  isFeatured: boolean;
  variants: SeedVariant[];
}

export interface SeedBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
}

export const SEED_CATEGORIES: SeedCategory[] = [
  {
    id: "cat-1",
    name: "Agbada & Traditional",
    slug: "agbada-traditional",
    description: "Architectural traditional silhouettes handcrafted with structured jacquard, damask, and bespoke embroidery.",
    isFeatured: true,
  },
  {
    id: "cat-2",
    name: "Modern Two-Piece",
    slug: "modern-two-piece",
    description: "Sharp contemporary co-ord sets combining native Yoruba textile motifs with minimalist Western tailoring.",
    isFeatured: true,
  },
  {
    id: "cat-3",
    name: "Dresses & Gowns",
    slug: "dresses",
    description: "Sculpted floor-length and midi dresses engineered for movement, formal gatherings, and celebratory milestones.",
    isFeatured: true,
  },
  {
    id: "cat-4",
    name: "Ready-to-Wear",
    slug: "ready-to-wear",
    description: "Everyday luxury staples: refined tunic shirts, relaxed linen trousers, and modular casual separates.",
    isFeatured: true,
  },
];

export const SEED_PRODUCTS: SeedProduct[] = [
  // 1. Agbada
  {
    id: "prod-1",
    categoryId: "cat-1",
    name: "The Akobo Grand Damask Agbada",
    slug: "akobo-grand-damask-agbada",
    description: "Three-piece architectural silhouette comprising a floor-draping outer robe, structured inner tunic, and tapered sokoto trousers. Tailored from heavyweight imported damask with precision hand-guided chest embroidery. Designed and crafted at our Akobo, Ibadan atelier.",
    basePrice: 9500000, // ₦95,000
    frontImageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1000",
    backImageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000",
    galleryUrls: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80&w=1000",
    ],
    isActive: true,
    isFeatured: true,
    variants: [
      { id: "var-1-1", productId: "prod-1", sku: "TLP-AGB-EMR-M", size: "M", color: "Imperial Emerald", colorHex: "#0D3826", priceOverride: null, stockQuantity: 4 },
      { id: "var-1-2", productId: "prod-1", sku: "TLP-AGB-EMR-L", size: "L", color: "Imperial Emerald", colorHex: "#0D3826", priceOverride: null, stockQuantity: 6 },
      { id: "var-1-3", productId: "prod-1", sku: "TLP-AGB-EMR-XL", size: "XL", color: "Imperial Emerald", colorHex: "#0D3826", priceOverride: null, stockQuantity: 3 },
      { id: "var-1-4", productId: "prod-1", sku: "TLP-AGB-MID-M", size: "M", color: "Midnight Navy", colorHex: "#0B1D3A", priceOverride: null, stockQuantity: 5 },
      { id: "var-1-5", productId: "prod-1", sku: "TLP-AGB-MID-L", size: "L", color: "Midnight Navy", colorHex: "#0B1D3A", priceOverride: null, stockQuantity: 2 },
      { id: "var-1-6", productId: "prod-1", sku: "TLP-AGB-MID-XL", size: "XL", color: "Midnight Navy", colorHex: "#0B1D3A", priceOverride: null, stockQuantity: 5 },
    ],
  },
  {
    id: "prod-2",
    categoryId: "cat-1",
    name: "Sovereign Aso-Oke Paneled Agbada",
    slug: "sovereign-aso-oke-paneled-agbada",
    description: "Heritage handwoven Aso-Oke woven panels integrated along the shoulder line and lapel of crisp white Italian cashmere wool. Cut with a modern ergonomic sleeve drop that eliminates excess bulk while maintaining majestic volume.",
    basePrice: 12000000, // ₦120,000
    frontImageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=1000",
    backImageUrl: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=1000",
    galleryUrls: [
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=1000",
    ],
    isActive: true,
    isFeatured: true,
    variants: [
      { id: "var-2-1", productId: "prod-2", sku: "TLP-SOV-WHT-M", size: "M", color: "Raw Chalk", colorHex: "#F4F3EE", priceOverride: null, stockQuantity: 3 },
      { id: "var-2-2", productId: "prod-2", sku: "TLP-SOV-WHT-L", size: "L", color: "Raw Chalk", colorHex: "#F4F3EE", priceOverride: null, stockQuantity: 4 },
      { id: "var-2-3", productId: "prod-2", sku: "TLP-SOV-WHT-XL", size: "XL", color: "Raw Chalk", colorHex: "#F4F3EE", priceOverride: null, stockQuantity: 1 },
      { id: "var-2-4", productId: "prod-2", sku: "TLP-SOV-ONY-L", size: "L", color: "Onyx Black", colorHex: "#111111", priceOverride: 12500000, stockQuantity: 3 },
    ],
  },

  // 2. Modern Two-Piece
  {
    id: "prod-3",
    categoryId: "cat-2",
    name: "Minimalist Mandarin Collar Senator Co-ord",
    slug: "minimalist-mandarin-senator-coord",
    description: "Contemporary two-piece set featuring an asymmetrical hidden-placket tunic and matching straight-leg trousers. Breathable wool-blend fabric structured for humid climates and sharp evening transitions.",
    basePrice: 5800000, // ₦58,000
    frontImageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1000",
    backImageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000",
    galleryUrls: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000",
    ],
    isActive: true,
    isFeatured: true,
    variants: [
      { id: "var-3-1", productId: "prod-3", sku: "TLP-SEN-TER-S", size: "S", color: "Earthy Terracotta", colorHex: "#8A3B29", priceOverride: null, stockQuantity: 5 },
      { id: "var-3-2", productId: "prod-3", sku: "TLP-SEN-TER-M", size: "M", color: "Earthy Terracotta", colorHex: "#8A3B29", priceOverride: null, stockQuantity: 8 },
      { id: "var-3-3", productId: "prod-3", sku: "TLP-SEN-TER-L", size: "L", color: "Earthy Terracotta", colorHex: "#8A3B29", priceOverride: null, stockQuantity: 4 },
      { id: "var-3-4", productId: "prod-3", sku: "TLP-SEN-SLA-M", size: "M", color: "Smoky Slate", colorHex: "#393D42", priceOverride: null, stockQuantity: 6 },
      { id: "var-3-5", productId: "prod-3", sku: "TLP-SEN-SLA-L", size: "L", color: "Smoky Slate", colorHex: "#393D42", priceOverride: null, stockQuantity: 3 },
    ],
  },
  {
    id: "prod-4",
    categoryId: "cat-2",
    name: "Architectural Split-Hem Kimono Suit",
    slug: "architectural-split-hem-kimono-suit",
    description: "Relaxed tailored kimono jacket paired with high-waisted pleated trousers. Constructed from heavy linen-cotton with contrasting piped interior seams.",
    basePrice: 6400000, // ₦64,000
    frontImageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000",
    backImageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000",
    galleryUrls: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000",
    ],
    isActive: true,
    isFeatured: true,
    variants: [
      { id: "var-4-1", productId: "prod-4", sku: "TLP-KIM-SND-M", size: "M", color: "Warm Sand", colorHex: "#D5C4A1", priceOverride: null, stockQuantity: 4 },
      { id: "var-4-2", productId: "prod-4", sku: "TLP-KIM-SND-L", size: "L", color: "Warm Sand", colorHex: "#D5C4A1", priceOverride: null, stockQuantity: 5 },
      { id: "var-4-3", productId: "prod-4", sku: "TLP-KIM-OLV-L", size: "L", color: "Deep Olive", colorHex: "#3B443B", priceOverride: null, stockQuantity: 2 },
    ],
  },

  // 3. Dresses & Gowns
  {
    id: "prod-5",
    categoryId: "cat-3",
    name: "Moremi Sculpted Corset Midi Dress",
    slug: "moremi-sculpted-corset-midi-dress",
    description: "Internal boned bodice crafted from hand-loomed adire silk with a structured crepe trumpet skirt. Offers sharp definition through the waist with a concealed back zip and gentle walking slit.",
    basePrice: 7200000, // ₦72,000
    frontImageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=1000",
    backImageUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1000",
    galleryUrls: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1000",
    ],
    isActive: true,
    isFeatured: true,
    variants: [
      { id: "var-5-1", productId: "prod-5", sku: "TLP-MOR-IND-S", size: "S", color: "Indigo Adire", colorHex: "#1F2942", priceOverride: null, stockQuantity: 6 },
      { id: "var-5-2", productId: "prod-5", sku: "TLP-MOR-IND-M", size: "M", color: "Indigo Adire", colorHex: "#1F2942", priceOverride: null, stockQuantity: 5 },
      { id: "var-5-3", productId: "prod-5", sku: "TLP-MOR-IND-L", size: "L", color: "Indigo Adire", colorHex: "#1F2942", priceOverride: null, stockQuantity: 3 },
      { id: "var-5-4", productId: "prod-5", sku: "TLP-MOR-RBY-M", size: "M", color: "Garnet Ruby", colorHex: "#5E1928", priceOverride: 7500000, stockQuantity: 2 },
    ],
  },
  {
    id: "prod-6",
    categoryId: "cat-3",
    name: "Yoruba Pleated Asymmetric Kaftan Gown",
    slug: "yoruba-pleated-asymmetric-kaftan-gown",
    description: "Flowing georgette silk kaftan accented with geometric gold embroidery across the shoulder and asymmetrical hemline. Fully lined with pure cotton voile.",
    basePrice: 6800000, // ₦68,000
    frontImageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=1000",
    backImageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=1000",
    galleryUrls: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=1000",
    ],
    isActive: true,
    isFeatured: true,
    variants: [
      { id: "var-6-1", productId: "prod-6", sku: "TLP-KAF-GLD-FREE", size: "Free Size", color: "Amber Ochre", colorHex: "#C68B29", priceOverride: null, stockQuantity: 7 },
      { id: "var-6-2", productId: "prod-6", sku: "TLP-KAF-IVR-FREE", size: "Free Size", color: "Bone Ivory", colorHex: "#EFECE6", priceOverride: null, stockQuantity: 4 },
    ],
  },

  // 4. Ready-to-Wear
  {
    id: "prod-7",
    categoryId: "cat-4",
    name: "Akobo Heavyweight Camp-Collar Tunic",
    slug: "akobo-heavyweight-camp-collar-tunic",
    description: "Cut from 280 GSM cotton twill with an open camp collar, dual chest box pleat pockets, and horn buttons. Boxy silhouette designed to be worn untucked.",
    basePrice: 3400000, // ₦34,000
    frontImageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000",
    backImageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1000",
    galleryUrls: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1000",
    ],
    isActive: true,
    isFeatured: true,
    variants: [
      { id: "var-7-1", productId: "prod-7", sku: "TLP-CMP-RAW-M", size: "M", color: "Raw Canvas", colorHex: "#E8E2D5", priceOverride: null, stockQuantity: 9 },
      { id: "var-7-2", productId: "prod-7", sku: "TLP-CMP-RAW-L", size: "L", color: "Raw Canvas", colorHex: "#E8E2D5", priceOverride: null, stockQuantity: 12 },
      { id: "var-7-3", productId: "prod-7", sku: "TLP-CMP-RAW-XL", size: "XL", color: "Raw Canvas", colorHex: "#E8E2D5", priceOverride: null, stockQuantity: 5 },
      { id: "var-7-4", productId: "prod-7", sku: "TLP-CMP-BLK-M", size: "M", color: "Pitch Black", colorHex: "#111111", priceOverride: null, stockQuantity: 8 },
      { id: "var-7-5", productId: "prod-7", sku: "TLP-CMP-BLK-L", size: "L", color: "Pitch Black", colorHex: "#111111", priceOverride: null, stockQuantity: 6 },
    ],
  },
  {
    id: "prod-8",
    categoryId: "cat-4",
    name: "Pleated Relaxed Drawstring Linen Trousers",
    slug: "pleated-relaxed-drawstring-linen-trousers",
    description: "Deep front double pleats with a tailored taper, elasticated waistband with cotton cord, and deep side slant pockets. Pre-washed for soft hand feel.",
    basePrice: 3800000, // ₦38,000
    frontImageUrl: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&q=80&w=1000",
    backImageUrl: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=1000",
    galleryUrls: [
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=1000",
    ],
    isActive: true,
    isFeatured: true,
    variants: [
      { id: "var-8-1", productId: "prod-8", sku: "TLP-TRS-CHR-M", size: "M", color: "Washed Charcoal", colorHex: "#2B2B2B", priceOverride: null, stockQuantity: 7 },
      { id: "var-8-2", productId: "prod-8", sku: "TLP-TRS-CHR-L", size: "L", color: "Washed Charcoal", colorHex: "#2B2B2B", priceOverride: null, stockQuantity: 10 },
      { id: "var-8-3", productId: "prod-8", sku: "TLP-TRS-CHR-XL", size: "XL", color: "Washed Charcoal", colorHex: "#2B2B2B", priceOverride: null, stockQuantity: 4 },
      { id: "var-8-4", productId: "prod-8", sku: "TLP-TRS-KHK-M", size: "M", color: "Safari Khaki", colorHex: "#A89F81", priceOverride: null, stockQuantity: 6 },
    ],
  },
];

export const SEED_BANNER: SeedBanner = {
  id: "banner-1",
  title: "Modern Yoruba Heritage & Precision Tailoring",
  subtitle: "Handcrafted in Akobo, Ibadan. Architectural Agbadas, co-ords, and sculpted silhouettes built from heavyweight heritage textiles.",
  imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1800",
  ctaText: "Shop New Season Collection",
  ctaLink: "/shop",
  isActive: true,
};

export const SEED_REVIEWS = [
  {
    name: "Idowu Abayomi Oluwasegun",
    rating: 5,
    location: "Ibadan, Nigeria",
    comment: "The cut on my Grand Damask Agbada is unmatched. You can feel the weight of the fabric immediately. Delivered straight to Bodija within 36 hours.",
    date: "February 2026",
  },
  {
    name: "Oluwatoyin Oyewo",
    rating: 5,
    location: "Lagos, Nigeria",
    comment: "Ordered the Moremi Corset Dress for a family wedding. The internal boning gives incredible structure without pinching. Tullipio understands real African tailoring.",
    date: "January 2026",
  },
  {
    name: "Ododoola Oyewo",
    rating: 5,
    location: "Ibadan, Nigeria",
    comment: "Visited the Akobo atelier in person to inspect the two-piece sets. Exceptional craftsmanship, clean French seams, and honest pricing.",
    date: "March 2026",
  },
];


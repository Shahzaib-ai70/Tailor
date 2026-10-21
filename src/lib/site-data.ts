export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  collection: string;
  image: string;
  alt: string;
  colors: string[];
  sizes: string[];
  summary: string;
  description: string;
  details: string[];
  materials: string[];
  featured?: boolean;
  badge?: string;
};

export type Collection = {
  slug: string;
  name: string;
  season: string;
  description: string;
  image: string;
  highlights: string[];
};

export type NavItem = {
  href: string;
  label: string;
};

export type GalleryCategory =
  | "Classic Shalwar Kameez"
  | "Premium Formal Suits"
  | "Casual Wear"
  | "Wedding & Party Wear"
  | "Traditional Pakistani Fashion"
  | "Modern Designs"
  | "Fabric Collection"
  | "Stitching Design Details"
  | "Color Collection"
  | "Latest Trends";

export type GalleryItem = {
  slug: string;
  title: string;
  primaryCategory: GalleryCategory;
  categories: GalleryCategory[];
  image: string;
  alt: string;
  priceLabel?: string;
  sourceLabel: string;
};

export const brandName = "MIAN TAILOR and design";

export const mainNav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const products: Product[] = [
  {
    slug: "off-white-classic-kameez-shalwar",
    name: "Off-White Classic Kameez Shalwar",
    category: "Classic Shalwar Kameez",
    price: 18500,
    collection: "Classic Essentials",
    image:
      "https://cdn.shopify.com/s/files/1/0508/0675/1423/files/1_a4edfa29-847c-4f30-91c3-4002cd5d3234.jpg?v=1790444988",
    alt: "Off-white men's classic kameez shalwar with mandarin collar in a premium Pakistani catalog image",
    colors: ["Off-White"],
    sizes: ["S", "M", "L", "XL"],
    summary: "A clean off-white classic set for Friday wear, Eid dressing, and formal day events.",
    description:
      "This off-white Kameez Shalwar keeps the look traditional and polished with a unique mandarin collar, branded buttons, and a refined front finish.",
    details: [
      "Unique mandarin collar",
      "Logo buttons with embroidered front detail",
      "Balanced cut for classic Pakistani styling",
    ],
    materials: ["Premium blended fabric", "Signature branded buttons"],
    featured: true,
    badge: "Classic",
  },
  {
    slug: "black-classic-kameez-shalwar",
    name: "Black Classic Kameez Shalwar",
    category: "Premium Formal Suits",
    price: 18500,
    collection: "Classic Essentials",
    image:
      "https://cdn.shopify.com/s/files/1/0508/0675/1423/files/1_557ace2e-40d3-456c-9499-79b71ba6cdf1.jpg?v=1790445039",
    alt: "Black men's kameez shalwar with mandarin collar in a formal Pakistani clothing catalog image",
    colors: ["Black"],
    sizes: ["S", "M", "L", "XL"],
    summary: "A sharp black classic for dinners, Friday evenings, and understated formal dressing.",
    description:
      "The black classic Kameez Shalwar delivers a crisp traditional line with mandarin collar styling and embroidered front finishing.",
    details: [
      "Mandarin collar",
      "Branded buttons",
      "Refined embroidered front detail",
    ],
    materials: ["Premium blended fabric", "Branded hardware"],
    featured: true,
    badge: "Formal",
  },
  {
    slug: "cream-classic-kameez-shalwar",
    name: "Cream Classic Kameez Shalwar",
    category: "Casual Wear",
    price: 18500,
    collection: "Classic Essentials",
    image:
      "https://cdn.shopify.com/s/files/1/0508/0675/1423/files/1_aa64cbcf-84f9-41c6-a644-d839d7c471df.jpg?v=1790444993",
    alt: "Cream men's kameez shalwar with classic collar styling for everyday and festive Pakistani wear",
    colors: ["Cream"],
    sizes: ["S", "M", "L", "XL"],
    summary: "A soft cream colorway suited to everyday wear, Jummah dressing, and summer occasions.",
    description:
      "This cream classic Kameez Shalwar keeps the silhouette simple and wearable while preserving a polished premium finish.",
    details: [
      "Classic front finish",
      "Mandarin collar",
      "Comfortable easy-wear silhouette",
    ],
    materials: ["Wash-and-wear blend", "Lightweight seasonal fabric"],
    featured: true,
  },
  {
    slug: "blue-classic-kameez-shalwar",
    name: "Blue Classic Kameez Shalwar",
    category: "Traditional Pakistani Fashion",
    price: 18500,
    collection: "Classic Essentials",
    image:
      "https://cdn.shopify.com/s/files/1/0508/0675/1423/files/1_a0dc6d12-574a-41a2-8a08-57212394f72d.jpg?v=1790445001",
    alt: "Blue men's classic kameez shalwar in a clean front-facing Pakistani traditional fashion product image",
    colors: ["Blue"],
    sizes: ["S", "M", "L", "XL"],
    summary: "A classic blue set that keeps traditional Pakistani styling neat, fresh, and versatile.",
    description:
      "The blue classic Kameez Shalwar combines a traditional straight cut with premium finishing for festive and everyday wear.",
    details: [
      "Unique mandarin collar",
      "Logo buttons",
      "Embroidered front detail",
    ],
    materials: ["Premium blended fabric", "Signature trims"],
    featured: true,
    badge: "Bestseller",
  },
  {
    slug: "beige-textured-kameez-shalwar",
    name: "Beige Textured Kameez Shalwar",
    category: "Fabric Collection",
    price: 18500,
    collection: "Textured Designer Edit",
    image:
      "https://cdn.shopify.com/s/files/1/0508/0675/1423/files/1_bdaef26a-be0d-4089-b88a-aa9b46b2e09a.jpg?v=1790582724",
    alt: "Beige textured men's kameez shalwar highlighting fabric texture and front placket detail",
    colors: ["Beige"],
    sizes: ["S", "M", "L", "XL"],
    summary: "A textured beige option for clients who want subtle fabric depth without heavy embroidery.",
    description:
      "The beige textured Kameez Shalwar highlights front placket work and signature thread finishing for a more elevated daywear look.",
    details: [
      "Textured fabric surface",
      "Front placket monogram detail",
      "Signature thread finishing",
    ],
    materials: ["Textured blended fabric", "Metal and logo button detailing"],
  },
  {
    slug: "blue-textured-kameez-shalwar",
    name: "Blue Textured Kameez Shalwar",
    category: "Modern Designs",
    price: 24500,
    collection: "Textured Designer Edit",
    image:
      "https://cdn.shopify.com/s/files/1/0508/0675/1423/files/1_7cda77a7-86ad-4026-8576-10028f8220d1.jpg?v=1790444984",
    alt: "Blue textured men's kameez shalwar with hidden placket and modern mandarin collar styling",
    colors: ["Blue"],
    sizes: ["S", "M", "L", "XL"],
    summary: "A more fashion-forward blue textured set with hidden placket and rich finishing details.",
    description:
      "The blue textured Kameez Shalwar is designed for customers who want modern collar styling, trim details, and a sharper dress silhouette.",
    details: [
      "Hidden button placket",
      "Mandarin collar",
      "Velvet trim and signature thread details",
    ],
    materials: ["Textured premium fabric", "Metal button accents"],
    featured: true,
  },
  {
    slug: "taupe-textured-kameez-shalwar",
    name: "Taupe Textured Kameez Shalwar",
    category: "Stitching Design Details",
    price: 24500,
    collection: "Textured Designer Edit",
    image:
      "https://cdn.shopify.com/s/files/1/0508/0675/1423/files/1_ca029da5-f894-4392-8a45-2810aea26fb5.jpg?v=1790445007",
    alt: "Taupe textured men's kameez shalwar showing cuff embroidery, buttons, and mandarin collar design details",
    colors: ["Taupe"],
    sizes: ["S", "M", "L", "XL"],
    summary: "A taupe textured design for customers focusing on cuffs, placket embroidery, and button finish.",
    description:
      "The taupe textured Kameez Shalwar highlights detail-driven finishing through embroidered cuff branding and front placket work.",
    details: [
      "Matching metal buttons",
      "Front placket embroidery",
      "Cuff text embroidery detail",
    ],
    materials: ["Textured premium fabric", "Signature hardware"],
  },
  {
    slug: "brown-textured-designer-kameez-shalwar",
    name: "Brown Textured Designer Kameez Shalwar",
    category: "Wedding & Party Wear",
    price: 26500,
    collection: "Textured Designer Edit",
    image:
      "https://cdn.shopify.com/s/files/1/0508/0675/1423/files/1_50a7d1e0-417f-4e05-bed7-e21a3507dd7b.jpg?v=1790444959",
    alt: "Brown designer men's kameez shalwar with button-down collar and refined front detailing",
    colors: ["Brown"],
    sizes: ["S", "M", "L", "XL"],
    summary: "A designer brown set with richer trim and front styling for semi-formal and festive wear.",
    description:
      "This brown textured designer Kameez Shalwar is built for dressier gatherings with collar variation and statement hardware.",
    details: [
      "Button-down collar",
      "Hidden placket with special details",
      "Gold logo and metal button accents",
    ],
    materials: ["Textured designer fabric", "Metal embellishment details"],
    featured: true,
    badge: "Designer",
  },
  {
    slug: "black-textured-kameez-shalwar",
    name: "Black Textured Kameez Shalwar",
    category: "Premium Formal Suits",
    price: 24500,
    collection: "Wedding & Eid Signatures",
    image:
      "https://cdn.shopify.com/s/files/1/0508/0675/1423/files/1_6b146440-d543-4ea4-9bc0-bf6c5aa17c5b.jpg?v=1790444977",
    alt: "Black textured men's kameez shalwar with metal buttons and premium evening styling",
    colors: ["Black"],
    sizes: ["S", "M", "L", "XL"],
    summary: "A dressier black textured outfit with statement trim for evening events and premium wear.",
    description:
      "The black textured Kameez Shalwar adds formal depth through rich fabric texture, monogram buttons, and refined metallic detail.",
    details: [
      "Mandarin collar",
      "Monogram metal buttons",
      "Premium formal front embellishment",
    ],
    materials: ["Textured premium fabric", "Signature metal hardware"],
  },
  {
    slug: "cream-textured-kameez-shalwar",
    name: "Cream Textured Kameez Shalwar",
    category: "Latest Trends",
    price: 26500,
    collection: "Wedding & Eid Signatures",
    image:
      "https://cdn.shopify.com/s/files/1/0508/0675/1423/files/1_66e0182a-0d2a-4a9a-be42-df494b0f102b.jpg?v=1790444971",
    alt: "Cream textured men's kameez shalwar with contemporary front detailing for modern seasonal wear",
    colors: ["Cream"],
    sizes: ["S", "M", "L", "XL"],
    summary: "A trending cream design with premium metal detail for Eid, nikah functions, and festive events.",
    description:
      "The cream textured Kameez Shalwar offers a modern front treatment and dressier tone while keeping a soft traditional palette.",
    details: [
      "Hidden button placket",
      "Metal front details",
      "Modern cream festive styling",
    ],
    materials: ["Textured ceremonial fabric", "Metal embellishment details"],
  },
  {
    slug: "tan-limited-edition-kameez-shalwar",
    name: "Tan Limited Edition Kameez Shalwar",
    category: "Wedding & Party Wear",
    price: 36500,
    collection: "Wedding & Eid Signatures",
    image:
      "https://cdn.shopify.com/s/files/1/0508/0675/1423/files/1_935eedab-6baf-40f9-99ea-b2d954214096.jpg?v=1790854751",
    alt: "Tan limited-edition men's kameez shalwar with statement buttons and premium festive styling",
    colors: ["Tan"],
    sizes: ["S", "M", "L", "XL"],
    summary: "A high-end tan festive set made for standout event dressing and signature premium styling.",
    description:
      "The limited-edition tan Kameez Shalwar is designed as a signature occasion look with oversized buttons and sharp finishing.",
    details: [
      "Button-down collar",
      "Oversized monogram buttons",
      "Limited-edition metal detail finish",
    ],
    materials: ["Premium luxury fabric", "Monogram hardware"],
    featured: true,
    badge: "Limited",
  },
  {
    slug: "teal-blue-limited-edition-kameez-shalwar",
    name: "Teal Blue Limited Edition Kameez Shalwar",
    category: "Wedding & Party Wear",
    price: 38500,
    collection: "Wedding & Eid Signatures",
    image:
      "https://cdn.shopify.com/s/files/1/0508/0675/1423/files/1_e16b1b0f-0d80-45d5-8025-e87727061c9a.jpg?v=1790445045",
    alt: "Teal blue limited-edition men's kameez shalwar with velvet details for wedding and party wear",
    colors: ["Teal Blue"],
    sizes: ["S", "M", "L", "XL"],
    summary: "A premium teal-blue occasion design with velvet and metal work for standout wedding wear.",
    description:
      "This limited-edition teal-blue Kameez Shalwar is built for wedding and party wear with velvet applique and metallic finishing.",
    details: [
      "Velvet collar and front applique",
      "Metal monogram buttons",
      "High-occasion premium styling",
    ],
    materials: ["Luxury event fabric", "Velvet trim", "Metal button finish"],
    featured: true,
    badge: "Wedding",
  },
];

export const collections: Collection[] = [
  {
    slug: "classic-essentials",
    name: "Classic Essentials",
    season: "Core Collection",
    description:
      "Everyday and formal classic Kameez Shalwar colors including off-white, cream, black, and blue.",
    image:
      "https://cdn.shopify.com/s/files/1/0508/0675/1423/files/1_a4edfa29-847c-4f30-91c3-4002cd5d3234.jpg?v=1790444988",
    highlights: ["Classic colors", "Mandarin collars", "Daily and Eid wear"],
  },
  {
    slug: "textured-designer-edit",
    name: "Textured Designer Edit",
    season: "Designer Line",
    description:
      "Textured fabrics, modern collars, and design-detail pieces for customers who want elevated styling.",
    image:
      "https://cdn.shopify.com/s/files/1/0508/0675/1423/files/1_7cda77a7-86ad-4026-8576-10028f8220d1.jpg?v=1790444984",
    highlights: ["Textured fabrics", "Hidden plackets", "Cuff and trim details"],
  },
  {
    slug: "wedding-eid-signatures",
    name: "Wedding & Eid Signatures",
    season: "Occasion Wear",
    description:
      "Limited-edition Kameez Shalwar styles for wedding functions, Eid dressing, and premium celebrations.",
    image:
      "https://cdn.shopify.com/s/files/1/0508/0675/1423/files/1_e16b1b0f-0d80-45d5-8025-e87727061c9a.jpg?v=1790445045",
    highlights: ["Velvet accents", "Limited editions", "Premium event wear"],
  },
];

export const tailoringServices = [
  {
    title: "Custom Stitching",
    description:
      "Select your preferred collar, cuff, placket, and overall fit for made-to-order Kameez Shalwar stitching.",
  },
  {
    title: "Fabric Guidance",
    description:
      "Choose between wash-and-wear, cotton blends, textured fabrics, and premium occasionwear cloths.",
  },
  {
    title: "Wedding Styling",
    description:
      "Plan coordinated Shalwar Kameez looks for Eid, mehndi, nikah, and formal family functions.",
  },
];

export const appointmentOptions = [
  "Custom stitching consultation",
  "Wedding & Eid styling",
  "Fabric selection review",
  "Measurement appointment",
];

export const cityAtelierNotes = [
  "Private Shalwar Kameez consultations with color, collar, and cuff guidance",
  "Fabric options include classic, textured, wash-and-wear, and occasionwear styles",
  "Typical stitching cycle depends on design complexity and event timelines",
];

export const galleryCategories: GalleryCategory[] = [
  "Classic Shalwar Kameez",
  "Premium Formal Suits",
  "Casual Wear",
  "Wedding & Party Wear",
  "Traditional Pakistani Fashion",
  "Modern Designs",
  "Fabric Collection",
  "Stitching Design Details",
  "Color Collection",
  "Latest Trends",
];

export const shalwarKameezGallery: GalleryItem[] = [
  {
    slug: "off-white-classic-kameez-shalwar",
    title: "Off-White Classic Kameez Shalwar",
    primaryCategory: "Classic Shalwar Kameez",
    categories: [
      "Classic Shalwar Kameez",
      "Traditional Pakistani Fashion",
      "Premium Formal Suits",
      "Color Collection",
    ],
    image:
      "https://cdn.shopify.com/s/files/1/0508/0675/1423/files/1_a4edfa29-847c-4f30-91c3-4002cd5d3234.jpg?v=1790444988",
    alt: "Off-white men's classic kameez shalwar with mandarin collar in a premium Pakistani catalog image",
    priceLabel: "PKR 18,500",
    sourceLabel: "Official Kameez Shalwar catalog image",
  },
  {
    slug: "black-classic-kameez-shalwar",
    title: "Black Classic Kameez Shalwar",
    primaryCategory: "Premium Formal Suits",
    categories: [
      "Premium Formal Suits",
      "Classic Shalwar Kameez",
      "Traditional Pakistani Fashion",
      "Color Collection",
    ],
    image:
      "https://cdn.shopify.com/s/files/1/0508/0675/1423/files/1_557ace2e-40d3-456c-9499-79b71ba6cdf1.jpg?v=1790445039",
    alt: "Black men's kameez shalwar with mandarin collar in a formal Pakistani clothing catalog image",
    priceLabel: "PKR 18,500",
    sourceLabel: "Official Kameez Shalwar catalog image",
  },
  {
    slug: "cream-classic-kameez-shalwar",
    title: "Cream Classic Kameez Shalwar",
    primaryCategory: "Casual Wear",
    categories: [
      "Casual Wear",
      "Classic Shalwar Kameez",
      "Fabric Collection",
      "Color Collection",
    ],
    image:
      "https://cdn.shopify.com/s/files/1/0508/0675/1423/files/1_aa64cbcf-84f9-41c6-a644-d839d7c471df.jpg?v=1790444993",
    alt: "Cream men's kameez shalwar with classic collar styling for everyday and festive Pakistani wear",
    priceLabel: "PKR 18,500",
    sourceLabel: "Official Kameez Shalwar catalog image",
  },
  {
    slug: "teal-blue-limited-edition-kameez-shalwar",
    title: "Teal Blue Limited Edition Kameez Shalwar",
    primaryCategory: "Wedding & Party Wear",
    categories: [
      "Wedding & Party Wear",
      "Premium Formal Suits",
      "Modern Designs",
      "Latest Trends",
    ],
    image:
      "https://cdn.shopify.com/s/files/1/0508/0675/1423/files/1_e16b1b0f-0d80-45d5-8025-e87727061c9a.jpg?v=1790445045",
    alt: "Teal blue limited-edition men's kameez shalwar with velvet details for wedding and party wear",
    priceLabel: "PKR 38,500",
    sourceLabel: "Official Kameez Shalwar catalog image",
  },
  {
    slug: "blue-classic-kameez-shalwar",
    title: "Blue Classic Kameez Shalwar",
    primaryCategory: "Traditional Pakistani Fashion",
    categories: [
      "Traditional Pakistani Fashion",
      "Classic Shalwar Kameez",
      "Color Collection",
      "Latest Trends",
    ],
    image:
      "https://cdn.shopify.com/s/files/1/0508/0675/1423/files/1_a0dc6d12-574a-41a2-8a08-57212394f72d.jpg?v=1790445001",
    alt: "Blue men's classic kameez shalwar in a clean front-facing Pakistani traditional fashion product image",
    priceLabel: "PKR 18,500",
    sourceLabel: "Official Kameez Shalwar catalog image",
  },
  {
    slug: "blue-textured-kameez-shalwar",
    title: "Blue Textured Kameez Shalwar",
    primaryCategory: "Modern Designs",
    categories: [
      "Modern Designs",
      "Premium Formal Suits",
      "Stitching Design Details",
    ],
    image:
      "https://cdn.shopify.com/s/files/1/0508/0675/1423/files/1_7cda77a7-86ad-4026-8576-10028f8220d1.jpg?v=1790444984",
    alt: "Blue textured men's kameez shalwar with hidden placket and modern mandarin collar styling",
    priceLabel: "PKR 24,500",
    sourceLabel: "Official Kameez Shalwar catalog image",
  },
  {
    slug: "beige-textured-kameez-shalwar",
    title: "Beige Textured Kameez Shalwar",
    primaryCategory: "Fabric Collection",
    categories: [
      "Fabric Collection",
      "Casual Wear",
      "Stitching Design Details",
      "Latest Trends",
    ],
    image:
      "https://cdn.shopify.com/s/files/1/0508/0675/1423/files/1_bdaef26a-be0d-4089-b88a-aa9b46b2e09a.jpg?v=1790582724",
    alt: "Beige textured men's kameez shalwar highlighting fabric texture and front placket detail",
    priceLabel: "PKR 18,500",
    sourceLabel: "Official Kameez Shalwar catalog image",
  },
  {
    slug: "taupe-textured-kameez-shalwar",
    title: "Taupe Textured Kameez Shalwar",
    primaryCategory: "Stitching Design Details",
    categories: [
      "Stitching Design Details",
      "Modern Designs",
      "Fabric Collection",
      "Latest Trends",
    ],
    image:
      "https://cdn.shopify.com/s/files/1/0508/0675/1423/files/1_ca029da5-f894-4392-8a45-2810aea26fb5.jpg?v=1790445007",
    alt: "Taupe textured men's kameez shalwar showing cuff embroidery, buttons, and mandarin collar design details",
    priceLabel: "PKR 24,500",
    sourceLabel: "Official Kameez Shalwar catalog image",
  },
  {
    slug: "tan-limited-edition-kameez-shalwar",
    title: "Tan Limited Edition Kameez Shalwar",
    primaryCategory: "Color Collection",
    categories: [
      "Color Collection",
      "Premium Formal Suits",
      "Wedding & Party Wear",
      "Fabric Collection",
    ],
    image:
      "https://cdn.shopify.com/s/files/1/0508/0675/1423/files/1_935eedab-6baf-40f9-99ea-b2d954214096.jpg?v=1790854751",
    alt: "Tan limited-edition men's kameez shalwar with statement buttons and premium festive styling",
    priceLabel: "PKR 36,500",
    sourceLabel: "Official Kameez Shalwar catalog image",
  },
  {
    slug: "cream-textured-kameez-shalwar",
    title: "Cream Textured Kameez Shalwar",
    primaryCategory: "Latest Trends",
    categories: [
      "Latest Trends",
      "Modern Designs",
      "Premium Formal Suits",
    ],
    image:
      "https://cdn.shopify.com/s/files/1/0508/0675/1423/files/1_66e0182a-0d2a-4a9a-be42-df494b0f102b.jpg?v=1790444971",
    alt: "Cream textured men's kameez shalwar with contemporary front detailing for modern seasonal wear",
    priceLabel: "PKR 26,500",
    sourceLabel: "Official Kameez Shalwar catalog image",
  },
  {
    slug: "brown-textured-designer-kameez-shalwar",
    title: "Brown Textured Designer Kameez Shalwar",
    primaryCategory: "Classic Shalwar Kameez",
    categories: [
      "Modern Designs",
      "Wedding & Party Wear",
      "Stitching Design Details",
      "Color Collection",
    ],
    image:
      "https://cdn.shopify.com/s/files/1/0508/0675/1423/files/1_50a7d1e0-417f-4e05-bed7-e21a3507dd7b.jpg?v=1790444959",
    alt: "Brown designer men's kameez shalwar with button-down collar and refined front detailing",
    priceLabel: "PKR 26,500",
    sourceLabel: "Official Kameez Shalwar catalog image",
  },
  {
    slug: "black-textured-kameez-shalwar",
    title: "Black Textured Kameez Shalwar",
    primaryCategory: "Casual Wear",
    categories: [
      "Premium Formal Suits",
      "Wedding & Party Wear",
      "Stitching Design Details",
    ],
    image:
      "https://cdn.shopify.com/s/files/1/0508/0675/1423/files/1_6b146440-d543-4ea4-9bc0-bf6c5aa17c5b.jpg?v=1790444977",
    alt: "Black textured men's kameez shalwar with metal buttons and premium evening styling",
    priceLabel: "PKR 24,500",
    sourceLabel: "Official Kameez Shalwar catalog image",
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(slug: string, collection: string) {
  return products
    .filter((product) => product.slug !== slug && product.collection === collection)
    .slice(0, 3);
}


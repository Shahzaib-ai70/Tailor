const express = require("express");
const multer = require("multer");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { DatabaseSync } = require("node:sqlite");

const app = express();
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, "data");
const UPLOADS_DIR = path.join(ROOT_DIR, "uploads");
const DB_PATH = path.join(DATA_DIR, "mian-tailer.db");
const AUTH_COOKIE = "mian_tailer_admin";
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT) || 3000;
const TRUST_PROXY = process.env.TRUST_PROXY === "true";
const COOKIE_SECURE = process.env.COOKIE_SECURE === "true";
const DEFAULT_ADMIN_USERNAME = (process.env.ADMIN_USERNAME || "admin").trim();
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "mian123";
const STORE_CONFIG = {
  businessName: "Mian Tailer",
  phone: "+92 300 123 4567",
  whatsappNumber: "923001234567",
  supportEmail: "care@miantailer.com",
  supportHours: "Mon - Sat | 10:00 AM - 8:00 PM",
  serviceCity: "Pakistan Wide Delivery",
  deliveryFee: 350,
  freeDeliveryThreshold: 15000,
  deliveryEta: "2 - 4 working days",
  whatsappMessage:
    "Assalam o Alaikum, I want help with a design/order from Mian Tailer.",
};
const galleryStreamClients = new Set();

if (TRUST_PROXY) {
  app.set("trust proxy", 1);
}

const seededGalleryItems = [
  {
    title: "Jet Black Band Collar Set",
    description: "Structured black shalwar kameez with embellished neckline and formal finish.",
    details:
      "A sharp black formal set made for evening gatherings, Eid dinners, and premium traditional dressing. The neckline carries detailed embroidery with a clean straight fall and polished front presentation.",
    imagePath:
      "https://di2ponv0v5otw.cloudfront.net/posts/2022/10/18/634ead1f4bc6555a48452523/l_634eae8ba0aeb7ad9b47cc6d.jpg",
    priceText: "Rs. 8,500",
    sourceUrl:
      "https://poshmark.com/listing/Mens-Pakistani-2-Piece-Black-Band-Collar-Shalwar-Kameez-Embellished-Neckline-634ead1f4bc6555a48452523",
  },
  {
    title: "Navy Blue Embroidered Placket",
    description: "Relaxed blue kurta style with neat band collar and subtle front embroidery.",
    details:
      "A rich navy blue design suited for Friday wear and formal casual events. Features a band collar, long sleeves, and an embroidered button placket with balanced traditional styling.",
    imagePath:
      "https://di2ponv0v5otw.cloudfront.net/posts/2026/09/01/6a97983ff314c2f6d9bf46d7/l_6a97983f1921250a6f405f67.jpg",
    priceText: "Rs. 7,900",
    sourceUrl:
      "https://poshmark.com/listing/Novelty-Exclusive-Shirt-Men-L-Blue-Shalwar-Kameez-Band-Collar-Embroidered-Button-6a97983ff314c2f6d9bf46d7",
  },
  {
    title: "Black Front Detail View",
    description: "Closer front angle showing cuff finish, clean buttons, and premium tailoring lines.",
    details:
      "Focused front view for customers who want to inspect neckline balance, button styling, and cuff finishing before ordering. A strong option for formal black wardrobe pieces.",
    imagePath:
      "https://di2ponv0v5otw.cloudfront.net/posts/2022/10/18/634ead1f4bc6555a48452523/l_634eae8cf644e559060be826.jpg",
    priceText: "Rs. 8,300",
    sourceUrl:
      "https://poshmark.com/listing/Mens-Pakistani-2-Piece-Black-Band-Collar-Shalwar-Kameez-Embellished-Neckline-634ead1f4bc6555a48452523",
  },
  {
    title: "Powder Blue Smart Casual",
    description: "Light blue traditional shirt look with polished collar work and easy everyday styling.",
    details:
      "A lightweight powder blue style for daily wear, Jummah, and summer dressing. The clean collar work and minimal look keep it elegant and easy to pair with dark or white bottoms.",
    imagePath:
      "https://di2ponv0v5otw.cloudfront.net/posts/2026/09/01/6a97983ff314c2f6d9bf46d7/l_6a979840221dcb67399f0fda.jpg",
    priceText: "Rs. 7,200",
    sourceUrl:
      "https://poshmark.com/listing/Novelty-Exclusive-Shirt-Men-L-Blue-Shalwar-Kameez-Band-Collar-Embroidered-Button-6a97983ff314c2f6d9bf46d7",
  },
  {
    title: "Evening Black Signature Fit",
    description: "Elegant evening wear look in black with modest silhouette and tailored structure.",
    details:
      "This signature black design brings a slightly more premium evening feel with a modest body line, formal sleeve finish, and standout upper-front embroidery for festive nights.",
    imagePath:
      "https://di2ponv0v5otw.cloudfront.net/posts/2022/10/18/634ead1f4bc6555a48452523/l_634eae8d8d7a3c0fcc3850fd.jpg",
    priceText: "Rs. 8,900",
    sourceUrl:
      "https://poshmark.com/listing/Mens-Pakistani-2-Piece-Black-Band-Collar-Shalwar-Kameez-Embellished-Neckline-634ead1f4bc6555a48452523",
  },
  {
    title: "Sky Blue Collar Highlight",
    description: "Soft blue design featuring decorative collar emphasis and refined modest drape.",
    details:
      "A soft blue premium piece designed for customers who prefer calm color tones with refined collar styling. Best for family gatherings, Eid brunch, and polished casual looks.",
    imagePath:
      "https://di2ponv0v5otw.cloudfront.net/posts/2026/09/01/6a97983ff314c2f6d9bf46d7/l_6a97984088963f9b17de81a3.jpg",
    priceText: "Rs. 7,600",
    sourceUrl:
      "https://poshmark.com/listing/Novelty-Exclusive-Shirt-Men-L-Blue-Shalwar-Kameez-Band-Collar-Embroidered-Button-6a97983ff314c2f6d9bf46d7",
  },
  {
    title: "Formal Black Occasion Wear",
    description: "Deep black set for dinners, Eid evenings, and special gatherings.",
    details:
      "A strong black occasion-wear option with crisp tailoring and premium presence. Built for events where you want a graceful formal look without heavy over-designing.",
    imagePath:
      "https://di2ponv0v5otw.cloudfront.net/posts/2022/10/18/634ead1f4bc6555a48452523/l_634eae8e253a8c1c5f86f3d8.jpg",
    priceText: "Rs. 9,100",
    sourceUrl:
      "https://poshmark.com/listing/Mens-Pakistani-2-Piece-Black-Band-Collar-Shalwar-Kameez-Embellished-Neckline-634ead1f4bc6555a48452523",
  },
  {
    title: "Mian Blue Premium Stitch",
    description: "Premium blue traditional shirt presentation with crisp finishing and polished hemline.",
    details:
      "A premium blue set designed with a polished hemline, neat finishing, and a balanced front. A versatile design for formal family events and upscale daily dressing.",
    imagePath:
      "https://di2ponv0v5otw.cloudfront.net/posts/2026/09/01/6a97983ff314c2f6d9bf46d7/l_6a97984024cc872cba940a9d.jpg",
    priceText: "Rs. 8,100",
    sourceUrl:
      "https://poshmark.com/listing/Novelty-Exclusive-Shirt-Men-L-Blue-Shalwar-Kameez-Band-Collar-Embroidered-Button-6a97983ff314c2f6d9bf46d7",
  },
  {
    title: "Black Designer Profile",
    description: "Profile-style product view highlighting fall, shoulder balance, and clean tailoring.",
    details:
      "This angle highlights how the piece sits through the shoulder, chest, and side line. A useful design reference for clients who care about silhouette and fit before ordering.",
    imagePath:
      "https://di2ponv0v5otw.cloudfront.net/posts/2022/10/18/634ead1f4bc6555a48452523/l_634eae8f7dfcc2edbd84a9bb.jpg",
    priceText: "Rs. 8,400",
    sourceUrl:
      "https://poshmark.com/listing/Mens-Pakistani-2-Piece-Black-Band-Collar-Shalwar-Kameez-Embellished-Neckline-634ead1f4bc6555a48452523",
  },
  {
    title: "Blue Festive Classic",
    description: "Festive menswear look with minimalist embroidery and a sleek traditional cut.",
    details:
      "A clean festive classic for men who like understated embroidery with a modern traditional silhouette. The blue tone works well for wedding dinners and Eid visits.",
    imagePath:
      "https://di2ponv0v5otw.cloudfront.net/posts/2026/09/01/6a97983ff314c2f6d9bf46d7/l_6a97984088963fd668de81a4.jpg",
    priceText: "Rs. 8,250",
    sourceUrl:
      "https://poshmark.com/listing/Novelty-Exclusive-Shirt-Men-L-Blue-Shalwar-Kameez-Band-Collar-Embroidered-Button-6a97983ff314c2f6d9bf46d7",
  },
  {
    title: "Black Luxury Tailored Set",
    description: "Premium black suit-inspired kurta look with formal presentation and rich finish.",
    details:
      "A luxury black tailored option inspired by polished formal menswear. Strong front presence, premium neck work, and a finish suitable for weddings and formal dinners.",
    imagePath:
      "https://di2ponv0v5otw.cloudfront.net/posts/2022/10/18/634ead1f4bc6555a48452523/l_634eae9b932a8a4a5d6e7daa.jpg",
    priceText: "Rs. 9,300",
    sourceUrl:
      "https://poshmark.com/listing/Mens-Pakistani-2-Piece-Black-Band-Collar-Shalwar-Kameez-Embellished-Neckline-634ead1f4bc6555a48452523",
  },
  {
    title: "Blue Detailed Button Placket",
    description: "Close view of front placket styling, sharp buttoning, and refined stitch detailing.",
    details:
      "A close inspection product card showing placket styling, button spacing, and stitch refinement. Ideal as a design reference for clients who want a custom blue placket finish.",
    imagePath:
      "https://di2ponv0v5otw.cloudfront.net/posts/2026/09/01/6a97983ff314c2f6d9bf46d7/l_6a9798407e297b651dd9c9d1.jpg",
    priceText: "Rs. 7,850",
    sourceUrl:
      "https://poshmark.com/listing/Novelty-Exclusive-Shirt-Men-L-Blue-Shalwar-Kameez-Band-Collar-Embroidered-Button-6a97983ff314c2f6d9bf46d7",
  },
  {
    title: "Maroon Wedding Embroidered Set",
    description: "Deep maroon shalwar kameez with intricate gold-toned collar embroidery for baraat wear.",
    details:
      "A regal maroon festive set crafted for wedding baraat and formal celebrations. Gold threadwork on mandarin collar, polished placket, premium wash-and-wear fabric with graceful fall and formal drape.",
    imagePath:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=pakistani%20mens%20maroon%20shalwar%20kameez%20with%20intricate%20gold%20embroidered%20mandarin%20collar%2C%20flat%20lay%20product%20photography%2C%20dark%20background%2C%20premium%20formal%20wear&image_size=square_hd",
    priceText: "Rs. 11,500",
    sourceUrl: "",
  },
  {
    title: "Charcoal Gray Prince Coat Combo",
    description: "Elegant charcoal prince coat layered over tailored white kurta for groom look.",
    details:
      "Complete three piece look combining a tailored charcoal prince coat with fine lapels, layered over a crisp white kurta. Finishing with elegant buttons, perfect for walima, mehndi, and reception evenings.",
    imagePath:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mens%20charcoal%20gray%20prince%20coat%20over%20white%20kurta%20shalwar%20kameez%20menswear%20hanging%20product%20shot%20on%20hanger%2C%20premium%20eastern%20formal%20wedding%20wear&image_size=square_hd",
    priceText: "Rs. 18,900",
    sourceUrl: "",
  },
  {
    title: "Off-White Chikankari Kurta",
    description: "Hand-finished off-white chikankari embroidered kurta with refined threadwork.",
    details:
      "Light summer-friendly off-white design with classic chikankari embroidery across front and cuffs. Premium cotton-blend fabric, classic straight cut for Eid, Jummah, and daytime festive wear.",
    imagePath:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mens%20off%20white%20chikankari%20kurta%20shalwar%20kameez%20hanging%20flat%20lay%20product%20photo%20%20elegant%20embroidery%20premium%20eastern%20wear&image_size=square_hd",
    priceText: "Rs. 9,700",
    sourceUrl: "",
  },
  {
    title: "Emerald Green Festive Set",
    description: "Rich emerald green kurta with contrast embroidered band collar and premium buttons.",
    details:
      "Deep emerald tone designed for mehndi and Eid. Decorative embroidered band collar with elegant buttons and a richly tailored structure with richly tailored straight fall festive wear.",
    imagePath:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=pakistani%20mens%20deep%20emerald%20green%20shalwar%20kameez%20band%20collar%20embroidery%20on%20hanger%20product%20photography%20festive%20premium%20tailored&image_size=square_hd",
    priceText: "Rs. 10,200",
    sourceUrl: "",
  },
  {
    title: "Beige Textured Waistcoat Set",
    description: "Beige embroidered waistcoat layered with matching kurta for refined formal layered look.",
    details:
      "Three piece set with an embroidered beige waistcoat over plain kurta shalwar. Perfect layered look ideal for daytime wedding events, family dinners, and graceful occasion dressing.",
    imagePath:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mens%20beige%20embroidered%20waistcoat%20layered%20over%20kurta%20shalwar%20kameez%2C%20premium%20pakistani%20eastern%20wear%20product%20photo%20on%20hanger&image_size=square_hd",
    priceText: "Rs. 14,500",
    sourceUrl: "",
  },
  {
    title: "Light Pink Pastel Kurta",
    description: "Soft pastel pink kurta with minimal embroidery on collar for elegant summer tailoring.",
    details:
      "A pastel pink perfect for summer daytime weddings, graceful minimal design with subtle embroidery on cuffs and placket. Light airy blended fabric premium soft tailored drape and straight cut.",
    imagePath:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mens%20soft%20pastel%20light%20pink%20shalwar%20kameez%20kurta%2C%20minimal%20embroidered%20collar%2C%20summer%20eastern%20wear%20hanging%20on%20a%20hanger%20product%20shot&image_size=square_hd",
    priceText: "Rs. 7,950",
    sourceUrl: "",
  },
  {
    title: "Navy Blue Zari Collar Detail",
    description: "Close-up navy blue kurta detailed zari and resham embroidered collar design.",
    details:
      "Focus shot focusing on collar and placket zardozi details of a navy blue kurta. Detailed zari threadwork with stone accents on mandarin collar premium tailored for groom inspiration design reference sample detailed collar closeup.",
    imagePath:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=closeup%20of%20mens%20navy%20blue%20shalwar%20kameez%20embroidered%20mandarin%20collar%20with%20zari%20gold%20resham%20threadwork%20product%20photography&image_size=square_hd",
    priceText: "Rs. 9,400",
    sourceUrl: "",
  },
  {
    title: "Deep Purple Mehndi Ensemble",
    description: "Signature deep purple with motif embroidered front panel embroidery on kurta set.",
    details:
      "Bold deep purple kurta with intricate embroidered on front panel and collar. Traditional festive look and graceful mehndi night men's fashion design premium stitching, wash and wear fabric with embroidery.",
    imagePath:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mens%20deep%20purple%20pakistani%20shalwar%20kameez%20kurta%20embroidered%20front%20panel%2C%20mehndi%20wear%2C%20hanging%20on%20hanger%20product%20photo&image_size=square_hd",
    priceText: "Rs. 10,800",
    sourceUrl: "",
  },
  {
    title: "Ivory Sherwani Style Kurta",
    description: "Ivory off-white sherwani style stand collar tailored kurta premium look with stand collar.",
    details:
      "Minimal ivory kurta inspired by sherwani silhouette with tailored stand premium look. High low stand premium clean buttons tailored for dapper formal day, walima, formal and formal groom side.",
    imagePath:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mens%20ivory%20sherwani%20style%20kurta%20high%20low%20stand%20collar%2C%20premium%20pakistani%20groom%20wear%2C%20hanging%20hanger%20product%20shot&image_size=square_hd",
    priceText: "Rs. 12,900",
    sourceUrl: "",
  },
  {
    title: "Olive Green Dapper Cut",
    description: "Olive green smart kurta with contrast buttons textured fabric detailed cuff detailing.",
    details:
      "Modern stylish olive contemporary kurta banded from soft premium subtle textured fabric smart dressing. Premium buttons for jummah mubarak wear smart clean and sophisticated men's style shalwar kameez.",
    imagePath:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mens%20olive%20green%20shalwar%20kameez%20kurta%20premium%20smart%20casual%20band%20wear%20hanging%20on%20hanger%20product%20photography&image_size=square_hd",
    priceText: "Rs. 8,250",
    sourceUrl: "",
  },
  {
    title: "Mustard Yellow Haldi Kurta",
    description: "Vibrant mustard yellow kurta set haldi event wear festive.",
    details:
      "Cheerful mustard kurta haldi ceremony bright and day events, with subtle embroidery details breathable cotton blend summery daytime wearing groom haldi function traditional colour.",
    imagePath:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mens%20mustard%20yellow%20kurta%20shalwar%20kameez%2C%20haldi%20ceremony%20wear%2C%20pakistani%20eastern%20wear%20product%20photography%20on%20hanger&image_size=square_hd",
    priceText: "Rs. 7,600",
    sourceUrl: "",
  },
  {
    title: "Black Gold Heavy Embroidered",
    description: "Jet black kurta heavy gold embroidery premium groom ensemble.",
    details:
      "Premium black kurta with intricate heavily embroidered full suit men's heavily gold threadwork perfect for reception nights, baraat processions. Heavy zardozi detailing.",
    imagePath:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mens%20jet%20black%20shalwar%20kameez%20heavy%20gold%20embroidered%20kurta%20zardozi%2C%20premium%20groom%20wedding%20wear%2C%20hanging%20product%20photography&image_size=square_hd",
    priceText: "Rs. 16,900",
    sourceUrl: "",
  },
  {
    title: "Light Gray Slim Tailored Silhouette",
    description: "Light gray kurta with modern tailored slim silhouette cut.",
    details:
      "Lightweight breathable premium modern silhouette, light grey refined light wash and wear elegant modern slim tailored slim fit cut clean look gentlemen choice stylish easy modern formal everyday formalwear officewear.",
    imagePath:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mens%20light%20grey%20slim%20fit%20shalwar%20kameez%20kurta%2C%20modern%20tailored%20silhouette%2C%20premium%20eastern%20wear%20hanging%20hanger%20photo&image_size=square_hd",
    priceText: "Rs. 7,400",
    sourceUrl: "",
  },
  {
    title: "Cream Walima Silk Kurta",
    description: "Luxury cream silk-blend kurta with refined tone-on-tone detailing for walima wear.",
    details:
      "Soft luxurious cream kurta silk blend refined elegant wedding wear subtle tone-on-tone embroidery for groom's side outfit. Luxurious feel graceful drape premium men’s walima attire premium silk cotton rich fabric soft luxurious style.",
    imagePath:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mens%20cream%20silk%20blend%20kurta%2C%20luxurious%20walima%20wear%2C%20pakistani%20shalwar%20kameez%2C%20hanging%20on%20hanger%20product%20photography&image_size=square_hd",
    priceText: "Rs. 13,200",
    sourceUrl: "",
  },
  {
    title: "Dark Brown Butta Wear",
    description: "Dark brown kurta with intricate brown threadwork subtle details.",
    details:
      "A rich dark brown kurta set, intricate self thread embroidery premium front placket band banded buttons sophisticated tone suitable for Autumn events and evening wear premium.",
    imagePath:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mens%20dark%20brown%20shalwar%20kameez%20kurta%20subtle%20thread%20embroidery%20front%20placket%20premium%20eastern%20wear%20product%20shot&image_size=square_hd",
    priceText: "Rs. 8,800",
    sourceUrl: "",
  },
  {
    title: "Peshawari Classic Cut",
    description: "Traditional Peshawari-inspired loose cut with elegant drape and classic tailoring.",
    details:
      "Traditional Peshawari silhouette kurta set a traditional and design reference, Peshawari Peshawari style design loose elegant stitching for a graceful fall comfortable Peshawari traditionally tailored kurta.",
    imagePath:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mens%20traditional%20peshawari%20style%20shalwar%20kameez%20kurta%20loose%20comfortable%20elegant%20hanging%20hanger%20product%20photography&image_size=square_hd",
    priceText: "Rs. 9,000",
    sourceUrl: "",
  },
  {
    title: "Blue Three Piece Formal Set",
    description: "Navy blue three-piece formal set with a matching waistcoat and elegant tailoring.",
    details:
      "Navy blue three piece set comprising kurta trousers and matching waistcoat. Formal three piece navy three piece three piece suit layering groom men piece suit design formal occasions.",
    imagePath:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mens%20navy%20blue%20three%20piece%20waistcoat%20and%20kurta%20shalwar%20kameez%20premium%20wedding%20wear%20hanging%20product%20shot&image_size=square_hd",
    priceText: "Rs. 15,750",
    sourceUrl: "",
  },
  {
    title: "White Classic Eid Kurta",
    description: "Crisp white kurta with premium stitching and a timeless Eid-ready silhouette.",
    details:
      "A wardrobe essential pure white kurta, classic white fabric. Elegant crisp white, perfectly premium men. Classic tailored look, with cuffs. A sharp cut men.",
    imagePath:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=crisp%20white%20mens%20shalwar%20kameez%20kurta%2C%20premium%20stitching%20classic%20eid%20wear%20hanging%20on%20hanger%20product%20photography&image_size=square_hd",
    priceText: "Rs. 6,800",
    sourceUrl: "",
  },
  {
    title: "Designer Collar Embellished",
    description: "Designer collar design sample close shot detailed embellished designer detailed collar.",
    details:
      "Detailed close-up shot of a embellished designer kurta collar. Gem stone embellished embroidered collar. Jewel-necked collar on neck kurta, with sequence and buttons with cutwork premium detail for a stonework kurta reference.",
    imagePath:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=close%20up%20of%20embellished%20embroidered%20designer%20kurta%20collar%20premium%20pakistani%20shalwar%20kameez%20stone%20work&image_size=square_hd",
    priceText: "Rs. 11,200",
    sourceUrl: "",
  },
  {
    title: "Sea Green Side Profile",
    description: "Sea green kurta profile view highlighting shoulder drape and clean side balance.",
    details:
      "Side profile view sea green teal kurta, showing how fabric, drape from side silhouette view sleeve fall and shoulder line design sample profile look. Perfect to inspect fit kurta perfect fitting view reference kurta.",
    imagePath:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=side%20profile%20of%20sea%20green%20teal%20mens%20kurta%20shalwar%20kameez%20shoulder%20drape%20fall%2C%20premium%20tailoring%20hanging%20hanger%20view&image_size=square_hd",
    priceText: "Rs. 8,550",
    sourceUrl: "",
  },
];

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const db = new DatabaseSync(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    admin_username TEXT NOT NULL,
    admin_password_hash TEXT NOT NULL,
    token_secret TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS gallery_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    image_path TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS contact_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    occasion TEXT DEFAULT '',
    message TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT DEFAULT '',
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    notes TEXT DEFAULT '',
    items_json TEXT NOT NULL,
    subtotal_amount REAL NOT NULL,
    delivery_fee REAL NOT NULL,
    total_amount REAL NOT NULL,
    payment_method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL
  );
`);

function ensureColumn(tableName, columnName, definition) {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();

  if (!columns.some((column) => column.name === columnName)) {
    db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  }
}

ensureColumn("gallery_items", "price_text", "TEXT DEFAULT ''");
ensureColumn("gallery_items", "details", "TEXT DEFAULT ''");
ensureColumn("gallery_items", "is_visible", "INTEGER NOT NULL DEFAULT 1");
ensureColumn("gallery_items", "display_order", "INTEGER NOT NULL DEFAULT 0");
ensureColumn("gallery_items", "source_type", "TEXT NOT NULL DEFAULT 'upload'");
ensureColumn("gallery_items", "source_url", "TEXT DEFAULT ''");

const settingsCount = db.prepare("SELECT COUNT(*) AS count FROM settings").get().count;
const createdDefaultAdmin = settingsCount === 0;

if (createdDefaultAdmin) {
  db.prepare(
    "INSERT INTO settings (id, admin_username, admin_password_hash, token_secret) VALUES (1, ?, ?, ?)"
  ).run(
    DEFAULT_ADMIN_USERNAME || "admin",
    hashPassword(DEFAULT_ADMIN_PASSWORD),
    crypto.randomBytes(32).toString("hex")
  );
}

function seedGalleryCatalog() {
  const existingSeededTitles = new Set(
    db
      .prepare("SELECT title FROM gallery_items WHERE source_type = 'seeded'")
      .all()
      .map((row) => row.title)
  );

  const insertGalleryItem = db.prepare(
    `
      INSERT INTO gallery_items (
        title,
        description,
        image_path,
        created_at,
        price_text,
        details,
        is_visible,
        display_order,
        source_type,
        source_url
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
  );

  seededGalleryItems.forEach((item, index) => {
    if (existingSeededTitles.has(item.title)) {
      return;
    }

    insertGalleryItem.run(
      item.title,
      item.description,
      item.imagePath,
      new Date(Date.now() - (seededGalleryItems.length - index) * 1000).toISOString(),
      item.priceText,
      item.details,
      1,
      index + 1,
      "seeded",
      item.sourceUrl
    );
  });
}

seedGalleryCatalog();

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(UPLOADS_DIR));

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename: (_req, file, cb) => {
      const extension = path.extname(file.originalname || "").toLowerCase() || ".jpg";
      cb(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
    },
  }),
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed."));
    }

    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, storedValue] = storedHash.split(":");

  if (!salt || !storedValue) {
    return false;
  }

  const computed = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(storedValue, "hex");
  const b = Buffer.from(computed, "hex");

  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function getCookieMap(req) {
  const header = req.headers.cookie || "";

  return header.split(";").reduce((cookies, pair) => {
    const [rawName, ...rest] = pair.trim().split("=");

    if (!rawName) {
      return cookies;
    }

    cookies[rawName] = decodeURIComponent(rest.join("="));
    return cookies;
  }, {});
}

function readSettings() {
  return db.prepare("SELECT * FROM settings WHERE id = 1").get();
}

function createAuthToken(username) {
  const settings = readSettings();
  const payload = Buffer.from(
    JSON.stringify({
      username,
      expiresAt: Date.now() + ONE_WEEK_MS,
    })
  ).toString("base64url");
  const signature = crypto
    .createHmac("sha256", settings.token_secret)
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

function verifyAuthToken(token) {
  if (!token || !token.includes(".")) {
    return null;
  }

  const [payload, signature] = token.split(".");
  const settings = readSettings();
  const expectedSignature = crypto
    .createHmac("sha256", settings.token_secret)
    .update(payload)
    .digest("base64url");

  if (signature.length !== expectedSignature.length) {
    return null;
  }

  if (
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  ) {
    return null;
  }

  const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));

  if (data.expiresAt < Date.now()) {
    return null;
  }

  return data;
}

function setAuthCookie(res, token) {
  const secureFlag = COOKIE_SECURE ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${AUTH_COOKIE}=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=${
      ONE_WEEK_MS / 1000
    }; SameSite=Lax${secureFlag}`
  );
}

function clearAuthCookie(res) {
  const secureFlag = COOKIE_SECURE ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${AUTH_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${secureFlag}`
  );
}

function requireAdmin(req, res, next) {
  const token = getCookieMap(req)[AUTH_COOKIE];
  const session = verifyAuthToken(token);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.admin = session;
  next();
}

function mapGalleryItem(item) {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    imagePath: item.image_path,
    createdAt: item.created_at,
    priceText: item.price_text || "",
    details: item.details || "",
    isVisible: Boolean(item.is_visible),
    displayOrder: item.display_order || 0,
    sourceType: item.source_type || "upload",
    sourceUrl: item.source_url || "",
    productUrl: `/product?id=${item.id}`,
  };
}

function mapContactRequest(item) {
  return {
    id: item.id,
    name: item.name,
    email: item.email,
    occasion: item.occasion,
    message: item.message,
    createdAt: item.created_at,
  };
}

function mapOrder(item) {
  return {
    id: item.id,
    customerName: item.customer_name,
    phone: item.phone,
    email: item.email || "",
    city: item.city,
    address: item.address,
    notes: item.notes || "",
    items: JSON.parse(item.items_json || "[]"),
    subtotalAmount: Number(item.subtotal_amount || 0),
    deliveryFee: Number(item.delivery_fee || 0),
    totalAmount: Number(item.total_amount || 0),
    paymentMethod: item.payment_method,
    status: item.status,
    createdAt: item.created_at,
  };
}

function parseCurrencyValue(value = "") {
  const numeric = Number(String(value).replace(/\D/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function getStorefrontData() {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const isBusinessDay = day >= 1 && day <= 6;
  const isSupportLive = isBusinessDay && hour >= 10 && hour < 20;

  return {
    ...STORE_CONFIG,
    whatsappUrl: `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
      STORE_CONFIG.whatsappMessage
    )}`,
    isSupportLive,
  };
}

function buildTitleFromFilename(filename = "") {
  const base = path.basename(filename, path.extname(filename));
  return (
    base
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim() || "Mian Tailer Design"
  );
}

function sendGalleryUpdate(type, itemId = null) {
  const payload = JSON.stringify({
    type,
    itemId,
    timestamp: Date.now(),
  });

  for (const client of galleryStreamClients) {
    client.write(`event: gallery-update\n`);
    client.write(`data: ${payload}\n\n`);
  }
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/storefront", (_req, res) => {
  res.json(getStorefrontData());
});

app.get("/api/gallery", (_req, res) => {
  const rows = db
    .prepare(
      `
        SELECT *
        FROM gallery_items
        WHERE is_visible = 1
        ORDER BY
          CASE WHEN source_type = 'seeded' THEN 0 ELSE 1 END,
          display_order ASC,
          id DESC
      `
    )
    .all()
    .map(mapGalleryItem);

  res.json({ items: rows });
});

app.get("/api/gallery/:id", (req, res) => {
  const id = Number(req.params.id);
  const item = db
    .prepare("SELECT * FROM gallery_items WHERE id = ? AND is_visible = 1")
    .get(id);

  if (!item) {
    return res.status(404).json({ error: "Product not found." });
  }

  res.json({ item: mapGalleryItem(item) });
});

app.get("/api/gallery/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  res.write(`event: connected\n`);
  res.write(`data: ${JSON.stringify({ ok: true })}\n\n`);

  galleryStreamClients.add(res);

  const heartbeat = setInterval(() => {
    res.write(`event: heartbeat\n`);
    res.write(`data: ${Date.now()}\n\n`);
  }, 25000);

  req.on("close", () => {
    clearInterval(heartbeat);
    galleryStreamClients.delete(res);
  });
});

app.post("/api/contact", (req, res) => {
  const { name = "", email = "", occasion = "", message = "" } = req.body;

  if (!name.trim() || !email.trim() || !message.trim()) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  const createdAt = new Date().toISOString();
  const result = db
    .prepare(
      `
        INSERT INTO contact_requests (name, email, occasion, message, created_at)
        VALUES (?, ?, ?, ?, ?)
      `
    )
    .run(name.trim(), email.trim(), occasion.trim(), message.trim(), createdAt);

  const item = db
    .prepare("SELECT * FROM contact_requests WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json({
    message: "Request sent successfully.",
    request: mapContactRequest(item),
  });
});

app.post("/api/orders", (req, res) => {
  const {
    customerName = "",
    phone = "",
    email = "",
    city = "",
    address = "",
    notes = "",
    items = [],
    paymentMethod = "Cash on Delivery",
  } = req.body;

  if (!customerName.trim() || !phone.trim() || !city.trim() || !address.trim()) {
    return res
      .status(400)
      .json({ error: "Name, phone, city, and delivery address are required." });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Your cart is empty." });
  }

  const readProduct = db.prepare(
    "SELECT * FROM gallery_items WHERE id = ? AND is_visible = 1"
  );

  const normalizedItems = [];
  let subtotal = 0;

  for (const rawItem of items) {
    const productId = Number(rawItem?.productId);
    const quantity = Math.max(1, Number(rawItem?.quantity) || 1);
    const product = readProduct.get(productId);

    if (!product) {
      return res.status(400).json({ error: "One or more selected products are unavailable." });
    }

    const unitPrice = parseCurrencyValue(product.price_text);
    subtotal += unitPrice * quantity;
    normalizedItems.push({
      productId: product.id,
      title: product.title,
      imagePath: product.image_path,
      quantity,
      unitPrice,
      priceText: product.price_text || "",
    });
  }

  const deliveryFee =
    subtotal >= STORE_CONFIG.freeDeliveryThreshold ? 0 : STORE_CONFIG.deliveryFee;
  const totalAmount = subtotal + deliveryFee;
  const createdAt = new Date().toISOString();

  const result = db
    .prepare(
      `
        INSERT INTO orders (
          customer_name,
          phone,
          email,
          city,
          address,
          notes,
          items_json,
          subtotal_amount,
          delivery_fee,
          total_amount,
          payment_method,
          status,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)
      `
    )
    .run(
      customerName.trim(),
      phone.trim(),
      email.trim(),
      city.trim(),
      address.trim(),
      notes.trim(),
      JSON.stringify(normalizedItems),
      subtotal,
      deliveryFee,
      totalAmount,
      paymentMethod.trim() || "Cash on Delivery",
      createdAt
    );

  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(result.lastInsertRowid);

  res.status(201).json({
    message: "Order placed successfully.",
    order: mapOrder(order),
  });
});

app.post("/api/admin/login", (req, res) => {
  const { username = "", password = "" } = req.body;
  const settings = readSettings();

  if (
    username.trim() !== settings.admin_username ||
    !verifyPassword(password, settings.admin_password_hash)
  ) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  setAuthCookie(res, createAuthToken(settings.admin_username));
  res.json({
    message: "Login successful.",
    admin: { username: settings.admin_username },
  });
});

app.post("/api/admin/logout", (_req, res) => {
  clearAuthCookie(res);
  res.json({ message: "Logged out." });
});

app.get("/api/admin/session", requireAdmin, (req, res) => {
  res.json({ admin: { username: req.admin.username } });
});

app.get("/api/admin/dashboard", requireAdmin, (_req, res) => {
  const galleryCount = db
    .prepare("SELECT COUNT(*) AS count FROM gallery_items WHERE is_visible = 1")
    .get().count;
  const contactCount = db
    .prepare("SELECT COUNT(*) AS count FROM contact_requests")
    .get().count;
  const orderCount = db.prepare("SELECT COUNT(*) AS count FROM orders").get().count;

  res.json({
    stats: {
      galleryCount,
      contactCount,
      orderCount,
    },
  });
});

app.get("/api/admin/gallery", requireAdmin, (_req, res) => {
  const rows = db
    .prepare(
      `
        SELECT *
        FROM gallery_items
        ORDER BY
          CASE WHEN source_type = 'seeded' THEN 0 ELSE 1 END,
          display_order ASC,
          id DESC
      `
    )
    .all()
    .map(mapGalleryItem);

  res.json({ items: rows });
});

app.post(
  "/api/admin/gallery",
  requireAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 20 },
  ]),
  (req, res) => {
    const {
      title = "",
      description = "",
      details = "",
      priceText = "",
      isVisible = "true",
    } = req.body;
    const files = [...(req.files?.image || []), ...(req.files?.images || [])];

    if (files.length === 0) {
      return res.status(400).json({ error: "At least one image file is required." });
    }

    const sharedTitle = title.trim();
    const sharedDescription = description.trim();
    const sharedDetails = details.trim();
    const sharedPriceText = priceText.trim();
    const visibleValue = String(isVisible) === "false" ? 0 : 1;
    const insertGalleryItem = db.prepare(
      `
        INSERT INTO gallery_items (
          title,
          description,
          image_path,
          created_at,
          price_text,
          details,
          is_visible,
          display_order,
          source_type,
          source_url
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
    );
    const readGalleryItem = db.prepare("SELECT * FROM gallery_items WHERE id = ?");
    const items = [];

    for (const [index, file] of files.entries()) {
      const itemTitle =
        files.length === 1
          ? sharedTitle || buildTitleFromFilename(file.originalname)
          : sharedTitle
            ? `${sharedTitle} ${index + 1}`
            : buildTitleFromFilename(file.originalname);
      const createdAt = new Date().toISOString();
      const imagePath = `/uploads/${file.filename}`;
      const result = insertGalleryItem.run(
        itemTitle,
        sharedDescription,
        imagePath,
        createdAt,
        sharedPriceText,
        sharedDetails,
        visibleValue,
        999 + index,
        "upload",
        ""
      );
      const item = readGalleryItem.get(result.lastInsertRowid);

      items.push(mapGalleryItem(item));
      sendGalleryUpdate("created", item.id);
    }

    res.status(201).json({
      message: `${items.length} design${items.length === 1 ? "" : "s"} uploaded.`,
      items,
    });
  }
);

app.patch("/api/admin/gallery/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const {
    title = "",
    description = "",
    details = "",
    priceText = "",
    isVisible = true,
    displayOrder = 0,
  } = req.body;
  const existing = db.prepare("SELECT * FROM gallery_items WHERE id = ?").get(id);

  if (!existing) {
    return res.status(404).json({ error: "Gallery item not found." });
  }

  if (!title.trim()) {
    return res.status(400).json({ error: "Title is required." });
  }

  db.prepare(
    `
      UPDATE gallery_items
      SET
        title = ?,
        description = ?,
        details = ?,
        price_text = ?,
        is_visible = ?,
        display_order = ?
      WHERE id = ?
    `
  ).run(
    title.trim(),
    description.trim(),
    details.trim(),
    priceText.trim(),
    isVisible ? 1 : 0,
    Number(displayOrder) || 0,
    id
  );

  const updated = db.prepare("SELECT * FROM gallery_items WHERE id = ?").get(id);
  sendGalleryUpdate("updated", updated.id);
  res.json({ message: "Gallery item updated.", item: mapGalleryItem(updated) });
});

app.delete("/api/admin/gallery/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare("SELECT * FROM gallery_items WHERE id = ?").get(id);

  if (!existing) {
    return res.status(404).json({ error: "Gallery item not found." });
  }

  db.prepare("DELETE FROM gallery_items WHERE id = ?").run(id);

  if (existing.image_path.startsWith("/uploads/")) {
    const filePath = path.join(ROOT_DIR, existing.image_path.replace(/^\//, ""));

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  sendGalleryUpdate("deleted", id);
  res.json({ message: "Gallery item deleted." });
});

app.get("/api/admin/contacts", requireAdmin, (_req, res) => {
  const rows = db
    .prepare("SELECT * FROM contact_requests ORDER BY id DESC")
    .all()
    .map(mapContactRequest);

  res.json({ items: rows });
});

app.get("/api/admin/orders", requireAdmin, (_req, res) => {
  const rows = db
    .prepare("SELECT * FROM orders ORDER BY id DESC")
    .all()
    .map(mapOrder);

  res.json({ items: rows });
});

app.post("/api/admin/change-password", requireAdmin, (req, res) => {
  const { currentPassword = "", newPassword = "" } = req.body;
  const settings = readSettings();

  if (!verifyPassword(currentPassword, settings.admin_password_hash)) {
    return res.status(400).json({ error: "Current password is incorrect." });
  }

  if (newPassword.trim().length < 6) {
    return res.status(400).json({ error: "New password must be at least 6 characters." });
  }

  db.prepare("UPDATE settings SET admin_password_hash = ? WHERE id = 1").run(
    hashPassword(newPassword.trim())
  );

  res.json({ message: "Password updated." });
});

app.get("/admin", (_req, res) => {
  res.sendFile(path.join(ROOT_DIR, "admin.html"));
});

app.get("/admin/dashboard", (_req, res) => {
  res.sendFile(path.join(ROOT_DIR, "admin-dashboard.html"));
});

app.get("/gallery", (_req, res) => {
  res.sendFile(path.join(ROOT_DIR, "gallery.html"));
});

app.get("/about", (_req, res) => {
  res.sendFile(path.join(ROOT_DIR, "about.html"));
});

app.get("/services", (_req, res) => {
  res.sendFile(path.join(ROOT_DIR, "services.html"));
});

app.get("/contact", (_req, res) => {
  res.sendFile(path.join(ROOT_DIR, "contact.html"));
});

app.get("/product", (_req, res) => {
  res.sendFile(path.join(ROOT_DIR, "product.html"));
});

app.get("/cart", (_req, res) => {
  res.sendFile(path.join(ROOT_DIR, "cart.html"));
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(ROOT_DIR, "index.html"));
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use(express.static(ROOT_DIR));

app.use((err, _req, res, _next) => {
  const status = err.code === "LIMIT_FILE_SIZE" ? 400 : 500;
  res.status(status).json({ error: err.message || "Unexpected server error." });
});

app.listen(PORT, HOST, () => {
  console.log(`Mian Tailer server running on ${HOST}:${PORT}`);
  console.log(`Health check available at http://127.0.0.1:${PORT}/health`);

  if (createdDefaultAdmin) {
    console.log(`Default admin login: ${DEFAULT_ADMIN_USERNAME} / ${DEFAULT_ADMIN_PASSWORD}`);
  }
});

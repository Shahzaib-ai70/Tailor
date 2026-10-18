const yearElement = document.getElementById("year");
const contactFeedback = document.getElementById("contact-feedback");
const galleryList = document.getElementById("gallery-list");
const galleryEmpty = document.getElementById("gallery-empty");
const curatedGalleryList = document.getElementById("curated-gallery-list");
const curatedEmpty = document.getElementById("curated-empty");
const productImage = document.getElementById("product-image");
const productStatus = document.getElementById("product-status");
const productTitle = document.getElementById("product-title");
const productPrice = document.getElementById("product-price");
const productDescription = document.getElementById("product-description");
const productDetails = document.getElementById("product-details");
const productQuantity = document.getElementById("product-quantity");
const productFeedback = document.getElementById("product-feedback");
const addToCartButton = document.getElementById("add-to-cart-button");
const buyNowButton = document.getElementById("buy-now-button");
const heroSpotlightImage = document.getElementById("hero-spotlight-image");
const heroSpotlightTitle = document.getElementById("hero-spotlight-title");
const heroSpotlightDescription = document.getElementById("hero-spotlight-description");
const heroSpotlightPrice = document.getElementById("hero-spotlight-price");
const heroSpotlightLink = document.getElementById("hero-spotlight-link");
const spotlightShuffleButton = document.getElementById("spotlight-shuffle-button");
const homeShuffleGrid = document.getElementById("home-shuffle-grid");
const shuffleGalleryButton = document.getElementById("shuffle-gallery-button");
const cartItemsContainer = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const cartSubtotal = document.getElementById("cart-subtotal");
const cartDelivery = document.getElementById("cart-delivery");
const cartTotal = document.getElementById("cart-total");
const orderForm = document.getElementById("order-form");
const orderFeedback = document.getElementById("order-feedback");
const cartCountElements = document.querySelectorAll("[data-cart-count]");
const whatsappLinks = document.querySelectorAll("[data-whatsapp-link]");
const storeLiveElements = document.querySelectorAll("[data-store-live]");
const storeDeliveryEtaElements = document.querySelectorAll("[data-store-delivery-eta]");
const storeSupportHoursElements = document.querySelectorAll("[data-store-support-hours]");
const languageButtons = document.querySelectorAll("[data-lang-switch]");
const currentPage = document.body.dataset.page || "home";
const metaDescription = document.querySelector('meta[name="description"]');
const siteNav = document.querySelector(".nav");
const navActions = siteNav?.querySelector(".nav-actions");
const MOBILE_MENU_BREAKPOINT = 900;
let galleryRefreshTimer = null;
let galleryStream = null;
let lastGalleryItems = [];
let storefrontData = null;
let activeProduct = null;
let menuToggleButton = null;

const translations = {
  en: {
    meta: {
      home: {
        title: "Mian Tailer | Luxury Men's Shalwar Kameez",
        description:
          "Mian Tailer creates luxury men's shalwar kameez, waistcoats, and formal Eastern wear with premium fabrics and refined stitching.",
      },
      gallery: {
        title: "Mian Tailer | Gallery",
        description:
          "Mian Tailer gallery of men's shalwar kameez design photos and premium tailoring details.",
      },
    },
    nav: {
      about: "About",
      services: "Services",
      gallery: "Gallery",
      contact: "Contact",
    },
    footer: {
      tagline: "Mian Tailer. Crafted for elegance.",
    },
    home: {
      hero: {
        eyebrow: "Luxury Men's Tailoring",
        title: "Mian Shalwar Kameez Designed With Class.",
        text:
          "Mian Tailer creates premium men's shalwar kameez with elegant cuts, rich fabrics, and beautiful design details for weddings, Eid, Friday wear, and refined everyday style.",
        primaryCta: "Explore Collection",
        secondaryCta: "Book Consultation",
      },
      about: {
        eyebrow: "About Mian Tailer",
        title: "Luxury Eastern menswear shaped by timeless craft.",
        card1Title: "Custom Fit",
        card1Text:
          "Every shalwar kameez is measured for a clean shoulder line, sharp fall, and comfortable premium fit.",
        card2Title: "Premium Fabrics",
        card2Text:
          "We use wash-and-wear, cotton, blended, and festive fabrics with rich texture and graceful movement.",
        card3Title: "Fine Finishing",
        card3Text:
          "Fine collars, cuff work, plackets, buttons, and subtle embroidery give each piece a beautiful finished look.",
      },
      services: {
        eyebrow: "Signature Services",
        title: "For weddings, Eid, Jummah, and standout daily dressing.",
        card1Title: "Luxury Shalwar Kameez",
        card1Text:
          "Custom stitched men's shalwar kameez with graceful cuts, clean stitching, and premium finishing.",
        card2Title: "Prince Coats & Waistcoats",
        card2Text:
          "Regal layering pieces designed to elevate mehndi, barat, walima, and festive occasions.",
        card3Title: "Signature Design Details",
        card3Text:
          "Embroidered collars, contrast cuffs, luxury buttons, and polished plackets for a distinct signature identity.",
      },
      showcase: {
        eyebrow: "Why Clients Choose Us",
        title: "Beautiful men's designs. Flawless fit. Memorable craftsmanship.",
        text:
          "From first measurement to final fitting, Mian Tailer focuses only on men's Eastern wear, combining premium cloth, expert stitching, and beautiful design details to create a wardrobe that feels distinguished and truly personal.",
      },
      contact: {
        eyebrow: "Contact Us",
        title: "Reserve your personal men's fitting with Mian Tailer.",
        visitTitle: "Visit The Atelier",
        visitText: "Luxury men's tailoring consultations by appointment.",
        hours: "Mon - Sat | 10:00 AM - 8:00 PM",
        phone: "Call: +92 300 123 4567",
        form: {
          nameLabel: "Name",
          namePlaceholder: "Your name",
          emailLabel: "Email",
          emailPlaceholder: "Your email",
          occasionLabel: "Occasion",
          occasionPlaceholder: "Shalwar kameez, waistcoat, prince coat...",
          messageLabel: "Message",
          messagePlaceholder: "Tell us what style, fabric, or design you want stitched",
          submit: "Send Request",
          sending: "Sending...",
          success: "Your request has been sent.",
          error: "Unable to send request.",
        },
      },
      gallery: {
        defaultDescription: "Mian Tailer design.",
      },
    },
    gallery: {
      hero: {
        eyebrow: "Real Design Gallery",
        title: "Mens Shalwar Kameez Designs",
        text:
          "Explore our latest men's shalwar kameez designs, premium stitching details, and elegant tailoring styles.",
      },
      catalog: {
        eyebrow: "Curated Collection",
        title: "Featured Suit Designs",
      },
      live: {
        eyebrow: "Live Uploads",
        title: "Latest Added Designs",
      },
      empty: {
        title: "No gallery images yet",
        text: "New designs will be shown here soon.",
      },
      defaultDescription: "Mian Tailer design.",
    },
  },
  ur: {
    meta: {
      home: {
        title: "Mian Tailer | پرتعیش مردانہ شلوار قمیض",
        description:
          "میاں ٹیلر اعلیٰ کپڑے اور نفیس سلائی کے ساتھ مردانہ شلوار قمیض، ویسٹ کوٹ اور رسمی مشرقی لباس تیار کرتا ہے۔",
      },
      gallery: {
        title: "Mian Tailer | گیلری",
        description:
          "میاں ٹیلر گیلری میں مردانہ شلوار قمیض کے ڈیزائن اور عمدہ سلائی کی تفصیلات دیکھیے۔",
      },
    },
    nav: {
      about: "ہمارے بارے میں",
      services: "سروسز",
      gallery: "گیلری",
      contact: "رابطہ",
    },
    footer: {
      tagline: "Mian Tailer۔ نفاست کے ساتھ تیار کیا گیا۔",
    },
    home: {
      hero: {
        eyebrow: "پرتعیش مردانہ سلائی",
        title: "شاہانہ شلوار قمیض باوقار انداز کے ساتھ۔",
        text:
          "میاں ٹیلر شادی، عید، جمعہ اور روزمرہ کے نفیس انداز کے لیے اعلیٰ معیار کی مردانہ شلوار قمیض تیار کرتا ہے جس میں خوبصورت کٹنگ، عمدہ کپڑا اور دلکش ڈیزائن شامل ہوتے ہیں۔",
        primaryCta: "کلیکشن دیکھیں",
        secondaryCta: "مشاورت بک کریں",
      },
      about: {
        eyebrow: "میاں ٹیلر کے بارے میں",
        title: "روایتی ہنر سے تیار کردہ پرتعیش مشرقی مردانہ لباس۔",
        card1Title: "حسبِ پیمائش فٹنگ",
        card1Text:
          "ہر شلوار قمیض کو صاف شولڈر لائن، خوبصورت فال اور آرام دہ عمدہ فٹ کے لیے ناپ کے مطابق تیار کیا جاتا ہے۔",
        card2Title: "اعلیٰ معیار کے کپڑے",
        card2Text:
          "ہم واش اینڈ ویئر، کاٹن، بلینڈڈ اور تہواروں کے کپڑے استعمال کرتے ہیں جن میں بھرپور بناوٹ اور خوبصورت گرِپ ہوتی ہے۔",
        card3Title: "نفیس فنشنگ",
        card3Text:
          "نفیس کالر، کف ورک، پلیکیٹ، بٹن اور ہلکی کڑھائی ہر لباس کو مکمل اور خوبصورت انداز دیتی ہے۔",
      },
      services: {
        eyebrow: "خصوصی خدمات",
        title: "شادی، عید، جمعہ اور روزمرہ کے نمایاں انداز کے لیے۔",
        card1Title: "پرتعیش شلوار قمیض",
        card1Text:
          "حسبِ خواہش سلی ہوئی مردانہ شلوار قمیض جس میں خوبصورت کٹنگ، صاف سلائی اور اعلیٰ فنشنگ شامل ہو۔",
        card2Title: "پرنس کوٹ اور ویسٹ کوٹ",
        card2Text:
          "شاہانہ لیئرنگ پیسز جو مہندی، بارات، ولیمہ اور دیگر تقریبات کے انداز کو نمایاں بنائیں۔",
        card3Title: "خصوصی ڈیزائن تفصیلات",
        card3Text:
          "کڑھائی والے کالر، کانٹراسٹ کف، لگژری بٹن اور خوبصورت پلیکیٹ آپ کے لباس کو منفرد شناخت دیتے ہیں۔",
      },
      showcase: {
        eyebrow: "صارفین ہمیں کیوں پسند کرتے ہیں",
        title: "دلکش مردانہ ڈیزائن، بہترین فٹ اور یادگار دستکاری۔",
        text:
          "پہلی پیمائش سے آخری فٹنگ تک میاں ٹیلر صرف مردانہ مشرقی لباس پر توجہ دیتا ہے، جہاں اعلیٰ کپڑا، ماہر سلائی اور خوبصورت ڈیزائن کی مدد سے ایسا لباس تیار ہوتا ہے جو واقعی منفرد محسوس ہو۔",
      },
      contact: {
        eyebrow: "رابطہ کریں",
        title: "میاں ٹیلر کے ساتھ اپنی ذاتی فٹنگ بک کریں۔",
        visitTitle: "ہمارے اٹیلیئر تشریف لائیں",
        visitText: "پرتعیش مردانہ سلائی مشاورت صرف اپائنٹمنٹ کے ذریعے دستیاب ہے۔",
        hours: "پیر تا ہفتہ | صبح 10:00 سے رات 8:00 بجے تک",
        phone: "کال کریں: +92 300 123 4567",
        form: {
          nameLabel: "نام",
          namePlaceholder: "آپ کا نام",
          emailLabel: "ای میل",
          emailPlaceholder: "آپ کی ای میل",
          occasionLabel: "موقع",
          occasionPlaceholder: "شلوار قمیض، ویسٹ کوٹ، پرنس کوٹ...",
          messageLabel: "پیغام",
          messagePlaceholder: "بتائیں آپ کون سا اسٹائل، کپڑا یا ڈیزائن سلوانا چاہتے ہیں",
          submit: "درخواست بھیجیں",
          sending: "بھیجا جا رہا ہے...",
          success: "آپ کی درخواست بھیج دی گئی ہے۔",
          error: "درخواست بھیجنے میں مسئلہ پیش آیا۔",
        },
      },
      gallery: {
        defaultDescription: "Mian Tailer ڈیزائن۔",
      },
    },
    gallery: {
      hero: {
        eyebrow: "اصل ڈیزائن گیلری",
        title: "مردانہ شلوار قمیض ڈیزائنز",
        text:
          "ہماری تازہ ترین مردانہ شلوار قمیض، نفیس سلائی کی تفصیلات اور خوبصورت ٹیلرنگ اسٹائلز دیکھیں۔",
      },
      catalog: {
        eyebrow: "منتخب کلیکشن",
        title: "نمایاں سوٹ ڈیزائنز",
      },
      live: {
        eyebrow: "لائیو اپ لوڈز",
        title: "تازہ شامل کردہ ڈیزائنز",
      },
      empty: {
        title: "ابھی گیلری میں تصاویر موجود نہیں ہیں",
        text: "نئے ڈیزائن جلد یہاں دکھائے جائیں گے۔",
      },
      defaultDescription: "Mian Tailer ڈیزائن۔",
    },
  },
};

let currentLanguage = "en";

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

function getTranslation(path, language = currentLanguage) {
  return path.split(".").reduce((value, segment) => value?.[segment], translations[language]);
}

function translate(path) {
  return getTranslation(path) || getTranslation(path, "en") || path;
}

function setFeedback(element, message, isError = false) {
  if (!element) {
    return;
  }

  element.textContent = message;
  element.dataset.state = isError ? "error" : "success";
}

function requestJSON(url, options = {}) {
  return fetch(url, options).then(async (response) => {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "Request failed.");
    }

    return data;
  });
}

function formatCurrency(value) {
  return `Rs. ${Number(value || 0).toLocaleString()}`;
}

function parsePriceText(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return Number(digits || 0);
}

function getCart() {
  return JSON.parse(localStorage.getItem("mian-tailer-cart") || "[]");
}

function saveCart(items) {
  localStorage.setItem("mian-tailer-cart", JSON.stringify(items));
  updateCartCount();
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  cartCountElements.forEach((element) => {
    element.textContent = String(count);
  });
}

function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.productId === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  saveCart(cart);
}

function updateWhatsAppLinks() {
  const url = storefrontData?.whatsappUrl || "#";
  whatsappLinks.forEach((link) => {
    link.setAttribute("href", url);
    if (url.startsWith("http")) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noreferrer");
    }
  });
}

function syncStorefrontUI() {
  const liveText = storefrontData?.isSupportLive
    ? "Live customer service is online now"
    : "Customer care replies during business hours";
  const etaText = `Delivery: ${storefrontData?.deliveryEta || "2 - 4 working days"}`;
  const hoursText = storefrontData?.supportHours || "Mon - Sat | 10:00 AM - 8:00 PM";

  storeLiveElements.forEach((element) => {
    element.textContent = liveText;
    element.dataset.state = storefrontData?.isSupportLive ? "success" : "";
  });
  storeDeliveryEtaElements.forEach((element) => {
    element.textContent = etaText;
  });
  storeSupportHoursElements.forEach((element) => {
    element.textContent = hoursText;
  });
  updateWhatsAppLinks();
}

async function loadStorefrontData() {
  try {
    const data = await requestJSON("/api/storefront");
    storefrontData = data;
    syncStorefrontUI();
  } catch (_error) {
    storefrontData = null;
  }
}

function applyMetaTranslations() {
  const meta = translations[currentLanguage].meta?.[currentPage];

  if (!meta) {
    return;
  }

  document.title = meta.title;

  if (metaDescription) {
    metaDescription.setAttribute("content", meta.description);
  }
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = translate(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", translate(element.dataset.i18nPlaceholder));
  });

  applyMetaTranslations();
}

function updateLanguageButtons() {
  languageButtons.forEach((button) => {
    const isActive = button.dataset.langSwitch === currentLanguage;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function applyLanguage(language) {
  currentLanguage = translations[language] ? language : "en";
  localStorage.setItem("mian-tailer-language", currentLanguage);
  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = currentLanguage === "ur" ? "rtl" : "ltr";
  document.body.dataset.lang = currentLanguage;
  applyTranslations();
  updateLanguageButtons();
}

function createGalleryCard(item, options = {}) {
  const card = document.createElement("article");
  const productUrl = item.productUrl || `product.html?id=${item.id}`;
  card.className = `gallery-card catalog-card${options.live ? " live-card" : ""}`;
  const price = item.price || item.priceText;
  const priceMarkup = price ? `<p class="catalog-price">${price}</p>` : "";

  card.innerHTML = `
    <a class="gallery-card-link" href="${productUrl}">
      <img src="${item.imagePath}" alt="${item.title}" loading="lazy" />
    </a>
    <div class="gallery-copy catalog-copy">
      <h3>${item.title}</h3>
      <p>${item.description || translate(`${currentPage}.defaultDescription`)}</p>
      ${priceMarkup}
      <div class="catalog-actions">
        <a class="button secondary button-compact" href="${productUrl}">View Details</a>
        <button class="button primary button-compact" type="button" data-add-to-cart="${item.id}">
          Add To Cart
        </button>
      </div>
    </div>
  `;

  return card;
}

function pickRandomItems(items, count) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy.slice(0, Math.min(count, copy.length));
}

function renderHeroSpotlight(items) {
  if (!heroSpotlightImage || !items.length) {
    return;
  }

  const [item] = pickRandomItems(items, 1);
  heroSpotlightImage.src = item.imagePath;
  heroSpotlightImage.alt = item.title;
  heroSpotlightTitle.textContent = item.title;
  heroSpotlightDescription.textContent =
    item.description || "Premium mens shalwar kameez with signature finishing.";
  heroSpotlightPrice.textContent = item.priceText || item.price || "";
  heroSpotlightLink.href = item.productUrl || `product.html?id=${item.id}`;
}

function renderHomeShuffleGrid(items) {
  if (!homeShuffleGrid || !items.length) {
    return;
  }

  const selectedItems = pickRandomItems(items, 6);
  homeShuffleGrid.innerHTML = "";

  selectedItems.forEach((item) => {
    const card = document.createElement("article");
    card.className = "shuffle-card";
    card.innerHTML = `
      <a href="${item.productUrl || `product.html?id=${item.id}`}">
        <img src="${item.imagePath}" alt="${item.title}" loading="lazy" />
        <div class="shuffle-card-copy">
          <strong>${item.title}</strong>
          <span>${item.priceText || item.price || ""}</span>
        </div>
      </a>
    `;
    homeShuffleGrid.appendChild(card);
  });
}

async function loadHomeShowcase() {
  if (!heroSpotlightImage && !homeShuffleGrid) {
    return;
  }

  try {
    const data = await requestJSON("/api/gallery");
    const items = (data.items || []).filter((item) => item.isVisible !== false);
    lastGalleryItems = items;
    renderHeroSpotlight(items);
    renderHomeShuffleGrid(items);
  } catch (_error) {
    // The homepage can still render even if showcase media fails to load.
  }
}

function renderCuratedGallery(items) {
  if (!curatedGalleryList) {
    return;
  }

  const seedItems = (items || []).filter((item) => item.sourceType === "seeded");
  curatedGalleryList.innerHTML = "";
  curatedEmpty.hidden = seedItems.length !== 0;

  seedItems.forEach((item) => {
    curatedGalleryList.appendChild(createGalleryCard(item));
  });
}

async function loadGallery() {
  if (!curatedGalleryList && !galleryList) {
    return;
  }

  try {
    const data = await requestJSON("/api/gallery");
    const items = data.items || [];
    lastGalleryItems = items;

    if (curatedGalleryList) {
      renderCuratedGallery(items);
    }

    if (galleryList && galleryEmpty) {
      const uploadItems = items.filter((item) => item.sourceType !== "seeded");
      galleryList.innerHTML = "";
      galleryEmpty.hidden = uploadItems.length !== 0;

      uploadItems.forEach((item) => {
        galleryList.appendChild(createGalleryCard(item, { live: true }));
      });
    }
  } catch (_error) {
    if (galleryEmpty) {
      galleryEmpty.hidden = false;
      setFeedback(galleryEmpty.querySelector("p"), translate("gallery.empty.text"), false);
    }
  }
}

function queueGalleryReload(delay = 300) {
  window.clearTimeout(galleryRefreshTimer);
  galleryRefreshTimer = window.setTimeout(() => {
    loadGallery();
  }, delay);
}

function startLiveGalleryUpdates() {
  if (!curatedGalleryList && !galleryList) {
    return;
  }

  if ("EventSource" in window) {
    galleryStream = new EventSource("/api/gallery/stream");
    galleryStream.addEventListener("gallery-update", () => {
      queueGalleryReload(150);
    });
    galleryStream.onerror = () => {
      galleryStream?.close();
      galleryStream = null;
      window.setTimeout(startLiveGalleryUpdates, 4000);
    };
    return;
  }

  window.setInterval(() => {
    loadGallery();
  }, 15000);
}

async function fetchGalleryItem(id) {
  const data = await requestJSON(`/api/gallery/${id}`);
  return data.item;
}

async function loadProductPage() {
  if (!productTitle) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const productId = Number(params.get("id"));

  if (!productId) {
    productStatus.textContent = "Product not found";
    return;
  }

  try {
    const item = await fetchGalleryItem(productId);
    activeProduct = item;
    productStatus.textContent = item.sourceType === "seeded" ? "Featured product" : "Latest design";
    productTitle.textContent = item.title;
    productPrice.textContent = item.priceText || formatCurrency(0);
    productDescription.textContent = item.description || "No description added yet.";
    productDetails.textContent = item.details || item.description || "No additional details available.";
    productImage.src = item.imagePath;
    productImage.alt = item.title;
    buyNowButton.href = `cart.html?add=${item.id}`;
    document.title = `${item.title} | Mian Tailer`;
  } catch (error) {
    productStatus.textContent = "Unable to load product";
    setFeedback(productFeedback, error.message, true);
  }
}

function renderCartItems(products) {
  if (!cartItemsContainer || !cartEmpty || !cartSubtotal || !cartDelivery || !cartTotal) {
    return;
  }

  const cart = getCart();
  cartItemsContainer.innerHTML = "";
  cartEmpty.hidden = cart.length !== 0;

  let subtotal = 0;

  cart.forEach((cartItem) => {
    const product = products.find((item) => item.id === cartItem.productId);

    if (!product) {
      return;
    }

    const unitPrice = parsePriceText(product.priceText);
    const lineTotal = unitPrice * cartItem.quantity;
    subtotal += lineTotal;

    const row = document.createElement("article");
    row.className = "cart-row";
    row.innerHTML = `
      <img class="cart-thumb" src="${product.imagePath}" alt="${product.title}" />
      <div class="cart-row-copy">
        <h3>${product.title}</h3>
        <p>${product.description || "Premium custom tailoring design."}</p>
        <a href="product.html?id=${product.id}">Review details</a>
      </div>
      <div class="cart-row-controls">
        <label>
          <span>Qty</span>
          <input type="number" min="1" value="${cartItem.quantity}" data-cart-qty="${product.id}" />
        </label>
        <strong>${formatCurrency(lineTotal)}</strong>
        <button class="button secondary button-compact" type="button" data-remove-cart="${product.id}">
          Remove
        </button>
      </div>
    `;
    cartItemsContainer.appendChild(row);
  });

  const deliveryFee =
    subtotal >= Number(storefrontData?.freeDeliveryThreshold || 0)
      ? 0
      : Number(storefrontData?.deliveryFee || 0);
  cartSubtotal.textContent = formatCurrency(subtotal);
  cartDelivery.textContent = formatCurrency(deliveryFee);
  cartTotal.textContent = formatCurrency(subtotal + deliveryFee);
}

async function loadCartPage() {
  if (!cartItemsContainer) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const addProductId = Number(params.get("add"));

  if (addProductId) {
    addToCart(addProductId, 1);
    params.delete("add");
    const nextQuery = params.toString();
    window.history.replaceState({}, "", nextQuery ? `cart.html?${nextQuery}` : "cart.html");
  }

  const data = await requestJSON("/api/gallery");
  lastGalleryItems = data.items || [];
  renderCartItems(lastGalleryItems);
}

function updateCartItem(productId, quantity) {
  const cart = getCart()
    .map((item) =>
      item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item
    )
    .filter((item) => item.quantity > 0);
  saveCart(cart);
  renderCartItems(lastGalleryItems);
}

function removeCartItem(productId) {
  const cart = getCart().filter((item) => item.productId !== productId);
  saveCart(cart);
  renderCartItems(lastGalleryItems);
}

function syncMobileMenuState() {
  if (!siteNav || !navActions || !menuToggleButton) {
    return;
  }

  const isMobile = window.innerWidth <= MOBILE_MENU_BREAKPOINT;
  const isOpen = siteNav.classList.contains("is-menu-open");

  if (!isMobile) {
    siteNav.classList.remove("is-menu-open");
    document.body.classList.remove("menu-open");
    navActions.hidden = false;
    menuToggleButton.hidden = true;
    menuToggleButton.setAttribute("aria-label", "Open menu");
    menuToggleButton.setAttribute("aria-expanded", "false");
    return;
  }

  menuToggleButton.hidden = false;
  navActions.hidden = !isOpen;
  document.body.classList.toggle("menu-open", isOpen);
  menuToggleButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  menuToggleButton.setAttribute("aria-expanded", String(isOpen));
}

function closeMobileMenu() {
  if (!siteNav?.classList.contains("is-menu-open")) {
    return;
  }

  siteNav.classList.remove("is-menu-open");
  syncMobileMenuState();
}

function setupMobileMenu() {
  if (!siteNav || !navActions || siteNav.querySelector("[data-menu-toggle]")) {
    return;
  }

  navActions.id = navActions.id || "site-nav-actions";

  menuToggleButton = document.createElement("button");
  menuToggleButton.type = "button";
  menuToggleButton.className = "menu-toggle";
  menuToggleButton.hidden = true;
  menuToggleButton.setAttribute("data-menu-toggle", "");
  menuToggleButton.setAttribute("aria-label", "Open menu");
  menuToggleButton.setAttribute("aria-expanded", "false");
  menuToggleButton.setAttribute("aria-controls", navActions.id);
  menuToggleButton.innerHTML = `
    <span class="menu-toggle-line"></span>
    <span class="menu-toggle-line"></span>
    <span class="menu-toggle-line"></span>
  `;

  siteNav.insertBefore(menuToggleButton, navActions);

  menuToggleButton.addEventListener("click", () => {
    siteNav.classList.toggle("is-menu-open");
    syncMobileMenuState();
  });

  siteNav.addEventListener("click", (event) => {
    if (!event.target.closest(".nav-links a, .lang-button")) {
      return;
    }

    if (window.innerWidth <= MOBILE_MENU_BREAKPOINT) {
      closeMobileMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (window.innerWidth > MOBILE_MENU_BREAKPOINT || !siteNav.classList.contains("is-menu-open")) {
      return;
    }

    if (!siteNav.contains(event.target)) {
      closeMobileMenu();
    }
  });

  window.addEventListener("resize", syncMobileMenuState);
  syncMobileMenuState();
}

async function placeOrder(event) {
  event.preventDefault();
  const cart = getCart();

  if (cart.length === 0) {
    setFeedback(orderFeedback, "Add at least one product before checkout.", true);
    return;
  }

  const form = event.currentTarget;
  const submitButton = form.querySelector("button[type='submit']");
  const formData = new FormData(form);

  submitButton.disabled = true;
  submitButton.textContent = "Placing Order...";

  try {
    const result = await requestJSON("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: formData.get("customerName"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        city: formData.get("city"),
        address: formData.get("address"),
        notes: formData.get("notes"),
        paymentMethod: formData.get("paymentMethod"),
        items: cart,
      }),
    });

    saveCart([]);
    form.reset();
    renderCartItems(lastGalleryItems);
    setFeedback(orderFeedback, `${result.message} Order #${result.order.id} confirmed.`);
  } catch (error) {
    setFeedback(orderFeedback, error.message, true);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Place Order";
  }
}

languageButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    applyLanguage(button.dataset.langSwitch);
    await loadGallery();
  });
});

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-to-cart]");

  if (addButton) {
    addToCart(Number(addButton.dataset.addToCart), 1);
    return;
  }

  const removeButton = event.target.closest("[data-remove-cart]");

  if (removeButton) {
    removeCartItem(Number(removeButton.dataset.removeCart));
    return;
  }
});

document.addEventListener("change", (event) => {
  const quantityInput = event.target.closest("[data-cart-qty]");

  if (quantityInput) {
    updateCartItem(Number(quantityInput.dataset.cartQty), Number(quantityInput.value) || 1);
  }
});

spotlightShuffleButton?.addEventListener("click", () => {
  renderHeroSpotlight(lastGalleryItems);
});

shuffleGalleryButton?.addEventListener("click", () => {
  renderHomeShuffleGrid(lastGalleryItems);
});

addToCartButton?.addEventListener("click", () => {
  if (!activeProduct) {
    return;
  }

  addToCart(activeProduct.id, Math.max(1, Number(productQuantity.value) || 1));
  setFeedback(productFeedback, "Added to cart.");
});

orderForm?.addEventListener("submit", placeOrder);

document.querySelectorAll("[data-contact-form]").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const contactForm = event.currentTarget;
    const button = contactForm.querySelector("button");

    if (button) {
      button.textContent = translate("home.contact.form.sending");
      button.disabled = true;
    }

    try {
      const formData = new FormData(contactForm);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          occasion: formData.get("occasion"),
          message: formData.get("message"),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || translate("home.contact.form.error"));
      }

      contactForm.reset();
      setFeedback(contactFeedback, translate("home.contact.form.success"));
    } catch (error) {
      setFeedback(contactFeedback, error.message || translate("home.contact.form.error"), true);
    } finally {
      if (button) {
        button.textContent = translate("home.contact.form.submit");
        button.disabled = false;
      }
    }
  });
});

setupMobileMenu();
applyLanguage(localStorage.getItem("mian-tailer-language") || "en");
updateCartCount();
loadStorefrontData();
loadHomeShowcase();
loadGallery();
loadProductPage();
loadCartPage();
startLiveGalleryUpdates();

if (currentPage === "home") {
  window.setInterval(() => {
    renderHeroSpotlight(lastGalleryItems);
    renderHomeShuffleGrid(lastGalleryItems);
  }, 7000);
}

import {
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  type Transition,
} from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Filter,
  Grid2x2,
  Heart,
  Home,
  ImagePlus,
  LayoutGrid,
  Lock,
  Mail,
  Menu,
  MessageCircle,
  Minus,
  Package,
  Phone,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Truck,
  Upload,
  UserRound,
  X,
  QrCode,
  RefreshCw,
} from "lucide-react";
import { cn } from "./utils/cn";

// --- Types ---

type Page =
  | "home"
  | "listing"
  | "product"
  | "cart"
  | "checkout"
  | "account"
  | "wholesale"
  | "about"
  | "contact"
  | "admin"
  | "returns"
  | "return-policy";

type Scope =
  | "All"
  | "Women"
  | "Kids"
  | "Collections"
  | "Wholesale"
  | "Offers"
  | "New Arrivals"
  | "Best Sellers"
  | "Festival Collection"
  | "Wedding Collection"
  | "Cotton Collection"
  | "Trending Collection";

type Product = {
  id: string;
  title: string;
  department: "Women" | "Kids Boys" | "Kids Girls" | "Baby";
  category: string;
  subcategory: string;
  description: string;
  price: number;
  comparePrice: number;
  gallery: string[];
  colors: { name: string; swatch: string }[];
  sizes: string[];
  tags: string[];
  badges: string[];
  createdAt: number;
  rating: number;
  reviews: number;
  stock: number;
  visibility: {
    homepage: boolean;
    newArrivals: boolean;
    featured: boolean;
    bestSellers: boolean;
    active: boolean;
  };
};

type Banner = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  scope: Scope;
  placement: "hero" | "featured" | "offer" | "festival" | "cotton" | "trending" | "wholesale" | "category";
  categoryMapping?: string;
  order: number;
};

type Order = {
  id: string;
  date: string;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  items: {
    title: string;
    quantity: number;
    price: number;
    size: string;
    color: string;
  }[];
  total: number;
  paymentMethod: "COD" | "UPI" | "Razorpay" | "Card";
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
};

type ReturnRequest = {
  id: string;
  orderId: string;
  productTitle: string;
  reason: string;
  notes: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected" | "Processed";
};

type StoreContent = {
  products: Product[];
  banners: Banner[];
};

type CartItem = {
  productId: string;
  quantity: number;
  size: string;
  color: string;
};

type Filters = {
  scope: Scope;
  category: string;
  size: string;
  color: string;
  price: number;
  sort: "Newest" | "Best Selling" | "Price Low To High" | "Price High To Low";
  newArrivals: boolean;
  bestSellers: boolean;
  offers: boolean;
};

// --- Constants & Config ---

const BRAND = "JEEV RUTHI COLLECTION";
const STORE_TIMING = "Open Daily • 10:00 AM – 10:00 PM";
const STORE_MAP_LINK = "https://maps.app.goo.gl/QwoTg7hgNXX9gPp96";
const STORE_MAP_EMBED =
  "https://www.google.com/maps?q=No.81%2C%20Vigneshwara%20Nagar%2C%20Kundrathur%20Main%20Road%2C%20Porur%2C%20Chennai%20600116&output=embed";
const STORE_ADDRESS = ["No.81, Vigneshwara Nagar,", "Kundrathur Main Road,", "Porur, Chennai – 600116,", "Tamil Nadu, India"];
const CMS_KEY = "jr-collection-cms-v1";
const ORDERS_KEY = "jr_orders_v1";
const RETURNS_KEY = "jr_returns_v1";
const AUTH_KEY = "jr_auth_v1";
const ADMIN_SESSION_KEY = "jr_admin_session";
const BUSINESS_PHONE = "919363697498";
const UPI_ID = "sujithjai007-2@oksbi";

const transition: Transition = { duration: 0.65, ease: [0.22, 1, 0.36, 1] };

const announcements = ["🚚 Free Shipping Above ₹999", "🎉 Festival Sale Live", "📞 Wholesale Orders Available", "🎁 New Arrivals Added Daily", "💳 UPI + COD Available"];

const socialLinks = {
  facebook: "https://facebook.com/placeholder",
  instagram: "https://www.instagram.com/yuva.priya.92351",
  whatsapp: `https://wa.me/${BUSINESS_PHONE}`,
  email: "mailto:Yuvavishnu2426@gmail.com",
  phone: `tel:+${BUSINESS_PHONE}`,
};

// --- Demo Data Generation ---

const sizeOptions = ["XS", "S", "M", "L", "XL"];
const colorSets = [
  [{ name: "Terracotta", swatch: "#8B5E3C" }, { name: "Ivory", swatch: "#F2E8DF" }, { name: "Mocha", swatch: "#6B3E26" }],
  [{ name: "Walnut", swatch: "#5E3B2B" }, { name: "Cream", swatch: "#F7F1EB" }, { name: "Cinnamon", swatch: "#A66A45" }],
  [{ name: "Rosewood", swatch: "#744735" }, { name: "Sand", swatch: "#D7B391" }, { name: "Chestnut", swatch: "#7A4C2A" }],
];

const womenImages = [
  "https://images.pexels.com/photos/28851461/pexels-photo-28851461.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  "https://images.pexels.com/photos/14284158/pexels-photo-14284158.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  "https://images.pexels.com/photos/6739340/pexels-photo-6739340.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  "https://images.pexels.com/photos/35521738/pexels-photo-35521738.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  "https://images.pexels.com/photos/37523792/pexels-photo-37523792.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  "https://images.pexels.com/photos/37523799/pexels-photo-37523799.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  "https://images.pexels.com/photos/8432522/pexels-photo-8432522.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  "https://images.pexels.com/photos/32982934/pexels-photo-32982934.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  "https://images.pexels.com/photos/35395108/pexels-photo-35395108.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  "https://images.pexels.com/photos/2723623/pexels-photo-2723623.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  "https://images.pexels.com/photos/30249378/pexels-photo-30249378.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  "https://images.pexels.com/photos/36951578/pexels-photo-36951578.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  "https://images.pexels.com/photos/32544086/pexels-photo-32544086.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  "https://images.pexels.com/photos/31580413/pexels-photo-31580413.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  "https://images.pexels.com/photos/31580442/pexels-photo-31580442.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
];

const boysImages = [
  "https://images.pexels.com/photos/19664810/pexels-photo-19664810.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  "https://images.pexels.com/photos/18544988/pexels-photo-18544988.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  "https://images.pexels.com/photos/18487396/pexels-photo-18487396.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  "https://images.pexels.com/photos/35819848/pexels-photo-35819848.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  "https://images.pexels.com/photos/7100297/pexels-photo-7100297.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
];

const girlsImages = [
  "https://images.pexels.com/photos/12100636/pexels-photo-12100636.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  "https://images.pexels.com/photos/15730103/pexels-photo-15730103.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  "https://images.pexels.com/photos/9323160/pexels-photo-9323160.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  "https://images.pexels.com/photos/18606561/pexels-photo-18606561.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  "https://images.pexels.com/photos/8084059/pexels-photo-8084059.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  "https://images.pexels.com/photos/7100328/pexels-photo-7100328.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
];

const babyImages = [
  "https://images.pexels.com/photos/37904241/pexels-photo-37904241.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  "https://images.pexels.com/photos/29015875/pexels-photo-29015875.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  "https://images.pexels.com/photos/32410090/pexels-photo-32410090.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  "https://images.pexels.com/photos/7282448/pexels-photo-7282448.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  "https://images.pexels.com/photos/33344775/pexels-photo-33344775.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  "https://images.pexels.com/photos/36276503/pexels-photo-36276503.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
];

const bannerImages = [
  "https://images.pexels.com/photos/14037486/pexels-photo-14037486.png?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  "https://images.pexels.com/photos/8750027/pexels-photo-8750027.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  "https://images.pexels.com/photos/31739926/pexels-photo-31739926.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  "https://images.pexels.com/photos/35228874/pexels-photo-35228874.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  "https://images.pexels.com/photos/7100328/pexels-photo-7100328.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  "https://images.pexels.com/photos/35045845/pexels-photo-35045845.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  "https://images.pexels.com/photos/30214754/pexels-photo-30214754.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  "https://images.pexels.com/photos/35395108/pexels-photo-35395108.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
];

const categoryBannerImages: Record<string, string> = {
  "Women": bannerImages[2],
  "Kurtis": bannerImages[3],
  "Sarees": bannerImages[6],
  "Dresses": bannerImages[7],
  "Tops": bannerImages[0],
  "Salwar Sets": bannerImages[1],
  "Kids": bannerImages[4],
  "Kids Boys": bannerImages[4],
  "Kids Girls": bannerImages[4],
  "Baby": bannerImages[4],
  "Party Wear": bannerImages[4],
  "Ethnic Wear": bannerImages[1],
};

const promoCards = [
  { title: "Kids Party Edit", subtitle: "Premium festive picks", image: girlsImages[0] },
  { title: "Wedding Sarees", subtitle: "Rich drapes & luxe tones", image: womenImages[8] },
];

const womenCategories: Record<string, string[]> = {
  Kurtis: ["Ajrakh Grace Kurti", "Terracotta Bloom Kurti", "Loom Story Kurti", "Courtyard Charm Kurti", "Sunlit Edit Kurti"],
  Sarees: ["Wedding Weave Saree", "Amber Drape Saree", "Temple Silk Saree", "Royal Vermilion Saree", "Velvet Glow Saree"],
  Dresses: ["Cedar Flow Dress", "Evening Muse Dress", "Artisan Hour Dress", "Soft Story Dress", "Modern Heritage Dress"],
  Tops: ["Studio Luxe Top", "Artisan Panel Top", "Weekend Edit Top", "Soft Loom Top", "Signature Day Top"],
  "Salwar Sets": ["Heirloom Salwar Set", "Noor Salwar Set", "Aangan Salwar Set", "Rust Glow Salwar Set", "Festival Salwar Set"],
};

const boysCategories: Record<string, string[]> = {
  Shirts: ["Little Monarch Shirt", "Porur Classic Shirt", "Check Story Shirt", "Weekend Fest Shirt", "Jr Signature Shirt"],
  "T-Shirts": ["Playfield Luxe Tee", "Metro Junior Tee", "Soft Cotton Tee", "Urban Club Tee", "Weekend Hero Tee"],
  "Party Wear": ["Prince Party Edit", "Tiny Celebration Set", "Star Kid Party Look", "Evening Suit Set", "Premium Party Layer"],
  "Ethnic Wear": ["Temple Prince Kurta", "Wedding Day Kurta", "Royal Junior Set", "Festive Heritage Kurta", "South Silk Junior"],
};

const girlsCategories: Record<string, string[]> = {
  Frocks: ["Birthday Bloom Frock", "Twinkle Muse Frock", "Little Aura Frock", "Caramel Charm Frock", "Confetti Smile Frock"],
  Dresses: ["Garden Story Dress", "Playful Grace Dress", "Candy Luxe Dress", "Junior Ribbon Dress", "Celebration Dress"],
  Gowns: ["Mini Regal Gown", "Princess Glow Gown", "Pearl Party Gown", "Wedding Bells Gown", "Sparkle Evening Gown"],
  "Party Wear": ["Confetti Party Edit", "Golden Ribbon Dress", "Junior Luxe Party Set", "Premium Kids Partywear", "Star Party Layer"],
};

const babyCategories: Record<string, string[]> = {
  Rompers: ["Cloud Soft Romper", "Tiny Bloom Romper", "Warm Nest Romper", "Baby Comfort Romper", "Little Story Romper"],
  "Gift Sets": ["Welcome Home Gift Set", "Newborn Keepsake Set", "Gentle Days Gift Set", "Soft Touch Gift Set", "Premium Infant Gift Set"],
};

function buildSeedProducts(): Product[] {
  let createdAt = 500;
  const items: Product[] = [];

  const pushGroup = (
    department: Product["department"],
    categoryMap: Record<string, string[]>,
    pool: string[],
    basePrice: number,
    subcategory: string,
  ) => {
    Object.entries(categoryMap).forEach(([category, titles], groupIndex) => {
      titles.forEach((title, index) => {
        const gallery = [
          pool[index % pool.length],
          pool[(index + 1) % pool.length],
          pool[(index + 2) % pool.length],
        ];
        const tags: string[] = [];
        if (index <= 1) tags.push("New Arrivals");
        if (index === 0 || index === 4) tags.push("Best Sellers");
        if (index === 1 || index === 3) tags.push("Offers");
        if (["Kurtis", "Salwar Sets", "Party Wear", "Ethnic Wear", "Frocks", "Gowns"].includes(category) && index < 3) {
          tags.push("Festival Collection");
        }
        if (["Sarees", "Salwar Sets", "Party Wear", "Gowns"].includes(category) && index < 2) {
          tags.push("Wedding Collection");
        }
        if (["Kurtis", "Dresses", "Tops", "Salwar Sets", "T-Shirts", "Rompers"].includes(category) && index < 3) {
          tags.push("Cotton Collection");
        }
        if (index === 2 || index === 3) tags.push("Trending Collection");

        const badges: string[] = [];
        if (index === 0 || index === 4) badges.push("Best Seller");
        if (index === 1 || index === 2) badges.push("New Arrival");
        if (index === 3) badges.push("Trending");

        items.push({
          id: `${department}-${category}-${index}`.toLowerCase().replace(/\s+/g, "-"),
          title,
          department,
          category,
          subcategory,
          description: `${BRAND} presents a premium fashion pick designed for elevated family wardrobes, refined styling, and high-conversion ecommerce presentation.`,
          price: basePrice + index * 180 + groupIndex * 70,
          comparePrice: basePrice + index * 180 + groupIndex * 70 + 650,
          gallery,
          colors: colorSets[(index + groupIndex) % colorSets.length],
          sizes: sizeOptions,
          tags: Array.from(new Set(tags)),
          badges,
          createdAt: createdAt--,
          rating: 4.6 + (index % 3) * 0.1,
          reviews: 58 + index * 21 + groupIndex * 8,
          stock: 8 + ((groupIndex + index) % 10),
          visibility: {
            homepage: true,
            newArrivals: tags.includes("New Arrivals"),
            featured: index < 2,
            bestSellers: tags.includes("Best Sellers"),
            active: true,
          },
        });
      });
    });
  };

  pushGroup("Women", womenCategories, womenImages, 1799, "Women Wear");
  pushGroup("Kids Boys", boysCategories, boysImages, 1199, "Kids Boys");
  pushGroup("Kids Girls", girlsCategories, girlsImages, 1299, "Kids Girls");
  pushGroup("Baby", babyCategories, babyImages, 999, "Baby");

  return items;
}

const seedContent: StoreContent = {
  products: buildSeedProducts(),
  banners: [
    { id: "hero-summer", title: "Summer Collection", subtitle: "Light textures, breathable silhouettes, and premium ethnic styling.", cta: "Shop Summer", image: bannerImages[3], scope: "Cotton Collection", placement: "hero", order: 1 },
    { id: "hero-festival", title: "Festival Collection", subtitle: "Rich hues, festive drapes, elegant sets, and premium fashion storytelling.", cta: "Explore Festival", image: bannerImages[0], scope: "Festival Collection", placement: "hero", order: 2 },
    { id: "hero-wedding", title: "Wedding Collection", subtitle: "Statement sarees, luxe ethnic edits, and occasion-ready looks.", cta: "View Wedding Edit", image: bannerImages[6], scope: "Wedding Collection", placement: "hero", order: 3 },
    { id: "hero-new", title: "New Arrivals", subtitle: "Fresh premium campaign drops curated for fashion-first discovery.", cta: "Shop New In", image: bannerImages[1], scope: "New Arrivals", placement: "hero", order: 4 },
    { id: "featured-women", title: "Premium Women's Edit", subtitle: "Kurtis, sarees, dresses, tops, and salwar sets with campaign energy.", cta: "Explore Women", image: bannerImages[2], scope: "Women", placement: "featured", order: 1 },
    { id: "featured-kids", title: "Kids Celebration Studio", subtitle: "Party wear, occasion dressing, and premium gifting moments.", cta: "Explore Kids", image: bannerImages[4], scope: "Kids", placement: "featured", order: 2 },
    { id: "featured-wholesale", title: "Wholesale Access", subtitle: "Dealer onboarding, bulk orders, and catalog-led sourcing.", cta: "Explore Wholesale", image: bannerImages[5], scope: "Wholesale", placement: "featured", order: 3 },
    { id: "offer-summer", title: "Summer Collection", subtitle: "Cooling cotton edits with elevated premium detail.", cta: "Shop Summer", image: bannerImages[3], scope: "Cotton Collection", placement: "offer", order: 1 },
    { id: "offer-kids", title: "Kids Party Wear", subtitle: "Compact luxury dressing for birthdays and festive days.", cta: "Shop Kids Party", image: bannerImages[4], scope: "Kids", placement: "offer", order: 2 },
    { id: "offer-trending", title: "Trending Collection", subtitle: "Fast-moving picks with premium fashion appeal.", cta: "Shop Trending", image: bannerImages[7], scope: "Trending Collection", placement: "offer", order: 3 },
    { id: "festival-main", title: "Festival Collection", subtitle: "Elegant festive campaigns designed to feel modern and aspirational.", cta: "Explore Festival", image: bannerImages[0], scope: "Festival Collection", placement: "festival", order: 1 },
    { id: "cotton-main", title: "Cotton Collection", subtitle: "Clean, premium cotton silhouettes with soft earthy tones.", cta: "Shop Cotton", image: bannerImages[3], scope: "Cotton Collection", placement: "cotton", order: 1 },
    { id: "trending-main", title: "Trending Collection", subtitle: "The newest premium discoveries rising fast across the storefront.", cta: "View Trending", image: bannerImages[7], scope: "Trending Collection", placement: "trending", order: 1 },
    { id: "wholesale-main", title: "Wholesale Banner", subtitle: "Premium sourcing for dealers, resellers, and bulk family-fashion retailers.", cta: "Register Now", image: bannerImages[5], scope: "Wholesale", placement: "wholesale", order: 1 },
  ],
};

// --- Utilities ---

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function getDiscount(product: Product) {
  return Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100);
}

function getStoredContent(): StoreContent {
  try {
    const raw = localStorage.getItem(CMS_KEY);
    return raw ? (JSON.parse(raw) as StoreContent) : seedContent;
  } catch {
    return seedContent;
  }
}

function getOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveOrders(orders: Order[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function getReturns(): ReturnRequest[] {
  try {
    const raw = localStorage.getItem(RETURNS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function updateMeta(page: Page, product?: Product | null) {
  const titleMap: Record<Page, string> = {
    home: `${BRAND} | Premium Fashion Ecommerce`,
    listing: `${BRAND} | Collections & Categories`,
    product: `${product?.title ?? BRAND} | ${BRAND}`,
    cart: `${BRAND} | Shopping Bag`,
    checkout: `${BRAND} | Secure Checkout`,
    account: `${BRAND} | Account`,
    wholesale: `${BRAND} | Wholesale`,
    about: `${BRAND} | About`,
    contact: `${BRAND} | Contact`,
    admin: `Admin | ${BRAND}`,
    returns: `${BRAND} | Return Request`,
    "return-policy": `${BRAND} | Return Policy`,
  };
  document.title = titleMap[page];
  const meta = document.querySelector('meta[name="description"]');
  if (meta) {
    meta.setAttribute(
      "content",
      `${BRAND} is a Chennai-based premium women, kids, family fashion, wholesale and retail ecommerce brand with modern luxury shopping experience.`,
    );
  }
}

function saveReturns(returns: ReturnRequest[]) {
  localStorage.setItem(RETURNS_KEY, JSON.stringify(returns));
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

// --- Icons ---

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 21v-8.1h2.7l.4-3.2h-3.1V7.65c0-.93.26-1.56 1.6-1.56h1.7V3.22c-.29-.04-1.29-.12-2.45-.12-2.42 0-4.08 1.48-4.08 4.21V9.7H8v3.2h2.92V21h2.58Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.5 11.8c0 4.75-3.86 8.6-8.62 8.6a8.57 8.57 0 0 1-4.17-1.08L3 20.8l1.53-4.53A8.57 8.57 0 0 1 3.27 11.8c0-4.75 3.86-8.6 8.61-8.6 4.76 0 8.62 3.85 8.62 8.6Zm-8.62-7.2a7.2 7.2 0 0 0-6.15 10.96l.2.34-.9 2.67 2.75-.88.32.18a7.2 7.2 0 1 0 3.78-13.27Zm4.12 9.25c-.23-.11-1.35-.67-1.56-.75-.21-.08-.36-.11-.52.11-.15.22-.6.74-.73.9-.13.15-.27.17-.5.06-.23-.12-.96-.35-1.83-1.12-.67-.6-1.13-1.34-1.26-1.57-.13-.22-.02-.35.1-.46.11-.1.23-.27.35-.4.12-.14.16-.23.23-.39.08-.15.04-.28-.02-.39-.06-.11-.52-1.24-.72-1.7-.19-.46-.38-.39-.52-.39h-.45c-.15 0-.39.06-.6.28-.21.22-.8.78-.8 1.89s.82 2.18.93 2.33c.12.15 1.62 2.46 3.93 3.45.55.24.98.38 1.31.48.55.18 1.05.15 1.45.09.44-.07 1.35-.55 1.54-1.08.19-.53.19-.98.13-1.08-.05-.09-.2-.15-.42-.26Z" />
    </svg>
  );
}

// --- Shared UI Components ---

function MediaImage({ src, alt, className, eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  return <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" className={className} />;
}

function LogoBlock({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center">
      <img src="/jr-logo.svg" alt={`${BRAND} logo`} className={compact ? "h-20 w-auto sm:h-24" : "h-24 w-auto sm:h-32"} />
    </div>
  );
}

function SectionHeading({ eyebrow, title, description, center = false }: { eyebrow: string; title: string; description: string; center?: boolean }) {
  return (
    <div className={cn("space-y-4", center && "mx-auto max-w-3xl text-center")}>
      <div className="inline-flex items-center gap-2 rounded-full border border-[#C89B6D]/30 bg-[#F7F1EB] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#8B5E3C]">
        <Sparkles className="h-3.5 w-3.5" />
        {eyebrow}
      </div>
      <h2 className="font-display text-4xl leading-none text-[#1A1A1A] sm:text-5xl">{title}</h2>
      <p className="max-w-2xl text-sm leading-7 text-[#5f4b3d] sm:text-base">{description}</p>
    </div>
  );
}

function PremiumButton({ children, onClick, variant = "primary", className, disabled = false }: { children: ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "ghost"; className?: string; disabled?: boolean }) {
  return (
    <motion.button
      type="button"
      whileHover={!disabled ? { y: -2, scale: 1.01 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition",
        disabled && "opacity-50 cursor-not-allowed",
        variant === "primary" && "bg-gradient-to-r from-[#6B3E26] via-[#8B5E3C] to-[#C89B6D] text-white shadow-[0_18px_40px_rgba(107,62,38,0.24)]",
        variant === "secondary" && "border border-[#C89B6D]/30 bg-white text-[#6B3E26] shadow-[0_12px_30px_rgba(17,17,17,0.05)]",
        variant === "ghost" && "text-[#6B3E26] hover:bg-[#F7F1EB]",
        className,
      )}
    >
      {children}
    </motion.button>
  );
}

function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={{ ...transition, delay }} className={className}>
      {children}
    </motion.div>
  );
}

function HeaderIconButton({ label, icon, count, onClick }: { label: string; icon: ReactNode; count?: number; onClick: () => void }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#E7D9CD] bg-white/85 text-[#6B3E26] transition hover:-translate-y-0.5">
      {icon}
      {count ? <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#6B3E26] px-1 text-[10px] font-bold text-white">{count}</span> : null}
    </button>
  );
}

function Rating({ value, reviews }: { value: number; reviews: number }) {
  return (
    <div className="flex items-center gap-2 text-xs text-[#6D5A4B]">
      <div className="flex items-center gap-1 text-[#8B5E3C]">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className={cn("h-3.5 w-3.5", index < Math.round(value) && "fill-current")} />
        ))}
      </div>
      <span className="font-semibold text-[#1A1A1A]">{value.toFixed(1)}</span>
      <span>({reviews})</span>
    </div>
  );
}

function MiniInfoCard({ icon, title, copy }: { icon: ReactNode; title: string; copy: string }) {
  return (
    <div className="rounded-[26px] border border-[#EDE0D4] bg-[#FFF9F5] p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-[#FFF0E5] p-3 text-[#6B3E26]">{icon}</div>
        <div>
          <p className="font-semibold text-[#1A1A1A]">{title}</p>
          <p className="text-sm text-[#6D5A4B]">{copy}</p>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, strong = false, subtle = false }: { label: string; value: string; strong?: boolean; subtle?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={cn(strong && "font-semibold text-[#1A1A1A]", subtle && "text-[#8B5E3C]")}>{label}</span>
      <span className={cn(strong && "font-semibold text-[#1A1A1A]", subtle && "text-[#8B5E3C]")}>{value}</span>
    </div>
  );
}

// --- Header & Navigation ---

function MegaLink({ title, onClick }: { title: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="rounded-[22px] border border-[#F3E7DC] bg-[#FFFBF8] px-4 py-4 text-left text-sm font-medium text-[#5f4b3d] transition hover:border-[#C89B6D]/45 hover:text-[#6B3E26]">
      {title}
    </button>
  );
}

function MobileNavLink({ title, onClick }: { title: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center justify-between rounded-2xl border border-[#EDE0D4] bg-[#FFF9F5] px-4 py-3 text-left text-sm font-semibold text-[#5f4b3d]">
      <span>{title}</span>
      <ArrowRight className="h-4 w-4 text-[#6B3E26]" />
    </button>
  );
}

function MobileAccordion({ title, open, onToggle, links, onSelect }: { title: string; open: boolean; onToggle: () => void; links: string[]; onSelect: (link: string) => void }) {
  return (
    <div className="rounded-3xl border border-[#EDE0D4] bg-[#FFF9F5] p-2">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between px-3 py-3 text-left text-sm font-semibold text-[#5f4b3d]">
        {title}
        <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden px-2 pb-2">
            <div className="grid gap-2">
              {links.map((link) => (
                <button key={link} type="button" onClick={() => onSelect(link)} className="rounded-2xl border border-[#F3E7DC] bg-white px-3 py-3 text-left text-sm text-[#5f4b3d]">
                  {link}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HeaderPromoCluster() {
  return (
    <div className="hidden items-center gap-3 xl:flex">
      {promoCards.map((card, index) => (
        <motion.div
          key={card.title}
          animate={{ y: [0, index % 2 === 0 ? -8 : 8, 0] }}
          transition={{ duration: 5 + index, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ y: -6, rotate: 1.5 }}
          className="group flex h-24 w-52 items-center gap-4 overflow-hidden rounded-3xl border border-white/45 bg-white/70 p-2 shadow-[0_18px_38px_rgba(17,17,17,0.08)] backdrop-blur"
        >
          <MediaImage src={card.image} alt={card.title} className="h-20 w-20 rounded-2xl object-cover transition duration-500 group-hover:scale-110" />
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-[#1A1A1A]">{card.title}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#8B5E3C]">{card.subtitle}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function Header({ announcement, activePage, cartCount, wishlistCount, onNavigate, onOpenScope, onOpenSearch, isLoggedIn }: { announcement: string; activePage: Page; cartCount: number; wishlistCount: number; onNavigate: (page: Page) => void; onOpenScope: (scope: Scope, category?: string) => void; onOpenSearch: () => void; isLoggedIn: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<Scope | null>(null);
  const [open, setOpen] = useState<Scope | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const startOpen = (value: Scope) => { if (timeoutRef.current) window.clearTimeout(timeoutRef.current); setOpen(value); };
  const startClose = () => { timeoutRef.current = window.setTimeout(() => setOpen(null), 220); };
  const stopClose = () => { if (timeoutRef.current) window.clearTimeout(timeoutRef.current); };

  const womenLinks = ["Kurtis", "Sarees", "Dresses", "Tops", "Salwar Sets"];
  const kidsLinks = ["Shirts", "T-Shirts", "Party Wear", "Ethnic Wear", "Frocks", "Dresses", "Gowns", "Gift Sets"];
  const collectionLinks = ["New Arrivals", "Festival Collection", "Wedding Collection", "Cotton Collection", "Best Sellers"];

  return (
    <header className="sticky top-0 z-[100]">
      <div className="border-b border-[#E6D7C8] bg-[#FFF9F5] px-4 py-2">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-[#8B5E3C]">
          <AnimatePresence mode="wait">
            <motion.p key={announcement} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="font-medium">{announcement}</motion.p>
          </AnimatePresence>
          <div className="hidden items-center gap-3 sm:flex">
            <a href="#contact" className="text-[#6B3E26]">Support</a>
            <span className="h-1 w-1 rounded-full bg-[#C89B6D]" />
            <span>{STORE_TIMING}</span>
          </div>
        </div>
      </div>

      <div className="glass-panel border-b border-[#EFE2D7] px-4">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 py-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center justify-between gap-4">
            <button type="button" onClick={() => onNavigate("home")} className="text-left">
              <LogoBlock compact />
            </button>
            <button type="button" onClick={() => setMobileOpen((current) => !current)} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E7D9CD] text-[#6B3E26] xl:hidden" aria-label="Toggle mobile menu">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <div className="hidden flex-1 items-center justify-center gap-8 xl:flex">
            <nav className="flex items-center gap-6" onMouseLeave={startClose}>
              <button type="button" onClick={() => onNavigate("home")} className={cn("text-sm font-semibold transition hover:text-[#6B3E26]", activePage === "home" ? "text-[#6B3E26]" : "text-[#5f4b3d]")}>Home</button>
              <div className="relative" onMouseEnter={() => startOpen("Women")}>
                <button type="button" onClick={() => setOpen(open === "Women" ? null : "Women")} className="flex items-center gap-1 text-sm font-semibold text-[#5f4b3d] transition hover:text-[#6B3E26]">
                  Women <ChevronDown className="h-4 w-4" />
                </button>
                <AnimatePresence>
                  {open === "Women" && (
                    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.2 }} onMouseEnter={stopClose} onMouseLeave={startClose} className="absolute left-1/2 top-full z-40 mt-5 w-[420px] -translate-x-1/2 rounded-[30px] border border-[#EDE0D4] bg-white p-5 shadow-[0_28px_70px_rgba(17,17,17,0.12)]">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <MegaLink title="All Women" onClick={() => onOpenScope("Women")} />
                        {womenLinks.map((link) => <MegaLink key={link} title={link} onClick={() => onOpenScope("Women", link)} />)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="relative" onMouseEnter={() => startOpen("Kids")}>
                <button type="button" onClick={() => setOpen(open === "Kids" ? null : "Kids")} className="flex items-center gap-1 text-sm font-semibold text-[#5f4b3d] transition hover:text-[#6B3E26]">
                  Kids <ChevronDown className="h-4 w-4" />
                </button>
                <AnimatePresence>
                  {open === "Kids" && (
                    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.2 }} onMouseEnter={stopClose} onMouseLeave={startClose} className="absolute left-1/2 top-full z-40 mt-5 w-[520px] -translate-x-1/2 rounded-[30px] border border-[#EDE0D4] bg-white p-5 shadow-[0_28px_70px_rgba(17,17,17,0.12)]">
                      <div className="grid gap-3 sm:grid-cols-3">
                        <MegaLink title="All Kids" onClick={() => onOpenScope("Kids")} />
                        {kidsLinks.map((link) => <MegaLink key={link} title={link} onClick={() => onOpenScope("Kids", link)} />)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="relative" onMouseEnter={() => startOpen("Collections")}>
                <button type="button" onClick={() => setOpen(open === "Collections" ? null : "Collections")} className="flex items-center gap-1 text-sm font-semibold text-[#5f4b3d] transition hover:text-[#6B3E26]">
                  Collections <ChevronDown className="h-4 w-4" />
                </button>
                <AnimatePresence>
                  {open === "Collections" && (
                    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.2 }} onMouseEnter={stopClose} onMouseLeave={startClose} className="absolute left-1/2 top-full z-40 mt-5 w-[480px] -translate-x-1/2 rounded-[30px] border border-[#EDE0D4] bg-white p-5 shadow-[0_28px_70px_rgba(17,17,17,0.12)]">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {collectionLinks.map((link) => <MegaLink key={link} title={link} onClick={() => onOpenScope(link as Scope)} />)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button type="button" onClick={() => onNavigate("wholesale")} className="text-sm font-semibold text-[#5f4b3d] transition hover:text-[#6B3E26]">Wholesale</button>
              <button type="button" onClick={() => onOpenScope("Offers")} className="text-sm font-semibold text-[#5f4b3d] transition hover:text-[#6B3E26]">Offers</button>
            </nav>
            <HeaderPromoCluster />
          </div>

          <div className="hidden items-center gap-3 xl:flex">
            <HeaderIconButton label="Search" onClick={onOpenSearch} icon={<Search className="h-4 w-4" />} />
            <HeaderIconButton label="Wishlist" onClick={() => onNavigate("account")} icon={<Heart className="h-4 w-4" />} count={wishlistCount} />
            <HeaderIconButton label={isLoggedIn ? "Account" : "Login"} onClick={() => onNavigate("account")} icon={<UserRound className="h-4 w-4" />} />
            <HeaderIconButton label="Cart" onClick={() => onNavigate("cart")} icon={<ShoppingBag className="h-4 w-4" />} count={cartCount} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="border-b border-[#EFE2D7] bg-white/95 px-4 py-5 backdrop-blur xl:hidden">
            <div className="mx-auto max-w-[1500px] space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {promoCards.map((card) => (
                  <div key={card.title} className="flex items-center gap-3 rounded-3xl border border-[#EDE0D4] bg-[#FFF9F5] p-3">
                    <MediaImage src={card.image} alt={card.title} className="h-16 w-16 rounded-2xl object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-[#1A1A1A]">{card.title}</p>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-[#8B5E3C]">{card.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
              <MobileNavLink title="Home" onClick={() => { onNavigate("home"); setMobileOpen(false); }} />
              <MobileAccordion title="Women" open={mobileSubmenu === "Women"} onToggle={() => setMobileSubmenu((current) => (current === "Women" ? null : "Women"))} links={["All Women", ...womenLinks]} onSelect={(link) => { onOpenScope("Women", link === "All Women" ? "All" : link); setMobileOpen(false); }} />
              <MobileAccordion title="Kids" open={mobileSubmenu === "Kids"} onToggle={() => setMobileSubmenu((current) => (current === "Kids" ? null : "Kids"))} links={["All Kids", ...kidsLinks]} onSelect={(link) => { onOpenScope("Kids", link === "All Kids" ? "All" : link); setMobileOpen(false); }} />
              <MobileAccordion title="Collections" open={mobileSubmenu === "Collections"} onToggle={() => setMobileSubmenu((current) => (current === "Collections" ? null : "Collections"))} links={collectionLinks} onSelect={(link) => { onOpenScope(link as Scope); setMobileOpen(false); }} />
              <MobileNavLink title="Wholesale" onClick={() => { onNavigate("wholesale"); setMobileOpen(false); }} />
              <MobileNavLink title="Offers" onClick={() => { onOpenScope("Offers"); setMobileOpen(false); }} />
              <div className="grid grid-cols-4 gap-2 pt-2">
                <HeaderIconButton label="Search" onClick={() => { onOpenSearch(); setMobileOpen(false); }} icon={<Search className="h-4 w-4" />} />
                <HeaderIconButton label="Wishlist" onClick={() => { onNavigate("account"); setMobileOpen(false); }} icon={<Heart className="h-4 w-4" />} count={wishlistCount} />
                <HeaderIconButton label="Account" onClick={() => { onNavigate("account"); setMobileOpen(false); }} icon={<UserRound className="h-4 w-4" />} />
                <HeaderIconButton label="Cart" onClick={() => { onNavigate("cart"); setMobileOpen(false); }} icon={<ShoppingBag className="h-4 w-4" />} count={cartCount} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// --- Product Cards ---

function ProductCard({ product, wishlisted, onOpen, onWishlist, onAddToCart, onQuickView }: { product: Product; wishlisted: boolean; onOpen: () => void; onWishlist: () => void; onAddToCart: () => void; onQuickView: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  return (
    <motion.article initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={transition} onMouseEnter={() => setHovered(true)} onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }} onMouseMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); setTilt({ x: ((event.clientX - rect.left) / rect.width - 0.5) * 8, y: -((event.clientY - rect.top) / rect.height - 0.5) * 8 }); }} className="group" style={{ perspective: 1400 }}>
      <div className="luxury-card overflow-hidden rounded-[30px]" style={{ transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`, transition: "transform 170ms ease-out" }}>
        <div className="relative overflow-hidden p-3">
          <button type="button" onClick={onOpen} className="relative block w-full overflow-hidden rounded-[24px] bg-[#F5ECE4] text-left">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[24px]">
              <MediaImage src={product.gallery[0]} alt={product.title} className={cn("absolute inset-0 h-full w-full object-cover transition duration-700", hovered ? "scale-110 opacity-0" : "scale-100 opacity-100")} />
              <MediaImage src={product.gallery[1] ?? product.gallery[0]} alt={`${product.title} alternate`} className={cn("absolute inset-0 h-full w-full object-cover transition duration-700", hovered ? "scale-100 opacity-100" : "scale-110 opacity-0")} />
              <div className="absolute left-3 top-3 flex flex-col gap-2">
                <span className="rounded-full bg-[#6B3E26] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white">{getDiscount(product)}% Off</span>
                {product.badges.map((badge) => <span key={badge} className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6B3E26] backdrop-blur">{badge}</span>)}
              </div>
            </div>
          </button>
          <div className="absolute right-6 top-6 flex flex-col gap-2 opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100">
            <IconPillButton active={wishlisted} onClick={onWishlist} icon={<Heart className={cn("h-4 w-4", wishlisted && "fill-current")} />} />
            <IconPillButton onClick={onQuickView} icon={<Search className="h-4 w-4" />} />
          </div>
        </div>
        <div className="space-y-3 px-5 pb-6">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8B5E3C]">{product.category}</p>
            <p className="text-xs text-[#7B6657]">{product.department}</p>
          </div>
          <button type="button" onClick={onOpen} className="block w-full text-left">
            <h3 className="font-display text-[2rem] leading-none text-[#1A1A1A]">{product.title}</h3>
          </button>
          <p className="line-clamp-2 text-sm leading-6 text-[#5F4B3D]">{product.description}</p>
          <Rating value={product.rating} reviews={product.reviews} />
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-lg font-bold text-[#1A1A1A]">{formatCurrency(product.price)}</p>
              <p className="text-sm text-[#A49184] line-through">{formatCurrency(product.comparePrice)}</p>
            </div>
            <PremiumButton className="px-4 py-2 text-xs" onClick={onAddToCart}>Add To Cart</PremiumButton>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function IconPillButton({ icon, onClick, active = false }: { icon: ReactNode; onClick: () => void; active?: boolean }) {
  return (
    <button type="button" onClick={(event) => { event.stopPropagation(); onClick(); }} className={cn("flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur transition", active ? "border-[#C89B6D]/45 bg-[#FFF4EA] text-[#6B3E26]" : "border-white/65 bg-white/88 text-[#1A1A1A]")}>
      {icon}
    </button>
  );
}

// --- Hero Slider ---

function HeroSlider({ slides, onOpenScope }: { slides: Banner[]; onOpenScope: (scope: Scope) => void }) {
  const [index, setIndex] = useState(0);
  const { scrollY } = useScroll();
  const parallax = useTransform(scrollY, [0, 500], [0, 90]);

  useEffect(() => { const interval = window.setInterval(() => setIndex((current) => (current + 1) % slides.length), 4200); return () => window.clearInterval(interval); }, [slides.length]);
  const slide = slides[index];

  return (
    <section className="px-4 pt-8 sm:pt-10">
      <div className="mx-auto max-w-[1500px] overflow-hidden rounded-[42px] bg-[#2C190F] text-white shadow-[0_40px_120px_rgba(17,17,17,0.18)]">
        <div className="relative min-h-[540px] overflow-hidden sm:min-h-[640px]">
          <AnimatePresence mode="wait">
            <motion.div key={slide.id} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.7 }} className="absolute inset-0">
              <motion.div style={{ y: parallax }} className="absolute inset-0 h-[112%]">
                <MediaImage src={slide.image} alt={slide.title} eager className="h-full w-full object-cover" />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#1A100B]/80 via-[#3A2417]/40 to-transparent" />
            </motion.div>
          </AnimatePresence>
          <div className="relative flex min-h-[540px] items-center px-6 py-12 sm:min-h-[640px] sm:px-10 lg:px-14">
            <motion.div key={`text-${slide.id}`} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={transition} className="max-w-2xl space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#F3D8C0] backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Premium Campaign
              </div>
              <div className="space-y-4">
                <h1 className="font-display text-5xl leading-none sm:text-6xl lg:text-[6.5rem]">{slide.title}</h1>
                <p className="max-w-xl text-sm leading-8 text-white/82 sm:text-lg">{slide.subtitle}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <PremiumButton onClick={() => onOpenScope(slide.scope)}>{slide.cta}</PremiumButton>
                <PremiumButton variant="secondary" onClick={() => onOpenScope("Women")}>Shop Women</PremiumButton>
                <PremiumButton variant="ghost" onClick={() => onOpenScope("Kids")}>Shop Kids</PremiumButton>
              </div>
            </motion.div>
          </div>
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between sm:left-10 sm:right-10 lg:left-14 lg:right-14">
            <div className="flex items-center gap-2">
              {slides.map((item, slideIndex) => (
                <button type="button" key={item.id} aria-label={`Go to ${item.title}`} onClick={() => setIndex(slideIndex)} className={cn("h-2.5 rounded-full transition", slideIndex === index ? "w-10 bg-white" : "w-2.5 bg-white/40")} />
              ))}
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <button type="button" onClick={() => setIndex((current) => (current - 1 + slides.length) % slides.length)} className="rounded-full border border-white/20 bg-white/10 p-3 backdrop-blur"><ChevronLeft className="h-4 w-4 text-white" /></button>
              <button type="button" onClick={() => setIndex((current) => (current + 1) % slides.length)} className="rounded-full border border-white/20 bg-white/10 p-3 backdrop-blur"><ChevronRight className="h-4 w-4 text-white" /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Category Circles ---

function CategoryCircles({ onOpen }: { onOpen: (scope: Scope, category?: string) => void }) {
  const circles = [
    { label: "New Arrivals", image: womenImages[11], scope: "New Arrivals" as Scope },
    { label: "Kurtis", image: womenImages[0], scope: "Women" as Scope, category: "Kurtis" },
    { label: "Sarees", image: womenImages[8], scope: "Women" as Scope, category: "Sarees" },
    { label: "Kids Wear", image: girlsImages[0], scope: "Kids" as Scope },
    { label: "Party Wear", image: boysImages[1], scope: "Kids" as Scope, category: "Party Wear" },
    { label: "Festival Wear", image: womenImages[2], scope: "Festival Collection" as Scope },
    { label: "Best Sellers", image: womenImages[9], scope: "Best Sellers" as Scope },
    { label: "Wedding Collection", image: womenImages[10], scope: "Wedding Collection" as Scope },
  ];

  return (
    <section className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-[1500px] space-y-10">
        <SectionHeading eyebrow="Category Circles" title="Swipe through premium discovery like a high-end fashion storefront" description="A mobile-first circular category scroller with realistic fashion imagery and refined campaign-style discovery." />
        <div className="hide-scrollbar flex gap-5 overflow-x-auto pb-4">
          {circles.map((circle, index) => (
            <motion.button type="button" key={circle.label} whileHover={{ y: -8, rotate: 1.5 }} whileTap={{ scale: 0.98 }} initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ ...transition, delay: index * 0.04 }} onClick={() => onOpen(circle.scope, circle.category)} className="group min-w-[140px] text-center">
              <div className="luxury-outline mx-auto h-32 w-32 overflow-hidden rounded-full bg-[#F6EEE6] p-1.5 shadow-[0_18px_44px_rgba(17,17,17,0.08)] sm:h-36 sm:w-36">
                <div className="h-full w-full overflow-hidden rounded-full">
                  <MediaImage src={circle.image} alt={circle.label} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                </div>
              </div>
              <p className="mt-4 text-sm font-semibold text-[#1A1A1A]">{circle.label}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Campaign Cards ---

function CampaignCard({ banner, onClick, tall = false }: { banner: Banner; onClick: () => void; tall?: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-24, 24]);

  return (
    <motion.div ref={ref} whileHover={{ y: -6 }} className={cn("group relative overflow-hidden rounded-[36px]", tall ? "min-h-[520px]" : "min-h-[420px]")}>
      <motion.div style={{ y }} className="absolute inset-0 h-[112%]">
        <MediaImage src={banner.image} alt={banner.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#1E120B]/75 via-[#3A2417]/28 to-transparent" />
      <div className="relative flex h-full items-end p-8 sm:p-10">
        <div className="max-w-xl space-y-5 text-white">
          <p className="text-xs uppercase tracking-[0.34em] text-[#E7C5A7]">Campaign</p>
          <h3 className="font-display text-5xl leading-none sm:text-6xl">{banner.title}</h3>
          <p className="text-sm leading-7 text-white/82 sm:text-base">{banner.subtitle}</p>
          <PremiumButton onClick={onClick}>{banner.cta}</PremiumButton>
        </div>
      </div>
    </motion.div>
  );
}

// --- Collection Section ---

function CollectionSection({ eyebrow, title, description, products, wishlist, onOpenProduct, onWishlist, onQuickView, onAddToCart, onExplore }: { eyebrow: string; title: string; description: string; products: Product[]; wishlist: string[]; onOpenProduct: (product: Product) => void; onWishlist: (productId: string) => void; onQuickView: (product: Product) => void; onAddToCart: (product: Product) => void; onExplore: () => void }) {
  return (
    <section className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-[1500px] space-y-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
          <PremiumButton variant="secondary" onClick={onExplore}>Explore More <ArrowRight className="h-4 w-4" /></PremiumButton>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} wishlisted={wishlist.includes(product.id)} onOpen={() => onOpenProduct(product)} onWishlist={() => onWishlist(product.id)} onQuickView={() => onQuickView(product)} onAddToCart={() => onAddToCart(product)} />
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Product Detail Page ---

function ProductDetailPage({ product, related, recent, onBack, onAddToCart, onBuyNow, onWishlist, wishlisted, onOpenProduct, onReturn }: { product: Product; related: Product[]; recent: Product[]; onBack: () => void; onAddToCart: (size: string, color: string, qty: number) => void; onBuyNow: (size: string, color: string, qty: number) => void; onWishlist: () => void; wishlisted: boolean; onOpenProduct: (product: Product) => void; onReturn: (orderId: string) => void }) {
  const [mainImage, setMainImage] = useState(product.gallery[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[2] ?? product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("Description");
  const [pincode, setPincode] = useState("");
  const [message, setMessage] = useState("");
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    setMainImage(product.gallery[0]);
    setSelectedSize(product.sizes[2] ?? product.sizes[0]);
    setSelectedColor(product.colors[0].name);
    setQty(1);
    setTab("Description");
    setPincode("");
    setMessage("");
  }, [product]);

  const tabs: Record<string, ReactNode> = {
    Description: product.description,
    "Fabric Details": "Premium fabric finish crafted for softness, drape, and occasion-ready premium styling.",
    "Size Guide": `Available sizes: ${product.sizes.join(", ")}. Fit is optimized for fashion-forward comfort and premium finish.`,
    "Delivery Information": "Tamil Nadu: 2–4 Business Days • South India: 3–6 Business Days • Rest Of India: 5–8 Business Days • Free shipping above ₹999.",
    "Return Policy": "7 day easy returns for unused products with original tags and original packaging.",
    Reviews: `${product.reviews}+ customers rated this style ${product.rating.toFixed(1)} stars for quality, styling, and premium presentation.`,
  };

  return (
    <section className="px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-[1500px] space-y-14">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-[#6B3E26]"><ChevronLeft className="h-4 w-4" /> Back to collection</button>
        <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
          <Reveal>
            <div className="grid gap-4 md:grid-cols-[110px_1fr]">
              <div className="hide-scrollbar order-2 flex gap-3 overflow-x-auto md:order-1 md:flex-col">
                {product.gallery.map((image, index) => (
                  <button type="button" key={`${image}-${index}`} onClick={() => setMainImage(image)} className={cn("overflow-hidden rounded-[22px] border bg-[#FFF8F3] p-1 transition md:w-full", mainImage === image ? "border-[#C89B6D]/50" : "border-[#EDE0D4]")}>
                    <MediaImage src={image} alt={`${product.title} thumbnail ${index + 1}`} className="h-24 w-24 rounded-[18px] object-cover md:h-28 md:w-full" />
                  </button>
                ))}
              </div>
              <div className="order-1 relative overflow-hidden rounded-[36px] bg-[#F5ECE4] shadow-[0_28px_80px_rgba(17,17,17,0.08)] md:order-2 cursor-zoom-in" onClick={() => setZoom(true)}>
                <AnimatePresence mode="wait">
                  <motion.div key={mainImage} initial={{ opacity: 0.2, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0.2, scale: 0.99 }} transition={{ duration: 0.35 }}>
                    <MediaImage src={mainImage} alt={product.title} eager className="aspect-[4/5] h-full w-full object-cover" />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute bottom-4 right-4 rounded-full bg-white/90 p-2 text-[#6B3E26]"><Search className="h-5 w-5" /></div>
              </div>
            </div>
          </Reveal>
          <Reveal className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#8B5E3C]">{product.department} • {product.category}</p>
                  <h1 className="font-display text-5xl leading-none text-[#1A1A1A] sm:text-6xl">{product.title}</h1>
                </div>
                <button type="button" onClick={onWishlist} className="rounded-full border border-[#EDE0D4] bg-white p-3 text-[#6B3E26]"><Heart className={cn("h-5 w-5", wishlisted && "fill-current")} /></button>
              </div>
              <Rating value={product.rating} reviews={product.reviews} />
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-3xl font-bold text-[#1A1A1A]">{formatCurrency(product.price)}</span>
                <span className="text-lg text-[#A49184] line-through">{formatCurrency(product.comparePrice)}</span>
                <span className="rounded-full bg-[#FFF0E5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#8B5E3C]">Save {getDiscount(product)}%</span>
              </div>
              <p className="text-sm leading-8 text-[#5F4B3D] sm:text-base">{product.description}</p>
            </div>
            <div className="rounded-[32px] border border-[#EDE0D4] bg-[#FFF9F5] p-6">
              <div className="space-y-6">
                <div>
                  <p className="mb-3 text-sm font-semibold text-[#1A1A1A]">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button type="button" key={size} onClick={() => setSelectedSize(size)} className={cn("rounded-full border px-4 py-2 text-sm font-semibold transition", selectedSize === size ? "border-[#6B3E26] bg-[#6B3E26] text-white" : "border-[#E7D9CD] bg-white text-[#6B3E26]")}>{size}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-sm font-semibold text-[#1A1A1A]">Color</p>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color, index) => (
                      <button type="button" key={color.name} onClick={() => { setSelectedColor(color.name); setMainImage(product.gallery[index % product.gallery.length]); }} className={cn("flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition", selectedColor === color.name ? "border-[#6B3E26] bg-[#FFF4EA] text-[#6B3E26]" : "border-[#E7D9CD] bg-white text-[#6B3E26]")}>
                        <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: color.swatch }} />
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-sm font-semibold text-[#1A1A1A]">Quantity</p>
                  <div className="flex w-fit items-center gap-3 rounded-full border border-[#E7D9CD] bg-white px-3 py-2">
                    <button type="button" onClick={() => setQty((current) => Math.max(1, current - 1))} className="rounded-full p-2 text-[#6B3E26]"><Minus className="h-4 w-4" /></button>
                    <span className="min-w-8 text-center text-sm font-semibold text-[#1A1A1A]">{qty}</span>
                    <button type="button" onClick={() => setQty((current) => current + 1)} className="rounded-full p-2 text-[#6B3E26]"><Plus className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <PremiumButton onClick={() => onAddToCart(selectedSize, selectedColor, qty)}>Add To Cart</PremiumButton>
                  <PremiumButton variant="secondary" onClick={() => onBuyNow(selectedSize, selectedColor, qty)}>Buy Now</PremiumButton>
                  <PremiumButton variant="secondary" onClick={() => window.open(socialLinks.whatsapp, "_blank")}>WhatsApp Order</PremiumButton>
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <MiniInfoCard icon={<Truck className="h-5 w-5" />} title="Shipping" copy="Fast delivery across India" />
              <MiniInfoCard icon={<ShieldCheck className="h-5 w-5" />} title="Returns" copy="7 day easy returns" />
              <MiniInfoCard icon={<Lock className="h-5 w-5" />} title="Security" copy="Secure checkout & OTP login" />
            </div>
            <div className="rounded-[32px] border border-[#EDE0D4] bg-white p-6 shadow-[0_18px_44px_rgba(17,17,17,0.04)]">
              <p className="mb-3 text-sm font-semibold text-[#1A1A1A]">Pincode Availability Checker</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input value={pincode} onChange={(event) => setPincode(event.target.value)} placeholder="Enter 6-digit pincode" className="flex-1 rounded-full border border-[#E7D9CD] px-4 py-3 text-sm outline-none" />
                <PremiumButton variant="secondary" onClick={() => setMessage(/^\d{6}$/.test(pincode) ? "Delivery available • Tamil Nadu: 2–4 days • South India: 3–6 days • Rest of India: 5–8 days" : "Please enter a valid 6-digit pincode")}>Check</PremiumButton>
              </div>
              {message && <p className="mt-3 text-sm text-[#5F4B3D]">{message}</p>}
            </div>
            <button type="button" onClick={() => onReturn("Demo-Order-123")} className="flex items-center gap-2 rounded-full border border-[#E7D9CD] bg-white px-6 py-3 text-sm font-semibold text-[#6B3E26] hover:bg-[#FFF9F5]">
              <RefreshCw className="h-4 w-4" /> Return / Replace Product
            </button>
          </Reveal>
        </div>
        <div className="space-y-6">
          <div className="hide-scrollbar flex gap-3 overflow-x-auto">
            {Object.keys(tabs).map((item) => (
              <button type="button" key={item} onClick={() => setTab(item)} className={cn("rounded-full border px-5 py-3 text-sm font-semibold transition", tab === item ? "border-[#C89B6D]/50 bg-[#FFF4EA] text-[#6B3E26]" : "border-[#E7D9CD] bg-white text-[#6B3E26]")}>{item}</button>
            ))}
          </div>
          <div className="rounded-[32px] border border-[#EDE0D4] bg-[#FFF9F5] p-6 text-sm leading-8 text-[#5F4B3D] sm:p-8">{tabs[tab]}</div>
        </div>
        <RelatedRow title="Related Products" products={related} onOpenProduct={onOpenProduct} />
        <RelatedRow title="Recently Viewed" products={recent} onOpenProduct={onOpenProduct} />
      </div>
      {zoom && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4" onClick={() => setZoom(false)}>
          <button type="button" onClick={() => setZoom(false)} className="absolute right-4 top-4 text-white"><X className="h-8 w-8" /></button>
          <img src={mainImage} alt={product.title} className="max-h-[90vh] max-w-full object-contain" />
        </div>
      )}
    </section>
  );
}

function RelatedRow({ title, products, onOpenProduct }: { title: string; products: Product[]; onOpenProduct: (product: Product) => void }) {
  return (
    <div className="space-y-6">
      <h3 className="font-display text-4xl text-[#1A1A1A]">{title}</h3>
      <div className="hide-scrollbar flex gap-5 overflow-x-auto pb-3">
        {products.map((product) => (
          <div key={product.id} className="min-w-[280px] overflow-hidden rounded-[30px] border border-[#EDE0D4] bg-white shadow-[0_18px_44px_rgba(17,17,17,0.05)]">
            <button type="button" onClick={() => onOpenProduct(product)} className="block w-full text-left">
              <MediaImage src={product.gallery[0]} alt={product.title} className="aspect-[4/3] w-full object-cover" />
              <div className="space-y-3 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-[#8B5E3C]">{product.category}</p>
                <h4 className="font-display text-3xl text-[#1A1A1A]">{product.title}</h4>
                <p className="font-semibold text-[#1A1A1A]">{formatCurrency(product.price)}</p>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Listing Page ---

function ListingPage({ filters, setFilters, products, allProducts, wishlist, onOpenProduct, onWishlist, onQuickView, onAddToCart }: { filters: Filters; setFilters: React.Dispatch<React.SetStateAction<Filters>>; products: Product[]; allProducts: Product[]; wishlist: string[]; onOpenProduct: (product: Product) => void; onWishlist: (productId: string) => void; onQuickView: (product: Product) => void; onAddToCart: (product: Product) => void }) {
  const [mobileFilters, setMobileFilters] = useState(false);
  const categories = ["All", ...Array.from(new Set(allProducts.map((product) => product.category)))];
  const sizes = ["All", ...Array.from(new Set(allProducts.flatMap((product) => product.sizes)))];
  const colors = ["All", ...Array.from(new Set(allProducts.flatMap((product) => product.colors.map((item) => item.name))))];
  
  const banner = categoryBannerImages[filters.scope] || categoryBannerImages[filters.category] || bannerImages[2];

  return (
    <section className="px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-[1500px] space-y-10">
        <Reveal>
          <div className="overflow-hidden rounded-[38px] bg-[#26170F] text-white shadow-[0_28px_80px_rgba(17,17,17,0.16)]">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div className="p-8 sm:p-10 lg:p-12">
                <p className="text-xs uppercase tracking-[0.34em] text-[#E7C5A7]">Category Page</p>
                <h1 className="mt-4 font-display text-5xl leading-none sm:text-6xl">{filters.scope}</h1>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/78 sm:text-base">Wider, cleaner collection browsing with accurate filters and premium product visibility.</p>
              </div>
              <div className="relative min-h-[280px]"><MediaImage src={banner} alt="Category banner" className="h-full w-full object-cover" /></div>
            </div>
          </div>
        </Reveal>
        <div className="flex items-center justify-between gap-4 lg:hidden">
          <SectionHeading eyebrow="Filters" title="Refine your discovery" description="Use touch-friendly filters and sorting built for mobile shopping." />
          <PremiumButton variant="secondary" className="shrink-0" onClick={() => setMobileFilters(true)}><Filter className="h-4 w-4" /> Filters</PremiumButton>
        </div>
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <FilterPanel className="hidden lg:block" filters={filters} setFilters={setFilters} categories={categories} sizes={sizes} colors={colors} />
          <div className="space-y-6">
            <div className="flex flex-col gap-3 rounded-[28px] border border-[#EDE0D4] bg-[#FFF9F5] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#8B5E3C]">Premium Category Grid</p>
                <p className="text-sm text-[#5F4B3D]">{products.length} products discovered</p>
              </div>
              <select value={filters.sort} onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value as Filters["sort"] }))} className="rounded-full border border-[#E7D9CD] bg-white px-4 py-2 text-sm text-[#6B3E26] outline-none">
                <option>Newest</option>
                <option>Best Selling</option>
                <option>Price Low To High</option>
                <option>Price High To Low</option>
              </select>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} wishlisted={wishlist.includes(product.id)} onOpen={() => onOpenProduct(product)} onWishlist={() => onWishlist(product.id)} onQuickView={() => onQuickView(product)} onAddToCart={() => onAddToCart(product)} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {mobileFilters && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] bg-black/45 p-4 backdrop-blur lg:hidden" onClick={() => setMobileFilters(false)}>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} onClick={(event) => event.stopPropagation()} className="mx-auto mt-8 max-w-xl rounded-[34px] bg-white p-5 shadow-[0_30px_90px_rgba(0,0,0,0.18)]">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h3 className="font-display text-3xl text-[#1A1A1A]">Filters</h3>
                <button type="button" onClick={() => setMobileFilters(false)} className="rounded-full border border-[#E7D9CD] p-2 text-[#6B3E26]"><X className="h-5 w-5" /></button>
              </div>
              <FilterPanel filters={filters} setFilters={setFilters} categories={categories} sizes={sizes} colors={colors} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function FilterPanel({ filters, setFilters, categories, sizes, colors, className }: { filters: Filters; setFilters: React.Dispatch<React.SetStateAction<Filters>>; categories: string[]; sizes: string[]; colors: string[]; className?: string }) {
  return (
    <aside className={cn("luxury-card rounded-[30px] p-6", className)}>
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-full bg-[#FFF0E5] p-3 text-[#6B3E26]"><Filter className="h-5 w-5" /></div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#8B5E3C]">Filtering System</p>
          <h3 className="font-display text-3xl text-[#1A1A1A]">Refine styles</h3>
        </div>
      </div>
      <FilterGroup title="Category"><PillSelector options={categories} value={filters.category} onChange={(value) => setFilters((current) => ({ ...current, category: value }))} /></FilterGroup>
      <FilterGroup title="Price Range"><input type="range" min={999} max={4999} step={100} value={filters.price} onChange={(event) => setFilters((current) => ({ ...current, price: Number(event.target.value) }))} className="w-full accent-[#8B5E3C]" /><p className="text-sm text-[#5F4B3D]">Up to {formatCurrency(filters.price)}</p></FilterGroup>
      <FilterGroup title="Size"><PillSelector compact options={sizes} value={filters.size} onChange={(value) => setFilters((current) => ({ ...current, size: value }))} /></FilterGroup>
      <FilterGroup title="Color"><PillSelector compact options={colors} value={filters.color} onChange={(value) => setFilters((current) => ({ ...current, color: value }))} /></FilterGroup>
      <div className="space-y-3 border-t border-[#EDE0D4] pt-5">
        <label className="flex items-center gap-3 text-sm text-[#5F4B3D]"><input type="checkbox" checked={filters.newArrivals} onChange={(event) => setFilters((current) => ({ ...current, newArrivals: event.target.checked }))} /> New Arrivals</label>
        <label className="flex items-center gap-3 text-sm text-[#5F4B3D]"><input type="checkbox" checked={filters.bestSellers} onChange={(event) => setFilters((current) => ({ ...current, bestSellers: event.target.checked }))} /> Best Sellers</label>
        <label className="flex items-center gap-3 text-sm text-[#5F4B3D]"><input type="checkbox" checked={filters.offers} onChange={(event) => setFilters((current) => ({ ...current, offers: event.target.checked }))} /> Offers</label>
      </div>
    </aside>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return <div className="border-t border-[#EDE0D4] py-5 first:border-t-0 first:pt-0"><p className="mb-3 text-sm font-semibold text-[#1A1A1A]">{title}</p>{children}</div>;
}

function PillSelector({ options, value, onChange, compact = false }: { options: string[]; value: string; onChange: (value: string) => void; compact?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.slice(0, compact ? 8 : 14).map((option) => (
        <button type="button" key={option} onClick={() => onChange(option)} className={cn("rounded-full border px-3 py-2 text-xs font-medium transition", value === option ? "border-[#C89B6D]/50 bg-[#FFF4EA] text-[#6B3E26]" : "border-[#E7D9CD] bg-white text-[#6B3E26]")}>{option}</button>
      ))}
    </div>
  );
}

// --- Cart Page ---

function CartPage({ items, coupon, setCoupon, discount, subtotal, shipping, total, onApplyCoupon, onUpdateQty, onRemove, onContinue, onCheckout }: { items: Array<CartItem & { product: Product }>; coupon: string; setCoupon: (value: string) => void; discount: number; subtotal: number; shipping: number; total: number; onApplyCoupon: () => void; onUpdateQty: (item: CartItem, quantity: number) => void; onRemove: (item: CartItem) => void; onContinue: () => void; onCheckout: () => void }) {
  return (
    <section className="px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-[1500px] space-y-10">
        <SectionHeading eyebrow="Shopping Bag" title="Review your premium cart before checkout" description="A clean responsive cart with consistent spacing and mobile-friendly quantity updates." />
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="rounded-[34px] border border-dashed border-[#D8C8B9] bg-[#FFF9F5] p-10 text-center">
                <ShoppingBag className="mx-auto h-10 w-10 text-[#6B3E26]" />
                <h3 className="mt-4 font-display text-4xl text-[#1A1A1A]">Your bag is empty</h3>
                <p className="mt-3 text-sm text-[#5F4B3D]">Explore collections and premium new arrivals to build your fashion bag.</p>
                <PremiumButton className="mt-6" onClick={onContinue}>Continue Shopping</PremiumButton>
              </div>
            ) : (
              items.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="luxury-card flex flex-col gap-5 rounded-[30px] p-5 sm:flex-row">
                  <MediaImage src={item.product.gallery[0]} alt={item.product.title} className="h-40 w-full rounded-[24px] object-cover sm:w-32" />
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-[#8B5E3C]">{item.product.category}</p>
                        <h3 className="font-display text-3xl text-[#1A1A1A]">{item.product.title}</h3>
                        <p className="text-sm text-[#6D5A4B]">{item.size} • {item.color}</p>
                      </div>
                      <button type="button" onClick={() => onRemove(item)} className="text-sm font-semibold text-[#8B5E3C] underline underline-offset-4">Remove</button>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3 rounded-full border border-[#E7D9CD] bg-white px-3 py-2">
                        <button type="button" onClick={() => onUpdateQty(item, Math.max(1, item.quantity - 1))} className="rounded-full p-2 text-[#6B3E26]"><Minus className="h-4 w-4" /></button>
                        <span className="min-w-8 text-center text-sm font-semibold text-[#1A1A1A]">{item.quantity}</span>
                        <button type="button" onClick={() => onUpdateQty(item, item.quantity + 1)} className="rounded-full p-2 text-[#6B3E26]"><Plus className="h-4 w-4" /></button>
                      </div>
                      <p className="font-semibold text-[#1A1A1A]">{formatCurrency(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="space-y-5">
            <div className="luxury-card rounded-[30px] p-6">
              <h3 className="font-display text-3xl text-[#1A1A1A]">Coupon Code</h3>
              <div className="mt-4 flex gap-3"><input value={coupon} onChange={(event) => setCoupon(event.target.value)} className="flex-1 rounded-full border border-[#E7D9CD] px-4 py-3 text-sm outline-none" /><PremiumButton variant="secondary" onClick={onApplyCoupon}>Apply</PremiumButton></div>
            </div>
            <div className="luxury-card rounded-[30px] p-6">
              <h3 className="font-display text-3xl text-[#1A1A1A]">Order Summary</h3>
              <div className="mt-6 space-y-4 text-sm text-[#5F4B3D]">
                <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
                <SummaryRow label="Discount" value={`- ${formatCurrency(discount)}`} />
                <SummaryRow label="Shipping" value={shipping === 0 ? "Free" : formatCurrency(shipping)} />
                <SummaryRow label="Free Shipping" value="Above ₹999" subtle />
                <div className="border-t border-[#EDE0D4] pt-4"><SummaryRow label="Total" value={formatCurrency(total)} strong /></div>
              </div>
              <PremiumButton className="mt-6 w-full" onClick={onCheckout}>Proceed To Checkout</PremiumButton>
              <PremiumButton variant="ghost" className="mt-2 w-full" onClick={onContinue}>Continue Shopping</PremiumButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Checkout Page ---

function CheckoutPage({ isLoggedIn, items, subtotal, discount, shipping, total, onRequireLogin, onPay, customer }: { isLoggedIn: boolean; items: Array<CartItem & { product: Product }>; subtotal: number; discount: number; shipping: number; total: number; onRequireLogin: () => void; onPay: (method: Order["paymentMethod"]) => void; customer: { name: string; phone: string; email: string; address: string; city: string; state: string; pincode: string; notes: string } }) {
  if (!isLoggedIn) {
    return (
      <section className="px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-5xl rounded-[38px] border border-[#EDE0D4] bg-white p-10 text-center shadow-[0_24px_70px_rgba(17,17,17,0.08)]">
          <LogoBlock compact />
          <h1 className="mt-8 font-display text-5xl text-[#1A1A1A]">Login required for checkout</h1>
          <p className="mt-4 text-sm leading-7 text-[#5F4B3D]">Guest users can browse freely, but checkout requires a premium account login.</p>
          <PremiumButton className="mt-8" onClick={onRequireLogin}>Open Premium Login</PremiumButton>
        </div>
      </section>
    );
  }
  return (
    <section className="px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-[1500px] space-y-10">
        <SectionHeading eyebrow="Checkout" title="Secure, responsive, mobile-first checkout" description="Complete your order with secure payment, saved addresses, and premium payment presentation." />
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5">
            <div className="luxury-card rounded-[30px] p-6">
              <h3 className="font-display text-3xl text-[#1A1A1A]">Delivery Details</h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <input defaultValue={customer.name} placeholder="Full Name" className="rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none" />
                <input defaultValue={customer.phone} placeholder="Phone Number" className="rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none" />
                <input defaultValue={customer.email} placeholder="Email Address" className="rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none sm:col-span-2" />
                <textarea defaultValue={customer.address} placeholder="Full Address" className="min-h-28 rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none sm:col-span-2" />
                <input defaultValue={customer.city} placeholder="City" className="rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none" />
                <input defaultValue={customer.state} placeholder="State" className="rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none" />
                <input defaultValue={customer.pincode} placeholder="Pincode" className="rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none" />
              </div>
            </div>
            <div className="luxury-card rounded-[30px] p-6">
              <h3 className="font-display text-3xl text-[#1A1A1A]">Delivery Instructions</h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {["Call Before Delivery", "Leave At Door", "Deliver To Security", "Alternate Number"].map((instruction) => (
                  <label key={instruction} className="flex items-center gap-3 rounded-2xl border border-[#EDE0D4] bg-[#FFF9F5] px-4 py-3 text-sm text-[#5F4B3D]"><input type="checkbox" />{instruction}</label>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <div className="luxury-card rounded-[30px] p-6">
              <h3 className="font-display text-3xl text-[#1A1A1A]">Order Summary</h3>
              <div className="mt-5 space-y-4">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center gap-4 rounded-[22px] border border-[#EDE0D4] bg-[#FFF9F5] p-3">
                    <MediaImage src={item.product.gallery[0]} alt={item.product.title} className="h-20 w-20 rounded-[18px] object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-[#1A1A1A]">{item.product.title}</p>
                      <p className="text-sm text-[#6D5A4B]">{item.size} • {item.color} • Qty {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-[#1A1A1A]">{formatCurrency(item.product.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-4 border-t border-[#EDE0D4] pt-4 text-sm text-[#5F4B3D]">
                <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
                <SummaryRow label="Discount" value={`- ${formatCurrency(discount)}`} />
                <SummaryRow label="Shipping" value={shipping === 0 ? "Free" : formatCurrency(shipping)} />
                <SummaryRow label="Total" value={formatCurrency(total)} strong />
              </div>
            </div>
            <div className="luxury-card rounded-[30px] p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#6B3E26] p-3 text-white"><CreditCard className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-[#8B5E3C]">Payment Methods</p>
                  <h3 className="font-display text-3xl text-[#1A1A1A]">Secure premium checkout</h3>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => onPay("COD")} className="rounded-[22px] border border-[#EDE0D4] bg-[#FFF9F5] p-4 text-left transition hover:border-[#C89B6D]">
                  <div className="flex items-center gap-3 text-[#5F4B3D]"><ShoppingBag className="h-5 w-5 text-[#6B3E26]" /><span className="text-sm font-medium">Cash On Delivery</span></div>
                </button>
                <button type="button" onClick={() => onPay("UPI")} className="rounded-[22px] border border-[#EDE0D4] bg-[#FFF9F5] p-4 text-left transition hover:border-[#C89B6D]">
                  <div className="flex items-center gap-3 text-[#5F4B3D]"><QrCode className="h-5 w-5 text-[#6B3E26]" /><span className="text-sm font-medium">UPI / Wallets</span></div>
                </button>
                <button type="button" onClick={() => onPay("Razorpay")} className="rounded-[22px] border border-[#EDE0D4] bg-[#FFF9F5] p-4 text-left transition hover:border-[#C89B6D]">
                  <div className="flex items-center gap-3 text-[#5F4B3D]"><CreditCard className="h-5 w-5 text-[#6B3E26]" /><span className="text-sm font-medium">Cards / Net Banking</span></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Account Page ---

function AccountPage({ isLoggedIn, onLogin, wishlist, recentOrders, onOpenProduct }: { isLoggedIn: boolean; onLogin: (method: "Mobile OTP" | "Google" | "Email") => void; wishlist: Product[]; recentOrders: Array<CartItem & { product: Product }>; onOpenProduct: (product: Product) => void }) {
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isLoggedIn) {
    return (
      <section className="px-4 py-10 sm:py-14">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[38px] border border-[#EDE0D4] bg-white shadow-[0_28px_80px_rgba(17,17,17,0.08)] lg:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-[#26170F] p-8 text-white sm:p-10">
            <LogoBlock compact />
            <p className="mt-8 text-xs uppercase tracking-[0.34em] text-[#E7C5A7]">Premium Login</p>
            <h1 className="mt-4 font-display text-5xl leading-none">Access your fashion account</h1>
            <p className="mt-5 text-sm leading-7 text-white/76 sm:text-base">Mobile OTP login, Google login, email login, wishlist sync, and premium shopping continuity.</p>
          </div>
          <div className="p-8 sm:p-10">
            <p className="text-xs uppercase tracking-[0.28em] text-[#8B5E3C]">Member Access</p>
            <h2 className="mt-3 font-display text-5xl text-[#1A1A1A]">Sign in</h2>
            <div className="mt-8 grid gap-4">
              {!otpSent ? (
                <>
                  <input placeholder="Mobile number (10 digits)" className="rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none" />
                  <PremiumButton onClick={() => setOtpSent(true)}>Send OTP</PremiumButton>
                  <div className="my-2 flex items-center gap-3"><div className="h-px flex-1 bg-[#EDE0D4]" /><p className="text-xs text-[#A49184]">OR</p><div className="h-px flex-1 bg-[#EDE0D4]" /></div>
                  <PremiumButton variant="secondary" onClick={() => onLogin("Google")}>Continue With Google</PremiumButton>
                  <input placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none" />
                  <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none" />
                  <PremiumButton variant="secondary" onClick={() => onLogin("Email")}>Sign In with Email</PremiumButton>
                </>
              ) : (
                <>
                  <input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none" />
                  <PremiumButton onClick={() => onLogin("Mobile OTP")}>Verify & Login</PremiumButton>
                  <button type="button" onClick={() => setOtpSent(false)} className="text-sm text-[#8B5E3C]">Change Mobile Number</button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-[1500px] space-y-10">
        <div><p className="text-xs uppercase tracking-[0.28em] text-[#8B5E3C]">Account</p><h1 className="font-display text-5xl text-[#1A1A1A]">Premium Customer Dashboard</h1></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {["Orders", "Wishlist", "Addresses", "Saved Payments", "Returns", "Support", "Profile", "Tracking"].map((item, index) => (
            <Reveal key={item} delay={index * 0.04}>
              <div className="luxury-card rounded-[28px] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-[#8B5E3C]">Member Area</p>
                <h3 className="mt-3 font-display text-3xl text-[#1A1A1A]">{item}</h3>
                <p className="mt-2 text-sm leading-6 text-[#6D5A4B]">Mobile-friendly account tools built for easy order and profile management.</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="luxury-card rounded-[30px] p-6">
            <h3 className="font-display text-3xl text-[#1A1A1A]">Recent Orders</h3>
            <div className="mt-5 space-y-4">
              {recentOrders.slice(0, 3).map((item) => (
                <div key={`${item.productId}-${item.color}`} className="flex items-center gap-4 rounded-[22px] border border-[#EDE0D4] bg-[#FFF9F5] p-4">
                  <MediaImage src={item.product.gallery[0]} alt={item.product.title} className="h-20 w-20 rounded-[18px] object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold text-[#1A1A1A]">{item.product.title}</p>
                    <p className="text-sm text-[#6D5A4B]">Packed • Qty {item.quantity}</p>
                  </div>
                  <span className="rounded-full bg-[#6B3E26] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">Packed</span>
                </div>
              ))}
            </div>
          </div>
          <div className="luxury-card rounded-[30px] p-6">
            <h3 className="font-display text-3xl text-[#1A1A1A]">Wishlist</h3>
            <div className="mt-5 space-y-4">
              {wishlist.slice(0, 3).map((product) => (
                <button key={product.id} type="button" onClick={() => onOpenProduct(product)} className="flex w-full items-center gap-4 rounded-[22px] border border-[#EDE0D4] bg-[#FFF9F5] p-4 text-left">
                  <MediaImage src={product.gallery[0]} alt={product.title} className="h-20 w-20 rounded-[18px] object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold text-[#1A1A1A]">{product.title}</p>
                    <p className="text-sm text-[#6D5A4B]">{formatCurrency(product.price)}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#6B3E26]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Static Pages ---

function AboutPage() {
  return (
    <section className="px-4 py-10 sm:py-14">
      <div className="mx-auto grid max-w-[1500px] gap-8 xl:grid-cols-[1fr_0.95fr] xl:items-center">
        <div className="space-y-6">
          <SectionHeading eyebrow="About" title={`${BRAND} is built for premium family fashion discovery`} description={`${BRAND} is a Chennai-based fashion retailer and wholesaler offering premium quality women wear, kids wear, festive collections, party wear and family fashion at affordable prices. We proudly serve retail customers, wholesale buyers, dealers and resellers across Tamil Nadu and India.`} />
          <div className="grid gap-4 sm:grid-cols-3">
            {["Women Wear", "Kids Wear", "Wholesale & Retail"].map((item) => (
              <div key={item} className="luxury-card rounded-[28px] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-[#8B5E3C]">{BRAND}</p>
                <p className="mt-3 font-display text-3xl text-[#1A1A1A]">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-[38px]"><MediaImage src={bannerImages[2]} alt={`${BRAND} about section`} className="h-full w-full object-cover" /></div>
      </div>
    </section>
  );
}

function WholesalePage() {
  return (
    <section className="px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-[1500px] space-y-10">
        <SectionHeading eyebrow="Wholesale" title="Dealer registration, reseller support, and bulk family fashion access" description="A premium wholesale experience with cleaner hierarchy and business-friendly action paths for large buyers." />
        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <div className="luxury-card rounded-[32px] p-6 sm:p-8">
            <h2 className="font-display text-4xl text-[#1A1A1A]">Bulk Order & Dealer Form</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {["Business Name", "Contact Person", "Phone Number", "WhatsApp Number", "Email Address", "GST Number", "City", "State"].map((field) => (<input key={field} placeholder={field} className="rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none" />))}
              <select className="rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none sm:col-span-2">
                <option>Buyer Type</option><option>Dealer Registration</option><option>Reseller Program</option><option>GST Buyer</option><option>Bulk Orders</option>
              </select>
              <textarea placeholder="Collection requirements / notes" className="min-h-32 rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none sm:col-span-2" />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <PremiumButton>Register Now</PremiumButton>
              <PremiumButton variant="secondary" onClick={() => window.open(socialLinks.whatsapp, "_blank")}>WhatsApp Wholesale Contact</PremiumButton>
              <PremiumButton variant="secondary">Catalogue Download</PremiumButton>
            </div>
          </div>
          <div className="space-y-5">
            {[
              { title: "Bulk Orders", copy: "Premium sourcing for boutiques, family stores, and seasonal campaigns." },
              { title: "Dealer Registration", copy: "Clean onboarding for long-term wholesale partnerships." },
              { title: "Reseller Program", copy: "Mobile-friendly support for beginner resellers and social sellers." },
              { title: "GST Buyers", copy: "Business billing and documentation-friendly purchasing support." },
            ].map((item) => (
              <div key={item.title} className="luxury-card rounded-[30px] p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-[#8B5E3C]">Wholesale Support</p>
                <h3 className="mt-3 font-display text-3xl text-[#1A1A1A]">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#5F4B3D]">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactPage() {
  return (
    <section id="contact" className="px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-[1500px] space-y-10">
        <SectionHeading eyebrow="Contact" title={`Connect with ${BRAND}`} description="Retail support, WhatsApp ordering, social contact, location, and store visit tools in one premium responsive contact page." />
        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <div className="luxury-card rounded-[32px] p-6 sm:p-8">
            <h2 className="font-display text-4xl text-[#1A1A1A]">Contact Form</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {["Full Name", "Phone Number", "Email Address", "Subject"].map((field) => (<input key={field} placeholder={field} className="rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none" />))}
              <textarea placeholder="How can we help?" className="min-h-36 rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none sm:col-span-2" />
            </div>
            <PremiumButton className="mt-6">Send Message</PremiumButton>
          </div>
          <div className="space-y-5">
            <div className="luxury-card rounded-[30px] p-6">
              <h3 className="font-display text-3xl text-[#1A1A1A]">Contact & Social</h3>
              <div className="mt-5 grid gap-3">
                {[
                  { icon: <Phone className="h-5 w-5" />, label: "+91 93636 97498", href: socialLinks.phone },
                  { icon: <Mail className="h-5 w-5" />, label: "Yuvavishnu2426@gmail.com", href: socialLinks.email },
                  { icon: <WhatsAppIcon className="h-5 w-5" />, label: "WhatsApp", href: socialLinks.whatsapp },
                  { icon: <InstagramIcon className="h-5 w-5" />, label: "Instagram", href: socialLinks.instagram },
                  { icon: <FacebookIcon className="h-5 w-5" />, label: "Facebook", href: socialLinks.facebook },
                ].map((item) => (
                  <a key={item.label} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="flex items-center gap-4 rounded-[22px] border border-[#EDE0D4] bg-[#FFF9F5] p-4 text-[#5F4B3D]">
                    <div className="rounded-full bg-[#FFF0E5] p-3 text-[#6B3E26]">{item.icon}</div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="luxury-card rounded-[30px] p-6">
              <h3 className="font-display text-3xl text-[#1A1A1A]">Store Location</h3>
              <div className="mt-4 space-y-4 text-sm leading-7 text-[#5F4B3D]">
                <p>{STORE_ADDRESS.join(" ")}</p>
                <p>{STORE_TIMING}</p>
              </div>
              <div className="mt-5 overflow-hidden rounded-[26px] border border-[#EDE0D4]">
                <iframe title="Store map" src={STORE_MAP_EMBED} className="h-64 w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
              <PremiumButton className="mt-5" onClick={() => window.open(STORE_MAP_LINK, "_blank")}>Open Google Maps</PremiumButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReturnPolicyPage() {
  return (
    <section className="px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-[1000px] space-y-8">
        <SectionHeading eyebrow="Policy" title="Returns & Refund Policy" description="We want you to love your JEEV RUTHI COLLECTION purchase. If you're not satisfied, we're here to help." center />
        <div className="space-y-6">
          <div className="luxury-card rounded-[30px] p-6">
            <h3 className="font-display text-3xl text-[#1A1A1A]">7-Day Easy Returns</h3>
            <p className="mt-3 text-sm leading-7 text-[#5F4B3D]">
              You can return any unused product within 7 days of delivery. The item must be in its original packaging with all tags attached.
              Refunds will be processed to the original payment method within 5-7 business days after we receive the returned item.
            </p>
          </div>
          <div className="luxury-card rounded-[30px] p-6">
            <h3 className="font-display text-3xl text-[#1A1A1A]">How to Return</h3>
            <ol className="mt-3 list-inside space-y-2 text-sm text-[#5F4B3D]">
              <li>Go to <strong>My Orders</strong> in your account dashboard.</li>
              <li>Select the item you want to return and click <strong>Return Product</strong>.</li>
              <li>Choose a reason and upload images if applicable.</li>
              <li>Schedule a pickup or ship the item back to our Chennai address.</li>
            </ol>
          </div>
          <div className="luxury-card rounded-[30px] p-6">
            <h3 className="font-display text-3xl text-[#1A1A1A]">Non-Returnable Items</h3>
            <p className="mt-3 text-sm leading-7 text-[#5F4B3D]">
              For hygiene reasons, innerwear, babywear, and customized orders are not eligible for return unless damaged or incorrect.
              Sale items are final sale unless defective.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReturnRequestPage({ onSubmit }: { onSubmit: (req: ReturnRequest) => void }) {
  const [orderId, setOrderId] = useState("");
  const [productTitle, setProductTitle] = useState("");
  const [reason, setReason] = useState("Wrong Size");
  const [notes, setNotes] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({
      id: `RET-${Date.now()}`,
      orderId,
      productTitle,
      reason,
      notes,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
    });
  };

  return (
    <section className="px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-[800px] space-y-8">
        <SectionHeading eyebrow="Returns" title="Request a Return" description="Please fill in the details below to start your return process." center />
        <form onSubmit={handleSubmit} className="luxury-card rounded-[30px] p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#6B3E26]">Order ID</label>
              <input required value={orderId} onChange={(e) => setOrderId(e.target.value)} className="w-full rounded-xl border border-[#E7D9CD] bg-[#FFF9F5] px-4 py-3 text-sm outline-none" placeholder="e.g., ORD-12345" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#6B3E26]">Product Name</label>
              <input required value={productTitle} onChange={(e) => setProductTitle(e.target.value)} className="w-full rounded-xl border border-[#E7D9CD] bg-[#FFF9F5] px-4 py-3 text-sm outline-none" placeholder="Product Title" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-[#6B3E26]">Return Reason</label>
              <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full rounded-xl border border-[#E7D9CD] bg-[#FFF9F5] px-4 py-3 text-sm outline-none">
                <option>Wrong Size</option>
                <option>Damaged Product</option>
                <option>Wrong Product Received</option>
                <option>Quality Issue</option>
                <option>Other</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-[#6B3E26]">Additional Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-xl border border-[#E7D9CD] bg-[#FFF9F5] px-4 py-3 text-sm outline-none" rows={4} />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <PremiumButton>Submit Return Request</PremiumButton>
          </div>
        </form>
      </div>
    </section>
  );
}

// --- Admin CMS Pages ---

function AdminLoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Fixed Admin Login: Consistent check
    if (username === "admin" && password === "admin123") {
      onLogin();
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <section className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-[34px] border border-[#EDE0D4] bg-white p-8 shadow-[0_30px_90px_rgba(0,0,0,0.18)] sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF0E5] text-[#6B3E26]">
            <Lock className="h-8 w-8" />
          </div>
          <h2 className="font-display text-4xl text-[#1A1A1A]">Admin Access</h2>
          <p className="mt-2 text-sm text-[#6D5A4B]">Secure login for store management.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
          <div>
            <label className="mb-1 block text-sm font-medium text-[#6B3E26]">Username</label>
            <input value={username} onChange={(event) => setUsername(event.target.value)} required className="w-full rounded-xl border border-[#E7D9CD] bg-[#FFF9F5] px-4 py-3 text-sm outline-none focus:border-[#C89B6D]" placeholder="Enter username" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[#6B3E26]">Password</label>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required className="w-full rounded-xl border border-[#E7D9CD] bg-[#FFF9F5] px-4 py-3 text-sm outline-none focus:border-[#C89B6D]" placeholder="Enter password" />
          </div>
          <PremiumButton className="w-full">Secure Login</PremiumButton>
        </form>
        <p className="mt-6 text-center text-xs text-[#A49184]">Protected Route • Authorized Personnel Only</p>
      </motion.div>
    </section>
  );
}

function AdminDashboard({ content, setContent, onLogout, orders, returns }: { content: StoreContent; setContent: React.Dispatch<React.SetStateAction<StoreContent>>; onLogout: () => void; orders: Order[]; returns: ReturnRequest[] }) {
  const [tab, setTab] = useState<"products" | "banners" | "orders" | "returns">("products");
  const blankProduct: Product = {
    id: `product-${Date.now()}`,
    title: "",
    department: "Women",
    category: "Kurtis",
    subcategory: "Women Wear",
    description: "",
    price: 1499,
    comparePrice: 2199,
    gallery: [womenImages[0], womenImages[1], womenImages[2]],
    colors: colorSets[0],
    sizes: sizeOptions,
    tags: ["New Arrivals"],
    badges: ["New Arrival"],
    createdAt: Date.now(),
    rating: 4.8,
    reviews: 120,
    stock: 10,
    visibility: {
      homepage: true,
      newArrivals: true,
      featured: true,
      bestSellers: true,
      active: true,
    },
  };
  const blankBanner: Banner = {
    id: `banner-${Date.now()}`,
    title: "New Banner",
    subtitle: "Edit this banner from the admin panel.",
    cta: "Shop Now",
    image: bannerImages[0],
    scope: "Collections",
    placement: "offer",
    order: content.banners.length + 1,
  };

  const [productForm, setProductForm] = useState<Product>(blankProduct);
  const [bannerForm, setBannerForm] = useState<Banner>(blankBanner);

  const productImageUpload = async (file: File, index: number) => {
    const dataUrl = await fileToDataUrl(file);
    setProductForm((current) => {
      const nextGallery = [...current.gallery];
      nextGallery[index] = dataUrl;
      return { ...current, gallery: nextGallery };
    });
  };

  const bannerImageUpload = async (file: File) => {
    const dataUrl = await fileToDataUrl(file);
    setBannerForm((current) => ({ ...current, image: dataUrl }));
  };

  return (
    <section className="px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-[1500px] space-y-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#8B5E3C]">Admin Dashboard</p>
            <h1 className="font-display text-4xl text-[#1A1A1A]">Content Management System</h1>
          </div>
          <div className="flex gap-3">
            <PremiumButton variant="secondary" onClick={onLogout}>Logout</PremiumButton>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <PremiumButton variant={tab === "products" ? "primary" : "secondary"} onClick={() => setTab("products")}>Products</PremiumButton>
          <PremiumButton variant={tab === "banners" ? "primary" : "secondary"} onClick={() => setTab("banners")}>Banners</PremiumButton>
          <PremiumButton variant={tab === "orders" ? "primary" : "secondary"} onClick={() => setTab("orders")}>Orders ({orders.length})</PremiumButton>
          <PremiumButton variant={tab === "returns" ? "primary" : "secondary"} onClick={() => setTab("returns")}>Returns ({returns.length})</PremiumButton>
          <PremiumButton variant="secondary" onClick={() => setContent(seedContent)}>Reset Demo Content</PremiumButton>
        </div>

        {tab === "products" && (
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="luxury-card rounded-[32px] p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-full bg-[#FFF0E5] p-3 text-[#6B3E26]"><Package className="h-5 w-5" /></div>
                <div><p className="text-xs uppercase tracking-[0.24em] text-[#8B5E3C]">Manage Products</p><h3 className="font-display text-3xl text-[#1A1A1A]">Product List</h3></div>
              </div>
              <div className="max-h-[780px] space-y-3 overflow-auto pr-1">
                {content.products.map((product) => (
                  <button type="button" key={product.id} onClick={() => setProductForm(product)} className="flex w-full items-center gap-4 rounded-[22px] border border-[#EDE0D4] bg-[#FFF9F5] p-3 text-left">
                    <MediaImage src={product.gallery[0]} alt={product.title} className="h-16 w-16 rounded-2xl object-cover" />
                    <div className="min-w-0 flex-1"><p className="truncate font-semibold text-[#1A1A1A]">{product.title}</p><p className="text-sm text-[#6D5A4B]">{product.department} • {product.category}</p></div>
                  </button>
                ))}
              </div>
            </div>

            <div className="luxury-card rounded-[32px] p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-full bg-[#FFF0E5] p-3 text-[#6B3E26]"><Settings2 className="h-5 w-5" /></div>
                <div><p className="text-xs uppercase tracking-[0.24em] text-[#8B5E3C]">Editor</p><h3 className="font-display text-3xl text-[#1A1A1A]">Product CMS Form</h3></div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={productForm.title} onChange={(event) => setProductForm((current) => ({ ...current, title: event.target.value }))} placeholder="Product Title" className="rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none sm:col-span-2" />
                <select value={productForm.department} onChange={(event) => setProductForm((current) => ({ ...current, department: event.target.value as Product["department"] }))} className="rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none">
                  <option>Women</option><option>Kids Boys</option><option>Kids Girls</option><option>Baby</option>
                </select>
                <input value={productForm.category} onChange={(event) => setProductForm((current) => ({ ...current, category: event.target.value }))} placeholder="Category" className="rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none" />
                <input value={String(productForm.price)} onChange={(event) => setProductForm((current) => ({ ...current, price: Number(event.target.value) }))} placeholder="Offer Price" className="rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none" />
                <input value={String(productForm.comparePrice)} onChange={(event) => setProductForm((current) => ({ ...current, comparePrice: Number(event.target.value) }))} placeholder="Original Price" className="rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none" />
                <input value={String(productForm.stock)} onChange={(event) => setProductForm((current) => ({ ...current, stock: Number(event.target.value) }))} placeholder="Stock Quantity" className="rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none" />
                <textarea value={productForm.description} onChange={(event) => setProductForm((current) => ({ ...current, description: event.target.value }))} placeholder="Description" className="min-h-28 rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none sm:col-span-2" />
                {productForm.gallery.map((image, index) => (
                  <div key={`${image}-${index}`} className="space-y-3 sm:col-span-2">
                    <input value={image} onChange={(event) => setProductForm((current) => { const g = [...current.gallery]; g[index] = event.target.value; return { ...current, gallery: g }; })} placeholder={`Image ${index + 1} URL`} className="w-full rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none" />
                    <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-[#C89B6D]/40 bg-[#FFF9F5] px-4 py-3 text-sm text-[#6B3E26]">
                      <Upload className="h-4 w-4" /> Upload Image {index + 1}
                      <input type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void productImageUpload(file, index); }} />
                    </label>
                  </div>
                ))}
                <input value={productForm.colors.map((c) => c.name).join(", ")} onChange={(event) => setProductForm((current) => ({ ...current, colors: event.target.value.split(",").map((n, i) => ({ name: n.trim(), swatch: current.colors[i]?.swatch ?? colorSets[0][i % 3].swatch })).filter((c) => c.name) }))} placeholder="Color names (comma separated)" className="rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none sm:col-span-2" />
                <input value={productForm.tags.join(", ")} onChange={(event) => setProductForm((current) => ({ ...current, tags: event.target.value.split(",").map((i) => i.trim()).filter(Boolean) }))} placeholder="Tags (comma separated)" className="rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none sm:col-span-2" />
                <input value={productForm.badges.join(", ")} onChange={(event) => setProductForm((current) => ({ ...current, badges: event.target.value.split(",").map((i) => i.trim()).filter(Boolean) }))} placeholder="Badges (comma separated)" className="rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none sm:col-span-2" />
                
                <div className="sm:col-span-2 rounded-xl border border-[#E7D9CD] bg-[#FFF9F5] p-4">
                  <p className="mb-3 text-sm font-semibold text-[#1A1A1A]">Visibility Settings</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex items-center gap-2 text-sm text-[#5F4B3D]"><input type="checkbox" checked={productForm.visibility.active} onChange={(e) => setProductForm(c => ({ ...c, visibility: { ...c.visibility, active: e.target.checked } }))} /> Active / Show Product</label>
                    <label className="flex items-center gap-2 text-sm text-[#5F4B3D]"><input type="checkbox" checked={productForm.visibility.homepage} onChange={(e) => setProductForm(c => ({ ...c, visibility: { ...c.visibility, homepage: e.target.checked } }))} /> Show on Homepage</label>
                    <label className="flex items-center gap-2 text-sm text-[#5F4B3D]"><input type="checkbox" checked={productForm.visibility.newArrivals} onChange={(e) => setProductForm(c => ({ ...c, visibility: { ...c.visibility, newArrivals: e.target.checked } }))} /> Show in New Arrivals</label>
                    <label className="flex items-center gap-2 text-sm text-[#5F4B3D]"><input type="checkbox" checked={productForm.visibility.featured} onChange={(e) => setProductForm(c => ({ ...c, visibility: { ...c.visibility, featured: e.target.checked } }))} /> Featured Product</label>
                    <label className="flex items-center gap-2 text-sm text-[#5F4B3D]"><input type="checkbox" checked={productForm.visibility.bestSellers} onChange={(e) => setProductForm(c => ({ ...c, visibility: { ...c.visibility, bestSellers: e.target.checked } }))} /> Show in Best Sellers</label>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <PremiumButton onClick={() => setContent((current) => { const exists = current.products.some((p) => p.id === productForm.id); const next = exists ? current.products.map((p) => p.id === productForm.id ? productForm : p) : [productForm, ...current.products]; return { ...current, products: next }; })}>Save Product</PremiumButton>
                <PremiumButton variant="secondary" onClick={() => setProductForm({ ...blankProduct, id: `product-${Date.now()}` })}>New Product</PremiumButton>
                <PremiumButton variant="ghost" onClick={() => { if(window.confirm("Are you sure you want to delete this product?")) setContent((current) => ({ ...current, products: current.products.filter((p) => p.id !== productForm.id) })) }}>Delete Product</PremiumButton>
              </div>
            </div>
          </div>
        )}

        {tab === "banners" && (
          <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
            <div className="luxury-card rounded-[32px] p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-full bg-[#FFF0E5] p-3 text-[#6B3E26]"><LayoutGrid className="h-5 w-5" /></div>
                <div><p className="text-xs uppercase tracking-[0.24em] text-[#8B5E3C]">Manage Banners</p><h3 className="font-display text-3xl text-[#1A1A1A]">Banner List</h3></div>
              </div>
              <div className="max-h-[780px] space-y-3 overflow-auto pr-1">
                {content.banners.map((banner) => (
                  <button key={banner.id} type="button" onClick={() => setBannerForm(banner)} className="flex w-full items-center gap-4 rounded-[22px] border border-[#EDE0D4] bg-[#FFF9F5] p-3 text-left">
                    <MediaImage src={banner.image} alt={banner.title} className="h-16 w-16 rounded-2xl object-cover" />
                    <div className="min-w-0 flex-1"><p className="truncate font-semibold text-[#1A1A1A]">{banner.title}</p><p className="text-sm text-[#6D5A4B]">{banner.placement} • {banner.scope}</p></div>
                  </button>
                ))}
              </div>
            </div>
            <div className="luxury-card rounded-[32px] p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-full bg-[#FFF0E5] p-3 text-[#6B3E26]"><ImagePlus className="h-5 w-5" /></div>
                <div><p className="text-xs uppercase tracking-[0.24em] text-[#8B5E3C]">Banner Editor</p><h3 className="font-display text-3xl text-[#1A1A1A]">Campaign CMS Form</h3></div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={bannerForm.title} onChange={(event) => setBannerForm((current) => ({ ...current, title: event.target.value }))} placeholder="Banner Title" className="rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none sm:col-span-2" />
                <textarea value={bannerForm.subtitle} onChange={(event) => setBannerForm((current) => ({ ...current, subtitle: event.target.value }))} placeholder="Banner Subtitle" className="min-h-28 rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none sm:col-span-2" />
                <input value={bannerForm.cta} onChange={(event) => setBannerForm((current) => ({ ...current, cta: event.target.value }))} placeholder="CTA Label" className="rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none" />
                <select value={bannerForm.scope} onChange={(event) => setBannerForm((current) => ({ ...current, scope: event.target.value as Scope }))} className="rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none">
                  {["All", "Women", "Kids", "Collections", "Wholesale", "Offers", "New Arrivals", "Best Sellers", "Festival Collection", "Wedding Collection", "Cotton Collection", "Trending Collection"].map((scope) => (<option key={scope}>{scope}</option>))}
                </select>
                <select value={bannerForm.placement} onChange={(event) => setBannerForm((current) => ({ ...current, placement: event.target.value as Banner["placement"] }))} className="rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none">
                  {["hero", "featured", "offer", "festival", "cotton", "trending", "wholesale", "category"].map((placement) => (<option key={placement}>{placement}</option>))}
                </select>
                <input value={String(bannerForm.order)} onChange={(event) => setBannerForm((current) => ({ ...current, order: Number(event.target.value) }))} placeholder="Display Order" className="rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none" />
                <input value={bannerForm.image} onChange={(event) => setBannerForm((current) => ({ ...current, image: event.target.value }))} placeholder="Banner Image URL" className="rounded-2xl border border-[#E7D9CD] px-4 py-3 text-sm outline-none sm:col-span-2" />
                <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-[#C89B6D]/40 bg-[#FFF9F5] px-4 py-3 text-sm text-[#6B3E26] sm:col-span-2">
                  <Upload className="h-4 w-4" /> Upload Banner Image
                  <input type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void bannerImageUpload(file); }} />
                </label>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <PremiumButton onClick={() => setContent((current) => { const exists = current.banners.some((b) => b.id === bannerForm.id); const next = exists ? current.banners.map((b) => b.id === bannerForm.id ? bannerForm : b) : [...current.banners, bannerForm]; return { ...current, banners: next }; })}>Save Banner</PremiumButton>
                <PremiumButton variant="secondary" onClick={() => setBannerForm({ ...blankBanner, id: `banner-${Date.now()}` })}>New Banner</PremiumButton>
                <PremiumButton variant="ghost" onClick={() => setContent((current) => ({ ...current, banners: current.banners.filter((b) => b.id !== bannerForm.id) }))}>Delete Banner</PremiumButton>
              </div>
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div className="luxury-card rounded-[32px] p-6">
            <h3 className="font-display text-3xl text-[#1A1A1A]">Order Management</h3>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[#EDE0D4] text-[#8B5E3C]">
                  <tr>
                    <th className="pb-3 pr-4">Order ID</th>
                    <th className="pb-3 pr-4">Date</th>
                    <th className="pb-3 pr-4">Customer</th>
                    <th className="pb-3 pr-4">Items</th>
                    <th className="pb-3 pr-4">Total</th>
                    <th className="pb-3 pr-4">Payment</th>
                    <th className="pb-3 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody className="text-[#5F4B3D]">
                  {orders.length === 0 ? (
                    <tr><td colSpan={7} className="py-8 text-center">No orders placed yet.</td></tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="border-b border-[#F3E7DC]">
                        <td className="py-4 pr-4 font-medium text-[#1A1A1A]">{order.id}</td>
                        <td className="py-4 pr-4">{order.date}</td>
                        <td className="py-4 pr-4">{order.customer.name}<br /><span className="text-xs text-[#A49184]">{order.customer.phone}</span></td>
                        <td className="py-4 pr-4">{order.items.map((i) => `${i.title} (x${i.quantity})`).join(", ")}</td>
                        <td className="py-4 pr-4 font-semibold text-[#1A1A1A]">{formatCurrency(order.total)}</td>
                        <td className="py-4 pr-4">{order.paymentMethod}</td>
                        <td className="py-4 pr-4">
                          <select 
                            defaultValue={order.status}
                            onChange={(e) => {
                              const newOrders = [...orders];
                              const idx = newOrders.findIndex(o => o.id === order.id);
                              if(idx !== -1) {
                                newOrders[idx].status = e.target.value as Order["status"];
                                saveOrders(newOrders);
                                // Force re-render is handled by parent state update ideally, but for localStorage we assume a refresh or better state management
                                window.location.reload(); 
                              }
                            }}
                            className="rounded-full border border-[#E7D9CD] bg-white px-2 py-1 text-xs"
                          >
                            <option>Pending</option>
                            <option>Confirmed</option>
                            <option>Shipped</option>
                            <option>Delivered</option>
                            <option>Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "returns" && (
          <div className="luxury-card rounded-[32px] p-6">
            <h3 className="font-display text-3xl text-[#1A1A1A]">Return Requests</h3>
            <div className="mt-6 space-y-4">
              {returns.length === 0 ? (
                <p className="py-8 text-center text-[#5F4B3D]">No return requests yet.</p>
              ) : (
                returns.map((ret) => (
                  <div key={ret.id} className="rounded-[22px] border border-[#EDE0D4] bg-[#FFF9F5] p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[#1A1A1A]">{ret.productTitle}</p>
                        <p className="text-sm text-[#6D5A4B]">Order ID: {ret.orderId}</p>
                      </div>
                      <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", ret.status === "Pending" ? "bg-yellow-100 text-yellow-800" : ret.status === "Approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}>
                        {ret.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[#5F4B3D]">Reason: {ret.reason}</p>
                    {ret.notes && <p className="mt-1 text-sm text-[#5F4B3D]">Notes: {ret.notes}</p>}
                    <div className="mt-3 flex gap-2">
                      {ret.status === "Pending" && (
                        <>
                          <button type="button" onClick={() => {
                            const newReturns = returns.map(r => r.id === ret.id ? { ...r, status: "Approved" as ReturnRequest["status"] } : r);
                            saveReturns(newReturns);
                            window.location.reload();
                          }} className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Approve</button>
                          <button type="button" onClick={() => {
                            const newReturns = returns.map(r => r.id === ret.id ? { ...r, status: "Rejected" as ReturnRequest["status"] } : r);
                            saveReturns(newReturns);
                            window.location.reload();
                          }} className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">Reject</button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// --- Search & QuickView Modals ---

function SearchModal({ open, onClose, query, setQuery, suggestions, results, onSelect }: { open: boolean; onClose: () => void; query: string; setQuery: (value: string) => void; suggestions: string[]; results: Product[]; onSelect: (product: Product) => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[125] bg-black/45 p-4 backdrop-blur" onClick={onClose}>
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 22 }} onClick={(event) => event.stopPropagation()} className="mx-auto mt-16 max-w-5xl rounded-[34px] bg-white p-6 shadow-[0_30px_90px_rgba(0,0,0,0.18)] sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div><p className="text-xs uppercase tracking-[0.3em] text-[#8B5E3C]">Smart Search</p><h3 className="font-display text-3xl text-[#1A1A1A]">Search premium fashion</h3></div>
              <button type="button" onClick={onClose} className="rounded-full border border-[#E7D9CD] p-2 text-[#6B3E26]"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-6 flex items-center gap-3 rounded-full border border-[#E7D9CD] bg-[#FFF9F5] px-5 py-4">
              <Search className="h-5 w-5 text-[#6B3E26]" />
              <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search kurtis, sarees, tops, kids party wear..." className="w-full bg-transparent text-sm outline-none placeholder:text-[#9B8B7F]" />
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {suggestions.map((item) => <button key={item} type="button" onClick={() => setQuery(item)} className="rounded-full border border-[#E7D9CD] px-4 py-2 text-sm text-[#6B3E26] transition hover:bg-[#FFF9F5]">{item}</button>)}
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.slice(0, 6).map((product) => (
                <button key={product.id} type="button" onClick={() => onSelect(product)} className="flex items-center gap-4 rounded-3xl border border-[#EDE0D4] bg-[#FFF9F5] p-3 text-left transition hover:bg-white">
                  <MediaImage src={product.gallery[0]} alt={product.title} className="h-20 w-20 rounded-2xl object-cover" />
                  <div className="min-w-0 flex-1"><p className="text-xs uppercase tracking-[0.24em] text-[#8B5E3C]">{product.category}</p><p className="font-display text-2xl text-[#1A1A1A]">{product.title}</p><p className="text-sm text-[#6D5A4B]">{formatCurrency(product.price)}</p></div>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function QuickViewModal({ product, onClose, onOpen, onAddToCart }: { product: Product | null; onClose: () => void; onOpen: (product: Product) => void; onAddToCart: (product: Product) => void }) {
  return (
    <AnimatePresence>
      {product && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[126] bg-black/55 p-4 backdrop-blur" onClick={onClose}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} onClick={(event) => event.stopPropagation()} className="mx-auto mt-12 grid max-w-5xl overflow-hidden rounded-[36px] bg-white shadow-[0_30px_90px_rgba(0,0,0,0.18)] lg:grid-cols-[1.02fr_0.98fr]">
            <div className="bg-[#F5ECE4] p-4"><MediaImage src={product.gallery[0]} alt={product.title} className="h-full w-full rounded-[28px] object-cover" /></div>
            <div className="space-y-6 p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div><p className="text-xs uppercase tracking-[0.28em] text-[#8B5E3C]">Quick View</p><h3 className="font-display text-4xl text-[#1A1A1A]">{product.title}</h3></div>
                <button type="button" onClick={onClose} className="rounded-full border border-[#E7D9CD] p-2 text-[#6B3E26]"><X className="h-5 w-5" /></button>
              </div>
              <Rating value={product.rating} reviews={product.reviews} />
              <p className="text-sm leading-7 text-[#5F4B3D]">{product.description}</p>
              <div className="flex items-center gap-3"><span className="text-2xl font-bold text-[#1A1A1A]">{formatCurrency(product.price)}</span><span className="text-sm text-[#A49184] line-through">{formatCurrency(product.comparePrice)}</span></div>
              <div className="grid gap-3 sm:grid-cols-2"><PremiumButton onClick={() => onAddToCart(product)}>Add To Cart</PremiumButton><PremiumButton variant="secondary" onClick={() => onOpen(product)}>View Product</PremiumButton></div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- Footer ---

function Footer({ onNavigate, onOpenScope }: { onNavigate: (page: Page) => void; onOpenScope: (scope: Scope, category?: string) => void }) {
  return (
    <footer className="border-t border-[#EDE0D4] bg-[#18110D] px-4 pb-28 pt-16 text-white sm:pb-16">
      <div className="mx-auto max-w-[1500px] space-y-12">
        <div className="grid gap-10 xl:grid-cols-[1.15fr_repeat(3,1fr)]">
          <div className="space-y-5">
            <LogoBlock compact />
            <p className="max-w-sm text-sm leading-7 text-white/72">{BRAND} delivers a premium fashion ecommerce experience for women wear, kids wear, wholesale buyers, and family fashion discovery.</p>
            <div className="flex items-center gap-3">
              <a href={socialLinks.facebook} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 p-3 text-white/75 transition hover:text-[#C89B6D]"><FacebookIcon className="h-4 w-4" /></a>
              <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 p-3 text-white/75 transition hover:text-[#C89B6D]"><InstagramIcon className="h-4 w-4" /></a>
              <a href={socialLinks.whatsapp} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 p-3 text-white/75 transition hover:text-[#C89B6D]"><WhatsAppIcon className="h-4 w-4" /></a>
            </div>
          </div>
          <FooterColumn title="Shop" links={[["Women", () => onOpenScope("Women")], ["Kids", () => onOpenScope("Kids")], ["New Arrivals", () => onOpenScope("New Arrivals")], ["Best Sellers", () => onOpenScope("Best Sellers")], ["Offers", () => onOpenScope("Offers")]]} />
          <FooterColumn title="Customer" links={[["About", () => onNavigate("about")], ["Contact", () => onNavigate("contact")], ["Wholesale", () => onNavigate("wholesale")], ["Returns", () => onNavigate("returns")], ["Return Policy", () => onNavigate("return-policy")]]} />
        </div>
        <div className="flex flex-col gap-4 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.24em] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {BRAND}. All Rights Reserved.</p>
          <p>Secure Payments • Easy Returns • Mobile First • OTP Login</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<[string, () => void]> }) {
  return (
    <div>
      <h3 className="font-display text-3xl text-white">{title}</h3>
      <div className="mt-4 space-y-3 text-sm text-white/72">
        {links.map(([label, action]) => <button type="button" key={label} onClick={action} className="block text-left transition hover:text-[#C89B6D]">{label}</button>)}
      </div>
    </div>
  );
}

function MobileBottomNav({ onNavigate, onOpenScope, onSearch }: { onNavigate: (page: Page) => void; onOpenScope: (scope: Scope) => void; onSearch: () => void }) {
  const items = [
    { label: "Home", icon: Home, action: () => onNavigate("home") },
    { label: "Categories", icon: Grid2x2, action: () => onOpenScope("Collections") },
    { label: "Search", icon: Search, action: onSearch },
    { label: "Wishlist", icon: Heart, action: () => onNavigate("account") },
    { label: "Account", icon: UserRound, action: () => onNavigate("account") },
  ];
  return (
    <div className="fixed inset-x-0 bottom-0 z-[95] border-t border-[#EDE0D4] bg-white/96 px-2 py-2 backdrop-blur xl:hidden">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => { const Icon = item.icon; return <button key={item.label} type="button" onClick={item.action} className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6D5A4B]"><Icon className="h-4 w-4 text-[#6B3E26]" />{item.label}</button>; })}
      </div>
    </div>
  );
}

// --- Main App Component ---

export default function App() {
  const [content, setContent] = useState<StoreContent>(() => getStoredContent());
  const [activePage, setActivePage] = useState<Page>("home");
  const [selectedProduct, setSelectedProduct] = useState<Product>(seedContent.products[0]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([seedContent.products[0].id]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [coupon, setCoupon] = useState("FAMILY15");
  const [couponApplied, setCouponApplied] = useState(true);
  const pendingActionRef = useRef<null | (() => void)>(null);
  const [filters, setFilters] = useState<Filters>({ scope: "Collections", category: "All", size: "All", color: "All", price: 4999, sort: "Newest", newArrivals: false, bestSellers: false, offers: false });
  const [orders, setOrders] = useState<Order[]>([]);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "", address: "", city: "", state: "", pincode: "", notes: "" });

  // --- Admin Auth Check & Routing ---
  useEffect(() => {
    const isAuth = sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
    setIsAdminAuth(isAuth);
    const path = window.location.pathname;
    if (path === "/admin") {
      setActivePage("admin");
    }
  }, []);

  // Load Orders & Returns
  useEffect(() => {
    setOrders(getOrders());
    setReturns(getReturns());
  }, []);

  // Auth Persistence
  useEffect(() => {
    const authData = localStorage.getItem(AUTH_KEY);
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        setIsLoggedIn(true);
        setCustomer(parsed);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CMS_KEY, JSON.stringify(content));
  }, [content]);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => setAnnouncementIndex((current) => (current + 1) % announcements.length), 2800);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => { updateMeta(activePage, selectedProduct); }, [activePage, selectedProduct]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  // --- Data Memos ---
  const heroBanners = useMemo(() => content.banners.filter((b) => b.placement === "hero").sort((a, b) => a.order - b.order), [content.banners]);
  const featuredBanners = useMemo(() => content.banners.filter((b) => b.placement === "featured").sort((a, b) => a.order - b.order), [content.banners]);
  const offerBanners = useMemo(() => content.banners.filter((b) => b.placement === "offer").sort((a, b) => a.order - b.order), [content.banners]);
  const festivalBanner = useMemo(() => content.banners.find((b) => b.placement === "festival"), [content.banners]);
  const cottonBanner = useMemo(() => content.banners.find((b) => b.placement === "cotton"), [content.banners]);
  const trendingBanner = useMemo(() => content.banners.find((b) => b.placement === "trending"), [content.banners]);
  const wholesaleBanner = useMemo(() => content.banners.find((b) => b.placement === "wholesale"), [content.banners]);

  const womenProducts = useMemo(() => content.products.filter((p) => p.department === "Women" && p.visibility.active).sort((a, b) => b.createdAt - a.createdAt).slice(0, 8), [content.products]);
  const kidsProducts = useMemo(() => content.products.filter((p) => p.department !== "Women" && p.visibility.active).sort((a, b) => b.createdAt - a.createdAt).slice(0, 8), [content.products]);
  const festivalProducts = useMemo(() => content.products.filter((p) => p.tags.includes("Festival Collection") && p.visibility.active).sort((a, b) => b.createdAt - a.createdAt).slice(0, 8), [content.products]);
  const cottonProducts = useMemo(() => content.products.filter((p) => p.tags.includes("Cotton Collection") && p.visibility.active).sort((a, b) => b.createdAt - a.createdAt).slice(0, 8), [content.products]);
  const trendingProducts = useMemo(() => content.products.filter((p) => p.tags.includes("Trending Collection") && p.visibility.active).sort((a, b) => b.createdAt - a.createdAt).slice(0, 8), [content.products]);
  const bestSellers = useMemo(() => content.products.filter((p) => p.tags.includes("Best Sellers") && p.visibility.active).sort((a, b) => b.createdAt - a.createdAt).slice(0, 8), [content.products]);

  const searchSuggestions = useMemo(() => {
    const base = ["Kurtis", "Sarees", "Cotton Collection", "Festival Collection", "Wedding Collection", "Kids Party Wear", "New Arrivals"];
    if (!searchQuery.trim()) return base;
    return base.filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return content.products.slice(0, 6);
    return content.products.filter((p) => p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query) || p.tags.some((t) => t.toLowerCase().includes(query)));
  }, [content.products, searchQuery]);

  const visibleProducts = useMemo(() => {
    let list = [...content.products].filter(p => p.visibility.active);
    if (filters.scope === "Women") list = list.filter((p) => p.department === "Women");
    if (filters.scope === "Kids") list = list.filter((p) => p.department !== "Women");
    if (filters.scope === "New Arrivals") list = list.filter((p) => p.tags.includes("New Arrivals") || p.visibility.newArrivals);
    if (filters.scope === "Best Sellers") list = list.filter((p) => p.tags.includes("Best Sellers") || p.visibility.bestSellers);
    if (filters.scope === "Festival Collection") list = list.filter((p) => p.tags.includes("Festival Collection"));
    if (filters.scope === "Wedding Collection") list = list.filter((p) => p.tags.includes("Wedding Collection"));
    if (filters.scope === "Cotton Collection") list = list.filter((p) => p.tags.includes("Cotton Collection"));
    if (filters.scope === "Trending Collection") list = list.filter((p) => p.tags.includes("Trending Collection"));
    if (filters.scope === "Offers") list = list.filter((p) => p.tags.includes("Offers"));

    if (filters.category !== "All") list = list.filter((p) => p.category === filters.category);
    if (filters.size !== "All") list = list.filter((p) => p.sizes.includes(filters.size));
    if (filters.color !== "All") list = list.filter((p) => p.colors.some((c) => c.name === filters.color));
    list = list.filter((p) => p.price <= filters.price);
    if (filters.newArrivals) list = list.filter((p) => p.tags.includes("New Arrivals"));
    if (filters.bestSellers) list = list.filter((p) => p.tags.includes("Best Sellers"));
    if (filters.offers) list = list.filter((p) => p.tags.includes("Offers"));

    switch (filters.sort) {
      case "Best Selling": list.sort((a, b) => b.reviews - a.reviews); break;
      case "Price Low To High": list.sort((a, b) => a.price - b.price); break;
      case "Price High To Low": list.sort((a, b) => b.price - a.price); break;
      default: list.sort((a, b) => b.createdAt - a.createdAt);
    }
    return list;
  }, [content.products, filters]);

  const cartDetailed = useMemo(() => cart.map((item) => ({ ...item, product: content.products.find((p) => p.id === item.productId) })).filter((item): item is CartItem & { product: Product } => Boolean(item.product)), [cart, content.products]);
  const wishlistProducts = useMemo(() => content.products.filter((p) => wishlist.includes(p.id)), [content.products, wishlist]);
  const relatedProducts = useMemo(() => content.products.filter((p) => p.category === selectedProduct.category && p.id !== selectedProduct.id).slice(0, 4), [content.products, selectedProduct]);
  const recentProducts = useMemo(() => content.products.filter((p) => recentlyViewed.includes(p.id) && p.id !== selectedProduct.id).slice(0, 4), [content.products, recentlyViewed, selectedProduct]);

  const subtotal = cartDetailed.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = couponApplied ? Math.round(subtotal * 0.15) : 0;
  const shipping = subtotal > 999 ? 0 : subtotal === 0 ? 0 : 99;
  const total = subtotal - discount + shipping;

  // --- Actions ---

  function showToast(message: string) { setToast(message); }

  function requireAuth(action: () => void, reason: string) {
    if (!isLoggedIn) {
      pendingActionRef.current = action;
      showToast(reason);
      return;
    }
    action();
  }

  function completeLogin(method: "Mobile OTP" | "Google" | "Email", userData = customer) {
    setIsLoggedIn(true);
    setCustomer(userData);
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
    showToast(`${method} login successful`);
    const pending = pendingActionRef.current;
    pendingActionRef.current = null;
    pending?.();
  }

  function navigate(page: Page) {
    setActivePage(page);
    if (page === "admin") {
      window.history.pushState({}, "", "/admin");
    } else {
      window.history.pushState({}, "", "/");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openScope(scope: Scope, category = "All") {
    setFilters((current) => ({ ...current, scope, category }));
    navigate("listing");
  }

  function openProduct(product: Product) {
    setSelectedProduct(product);
    navigate("product");
    setQuickView(null);
    setRecentlyViewed((current) => [product.id, ...current.filter((id) => id !== product.id)].slice(0, 8));
  }

  function toggleWishlist(productId: string) {
    requireAuth(() => {
      setWishlist((current) => current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]);
      showToast(wishlist.includes(productId) ? "Removed from wishlist" : "Added to wishlist");
    }, "Please login to save styles in your wishlist.");
  }

  function addToCart(product: Product, size = sizeOptions[2], color = product.colors[0].name, qty = 1) {
    requireAuth(() => {
      setCart((current) => {
        const existing = current.find((item) => item.productId === product.id && item.size === size && item.color === color);
        if (existing) return current.map((item) => item.productId === product.id && item.size === size && item.color === color ? { ...item, quantity: item.quantity + qty } : item);
        return [...current, { productId: product.id, quantity: qty, size, color }];
      });
      showToast(`${product.title} added to cart`);
    }, "Please login before adding products to cart.");
  }

  function buyNow(product: Product, size: string, color: string, qty: number) {
    requireAuth(() => {
      setCart((current) => {
        const existing = current.find((item) => item.productId === product.id && item.size === size && item.color === color);
        if (existing) return current.map((item) => item.productId === product.id && item.size === size && item.color === color ? { ...item, quantity: item.quantity + qty } : item);
        return [...current, { productId: product.id, quantity: qty, size, color }];
      });
      navigate("checkout");
    }, "Please login to continue with Buy Now.");
  }

  function applyCoupon() {
    const normalized = coupon.trim().toUpperCase();
    if (normalized === "FAMILY15" || normalized === "FESTIVE15") {
      setCouponApplied(true);
      showToast("Premium discount applied");
    } else {
      setCouponApplied(false);
      showToast("Invalid coupon code");
    }
  }

  async function handleOrderConfirmation(method: Order["paymentMethod"]) {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      customer: customer,
      items: cartDetailed.map(item => ({ title: item.product.title, quantity: item.quantity, price: item.product.price, size: item.size, color: item.color })),
      total,
      paymentMethod: method,
      status: "Pending",
      address: customer.address,
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode,
      notes: customer.notes,
    };

    // 1. Save Order
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    saveOrders(updatedOrders);

    // 2. Google Sheets Integration (Automatic)
    // Note: In production, replace this URL with your Google Apps Script Web App URL
    try {
      const scriptUrl = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";
      if (scriptUrl !== "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL") {
        await fetch(scriptUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: newOrder.id,
            date: newOrder.date,
            name: newOrder.customer.name,
            phone: newOrder.customer.phone,
            email: newOrder.customer.email,
            products: newOrder.items.map(i => `${i.title} (x${i.quantity})`).join(", "),
            quantity: newOrder.items.reduce((sum, i) => sum + i.quantity, 0),
            amount: newOrder.total,
            payment: newOrder.paymentMethod,
            address: `${newOrder.address}, ${newOrder.city}, ${newOrder.state}, ${newOrder.pincode}`,
            status: newOrder.status,
          }),
        });
      }
    } catch (e) {
      // Silent fail for demo
    }

    // 3. Email Notification (mailto)
    const mailBody = `New Order Placed: ${newOrder.id}%0ACustomer: ${customer.name}%0APhone: ${customer.phone}%0ATotal: ₹${total}%0APayment: ${method}`;
    window.open(`mailto:Yuvavishnu2426@gmail.com?subject=New Order ${newOrder.id}&body=${mailBody}`, "_blank");

    // 4. WhatsApp Notification (wa.me)
    const waBody = `*New Order Alert!*%0AOrder ID: ${newOrder.id}%0ACustomer: ${customer.name}%0APhone: ${customer.phone}%0AItems:%0A${cartDetailed.map(i => `- ${i.product.title} (${i.size}, ${i.color}) x${i.quantity}`).join("%0A")}%0ATotal: ₹${total}%0APayment: ${method}`;
    window.open(`https://wa.me/${BUSINESS_PHONE}?text=${waBody}`, "_blank");

    // 5. Clear Cart
    setCart([]);
    
    // 6. Show Success
    showToast("Order Placed Successfully! Redirecting to confirmation...");
    setTimeout(() => {
      alert(`✅ Order Placed!\n\nOrder ID: ${newOrder.id}\nTotal: ${formatCurrency(newOrder.total)}\nPayment: ${method}\n\nThank you for shopping with JEEV RUTHI COLLECTION.`);
      navigate("home");
    }, 1500);
  }

  function handleUPIPayment() {
    // UPI Intent for Mobile
    const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(BRAND)}&am=${total}&cu=INR&tn=Order-${Date.now()}`;
    window.location.href = upiLink;
    // Fallback for desktop / verification
    setTimeout(() => {
      if (window.confirm("Did you complete the UPI payment?")) {
        handleOrderConfirmation("UPI");
      }
    }, 5000);
  }

  function handleRazorpayPayment() {
    // Razorpay Integration
    // Note: In production, replace 'rzp_test_...' with your live Key ID
    const options = {
      key: "rzp_test_1234567890", // Replace with actual Key ID
      amount: total * 100,
      currency: "INR",
      name: BRAND,
      description: "Premium Fashion Purchase",
      handler: function (_response: any) {
        handleOrderConfirmation("Razorpay");
      },
      prefill: {
        name: customer.name,
        email: customer.email,
        contact: customer.phone,
      },
      theme: {
        color: "#8B5E3C",
      },
    };
    
    // Check if Razorpay is loaded (requires script injection)
    // For demo, we simulate success if script is not present
    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      // Simulation for environments without Razorpay script
      if (window.confirm("Razorpay script not loaded. Simulate successful payment?")) {
        handleOrderConfirmation("Razorpay");
      }
    }
  }

  const homeContent = (
    <>
      <HeroSlider slides={heroBanners} onOpenScope={(scope) => openScope(scope)} />
      <CategoryCircles onOpen={openScope} />
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-[1500px] space-y-10">
          <SectionHeading eyebrow="Featured Collections" title="Professional collection cards with consistent premium proportions" description="Uniform campaign cards, equal spacing, premium fashion photography, and collection storytelling." />
          <div className="grid gap-6 lg:grid-cols-3">
            {featuredBanners.map((banner, index) => (
              <Reveal key={banner.id} delay={index * 0.05}><CampaignCard banner={banner} onClick={() => banner.scope === "Wholesale" ? navigate("wholesale") : openScope(banner.scope)} /></Reveal>
            ))}
          </div>
        </div>
      </section>
      <CollectionSection eyebrow="Women's Collection" title="Elevated women's fashion with premium ethnic and modern edits" description="Browse structured product cards with consistent image ratios and cleaner spacing." products={womenProducts} wishlist={wishlist} onOpenProduct={openProduct} onWishlist={toggleWishlist} onQuickView={setQuickView} onAddToCart={(product) => addToCart(product)} onExplore={() => openScope("Women")} />
      <CollectionSection eyebrow="Kids Collection" title="Premium kids fashion for partywear, festive, and family celebrations" description="Touch-friendly browsing and consistent product grids across boys, girls, and baby collections." products={kidsProducts} wishlist={wishlist} onOpenProduct={openProduct} onWishlist={toggleWishlist} onQuickView={setQuickView} onAddToCart={(product) => addToCart(product)} onExplore={() => openScope("Kids")} />
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-[1500px] space-y-10">
          <SectionHeading eyebrow="Offer Sections" title="Luxury offer banners with improved visual quality and spacing" description="Large campaign-led offer presentation with consistent cards and refined spacing." />
          <div className="grid gap-6 lg:grid-cols-3">
            {offerBanners.map((banner, index) => (
              <Reveal key={banner.id} delay={index * 0.05}><CampaignCard banner={banner} onClick={() => openScope(banner.scope)} /></Reveal>
            ))}
          </div>
        </div>
      </section>
      {festivalBanner && (
        <section className="px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-[1500px] space-y-10">
            <CampaignCard banner={festivalBanner} onClick={() => openScope(festivalBanner.scope)} tall />
            <CollectionSection eyebrow="Festival Collection" title="Premium festive dressing with stronger hierarchy" description="Improved banner presentation and polished festive product discovery." products={festivalProducts} wishlist={wishlist} onOpenProduct={openProduct} onWishlist={toggleWishlist} onQuickView={setQuickView} onAddToCart={(product) => addToCart(product)} onExplore={() => openScope("Festival Collection")} />
          </div>
        </section>
      )}
      {cottonBanner && (
        <section className="px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-[1500px] space-y-10">
            <CampaignCard banner={cottonBanner} onClick={() => openScope(cottonBanner.scope)} tall />
            <CollectionSection eyebrow="Cotton Collection" title="Soft breathable premium cotton edits" description="A refined presentation for cotton-led seasonal styles." products={cottonProducts} wishlist={wishlist} onOpenProduct={openProduct} onWishlist={toggleWishlist} onQuickView={setQuickView} onAddToCart={(product) => addToCart(product)} onExplore={() => openScope("Cotton Collection")} />
          </div>
        </section>
      )}
      {trendingBanner && (
        <section className="px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-[1500px] space-y-10">
            <CampaignCard banner={trendingBanner} onClick={() => openScope(trendingBanner.scope)} tall />
            <CollectionSection eyebrow="Trending Collection" title="Newest premium styles shown first for stronger discovery" description="Newest items prioritized with consistent product cards." products={trendingProducts} wishlist={wishlist} onOpenProduct={openProduct} onWishlist={toggleWishlist} onQuickView={setQuickView} onAddToCart={(product) => addToCart(product)} onExplore={() => openScope("Trending Collection")} />
          </div>
        </section>
      )}
      <CollectionSection eyebrow="Best Sellers" title="Best-selling product cards with unified sizing and premium feel" description="Standardized product card dimensions and responsive spacing." products={bestSellers} wishlist={wishlist} onOpenProduct={openProduct} onWishlist={toggleWishlist} onQuickView={setQuickView} onAddToCart={(product) => addToCart(product)} onExplore={() => openScope("Best Sellers")} />
      {wholesaleBanner && (
        <section className="px-4 py-16 sm:py-20"><div className="mx-auto max-w-[1500px]"><CampaignCard banner={wholesaleBanner} onClick={() => navigate("wholesale")} tall /></div></section>
      )}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-[1500px] space-y-10">
          <SectionHeading eyebrow="Customer Reviews" title="Premium trust storytelling with strong social proof" description="Luxury presentation and spacious cards." />
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { name: "Retail Buyer", title: "Chennai Customer", quote: "The mobile experience feels polished, premium, and very easy to browse.", image: bannerImages[0] },
              { name: "Family Shopper", title: "Festive Purchase", quote: "Women and kids products are easier to compare now. Product pages feel professional.", image: bannerImages[6] },
              { name: "Dealer Partner", title: "Wholesale Buyer", quote: "The wholesale section looks stronger and more trustworthy. A premium ecommerce platform.", image: bannerImages[5] },
            ].map((item, index) => (
              <Reveal key={item.name} delay={index * 0.05}>
                <div className="luxury-card overflow-hidden rounded-[32px]">
                  <MediaImage src={item.image} alt={item.name} className="aspect-[4/3] w-full object-cover" />
                  <div className="space-y-4 p-6">
                    <div><h3 className="font-display text-3xl text-[#1A1A1A]">{item.name}</h3><p className="text-sm text-[#6D5A4B]">{item.title}</p></div>
                    <div className="flex items-center gap-1 text-[#8B5E3C]">{Array.from({ length: 5 }).map((_, starIndex) => <Star key={starIndex} className="h-4 w-4 fill-current" />)}</div>
                    <p className="text-sm leading-7 text-[#5F4B3D]">"{item.quote}"</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-[1500px] space-y-10">
          <SectionHeading eyebrow="Instagram Feed" title="Premium social presentation across fashion and family styling" description="A cleaner social block with responsive image cards." />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {womenImages.slice(0, 6).map((image, index) => (
              <motion.a key={image} href={socialLinks.instagram} target="_blank" rel="noreferrer" whileHover={{ y: -6 }} className={cn("group relative overflow-hidden rounded-[28px]", index === 0 ? "col-span-2 row-span-2 aspect-square lg:aspect-auto" : "aspect-square")}>
                <MediaImage src={image} alt={`${BRAND} social`} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] opacity-0 transition group-hover:opacity-100">
                  <InstagramIcon className="h-3.5 w-3.5 text-[#6B3E26]" /> @yuva.priya.92351
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-[1500px] space-y-10">
          <SectionHeading eyebrow="Why Choose Us" title="Mobile-first premium experience with stronger trust features" description="A better responsive experience across product pages, filters, checkout, and navigation." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Open Daily 10 AM – 10 PM", "Secure Payments", "Easy Returns", "Fast Mobile Browsing", "Premium Quality", "Wholesale Support", "Touch Friendly Navigation", "Accurate Filters"].map((item, index) => (
              <Reveal key={item} delay={index * 0.04}>
                <div className="luxury-card flex items-center gap-4 rounded-[26px] p-5">
                  <div className="rounded-full bg-[#FFF0E5] p-3 text-[#6B3E26]"><BadgeCheck className="h-5 w-5" /></div>
                  <p className="font-semibold text-[#1A1A1A]">{item}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-[1500px] space-y-10">
          <SectionHeading eyebrow="Shop With Us Anywhere" title="Multiple shopping paths with one premium brand experience" description="Website, WhatsApp, store visit, and wholesale touchpoints." />
          <div className="grid gap-6 lg:grid-cols-4">
            {[
              { title: "Website Shopping", copy: "Full responsive ecommerce browsing with clean collection discovery.", icon: ShoppingBag },
              { title: "WhatsApp Shopping", copy: "Ask for photos, sizing help, and fast product support.", icon: MessageCircle },
              { title: "Store Visit", copy: "Visit the Chennai store for family fashion and guided shopping.", icon: Store },
              { title: "Wholesale Buying", copy: "Dealer, reseller, and GST-friendly sourcing support.", icon: LayoutGrid },
            ].map((card, index) => {
              const Icon = card.icon;
              return (
                <Reveal key={card.title} delay={index * 0.05}>
                  <motion.div whileHover={{ y: -8 }} className="luxury-card rounded-[32px] p-6">
                    <div className="w-fit rounded-full bg-[#FFF0E5] p-3 text-[#6B3E26]"><Icon className="h-6 w-6" /></div>
                    <h3 className="mt-5 font-display text-3xl text-[#1A1A1A]">{card.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#5F4B3D]">{card.copy}</p>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-[1500px] overflow-hidden rounded-[38px] border border-[#EDE0D4] bg-[#FFF9F5]">
          <div className="grid gap-8 xl:grid-cols-[1fr_0.95fr] xl:items-center">
            <div className="p-8 sm:p-10 lg:p-12">
              <SectionHeading eyebrow="Store Visit" title={`Visit ${BRAND} in Chennai`} description="A premium location section with updated store timing, maps integration, and better hierarchy." />
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div className="rounded-[26px] border border-[#EDE0D4] bg-white p-5"><p className="text-xs uppercase tracking-[0.24em] text-[#8B5E3C]">Location</p><p className="mt-3 text-sm leading-7 text-[#5F4B3D]">{STORE_ADDRESS.join(" ")}</p></div>
                <div className="rounded-[26px] border border-[#EDE0D4] bg-white p-5"><p className="text-xs uppercase tracking-[0.24em] text-[#8B5E3C]">Store Timing</p><p className="mt-3 text-sm leading-7 text-[#5F4B3D]">{STORE_TIMING}</p></div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <PremiumButton onClick={() => window.open(socialLinks.phone, "_self")}>Call Now</PremiumButton>
                <PremiumButton variant="secondary" onClick={() => window.open(socialLinks.whatsapp, "_blank")}>WhatsApp Now</PremiumButton>
                <PremiumButton variant="secondary" onClick={() => window.open(STORE_MAP_LINK, "_blank")}>Open Google Maps</PremiumButton>
              </div>
            </div>
            <div className="space-y-4 p-4 sm:p-6">
              <MediaImage src={bannerImages[5]} alt={`${BRAND} store`} className="h-64 w-full rounded-[30px] object-cover lg:h-80" />
              <div className="overflow-hidden rounded-[30px] border border-[#EDE0D4]"><iframe title={`${BRAND} store map`} src={STORE_MAP_EMBED} className="h-64 w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 pb-24 pt-16 sm:pb-28 sm:pt-20">
        <div className="mx-auto max-w-6xl rounded-[38px] border border-[#EDE0D4] bg-white p-8 text-center shadow-[0_24px_70px_rgba(17,17,17,0.08)] sm:p-12">
          <div className="mx-auto max-w-3xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#8B5E3C]">Newsletter</p>
            <h3 className="font-display text-5xl leading-none text-[#1A1A1A]">Get first access to premium launches and featured updates</h3>
            <p className="text-sm leading-7 text-[#5F4B3D] sm:text-base">Stay updated on offers, collections, and brand campaigns.</p>
          </div>
          <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 rounded-full border border-[#E7D9CD] bg-[#FFF9F5] p-2 sm:flex-row">
            <input type="email" placeholder="Enter your email" className="flex-1 bg-transparent px-4 py-3 text-sm outline-none" />
            <PremiumButton>Subscribe Now</PremiumButton>
          </div>
        </div>
      </section>
    </>
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#1A1A1A]">
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.45 } }} className="fixed inset-0 z-[140] flex items-center justify-center bg-[#120C09]">
            <div className="space-y-8 text-center">
              <motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} className="mx-auto w-fit"><img src="/jr-logo.svg" alt={`${BRAND} logo`} className="h-36 w-auto" /></motion.div>
              <div className="space-y-3"><p className="font-display text-4xl tracking-[0.22em] text-white">{BRAND}</p><p className="text-xs uppercase tracking-[0.44em] text-[#C89B6D]">Loading a premium fashion experience</p></div>
              <div className="mx-auto h-1.5 w-72 overflow-hidden rounded-full bg-white/10"><motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }} className="h-full w-32 rounded-full bg-gradient-to-r from-[#6B3E26] via-[#8B5E3C] to-[#C89B6D]" /></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -12, x: 20 }} animate={{ opacity: 1, y: 0, x: 0 }} exit={{ opacity: 0, y: -12, x: 20 }} className="fixed right-4 top-24 z-[132] rounded-2xl border border-[#E7D9CD] bg-white px-4 py-3 text-sm font-semibold text-[#6B3E26] shadow-[0_24px_60px_rgba(17,17,17,0.12)]">{toast}</motion.div>
        )}
      </AnimatePresence>

      <Header announcement={announcements[announcementIndex]} activePage={activePage} cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} wishlistCount={wishlist.length} onNavigate={navigate} onOpenScope={openScope} onOpenSearch={() => setSearchOpen(true)} isLoggedIn={isLoggedIn} />

      <AnimatePresence mode="wait">
        <motion.main key={activePage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
          {activePage === "home" && homeContent}
          {activePage === "listing" && (
            <ListingPage filters={filters} setFilters={setFilters} products={visibleProducts} allProducts={content.products} wishlist={wishlist} onOpenProduct={openProduct} onWishlist={toggleWishlist} onQuickView={setQuickView} onAddToCart={(product) => addToCart(product)} />
          )}
          {activePage === "product" && (
            <ProductDetailPage product={selectedProduct} related={relatedProducts} recent={recentProducts} onBack={() => navigate("listing")} onAddToCart={(size, color, qty) => addToCart(selectedProduct, size, color, qty)} onBuyNow={(size, color, qty) => buyNow(selectedProduct, size, color, qty)} onWishlist={() => toggleWishlist(selectedProduct.id)} wishlisted={wishlist.includes(selectedProduct.id)} onOpenProduct={openProduct} onReturn={(orderId) => { setCustomer(c => ({...c, notes: `Return for Order ${orderId}` })); navigate("returns"); }} />
          )}
          {activePage === "cart" && (
            <CartPage items={cartDetailed} coupon={coupon} setCoupon={setCoupon} discount={discount} subtotal={subtotal} shipping={shipping} total={total} onApplyCoupon={applyCoupon} onUpdateQty={(item, quantity) => setCart((current) => current.map((entry) => entry.productId === item.productId && entry.size === item.size && entry.color === item.color ? { ...entry, quantity } : entry))} onRemove={(item) => setCart((current) => current.filter((entry) => !(entry.productId === item.productId && entry.size === item.size && entry.color === item.color)))} onContinue={() => openScope("Collections")} onCheckout={() => requireAuth(() => navigate("checkout"), "Please login to proceed to checkout.")} />
          )}
          {activePage === "checkout" && (
            <CheckoutPage 
              isLoggedIn={isLoggedIn} 
              items={cartDetailed} 
              subtotal={subtotal} 
              discount={discount} 
              shipping={shipping} 
              total={total} 
              onRequireLogin={() => showToast("Please login to continue to checkout.")} 
              onPay={(method) => {
                if (method === "COD") handleOrderConfirmation("COD");
                else if (method === "UPI") handleUPIPayment();
                else if (method === "Razorpay") handleRazorpayPayment();
              }} 
              customer={customer} 
            />
          )}
          {activePage === "account" && (
            <AccountPage isLoggedIn={isLoggedIn} onLogin={completeLogin} wishlist={wishlistProducts} recentOrders={cartDetailed} onOpenProduct={openProduct} />
          )}
          {activePage === "wholesale" && <WholesalePage />}
          {activePage === "about" && <AboutPage />}
          {activePage === "contact" && <ContactPage />}
          {activePage === "returns" && <ReturnRequestPage onSubmit={(req) => { saveReturns([...returns, req]); setReturns([...returns, req]); showToast("Return request submitted successfully!"); navigate("account"); }} />}
          {activePage === "return-policy" && <ReturnPolicyPage />}
          {activePage === "admin" && (
            isAdminAuth ? (
              <AdminDashboard content={content} setContent={setContent} onLogout={() => { setIsAdminAuth(false); sessionStorage.removeItem(ADMIN_SESSION_KEY); navigate("home"); }} orders={orders} returns={returns} />
            ) : (
              <AdminLoginPage onLogin={() => { setIsAdminAuth(true); sessionStorage.setItem(ADMIN_SESSION_KEY, "true"); }} />
            )
          )}
        </motion.main>
      </AnimatePresence>

      <Footer onNavigate={navigate} onOpenScope={openScope} />
      <MobileBottomNav onNavigate={navigate} onOpenScope={(scope) => openScope(scope)} onSearch={() => setSearchOpen(true)} />

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} query={searchQuery} setQuery={setSearchQuery} suggestions={searchSuggestions} results={searchResults} onSelect={openProduct} />
      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} onOpen={openProduct} onAddToCart={(product) => addToCart(product)} />

      <a href={socialLinks.whatsapp} target="_blank" rel="noreferrer" className="fixed bottom-36 right-4 z-40 flex items-center gap-3 rounded-full bg-[#6B3E26] px-4 py-3 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(17,17,17,0.18)] transition hover:-translate-y-1">
        <WhatsAppIcon className="h-5 w-5 text-[#F6DCC1]" />
        WhatsApp Support
      </a>
    </div>
  );
}

import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Boxes,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Coins,
  Copy,
  Crown,

  Filter,
  Gamepad2,
  KeyRound,
  Layers3,
  LayoutGrid,
  ListFilter,
  Lock,
  MessageSquare,
  Music,
  Pause,
  Play,
  Quote,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tv,
  UtensilsCrossed,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import digitalCollection from "@/assets/digital-collection.jpg";
import {
  fetchResellerProducts,
  createResellerOrder,
  STORE_CATEGORIES,
  type ResellerProduct,
  type ResellerVariant,
  type OrderResult,
  type StoreCategory,
} from "@/lib/reseller-api";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  loadRazorpayScript,
} from "@/lib/razorpay";


function getCategoryIcon(cat: string) {
  switch (cat) {
    case "Streaming":
      return <Tv className="size-4" />;
    case "AI Tools":
      return <Bot className="size-4" />;
    case "VPN & Security":
      return <ShieldCheck className="size-4" />;
    case "Music & Education":
      return <Music className="size-4" />;
    case "Software":
      return <Layers3 className="size-4" />;
    case "Food & Discounts":
      return <UtensilsCrossed className="size-4" />;
    case "Gaming":
      return <Gamepad2 className="size-4" />;
    case "Discord":
      return <MessageSquare className="size-4" />;
    default:
      return <KeyRound className="size-4" />;
  }
}

function ProductCard({
  product,
  onOrder,
}: {
  product: ResellerProduct;
  onOrder: (p: ResellerProduct) => void;
}) {
  const hasVariants = product.variants.length > 0;
  const minPrice = hasVariants
    ? Math.min(...product.variants.map((v) => v.retail_price))
    : product.retail_price;
  const maxPrice = hasVariants
    ? Math.max(...product.variants.map((v) => v.retail_price))
    : product.retail_price;

  const versionCount = product.variants.length || 1;
  const versionText = `${versionCount} ${versionCount === 1 ? "version" : "versions"}`;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/[0.08] bg-[#0c0e10] transition-all duration-300 hover:-translate-y-1 hover:border-[#22c55e]/50 hover:bg-[#111416] hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
      {/* Top Image Container matching Supreme Market */}
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-[1.42] w-full overflow-hidden bg-black/60"
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/[0.05] to-white/[0.02]">
            <Gamepad2 className="size-10 text-white/20" />
          </div>
        )}

        {/* Top-Left Version Badge */}
        <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-md border border-white/10 bg-black/80 px-2 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-md">
          <Layers3 className="size-3 text-[#22c55e]" />
          <span>{versionText}</span>
        </div>

        {/* Top-Right 5.0 Star Badge */}
        <div className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-md border border-white/10 bg-black/80 px-2 py-0.5 text-[11px] font-semibold text-amber-400 backdrop-blur-md">
          <Sparkles className="size-3" />
          <span>5.0</span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-4.5">
        <div>
          {/* Category */}
          <span className="text-[11px] font-medium tracking-wide text-white/50">
            {product.category}
          </span>

          {/* Title */}
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="mt-1 block"
          >
            <h3 className="line-clamp-1 font-heading text-[15px] font-bold text-white transition-colors group-hover:text-[#22c55e]">
              {product.name}
            </h3>
          </Link>

          {/* Stock info */}
          <div className="mt-1.5 flex items-center gap-1.5 text-[12px]">
            {product.inStock ? (
              <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                {product.totalStockCount >= 999
                  ? "In stock"
                  : `${product.totalStockCount} in stock`}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 font-medium text-amber-400">
                <span className="size-1.5 rounded-full bg-amber-400" />
                Preorder
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-3.5">
          <div>
            {hasVariants && minPrice !== maxPrice ? (
              <p className="flex items-baseline gap-1">
                <span className="text-[12px] text-white/50">from</span>
                <span className="font-display text-lg font-bold tracking-tight text-white">
                  ₹{minPrice.toLocaleString("en-IN")}
                </span>
              </p>
            ) : (
              <p className="font-display text-lg font-bold tracking-tight text-white">
                ₹{minPrice.toLocaleString("en-IN")}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 rounded-lg border-white/12 px-2.5 text-xs text-white/80 hover:bg-white/10 hover:text-white"
            >
              <Link to="/product/$slug" params={{ slug: product.slug }}>
                View
              </Link>
            </Button>
            <button
              type="button"
              onClick={() => onOrder(product)}
              disabled={!product.inStock}
              aria-label={`Order ${product.name}`}
              className="grid size-9 place-items-center rounded-lg bg-[#22c55e] text-black shadow-md transition-all hover:bg-[#16a34a] hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <ShoppingBag className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


export const Route = createFileRoute("/")({
  loader: async () => {
    return await fetchResellerProducts();
  },
  head: () => ({
    meta: [
      { title: "GurfMarket — Premium Gaming, Streaming & Digital Goods" },
      {
        name: "description",
        content: "Browse Netflix, Spotify, Discord Nitro, Fortnite, Valorant, and digital accounts with instant 24/7 delivery.",
      },
      { property: "og:title", content: "GurfMarket — Premium Gaming, Streaming & Digital Goods" },
      {
        property: "og:description",
        content: "Browse Netflix, Spotify, Discord Nitro, Fortnite, Valorant, and digital accounts with instant 24/7 delivery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const ITEMS_PER_PAGE = 12;

interface ReviewItem {
  id: string;
  user: string;
  avatarChar: string;
  rating: number;
  text: string;
  product: string;
}

const REVIEWS: ReviewItem[] = [
  {
    id: "1",
    user: "Mat****",
    avatarChar: "M",
    rating: 5,
    text: "Amazing uber eats account just a long guide after its done u get the discount off W GurfMarket as usual 🔥",
    product: "Uber Eats [Discounts]",
  },
  {
    id: "2",
    user: "sti****",
    avatarChar: "s",
    rating: 5,
    text: "Microsoft random codes worked on the first try, credentials and invoice delivered instantly.",
    product: "Microsoft Random Codes",
  },
  {
    id: "3",
    user: "jor****",
    avatarChar: "j",
    rating: 5,
    text: "Instant delivery as always, netflix working perfectly in 4K!",
    product: "Netflix Premium 4K [Full Access] [1 Month] [ Key ]",
  },
  {
    id: "4",
    user: "dev****",
    avatarChar: "d",
    rating: 5,
    text: "good account and support, replied in 2 minutes",
    product: "Full Access Premium 4K",
  },
  {
    id: "5",
    user: "sly****",
    avatarChar: "s",
    rating: 5,
    text: "Valorant account had all skins promised, email change and 2FA set up smoothly.",
    product: "Valorant Account [1-1000 Skins]",
  },
  {
    id: "6",
    user: "dor****",
    avatarChar: "d",
    rating: 5,
    text: "Spotify family works smooth. 10/10 recommend GurfMarket.",
    product: "Spotify Family Owner [Account]",
  },
  {
    id: "7",
    user: "bgc****",
    avatarChar: "b",
    rating: 5,
    text: "Epic Games account with 150+ games, login worked smoothly.",
    product: "Epic Games - [100-200 Games] FA",
  },
  {
    id: "8",
    user: "sig****",
    avatarChar: "s",
    rating: 5,
    text: "Crunchyroll mega fan subscription working great, fast service.",
    product: "Crunchyroll [LIFETIME]",
  },
  {
    id: "9",
    user: "mat****",
    avatarChar: "m",
    rating: 5,
    text: "Damn the key quality improved so much well done GurfMarket 👏",
    product: "Discord Nitro [1 Year]",
  },
  {
    id: "10",
    user: "nik****",
    avatarChar: "n",
    rating: 4,
    text: "Very fast delivery, worked smoothly on Rockstar launcher. Recommended!",
    product: "Grand Theft Auto V [Rockstar Key]",
  },
  {
    id: "11",
    user: "ale****",
    avatarChar: "a",
    rating: 4,
    text: "Account delivered instantly, needed a quick reset and support sorted it out.",
    product: "NordVPN Premium 2 Year",
  },
  {
    id: "12",
    user: "sam****",
    avatarChar: "s",
    rating: 3,
    text: "Key took about 30 seconds to arrive, but worked cleanly once entered.",
    product: "Xbox Game Pass Ultimate [1 Month]",
  },
];

const FAQS = [
  {
    category: "Delivery",
    question: "How fast is delivery?",
    answer:
      "Most orders are delivered automatically within seconds of payment. Your codes, keys or credentials land in your confirmation dashboard instantly, no waiting for manual processing.",
  },
  {
    category: "Delivery",
    question: "Where do I find my product after purchase?",
    answer:
      "Everything you buy appears in your dashboard under Orders, with a one-click copy for codes and credentials. We also email a copy to the address on your account as a backup.",
  },
  {
    category: "Payments",
    question: "Which payment methods do you accept?",
    answer:
      "We support major cards, popular wallets, UPI, and crypto at checkout. Every transaction is encrypted and processed through PCI-compliant providers, we never store your card details.",
  },
  {
    category: "General",
    question: "Are the products genuine and safe?",
    answer:
      "Yes. Every product is sourced through legitimate channels and backed by a replacement warranty for its full term. If anything ever stops working, we replace it or refund you.",
  },
  {
    category: "Warranty",
    question: "What does the warranty cover?",
    answer:
      "If a product stops working within its coverage period, open a ticket from your dashboard and we'll issue a replacement or a refund, usually the same day. No long forms, no runaround.",
  },
  {
    category: "Reselling",
    question: "Can I resell products to my own customers?",
    answer:
      "Absolutely, GurfMarket is built for resellers. Bulk pricing, fast restocks and a clean order history make it easy to fulfil your own clients. Reach out for volume tiers and API access.",
  },
  {
    category: "Reselling",
    question: "Do you offer an API for automation?",
    answer:
      "Yes. Verified resellers get API access to automate orders, sync stock and pull delivery details programmatically. You'll find your keys in the dashboard once your account is approved.",
  },
  {
    category: "Warranty",
    question: "Can I get a refund?",
    answer:
      "If a product can't be delivered or doesn't work and we can't replace it, you're entitled to a full refund under our refund policy. Digital goods that have already been delivered and used are reviewed case by case.",
  },
];

function Hero3DShowcase({ products }: { products: ResellerProduct[] }) {
  const showcaseProducts = useMemo(() => {
    const withImages = products.filter((p) => p.image);
    const priority = ["netflix", "disney", "fivem", "claude", "chatgpt", "spotify", "crunchyroll", "fortnite", "apple tv", "nitro"];
    return [...withImages].sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const aIdx = priority.findIndex((k) => aName.includes(k));
      const bIdx = priority.findIndex((k) => bName.includes(k));
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;
      return 0;
    });
  }, [products]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (!isPlaying || showcaseProducts.length === 0) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % showcaseProducts.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [isPlaying, showcaseProducts.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + showcaseProducts.length) % showcaseProducts.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % showcaseProducts.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) setTouchStartX(touch.clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touch = e.changedTouches[0];
    if (touch) {
      const diff = touch.clientX - touchStartX;
      if (diff > 40) handlePrev();
      else if (diff < -40) handleNext();
    }
    setTouchStartX(null);
  };

  if (showcaseProducts.length === 0) return null;

  const len = showcaseProducts.length;
  const current = showcaseProducts[activeIndex]!;

  const slots = [-2, -1, 0, 1, 2].map((offset) => {
    const idx = (activeIndex + offset + len) % len;
    return {
      offset,
      product: showcaseProducts[idx]!,
      index: idx,
    };
  });

  return (
    <div
      className="relative mx-auto w-full max-w-[560px] select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Right Pause / Play button matching Supreme Market */}
      <div className="absolute right-2 top-0 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? "Pause auto-scroll" : "Resume auto-scroll"}
          className="grid size-8 place-items-center rounded-full border border-white/15 bg-black/75 text-white/80 backdrop-blur-md transition-all hover:border-white/30 hover:bg-black/90 hover:text-white cursor-pointer"
        >
          {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
        </button>
      </div>

      {/* 3D Envelope Cards Stage */}
      <div className="relative mx-auto aspect-[1.3] w-full max-w-[480px]">
        {/* Radial Ambient Floor Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[-12%] bottom-[-10%] h-[55%]"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(34, 197, 94, 0.28), rgba(59, 130, 246, 0.15) 45%, transparent 75%)",
          }}
        />

        {/* The 3D Fan of Cards */}
        {slots.map(({ offset, product }) => {
          let transform = "";
          let zIndex = 10;
          let opacity = 0;

          if (offset === 0) {
            transform = "translate3d(-50%, 0, 0) scale(1) rotate(0deg)";
            zIndex = 30;
            opacity = 1;
          } else if (offset === -1) {
            transform = "translate3d(-108%, 18%, 0) scale(0.74) rotate(-9deg)";
            zIndex = 20;
            opacity = 0.88;
          } else if (offset === 1) {
            transform = "translate3d(8%, 18%, 0) scale(0.74) rotate(9deg)";
            zIndex = 20;
            opacity = 0.88;
          } else if (offset === -2) {
            transform = "translate3d(-155%, 34%, 0) scale(0.52) rotate(-16deg)";
            zIndex = 10;
            opacity = 0;
          } else if (offset === 2) {
            transform = "translate3d(55%, 34%, 0) scale(0.52) rotate(16deg)";
            zIndex = 10;
            opacity = 0;
          }

          return (
            <div
              key={product.id}
              className="absolute left-1/2 top-[5%] w-[56%] transition-all duration-700 ease-out"
              style={{
                transform,
                zIndex,
                opacity,
              }}
            >
              {offset === 0 ? (
                <Link
                  to="/product/$slug"
                  params={{ slug: product.slug }}
                  className="group relative block aspect-[1.12] overflow-hidden rounded-2xl border border-white/15 bg-black/80 shadow-[0_22px_50px_rgba(0,0,0,0.85)] transition-all duration-300 hover:scale-[1.03] hover:border-[#22c55e]/60 hover:shadow-[0_25px_60px_rgba(34,197,94,0.25)]"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-white/10" />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                    <span className="truncate text-xs font-bold text-white drop-shadow">
                      {product.name}
                    </span>
                    <span className="rounded bg-[#22c55e] px-1.5 py-0.5 text-[10px] font-extrabold text-black">
                      ₹{product.retail_price.toLocaleString("en-IN")}
                    </span>
                  </div>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={offset < 0 ? handlePrev : handleNext}
                  className="group relative block aspect-[1.12] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/80 shadow-2xl transition-all duration-300 hover:border-white/30 cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover brightness-90 transition-all duration-300 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-black/35" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Controls & Spotlight Pill */}
      <div className="relative z-30 mt-4 flex items-center justify-between px-2">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous product"
          className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/80 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="size-4" />
        </button>

        <Link
          to="/product/$slug"
          params={{ slug: current.slug }}
          className="group flex items-center gap-2 rounded-full border border-white/10 bg-black/75 px-4 py-1.5 text-xs text-white/90 shadow-md backdrop-blur-md transition-all hover:border-[#22c55e]/50 hover:bg-[#0c1611]"
        >
          <span className="size-2 rounded-full bg-[#22c55e] animate-pulse" />
          <span className="font-bold text-white group-hover:text-[#22c55e] transition-colors">
            {current.name}
          </span>
          <span className="text-white/40">•</span>
          <span className="font-semibold text-emerald-400">
            From ₹{current.retail_price.toLocaleString("en-IN")}
          </span>
          <ArrowRight className="size-3 text-[#22c55e] transition-transform group-hover:translate-x-0.5" />
        </Link>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next product"
          className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/80 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white active:scale-95 cursor-pointer"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Horizontal Scrolling Ribbon — All Products Scrollable Left to Right */}
      <div className="mt-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-2 px-1">
          {showcaseProducts.map((p, idx) => {
            const isSel = idx === activeIndex;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`flex shrink-0 items-center gap-2 rounded-xl border p-1.5 text-left transition-all cursor-pointer ${
                  isSel
                    ? "border-[#22c55e] bg-[#0c1611] shadow-[0_0_12px_rgba(34,197,94,0.25)]"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                }`}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="size-7 rounded-lg object-cover"
                />
                <span className={`text-[11px] font-medium whitespace-nowrap pr-1.5 ${isSel ? "text-white font-bold" : "text-white/70"}`}>
                  {p.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Index() {
  const loaderData = Route.useLoaderData();
  const [products, setProducts] = useState<ResellerProduct[]>(loaderData?.products || []);
  const [categories, setCategories] = useState<string[]>(loaderData?.categories || []);
  const [isLoading, setIsLoading] = useState(!loaderData?.products?.length);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceFilter, setPriceFilter] = useState<"all" | "under_100" | "100_to_500" | "over_500">("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc" | "stock">("featured");
  const [currentPage, setCurrentPage] = useState(1);

  // Reviews & FAQ Filters
  const [reviewRatingFilter, setReviewRatingFilter] = useState<"all" | "5" | "4" | "3">("all");
  const [activeFaqCategory, setActiveFaqCategory] = useState<string>("All");

  // Group products by the official store categories for Section View
  const productsByCategory = useMemo(() => {
    const map = new Map<string, ResellerProduct[]>();
    for (const cat of STORE_CATEGORIES) {
      map.set(cat, []);
    }
    for (const p of products) {
      const list = map.get(p.category);
      if (list) {
        list.push(p);
      } else {
        const others = map.get("Others") || [];
        others.push(p);
        map.set("Others", others);
      }
    }
    return map;
  }, [products]);

  // Order modal states
  const [selectedProduct, setSelectedProduct] = useState<ResellerProduct | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ResellerVariant | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [copiedKey, setCopiedKey] = useState(false);

  // Sync state with loader or client RPC
  useEffect(() => {
    if (loaderData?.products?.length) {
      setProducts(loaderData.products);
      setCategories(loaderData.categories);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      fetchResellerProducts()
        .then((res) => {
          if (res?.products) {
            setProducts(res.products);
            setCategories(res.categories || []);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [loaderData]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, priceFilter, inStockOnly, sortBy]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter((product) => {
      // Category match
      if (selectedCategory !== "All" && product.category !== selectedCategory) {
        return false;
      }

      // In stock filter
      if (inStockOnly && !product.inStock) {
        return false;
      }

      // Price filter (based on product minimum retail price)
      const minPrice = product.variants.length > 0
        ? Math.min(...product.variants.map((v) => v.retail_price))
        : product.retail_price;

      if (priceFilter === "under_100" && minPrice >= 100) return false;
      if (priceFilter === "100_to_500" && (minPrice < 100 || minPrice > 500)) return false;
      if (priceFilter === "over_500" && minPrice <= 500) return false;

      // Search match
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesSlug = product.slug.toLowerCase().includes(query);
        const matchesVariant = product.variants.some((v) => v.name.toLowerCase().includes(query));
        if (!matchesName && !matchesCategory && !matchesSlug && !matchesVariant) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    if (sortBy === "price_asc") {
      result.sort((a, b) => a.retail_price - b.retail_price);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.retail_price - a.retail_price);
    } else if (sortBy === "stock") {
      result.sort((a, b) => b.totalStockCount - a.totalStockCount);
    }

    return result;
  }, [products, selectedCategory, searchQuery, priceFilter, inStockOnly, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedProducts, currentPage]);

  const filteredReviews = useMemo(() => {
    if (reviewRatingFilter === "all") return REVIEWS;
    return REVIEWS.filter((r) => r.rating === Number(reviewRatingFilter));
  }, [reviewRatingFilter]);

  const filteredFaqs = useMemo(() => {
    if (activeFaqCategory === "All") return FAQS;
    return FAQS.filter((f) => f.category === activeFaqCategory);
  }, [activeFaqCategory]);

  const handleOpenOrder = (product: ResellerProduct) => {
    setSelectedProduct(product);
    setSelectedVariant(product.variants.length > 0 ? (product.variants[0] ?? null) : null);
    setOrderQuantity(1);
    setOrderSuccess(false);
    setOrderResult(null);
    setCopiedKey(false);
  };

  const handleCloseOrder = () => {
    setSelectedProduct(null);
    setSelectedVariant(null);
    setOrderSuccess(false);
    setOrderResult(null);
    setCopiedKey(false);
  };

  const copyToClipboard = (text: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedProduct) return;
    setIsPlacingOrder(true);
    setOrderResult(null);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Unable to load Razorpay checkout. Please check your internet connection.");
      }

      const orderData = await createRazorpayOrder({
        data: {
          amount: Number(totalPrice),
          productName: `${selectedProduct.name}${selectedVariant ? ` - ${selectedVariant.name}` : ""}`,
          productId: selectedVariant?.rawProductId || selectedProduct.id,
          variantId: selectedVariant?.variantId,
          quantity: orderQuantity,
          customerEmail,
          customerPhone,
        },
      });

      if (!orderData.success || !orderData.orderId || !orderData.keyId) {
        throw new Error(orderData.error || "Failed to initialize Razorpay payment order.");
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "GurfMarket",
        description: `${selectedProduct.name} - Instant Access`,
        image: "/logo-icon.png",
        order_id: orderData.orderId,
        prefill: {
          email: customerEmail || "customer@gurfmarket.com",
          contact: customerPhone || "9999999999",
        },
        theme: {
          color: "#22c55e",
        },
        modal: {
          ondismiss: () => {
            setIsPlacingOrder(false);
          },
        },
        handler: async (response: any) => {
          setIsPlacingOrder(true);
          try {
            const verification = await verifyRazorpayPayment({
              data: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                productId: selectedVariant?.rawProductId || selectedProduct.id,
                variantId: selectedVariant?.variantId,
                quantity: orderQuantity,
                customerEmail,
                customerPhone,
                amount: Number(totalPrice),
                productName: `${selectedProduct.name}${selectedVariant ? ` - ${selectedVariant.name}` : ""}`,
              },
            });

            if (verification.success) {
              setOrderResult({
                success: true,
                orderId: verification.orderId,
                paymentId: verification.paymentId,
                keys: verification.keys || [],
                status: verification.status,
                notice: verification.notice,
              });
              setOrderSuccess(true);
            } else {
              setOrderResult({
                success: false,
                error: verification.error || "Payment signature verification failed.",
              });
            }
          } catch (verifyErr: any) {
            setOrderResult({
              success: false,
              error: verifyErr.message || "Failed to verify payment with server.",
            });
          } finally {
            setIsPlacingOrder(false);
          }
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.on("payment.failed", (failRes: any) => {
        setIsPlacingOrder(false);
        setOrderResult({
          success: false,
          error: failRes.error?.description || "Payment was cancelled or failed.",
        });
      });
      razorpayInstance.open();
    } catch (err: any) {
      setOrderResult({
        success: false,
        error: err.message || "Failed to initialize payment gateway.",
      });
      setIsPlacingOrder(false);
    }
  };


  const currentPrice = selectedVariant
    ? selectedVariant.retail_price
    : selectedProduct?.retail_price || 0;

  const totalPrice = (currentPrice * orderQuantity).toFixed(2);

  return (
    <main className="overflow-hidden bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto grid h-[72px] max-w-[1240px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 sm:flex sm:justify-between sm:px-8">
          <a href="#top" className="flex min-w-0 items-center gap-3" aria-label="GurfMarket home">
            <img
              src="/logo-icon.png"
              alt="GurfMarket Crown Emblem"
              className="size-9.5 shrink-0 rounded-xl object-cover border border-[#22c55e]/50 shadow-[0_0_16px_rgba(34,197,94,0.35)]"
            />
            <div className="flex flex-col">
              <span className="truncate text-[15px] font-extrabold tracking-[0.06em] text-white">GURFMARKET</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#22c55e]">Market Live</span>
            </div>
          </a>

          <nav aria-label="Main navigation" className="hidden items-center gap-8 text-[13px] text-copy-secondary md:flex">
            <a className="transition-colors hover:text-foreground" href="#products">Products</a>
            <a className="transition-colors hover:text-foreground" href="#features">Features</a>
            <a className="transition-colors hover:text-foreground" href="#reviews">Reviews</a>
            <a className="transition-colors hover:text-foreground" href="#about">About</a>
            <a className="transition-colors hover:text-foreground" href="#faq">FAQ</a>
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <Button asChild className="h-10 rounded-sm px-4 text-xs sm:px-5 sm:text-sm">
              <a href="#products">Explore All <ArrowUpRight aria-hidden="true" /></a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section matching Supreme Market */}
      <section id="top" className="relative isolate border-b border-white/[0.08] overflow-hidden">
        {/* Background ambient lighting */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full opacity-40 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(34,197,94,0.18),rgba(255,255,255,0))]" />
        
        <div className="mx-auto grid min-h-[560px] max-w-[1240px] items-center gap-10 px-5 pt-12 pb-14 sm:px-8 sm:pt-16 sm:pb-20 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 lg:pt-20 lg:pb-16">
          {/* Left Column: Headline matching screenshot */}
          <div>
            <p className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-[#22c55e]">
              MORE ACCESS. BETTER PRICES.
            </p>
            <h1 className="mt-4 font-heading text-[clamp(3.1rem,7.5vw,5.4rem)] font-extrabold leading-[0.95] tracking-[-0.035em] text-white">
              <span className="block">Get more</span>
              <span className="block text-[#22c55e]">for less.</span>
            </h1>
            <p className="mt-6 max-w-[500px] text-base leading-relaxed text-white/70 sm:text-lg sm:leading-8">
              Access top digital accounts, tools and services for entertainment, productivity and more, all at better prices.
            </p>
            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              <a
                href="#products"
                className="group inline-flex h-[3.25rem] items-center justify-center gap-2.5 rounded-full bg-[#22c55e] px-8 font-heading text-sm sm:text-base font-extrabold text-black shadow-[0_12px_35px_-8px_rgba(34,197,94,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#16a34a]"
              >
                <span>Browse products</span>
                <ArrowRight className="size-4.5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>

              <a
                href="#products"
                className="group inline-flex h-[3.25rem] items-center justify-center gap-3 rounded-full border border-white/20 bg-white/[0.04] pl-2.5 pr-7 font-heading text-sm sm:text-base font-semibold text-white transition-all duration-300 hover:border-white/40 hover:bg-white/[0.08]"
              >
                <span className="grid size-9 place-items-center rounded-full bg-white/10 transition-colors group-hover:bg-[#22c55e] group-hover:text-black">
                  <Boxes className="size-4" />
                </span>
                <span>See the packs</span>
              </a>
            </div>
          </div>

          {/* Right Column: 3D Rotating Product Carousel */}
          <div>
            <Hero3DShowcase products={products} />
          </div>
        </div>

        {/* Bottom Trust & Stats Bar matching screenshot */}
        <div className="border-t border-white/[0.08] bg-[#07090b]/90 py-5">
          <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-6 px-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-xl bg-[#22c55e]/10 text-[#22c55e]">
                <Zap className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Instant delivery</p>
                <p className="text-[11px] text-white/50">Automatic, 24/7</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-xl bg-[#22c55e]/10 text-[#22c55e]">
                <Lock className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Secure checkout</p>
                <p className="text-[11px] text-white/50">5 payment methods</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-xl bg-[#22c55e]/10 text-[#22c55e]">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Warranty included</p>
                <p className="text-[11px] text-white/50">Easy replacements</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-xl bg-amber-400/10 text-amber-400">
                <Star className="size-5 fill-amber-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">4.9/5 rating</p>
                <p className="text-[11px] text-white/50">9,635 reviews</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2">
              <div className="grid size-10 place-items-center rounded-xl bg-[#22c55e]/20 text-[#22c55e]">
                <Crown className="size-5.5" />
              </div>
              <div>
                <p className="font-heading text-sm font-extrabold text-white">504,195+</p>
                <p className="text-[10px] text-white/50">products delivered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog & Products Section with Supreme Market Style Filters */}
      <section id="products" className="scroll-mt-24 border-b border-border/60">
        <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8 sm:py-20">
          {/* Section Header & Search */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-electric-bright">Product Catalog</p>
                <span className="inline-flex items-center rounded-sm border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                  <span className="mr-1 inline-block size-1.5 rounded-full bg-emerald-400" /> Live Supreme Market Feed
                </span>
              </div>
              <h2 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl">
                Browse All Products
              </h2>
              <p className="mt-2 text-sm text-copy-secondary">
                Explore individual product pages, choose variants, and order with instant automated delivery.
              </p>
            </div>

            {/* Search Input & Sort */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-copy-secondary" />
                <input
                  type="text"
                  placeholder="Search Netflix, Spotify, games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-sm border border-border bg-surface-raised pl-9 pr-4 text-xs text-foreground placeholder:text-copy-secondary/60 focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-10 rounded-sm border border-border bg-surface-raised px-3 text-xs text-foreground focus:border-electric focus:outline-none"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="stock">Stock Availability</option>
              </select>
            </div>
          </div>

          {/* Category Navigation Pills matching the screenshot */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <nav aria-label="Product categories" className="min-w-0 flex-1">
              <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {["All", ...STORE_CATEGORIES].map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCurrentPage(1);
                      }}
                      className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-4 text-[0.84rem] font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                        isActive
                          ? "border-[#22c55e] bg-[#22c55e] text-black font-semibold shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                          : "border-white/10 bg-white/[0.03] text-white/75 hover:border-white/25 hover:text-white hover:bg-white/[0.06]"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </nav>

          </div>

          {/* Section View: Divided into each category */}
          {selectedCategory === "All" && !searchQuery && priceFilter === "all" && !inStockOnly ? (
            <div className="mt-12 space-y-16">
              {isLoading ? (
                <div className="grid min-h-[300px] place-items-center text-center">
                  <RefreshCw className="size-8 animate-spin text-[#22c55e]" />
                  <p className="mt-3 text-sm text-copy-secondary">Syncing live catalog from Supreme Market...</p>
                </div>
              ) : (
                STORE_CATEGORIES.map((catName) => {
                  const sectionProducts = productsByCategory.get(catName) || [];
                  if (sectionProducts.length === 0) return null;

                  return (
                    <section
                      key={catName}
                      id={`section-${catName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                      className="space-y-5 scroll-mt-28"
                    >
                      {/* Section Header */}
                      <div className="flex flex-col gap-2 border-b border-white/10 pb-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <span className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-[#22c55e]">
                            {getCategoryIcon(catName)}
                          </span>
                          <div className="flex items-center gap-2.5">
                            <h3 className="font-heading text-lg font-bold text-white tracking-tight">
                              {catName}
                            </h3>
                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs font-medium text-white/60">
                              {sectionProducts.length} items
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory(catName);
                            setCurrentPage(1);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#22c55e] hover:text-[#4ade80] transition-colors"
                        >
                          View all {catName} ({sectionProducts.length}) <ArrowRight className="size-3.5" />
                        </button>
                      </div>

                      {/* Section Products Grid */}
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {sectionProducts.slice(0, 4).map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onOrder={handleOpenOrder}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })
              )}
            </div>
          ) : (
            /* Main Layout: Sidebar Filters + Products Grid */
            <div className="mt-8 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
              {/* Sidebar Filters */}
              <aside className="space-y-6 rounded-sm border border-border bg-surface-raised/40 p-5 lg:sticky lg:top-28 lg:self-start">
                <div>
                  <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                    <SlidersHorizontal className="size-3.5 text-electric-bright" /> Filters
                  </h4>
                </div>

                {/* Price Filter */}
                <div className="border-t border-border/70 pt-4">
                  <label className="text-xs font-semibold text-copy-secondary">Price Range</label>
                  <div className="mt-2.5 space-y-2 text-xs">
                    {[
                      { id: "all", label: "Any price" },
                      { id: "under_100", label: "Under ₹100" },
                      { id: "100_to_500", label: "₹100 – ₹500" },
                      { id: "over_500", label: "Over ₹500" },
                    ].map((option) => (
                      <label key={option.id} className="flex cursor-pointer items-center gap-2.5 text-copy-secondary hover:text-foreground">
                        <input
                          type="radio"
                          name="priceFilter"
                          checked={priceFilter === option.id}
                          onChange={() => setPriceFilter(option.id as any)}
                          className="accent-[#22c55e]"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* In Stock Toggle */}
                <div className="border-t border-border/70 pt-4">
                  <label className="flex cursor-pointer items-center gap-2.5 text-xs text-copy-secondary hover:text-foreground">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="accent-[#22c55e] size-3.5"
                    />
                    <span className="font-medium">In stock only</span>
                  </label>
                </div>

                {/* Quick Summary */}
                <div className="border-t border-border/70 pt-4 text-xs text-copy-secondary">
                  <p>Showing <span className="font-bold text-foreground">{filteredAndSortedProducts.length}</span> matching products</p>
                  <p className="mt-1">Page {currentPage} of {totalPages}</p>
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setPriceFilter("all");
                      setInStockOnly(false);
                      setSearchQuery("");
                    }}
                    className="mt-3 text-xs text-electric-bright hover:underline"
                  >
                    Reset all filters
                  </button>
                </div>
              </aside>

              {/* Products Column */}
              <div>
                {/* Active Category Header if filtered */}
                {selectedCategory !== "All" && (
                  <div className="mb-6 flex items-center justify-between border-b border-border/70 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-lg border border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]">
                        {getCategoryIcon(selectedCategory)}
                      </span>
                      <div>
                        <h3 className="font-display text-xl font-bold text-foreground">
                          {selectedCategory}
                        </h3>
                        <p className="text-xs text-copy-secondary">
                          {filteredAndSortedProducts.length} verified products available
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCategory("All");
                        setCurrentPage(1);
                      }}
                      className="text-xs text-electric-bright hover:underline"
                    >
                      ← Back to All Sections
                    </button>
                  </div>
                )}

                {isLoading ? (
                  <div className="grid min-h-[300px] place-items-center text-center">
                    <RefreshCw className="size-8 animate-spin text-[#22c55e]" />
                    <p className="mt-3 text-sm text-copy-secondary">Syncing live catalog from Supreme Market...</p>
                  </div>
                ) : paginatedProducts.length === 0 ? (
                  <div className="grid min-h-[300px] place-items-center rounded-sm border border-dashed border-border bg-surface-raised/30 p-12 text-center">
                    <div className="max-w-md">
                      <span className="mx-auto grid size-12 place-items-center rounded-sm border border-border bg-background text-electric-bright">
                        <Gamepad2 size={20} />
                      </span>
                      <h3 className="mt-4 text-base font-semibold">No products found</h3>
                      <p className="mt-2 text-sm text-copy-secondary">
                        No products matched your selected filters. Try resetting the filters or searching for another term.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCategory("All");
                          setPriceFilter("all");
                          setInStockOnly(false);
                          setSearchQuery("");
                        }}
                        className="mt-5"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Products Grid */}
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {paginatedProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onOrder={handleOpenOrder}
                        />
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border/70 pt-6">
                        <p className="text-xs text-copy-secondary">
                          Showing <span className="font-semibold text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
                          <span className="font-semibold text-foreground">
                            {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedProducts.length)}
                          </span>{" "}
                          of <span className="font-semibold text-foreground">{filteredAndSortedProducts.length}</span> products
                        </p>

                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className="h-8 px-2.5 text-xs"
                          >
                            <ChevronLeft className="size-3.5 mr-1" /> Prev
                          </Button>

                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                            if (
                              pageNum === 1 ||
                              pageNum === totalPages ||
                              (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                            ) {
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`grid size-8 place-items-center rounded-sm text-xs font-semibold transition-colors ${
                                    currentPage === pageNum
                                      ? "bg-[#22c55e] text-black font-bold"
                                      : "border border-border bg-surface-raised text-copy-secondary hover:text-foreground"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            }
                            if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                              return (
                                <span key={pageNum} className="px-1 text-xs text-copy-secondary">
                                  ...
                                </span>
                              );
                            }
                            return null;
                          })}

                          <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            className="h-8 px-2.5 text-xs"
                          >
                            Next <ChevronRight className="size-3.5 ml-1" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features & Security */}
      <section id="features" className="scroll-mt-24 border-b border-border/60 bg-surface-raised/30">
        <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-sm border border-border/70 bg-surface-raised/40 p-6">
              <span className="grid size-10 place-items-center rounded-sm border border-electric/40 bg-electric/10 text-electric-bright">
                <Zap className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">Instant Automated Delivery</h3>
              <p className="mt-2 text-sm leading-6 text-copy-secondary">
                Credentials and keys are dispatched immediately upon checkout. No manual waiting or delays.
              </p>
            </div>
            <div className="rounded-sm border border-border/70 bg-surface-raised/40 p-6">
              <span className="grid size-10 place-items-center rounded-sm border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">Verified Stock & Warranty</h3>
              <p className="mt-2 text-sm leading-6 text-copy-secondary">
                Every account and key is pre-verified against our supplier backend to guarantee functionality.
              </p>
            </div>
            <div className="rounded-sm border border-border/70 bg-surface-raised/40 p-6">
              <span className="grid size-10 place-items-center rounded-sm border border-electric/40 bg-electric/10 text-electric-bright">
                <RefreshCw className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">Live Real-time Inventory</h3>
              <p className="mt-2 text-sm leading-6 text-copy-secondary">
                Stock counts update automatically straight from the Supreme Market reseller feed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section matching user's photo */}
      <section id="reviews" className="scroll-mt-24 border-b border-border/60 bg-gradient-to-b from-background via-surface-raised/20 to-background">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Trusted by customers worldwide
            </h2>
            <p className="mt-3 text-sm text-copy-secondary">
              What people say about buying on GurfMarket.
            </p>
          </div>

          {/* Rating Hero Card */}
          <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-white/[0.08] bg-[#0c1220]/80 p-8 text-center shadow-2xl backdrop-blur-md">
            <div className="font-display text-5xl font-extrabold text-foreground tracking-tight">4.9</div>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="mt-2 text-xs font-medium text-copy-secondary">9,635 reviews</p>
          </div>

          {/* Rating Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: "all", label: "All ratings" },
              { id: "5", label: "5 stars" },
              { id: "4", label: "4 stars" },
              { id: "3", label: "3 stars" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setReviewRatingFilter(f.id as any)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  reviewRatingFilter === f.id
                    ? "border border-emerald-500/40 bg-emerald-500/20 text-emerald-400 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                    : "border border-white/10 bg-white/[0.03] text-copy-secondary hover:border-white/20 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Reviews Grid */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="group relative flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#0c111c]/90 p-5 shadow-lg backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-[#101726]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <Quote className="size-5 text-white/15" />
                  </div>
                  <p className="mt-3.5 text-xs leading-relaxed text-foreground/90 font-normal">
                    "{rev.text}"
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-3 border-t border-white/[0.06] pt-4">
                  <div className="grid size-8 shrink-0 place-items-center rounded-full bg-[#22c55e] text-black text-xs font-bold uppercase shadow-sm">
                    {rev.avatarChar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-white">{rev.user}</span>
                      <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                    </div>
                    <p className="truncate text-[11px] text-copy-secondary">
                      • {rev.product}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="scroll-mt-24 border-b border-border/60">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-electric-bright">About GurfMarket</p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Reliable digital assets for gaming and creator communities.
            </h2>
            <p className="mt-5 text-base leading-7 text-copy-secondary">
              GurfMarket connects directly with verified wholesale providers. Every product listed features transparent retail pricing in INR, real-time inventory validation, and automated digital fulfillment.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="scroll-mt-24">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-8 md:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-electric-bright">Support & Clarity</p>
              <h2 className="mt-3 font-display text-3xl font-semibold">Frequently Asked Questions</h2>
              <p className="mt-3 text-sm text-copy-secondary leading-relaxed">
                Answers about delivery, payments, warranty and our reseller integration.
              </p>

              {/* FAQ Category Pills */}
              <div className="mt-6 flex flex-wrap gap-2">
                {["All", "Delivery", "Payments", "Warranty", "Reselling", "General"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveFaqCategory(cat)}
                    className={`rounded-full px-3.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                      activeFaqCategory === cat
                        ? "bg-[#22c55e] text-black font-semibold"
                        : "border border-border/80 bg-surface-raised text-copy-secondary hover:text-foreground hover:bg-white/[0.05]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-border border-y border-border">
              {filteredFaqs.map((faq) => (
                <details key={faq.question} className="group py-5 transition-colors">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-medium hover:text-foreground [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center gap-2.5">
                      <span className="rounded-full bg-white/[0.05] border border-white/10 px-2 py-0.5 text-[10px] text-copy-secondary uppercase tracking-wider">
                        {faq.category}
                      </span>
                      <span>{faq.question}</span>
                    </span>
                    <ChevronDown size={17} aria-hidden="true" className="shrink-0 text-copy-secondary transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 max-w-xl pl-1 text-sm leading-6 text-copy-secondary">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/70">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-5 py-7 text-xs text-copy-secondary sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <a href="#top" className="flex items-center gap-2.5 font-semibold tracking-[0.08em] text-foreground">
            <span className="grid size-7 place-items-center rounded-sm border border-electric/50 bg-electric/10 text-[9px] font-extrabold text-electric-bright">
              GM
            </span>
            GURFMARKET
          </a>
          <span>Powered by Supreme Market Reseller API. 3.2x Retail Catalog.</span>
          <a href="#top" className="inline-flex items-center gap-1 hover:text-foreground">
            Back to top <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>
      </footer>

      {/* Quick Order Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={handleCloseOrder}
          />
          <div className="relative z-10 w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#0c0e12] p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#22c55e]">
                  {selectedProduct.category}
                </span>
                <h3 className="mt-1 text-2xl font-extrabold text-white">{selectedProduct.name}</h3>
                <p className="mt-1 flex items-center gap-2 text-xs text-white/50">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {selectedProduct.totalStockCount} in stock
                  </span>
                  <span>•</span>
                  <span>Instant Delivery</span>
                </p>
              </div>
              <button
                onClick={handleCloseOrder}
                className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/10 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            {orderSuccess && orderResult?.success ? (
              <div className="py-5 text-center">
                <span className="mx-auto grid size-13 place-items-center rounded-full bg-emerald-500/20 text-emerald-400 ring-8 ring-emerald-500/10">
                  <CheckCircle2 className="size-7" />
                </span>
                <h4 className="mt-3.5 font-heading text-xl font-extrabold text-white">Payment Confirmed!</h4>
                <p className="mt-1 text-xs text-white/60">
                  {selectedProduct.name} {selectedVariant ? `• ${selectedVariant.name}` : ""}
                </p>

                {orderResult.paymentId && (
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-mono text-white/70">
                    <span className="text-[#22c55e]">Razorpay ID:</span>
                    <span>{orderResult.paymentId}</span>
                  </div>
                )}

                {/* Delivered Credentials */}
                <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-left">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      Delivered Credentials / Key:
                    </p>
                    {orderResult.keys && orderResult.keys.length > 0 && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(orderResult.keys!.join("\n"))}
                        className="flex items-center gap-1 text-[11px] font-semibold text-white/80 hover:text-white cursor-pointer"
                      >
                        {copiedKey ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                        {copiedKey ? "Copied" : "Copy"}
                      </button>
                    )}
                  </div>
                  <pre className="mt-2.5 max-h-36 overflow-x-auto rounded-lg bg-black/80 p-3 font-mono text-xs text-white selection:bg-[#22c55e]/40">
                    {orderResult.keys && orderResult.keys.length > 0
                      ? orderResult.keys.join("\n")
                      : "Your digital license has been reserved. Check your email or live support."}
                  </pre>
                </div>

                {orderResult.notice && (
                  <p className="mt-2.5 text-[11px] text-amber-300 bg-amber-500/10 rounded-lg p-2 border border-amber-500/20">
                    {orderResult.notice}
                  </p>
                )}

                <p className="mt-3.5 text-sm font-bold text-emerald-400">Paid: ₹{totalPrice}</p>
                <Button
                  onClick={handleCloseOrder}
                  className="mt-4 w-full rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
                >
                  Done
                </Button>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {/* Variant Selector */}
                <div>
                  <h4 className="text-sm font-bold text-white">Choose your plan</h4>
                  <div className="mt-2 max-h-48 space-y-2 overflow-y-auto pr-1">
                    {(selectedProduct.variants.length > 0 ? selectedProduct.variants : [
                      {
                        id: selectedProduct.id,
                        rawProductId: selectedProduct.id,
                        name: "Standard Edition",
                        cost_price: selectedProduct.cost_price,
                        retail_price: selectedProduct.retail_price,
                        stock: selectedProduct.stock,
                      }
                    ]).map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`flex w-full items-center justify-between rounded-xl p-3.5 text-left text-xs transition-all cursor-pointer ${
                            isSelected
                              ? "border-2 border-[#22c55e] bg-[#0c1611] shadow-[0_0_18px_rgba(34,197,94,0.18)]"
                              : "border border-white/10 bg-[#0e1115] hover:border-white/20 hover:bg-[#12161c]"
                          }`}
                        >
                          <div className="flex items-center gap-3 pr-2 min-w-0">
                            <div
                              className={`size-4.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isSelected ? "border-[#22c55e]" : "border-white/30"
                              }`}
                            >
                              {isSelected && <span className="size-2 rounded-full bg-[#22c55e]" />}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className={`truncate text-[13px] ${isSelected ? "font-semibold text-white" : "text-white/80"}`}>
                                {v.name}
                              </span>
                              {v.stock !== null && v.stock !== undefined && v.stock <= 5 && (
                                <span className="text-[10px] font-semibold text-amber-400 mt-0.5">
                                  Limited stock
                                </span>
                              )}
                              {v.stock !== null && v.stock !== undefined && v.stock > 5 && (
                                <span className="text-[10px] font-medium text-white/50 mt-0.5">
                                  {v.stock} in stock
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="shrink-0 font-display text-sm font-bold text-white">
                            ₹{v.retail_price.toLocaleString("en-IN")}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity Row with Max in stock */}
                {(() => {
                  const modalStock = selectedVariant?.stock !== null && selectedVariant?.stock !== undefined
                    ? selectedVariant.stock
                    : (selectedProduct.stock ?? selectedProduct.totalStockCount ?? 29);
                  return (
                    <div className="flex items-start justify-between border-y border-white/[0.08] py-2.5 text-xs">
                      <span className="font-semibold text-white/70 mt-1">Quantity</span>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
                          <button
                            type="button"
                            onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                            className="grid size-7 place-items-center rounded text-white/70 hover:bg-white/10 hover:text-white font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-white">{orderQuantity}</span>
                          <button
                            type="button"
                            onClick={() => setOrderQuantity(Math.min(modalStock > 0 ? modalStock : 99, orderQuantity + 1))}
                            className="grid size-7 place-items-center rounded text-white/70 hover:bg-white/10 hover:text-white font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        <p className="mt-1 text-right text-[10px] font-bold text-amber-400">
                          Max {modalStock} in stock
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* Customer Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-white/70 mb-1">
                      Email Address (for key delivery)
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white placeholder:text-white/30 focus:border-[#22c55e] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-white/70 mb-1">
                      Phone Number (optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white placeholder:text-white/30 focus:border-[#22c55e] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Total Summary & Stock/Delivery Row */}
                <div className="rounded-xl border border-white/[0.08] bg-[#07090b] p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span>Price</span>
                    <span className="text-base font-extrabold text-[#22c55e]">₹{totalPrice}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] border-t border-white/[0.06] pt-2">
                    {(() => {
                      const avail = selectedVariant?.stock ?? selectedProduct.stock ?? selectedProduct.totalStockCount ?? 29;
                      if (avail === 0) {
                        return (
                          <div className="flex items-center gap-1.5 font-semibold text-rose-400">
                            <span className="size-1.5 rounded-full bg-rose-500" />
                            <span>Out of stock · 0 available</span>
                          </div>
                        );
                      }
                      return (
                        <div className="flex items-center gap-1.5 font-semibold text-[#22c55e]">
                          <span className="size-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                          <span>In stock · {avail} available</span>
                        </div>
                      );
                    })()}
                    <div className="flex items-center gap-1 font-semibold text-emerald-400">
                      <Zap className="size-3 fill-emerald-400" />
                      <span>Instant delivery</span>
                    </div>
                  </div>
                </div>

                {/* Cashback Box matching Supreme Market */}
                <div className="flex items-center gap-2.5 rounded-xl border border-[#22c55e]/20 bg-[#22c55e]/[0.05] p-2.5 text-xs">
                  <span className="grid size-6 place-items-center rounded-lg bg-[#22c55e]/20 text-[#22c55e] shrink-0">
                    <Coins className="size-3.5" />
                  </span>
                  <div>
                    <p className="font-semibold text-white text-[11px]">
                      Earn ₹{Math.max(1, Math.round(Number(totalPrice) * 0.02))} cashback on this order
                    </p>
                    <p className="text-[10px] text-white/50">
                      2% back to your digital wallet, credited instantly upon delivery.
                    </p>
                  </div>
                </div>

                {orderResult?.error && (
                  <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-300">
                    <p className="font-semibold">Payment Notice:</p>
                    <p className="mt-1">{orderResult.error}</p>
                  </div>
                )}

                {/* Razorpay Action Button */}
                {(() => {
                  const modalAvail = selectedVariant?.stock ?? selectedProduct.stock ?? selectedProduct.totalStockCount ?? 29;
                  const isOutOfStock = modalAvail === 0;
                  return (
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder || isOutOfStock}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#22c55e] text-sm font-extrabold text-black shadow-[0_4px_25px_rgba(34,197,94,0.35)] transition-all hover:bg-[#16a34a] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                    >
                      {isPlacingOrder ? (
                        <span className="flex items-center gap-2">
                          <RefreshCw className="size-4 animate-spin" /> Processing Razorpay...
                        </span>
                      ) : isOutOfStock ? (
                        <span>Currently Out of Stock</span>
                      ) : (
                        <>
                          <ShoppingBag className="size-4" />
                          <span>Pay ₹{totalPrice} with Razorpay</span>
                        </>
                      )}
                    </button>
                  );
                })()}

                <div className="flex items-center justify-center gap-2 text-[11px] font-medium text-white/50">
                  <ShieldCheck className="size-3.5 text-[#22c55e]" />
                  <span>Secured by Razorpay • UPI (GPay/PhonePe), Cards, NetBanking</span>
                </div>


                <div className="text-center pt-1">
                  <Link
                    to="/product/$slug"
                    params={{ slug: selectedProduct.slug }}
                    className="text-xs font-medium text-[#22c55e] hover:underline"
                  >
                    Go to Full Product Page →
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </main>
  );
}

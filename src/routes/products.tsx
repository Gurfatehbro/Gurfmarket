import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  CheckCircle2,
  Copy,
  Crown,
  Gamepad2,
  KeyRound,
  Layers3,
  Lock,
  Music,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tv,
  UtensilsCrossed,
  X,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { StoreFooter } from "@/components/StoreFooter";
import { Button } from "@/components/ui/button";
import {
  fetchResellerProducts,
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

export const Route = createFileRoute("/products")({
  loader: async () => {
    const data = await fetchResellerProducts();
    return { initialProducts: data.products, rate: data.rate };
  },
  head: () => ({
    meta: [
      { title: "Products & Digital Catalog | GurfMarket" },
      {
        name: "description",
        content: "Browse 50+ instant delivery digital accounts, streaming subscriptions, AI tools, VPNs, gaming tokens, and software keys in INR.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { initialProducts } = Route.useLoaderData();
  const [products] = useState<ResellerProduct[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<StoreCategory | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc" | "stock">("featured");
  const [priceFilter, setPriceFilter] = useState<"all" | "under_100" | "100_to_500" | "over_500">("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 16;

  // Order modal state
  const [selectedProduct, setSelectedProduct] = useState<ResellerProduct | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ResellerVariant | null>(null);
  const [orderEmail, setOrderEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.variants.some((v) => v.name.toLowerCase().includes(q))
      );
    }

    if (priceFilter !== "all") {
      result = result.filter((p) => {
        const price = p.retail_price;
        if (priceFilter === "under_100") return price < 100;
        if (priceFilter === "100_to_500") return price >= 100 && price <= 500;
        if (priceFilter === "over_500") return price > 500;
        return true;
      });
    }

    if (inStockOnly) {
      result = result.filter((p) => (p.stock ?? 0) > 0);
    }

    if (sortBy === "price_asc") {
      result.sort((a, b) => a.retail_price - b.retail_price);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.retail_price - a.retail_price);
    } else if (sortBy === "stock") {
      result.sort((a, b) => (b.stock ?? 0) - (a.stock ?? 0));
    }

    return result;
  }, [products, selectedCategory, searchQuery, priceFilter, inStockOnly, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const handleOpenOrder = (product: ResellerProduct) => {
    setSelectedProduct(product);
    setSelectedVariant(product.variants[0] || null);
    setOrderEmail("");
    setCustomerPhone("");
    setOrderQuantity(1);
    setOrderResult(null);
  };

  const handleCopyKey = (keyText: string) => {
    navigator.clipboard.writeText(keyText);
    setCopiedKey(keyText);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePayAndOrder = async () => {
    if (!selectedProduct || !orderEmail.trim()) return;
    const currentPrice = selectedVariant ? selectedVariant.retail_price : selectedProduct.retail_price;
    const finalAmount = currentPrice * orderQuantity;

    setIsPlacingOrder(true);
    setOrderResult(null);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error("Could not load Razorpay payment gateway.");

      const orderData = await createRazorpayOrder({
        data: {
          amount: finalAmount,
          productName: `${selectedProduct.name}${selectedVariant ? ` - ${selectedVariant.name}` : ""}`,
          productId: selectedVariant?.rawProductId || selectedProduct.id,
          variantId: selectedVariant?.variantId || selectedVariant?.id,
          quantity: orderQuantity,
          customerEmail: orderEmail,
          customerPhone: customerPhone || undefined,
        },
      });

      if (!orderData?.success || !orderData?.keyId || !orderData?.orderId) {
        throw new Error(orderData?.error || "Failed to initialize Razorpay payment order. Key missing or invalid.");
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "GurfMarket",
        description: `${selectedProduct.name} - Instant Delivery`,
        image: "/logo-icon.png",
        order_id: orderData.orderId,
        prefill: {
          email: orderEmail || "customer@gurfmarket.com",
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
                variantId: selectedVariant?.variantId || selectedVariant?.id,
                quantity: orderQuantity,
                customerEmail: orderEmail,
                customerPhone: customerPhone || undefined,
                amount: finalAmount,
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
                invoiceToken: verification.invoiceToken,
              });
            } else {
              setOrderResult({
                success: false,
                error: verification.error || "Payment verification failed. Please contact support.",
              });
            }
          } catch (err: any) {
            setOrderResult({
              success: false,
              error: err.message || "Payment verification failed.",
            });
          } finally {
            setIsPlacingOrder(false);
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (fail: any) => {
        setIsPlacingOrder(false);
        setOrderResult({
          success: false,
          error: fail.error?.description || "Payment was cancelled or declined.",
        });
      });
      rzp.open();
    } catch (err: any) {
      setOrderResult({
        success: false,
        error: err.message || "Checkout failed. Please try again.",
      });
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090b] text-white">
      <Navbar />

      <main className="mx-auto max-w-[1240px] px-4 py-8 sm:px-8 sm:py-12">
        {/* Header Banner */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-white/[0.08] pb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#22c55e] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#22c55e]">
                Live Product Catalog
              </span>
            </div>
            <h1 className="mt-2 font-heading text-3xl sm:text-4xl font-extrabold text-white">
              Explore All Digital Goods
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-white/60 max-w-xl">
              Streaming subscriptions, verified AI memberships, VPNs, Steam tokens, and software keys with instant delivery in INR.
            </p>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5">
            <span className="font-extrabold text-lg text-[#22c55e]">{products.length}+</span>
            <span className="text-xs text-white/60">Verified Accounts Available</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search Netflix, Claude, Steam, NordVPN..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-9.5 pr-4 text-xs text-white placeholder:text-white/40 focus:border-[#22c55e] focus:bg-white/[0.06] focus:outline-none transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-10 rounded-xl border border-white/10 bg-[#0c0e12] px-3 text-xs text-white/90 focus:border-[#22c55e] focus:outline-none cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="stock">Stock Availability</option>
            </select>

            <label className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 text-xs text-white/80 hover:bg-white/[0.06]">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-[#22c55e] size-3.5"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {["All", ...STORE_CATEGORIES].map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat as any);
                  setCurrentPage(1);
                }}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#22c55e] text-black shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                    : "border border-white/10 bg-white/[0.04] text-white/70 hover:border-white/20 hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="mt-8">
          {paginatedProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center">
              <ShoppingBag className="mx-auto size-12 text-white/20 mb-3" />
              <h3 className="text-base font-bold text-white">No products match your criteria</h3>
              <p className="mt-1 text-xs text-white/50">Try resetting filters or searching with different keywords.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                  setPriceFilter("all");
                  setInStockOnly(false);
                }}
                className="mt-4 rounded-xl bg-[#22c55e] px-4 py-2 text-xs font-bold text-black hover:bg-[#16a34a] cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedProducts.map((p) => {
                const isOutOfStock = (p.stock ?? 0) === 0;
                const price = p.retail_price;
                return (
                  <div
                    key={p.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0e12] p-3.5 transition-all duration-300 hover:border-[#22c55e]/40 hover:bg-[#101318] shadow-lg"
                  >
                    <div>
                      {/* Product Image */}
                      <Link
                        to="/product/$slug"
                        params={{ slug: p.slug }}
                        className="relative block aspect-[1.3] w-full overflow-hidden rounded-xl border border-white/10 bg-black/40"
                      >
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center bg-black/60 text-white/40 text-xs">
                            No Preview
                          </div>
                        )}
                        <span className="absolute left-2.5 top-2.5 rounded-md border border-white/10 bg-black/75 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                          {p.category}
                        </span>
                      </Link>

                      {/* Product Title */}
                      <div className="mt-3">
                        <Link
                          to="/product/$slug"
                          params={{ slug: p.slug }}
                          className="font-heading text-sm font-bold text-white hover:text-[#22c55e] transition-colors line-clamp-1"
                        >
                          {p.name}
                        </Link>
                        <p className="mt-1 text-[11px] text-white/50 line-clamp-1">
                          {p.variants?.length ? `${p.variants.length} options • Instant Key` : "Single key activation"}
                        </p>
                      </div>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-white/40 uppercase">Price</span>
                        <p className="font-heading text-base font-extrabold text-[#22c55e]">
                          ₹{price.toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link
                          to="/product/$slug"
                          params={{ slug: p.slug }}
                          className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10 transition-colors"
                        >
                          Details
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenOrder(p)}
                          disabled={isOutOfStock}
                          className="rounded-lg bg-[#22c55e] px-3 py-1.5 text-xs font-extrabold text-black hover:bg-[#16a34a] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <span className="text-xs text-white/60 px-3">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Quick Order Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-[#0c0e12] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-white/10 text-white/70 hover:text-white cursor-pointer"
            >
              <X className="size-4" />
            </button>

            {!orderResult ? (
              <div>
                <h3 className="font-heading text-lg font-bold text-white">
                  Buy {selectedProduct.name}
                </h3>
                <p className="mt-1 text-xs text-white/50">
                  Instant automated credentials dispatch to your email.
                </p>

                {/* Variant Selector */}
                {selectedProduct.variants && selectedProduct.variants.length > 1 && (
                  <div className="mt-4">
                    <label className="text-xs font-semibold text-white/70">Select Option</label>
                    <div className="mt-2 space-y-1.5 max-h-40 overflow-y-auto">
                      {selectedProduct.variants.map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`w-full flex items-center justify-between rounded-xl border p-2.5 text-xs transition-all cursor-pointer ${
                            selectedVariant?.id === v.id
                              ? "border-[#22c55e] bg-[#22c55e]/10 text-white font-semibold"
                              : "border-white/10 bg-white/[0.02] text-white/70 hover:border-white/20"
                          }`}
                        >
                          <span className="truncate">{v.name}</span>
                          <span className="text-[#22c55e] font-bold">₹{v.retail_price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Email Input */}
                <div className="mt-4">
                  <label className="text-xs font-semibold text-white/70">Delivery Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={orderEmail}
                    onChange={(e) => setOrderEmail(e.target.value)}
                    className="mt-1.5 h-10 w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 text-xs text-white placeholder:text-white/40 focus:border-[#22c55e] focus:outline-none"
                  />
                </div>

                {/* Total & Checkout */}
                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-white/40">Total Amount</span>
                    <p className="font-heading text-lg font-extrabold text-[#22c55e]">
                      ₹{selectedVariant ? selectedVariant.retail_price : selectedProduct.retail_price}
                    </p>
                  </div>
                  <Button
                    onClick={handlePayAndOrder}
                    disabled={isPlacingOrder || !orderEmail.includes("@")}
                    className="h-10 rounded-xl bg-[#22c55e] px-5 text-xs font-extrabold text-black hover:bg-[#16a34a] cursor-pointer"
                  >
                    {isPlacingOrder ? "Initializing..." : "Pay with UPI / Card"}
                  </Button>
                </div>
              </div>
            ) : orderResult.success ? (
              <div className="text-center py-4">
                <CheckCircle2 className="mx-auto size-12 text-[#22c55e] mb-3" />
                <h3 className="font-heading text-lg font-bold text-white">Order Successful!</h3>
                <p className="mt-1 text-xs text-white/60">
                  Credentials have been sent to {orderEmail}.
                </p>

                {orderResult.keys && orderResult.keys.length > 0 && (
                  <div className="mt-4 rounded-xl border border-white/10 bg-black/60 p-3 text-left">
                    <p className="text-[11px] font-bold text-white/60 mb-1">Your Key / Account:</p>
                    {orderResult.keys.map((k, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2 text-xs font-mono text-[#22c55e]">
                        <span className="truncate">{k}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyKey(k)}
                          className="shrink-0 p-1 text-white/60 hover:text-white"
                        >
                          {copiedKey === k ? <Check className="size-3.5 text-[#22c55e]" /> : <Copy className="size-3.5" />}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  onClick={() => setSelectedProduct(null)}
                  className="mt-6 w-full rounded-xl bg-[#22c55e] text-xs font-bold text-black"
                >
                  Done
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <X className="mx-auto size-12 text-rose-500 mb-3" />
                <h3 className="font-heading text-lg font-bold text-white">Payment Failed</h3>
                <p className="mt-1 text-xs text-rose-300">{orderResult.error || "Order could not be processed."}</p>
                <Button
                  onClick={() => setOrderResult(null)}
                  className="mt-6 w-full rounded-xl bg-white/10 text-xs font-bold text-white"
                >
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <StoreFooter />
    </div>
  );
}

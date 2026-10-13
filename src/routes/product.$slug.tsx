import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  KeyRound,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Boxes,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Lock,
  Layers3,
  Flame,
  Zap,
  Coins,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  fetchResellerProducts,
  createResellerOrder,
  type ResellerProduct,
  type ResellerVariant,
  type OrderResult,
} from "@/lib/reseller-api";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  loadRazorpayScript,
} from "@/lib/razorpay";


export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const data = await fetchResellerProducts();
    const product = data.products.find(
      (p) =>
        p.slug === params.slug ||
        p.id === params.slug ||
        p.allSlugs?.includes(params.slug) ||
        p.allIds?.includes(params.slug) ||
        p.variants?.some((v) => v.rawProductId === params.slug || v.id === params.slug)
    );
    const related = data.products
      .filter((p) => p.id !== product?.id && p.category === product?.category)
      .slice(0, 4);

    return { product, related, slugParam: params.slug };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.product
          ? `${loaderData.product.name} — GurfMarket`
          : "Product Not Found",
      },
      {
        name: "description",
        content: `Instant delivery for ${loaderData?.product?.name || "digital product"}. 24/7 verified stock.`,
      },
    ],
  }),
  component: ProductDetail,
});

function ProductDetail() {
  const { product, related = [], slugParam } = Route.useLoaderData();

  if (!product) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="font-display text-3xl font-bold">Product Not Found</h1>
        <p className="mt-2 text-sm text-copy-secondary">
          The requested product could not be located in our live inventory.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">Back to Storefront</Link>
        </Button>
      </main>
    );
  }

  const initialVariant = useMemo(() => {
    if (!product || !product.variants.length) return null;
    const match = product.variants.find(
      (v) => v.rawProductId === slugParam || v.id === slugParam || v.id.includes(slugParam)
    );
    return (match || product.variants[0]) ?? null;
  }, [product, slugParam]);

  const [selectedVariant, setSelectedVariant] = useState<ResellerVariant | null>(initialVariant ?? null);
  const [quantity, setQuantity] = useState(1);
  const [showFullName, setShowFullName] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const unitPrice = selectedVariant
    ? selectedVariant.retail_price
    : product.retail_price;
  const rawTotal = unitPrice * quantity;
  const totalPrice = rawTotal.toLocaleString("en-IN");
  const currentStock = selectedVariant?.stock !== null && selectedVariant?.stock !== undefined
    ? selectedVariant.stock
    : (product.stock ?? 29);


  const handleOrder = async () => {
    setIsOrdering(true);
    setOrderResult(null);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Unable to load Razorpay payment gateway. Please check your internet connection.");
      }

      const orderData = await createRazorpayOrder({
        data: {
          amount: rawTotal,
          productName: `${product.name}${selectedVariant ? ` - ${selectedVariant.name}` : ""}`,
          productId: selectedVariant?.rawProductId || product.id,
          variantId: selectedVariant?.variantId,
          quantity,
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
        description: `${product.name} - Instant Access`,
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
            setIsOrdering(false);
          },
        },
        handler: async (response: any) => {
          setIsOrdering(true);
          try {
            const verification = await verifyRazorpayPayment({
              data: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                productId: selectedVariant?.rawProductId || product.id,
                variantId: selectedVariant?.variantId,
                quantity,
                customerEmail,
                customerPhone,
                amount: rawTotal,
                productName: `${product.name}${selectedVariant ? ` - ${selectedVariant.name}` : ""}`,
              },
            });

            if (verification.success) {
              setOrderResult({
                success: true,
                orderId: verification.orderId,
                paymentId: verification.paymentId,
                invoiceToken: verification.invoiceToken,
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
            setIsOrdering(false);
          }
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.on("payment.failed", (failRes: any) => {
        setIsOrdering(false);
        setOrderResult({
          success: false,
          error: failRes.error?.description || "Payment was cancelled or failed.",
        });
      });
      razorpayInstance.open();
    } catch (err: any) {
      setOrderResult({
        success: false,
        error: err.message || "Failed to process order",
      });
      setIsOrdering(false);
    }
  };


  const copyToClipboard = (text: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-[#07090b] pb-24 text-foreground selection:bg-[#22c55e]/30 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#07090b]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo-icon.png"
              alt="GurfMarket Crown Emblem"
              className="size-9.5 shrink-0 rounded-xl object-cover border border-[#22c55e]/50 shadow-[0_0_16px_rgba(34,197,94,0.35)]"
            />
            <div className="flex flex-col">
              <span className="text-[15px] font-extrabold tracking-[0.06em] text-white">GURFMARKET</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#22c55e]">Storefront</span>
            </div>
          </Link>

          <Button asChild variant="outline" size="sm" className="rounded-lg border-white/10 bg-white/[0.03] text-xs text-white/80 hover:bg-white/10 hover:text-white">
            <Link to="/">
              <ArrowLeft className="mr-1.5 size-3.5" /> Back to Catalog
            </Link>
          </Button>
        </div>
      </header>

      {/* Breadcrumb matching Supreme Market */}
      <div className="mx-auto max-w-[1240px] px-5 py-5 sm:px-8">
        <nav className="flex items-center gap-2 text-xs text-white/50">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="font-semibold text-[#22c55e] uppercase tracking-wider">{product.category}</span>
          <span>/</span>
          <span className="truncate font-medium text-white/90">{product.name}</span>
        </nav>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          
          {/* Left Column: Official Artwork & Product Guarantees */}
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0e11] p-6 shadow-2xl">
              {/* Product Artwork with Supreme badge overlays */}
              <div className="relative aspect-[1.42] w-full overflow-hidden rounded-xl border border-white/10 bg-black/60 shadow-inner">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/[0.05] to-white/[0.02]">
                    <Boxes className="size-16 text-white/20" />
                  </div>
                )}

                {/* Top-Left Version Badge */}
                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md border border-white/10 bg-black/80 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
                  <Layers3 className="size-3.5 text-[#22c55e]" />
                  <span>
                    {product.variants.length > 0
                      ? `${product.variants.length} ${product.variants.length === 1 ? "version" : "versions"}`
                      : "Instant Key"}
                  </span>
                </div>

                {/* Top-Right Star Rating */}
                <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-md border border-white/10 bg-black/80 px-2.5 py-1 text-xs font-bold text-amber-400 backdrop-blur-md">
                  <Sparkles className="size-3.5" />
                  <span>5.0</span>
                </div>
              </div>

              {/* Delivery Specifications */}
              <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-white/80">
                  <KeyRound className="size-4 text-[#22c55e] shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Instant Delivery</p>
                    <p className="text-[11px] text-white/40">Automated 24/7</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-white/80">
                  <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Full Warranty</p>
                    <p className="text-[11px] text-white/40">Replacement guarantee</p>
                  </div>
                </div>
              </div>

              {/* Product Info Description */}
              <div className="mt-6 border-t border-white/[0.08] pt-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">
                  About this Product
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  Official authentic subscription access for <strong className="text-white">{product.name}</strong>. Directly connected to high-tier supplier inventory with automated on-screen key dispatch upon completed order.
                </p>
              </div>

              {/* Perks List */}
              <div className="mt-5 space-y-2 text-xs text-white/60">
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-[#22c55e]" />
                  <span>Verified credentials tested before dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-[#22c55e]" />
                  <span>No waiting queue — instant key generation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-[#22c55e]" />
                  <span>Support available 24/7 for activation guidance</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Exact Supreme Market Plan Selection matching screenshot */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category Breadcrumb/Tag */}
              <span className="text-xs font-bold uppercase tracking-widest text-[#22c55e]">
                {product.category}
              </span>

              {/* Product Title */}
              <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {product.name}
              </h1>

              {/* Stock and Status row */}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                {product.inStock ? (
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    {product.totalStockCount >= 999
                      ? "In stock"
                      : `${product.totalStockCount} in stock`}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 font-semibold text-amber-400">
                    <span className="size-2 rounded-full bg-amber-400" />
                    Preorder
                  </span>
                )}
                <span className="text-white/20">•</span>
                <span className="text-white/60">Automated Dispatch</span>
                <span className="text-white/20">•</span>
                <span className="text-white/60">Verified Wholesale</span>
              </div>

              {/* Choose your plan section */}
              <div className="mt-8">
                <h2 className="text-base font-bold text-white">Choose your plan</h2>

                {/* Plan Options list */}
                <div className="mt-3 space-y-2.5">
                  {(product.variants.length > 0 ? product.variants : [
                    {
                      id: product.id,
                      rawProductId: product.id,
                      name: "Standard Edition",
                      cost_price: product.cost_price,
                      retail_price: product.retail_price,
                      stock: product.stock,
                    }
                  ]).map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    const displayName = showFullName
                      ? v.name
                      : v.name.length > 80
                      ? v.name.slice(0, 75) + "..."
                      : v.name;

                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`group relative flex w-full items-center justify-between rounded-xl p-4 text-left transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "border-2 border-[#22c55e] bg-[#0c1611] shadow-[0_0_24px_rgba(34,197,94,0.18)]"
                            : "border border-white/10 bg-[#0e1115] hover:border-white/25 hover:bg-[#12161c]"
                        }`}
                      >
                        {/* Left: Radio circle indicator & Name */}
                        <div className="flex items-center gap-3.5 pr-3 min-w-0">
                          {/* Radio circle matching screenshot */}
                          <div
                            className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? "border-[#22c55e] bg-transparent"
                                : "border-white/30 bg-transparent group-hover:border-white/50"
                            }`}
                          >
                            {isSelected && (
                              <span className="size-2.5 rounded-full bg-[#22c55e]" />
                            )}
                          </div>

                          {/* Plan Title & Stock */}
                          <div className="flex flex-col min-w-0">
                            <span
                              className={`text-sm sm:text-[14px] font-medium leading-snug break-words ${
                                isSelected ? "text-white font-semibold" : "text-white/90"
                              }`}
                            >
                              {displayName}
                            </span>
                            {v.stock !== null && v.stock !== undefined && v.stock <= 5 && (
                              <span className="text-[11px] font-semibold text-amber-400 mt-0.5">
                                Limited stock
                              </span>
                            )}
                            {v.stock !== null && v.stock !== undefined && v.stock > 5 && (
                              <span className="text-[11px] font-medium text-white/50 mt-0.5">
                                {v.stock} in stock
                              </span>
                            )}
                          </div>
                        </div>


                        {/* Right: Price */}
                        <div className="shrink-0 text-right pl-2">
                          <span className="font-display text-sm sm:text-base font-bold text-white">
                            ₹{v.retail_price.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Show the plan's full name toggle matching screenshot */}
                {product.variants.some((v) => v.name.length > 60) && (
                  <button
                    type="button"
                    onClick={() => setShowFullName(!showFullName)}
                    className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#22c55e] hover:text-[#4ade80] transition-colors cursor-pointer"
                  >
                    <span>
                      {showFullName
                        ? "Hide plan's full name"
                        : "Show the plan's full name"}
                    </span>
                    {showFullName ? (
                      <ChevronUp className="size-3.5" />
                    ) : (
                      <ChevronDown className="size-3.5" />
                    )}
                  </button>
                )}
              </div>

              {/* Full Access / Security Description matching Supreme Market */}
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/[0.07] bg-[#0c0e11] p-4 text-xs text-white/70">
                <Lock className="size-4 text-[#22c55e] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-white">Full Access Guarantee:</strong> The account credentials or license key delivered are exclusively yours. Sourced directly via wholesale channels with full replacement warranty.
                </p>
              </div>

              {/* Error Notice */}
              {orderResult?.error && (
                <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3.5 text-xs text-rose-300">
                  <p className="font-bold">Payment Notice:</p>
                  <p className="mt-1">{orderResult.error}</p>
                </div>
              )}
            </div>

            {/* Bottom Checkout Action Box */}
            <div className="mt-8 rounded-2xl border border-white/[0.1] bg-[#0d1014] p-5 sm:p-6 shadow-xl">
              {orderSuccess && orderResult?.success ? (
                <div className="text-center py-4">
                  <span className="mx-auto grid size-13 place-items-center rounded-full bg-emerald-500/20 text-emerald-400 ring-8 ring-emerald-500/10">
                    <CheckCircle2 className="size-7" />
                  </span>
                  <h3 className="mt-3.5 font-heading text-xl font-extrabold text-white">Payment Confirmed!</h3>
                  <p className="mt-1 text-xs text-white/60">
                    {product.name} {selectedVariant ? `• ${selectedVariant.name}` : ""}
                  </p>

                  {orderResult.paymentId && (
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-xs font-mono text-white/70">
                      <span className="text-[#22c55e]">Razorpay ID:</span>
                      <span>{orderResult.paymentId}</span>
                    </div>
                  )}

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
                    <pre className="mt-2.5 max-h-40 overflow-x-auto rounded-lg bg-black/80 p-3.5 font-mono text-xs text-white selection:bg-[#22c55e]/40">
                      {orderResult.keys && orderResult.keys.length > 0
                        ? orderResult.keys.join("\n")
                        : "Your digital license has been reserved. Check your email or live support."}
                    </pre>
                  </div>

                  {orderResult.notice && (
                    <p className="mt-3 text-xs text-amber-300 bg-amber-500/10 rounded-lg p-2.5 border border-amber-500/20">
                      {orderResult.notice}
                    </p>
                  )}

                  <p className="mt-3.5 text-base font-bold text-emerald-400">
                    Paid: ₹{totalPrice}
                  </p>

                  <div className="mt-4 flex flex-col gap-2">
                    <Button
                      asChild
                      className="w-full rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-black font-extrabold shadow-[0_0_20px_rgba(34,197,94,0.35)] cursor-pointer"
                    >
                      <Link to="/invoice/$id" params={{ id: orderResult.invoiceToken || orderResult.orderId || orderResult.paymentId || "" }}>
                        📄 View Official Invoice & Download Keys →
                      </Link>
                    </Button>

                    <Button
                      onClick={() => {
                        setOrderSuccess(false);
                        setOrderResult(null);
                      }}
                      variant="outline"
                      className="w-full rounded-xl border-white/10 bg-white/[0.04] hover:bg-white/10 text-white font-semibold cursor-pointer"
                    >
                      Place Another Order
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Quantity Row matching Supreme Market */}
                  <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
                    <div>
                      <span className="text-sm font-bold text-white">Quantity</span>
                    </div>

                    <div className="flex flex-col items-end">
                      <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.04] p-1">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="grid size-8 place-items-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-10 text-center text-sm font-bold text-white">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.min(currentStock > 0 ? currentStock : 99, quantity + 1))}
                          className="grid size-8 place-items-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <p className="mt-1.5 text-right text-[11px] font-bold text-amber-400">
                        Max {currentStock} in stock
                      </p>
                    </div>
                  </div>

                  {/* Price & Stock Row matching Supreme Market */}
                  <div className="space-y-2 pt-1">
                    <span className="text-xs uppercase tracking-wider text-white/50">Price</span>
                    <div className="flex items-baseline justify-between">
                      <p className="font-display text-3xl font-extrabold text-white">
                        ₹{totalPrice}
                      </p>
                    </div>

                    {/* Stock & Delivery status badges right above payment */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      {currentStock === 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-rose-500" />
                          <span className="font-semibold text-rose-400">
                            Out of stock · 0 available
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-[#22c55e] animate-pulse" />
                          <span className="font-semibold text-[#22c55e]">
                            In stock · {currentStock} available
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                        <Zap className="size-3.5 fill-emerald-400" />
                        <span>Instant delivery</span>
                      </div>
                    </div>
                  </div>

                  {/* Cashback box matching Supreme Market */}
                  <div className="flex items-center gap-3 rounded-xl border border-[#22c55e]/20 bg-[#22c55e]/[0.05] p-3 text-xs">
                    <span className="grid size-7 place-items-center rounded-lg bg-[#22c55e]/20 text-[#22c55e] shrink-0">
                      <Coins className="size-4" />
                    </span>
                    <div>
                      <p className="font-semibold text-white">
                        Earn ₹{Math.max(1, Math.round(rawTotal * 0.02))} cashback on this order
                      </p>
                      <p className="text-[11px] text-white/50">
                        2% back to your digital wallet balance, instantly.
                      </p>
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-white/70 mb-1">
                        Email Address (for key delivery)
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-[#22c55e] focus:outline-none"
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
                        className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-[#22c55e] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Full Width Buy / Pay Button matching Supreme Market */}
                  <button
                    type="button"
                    onClick={handleOrder}
                    disabled={isOrdering || !product.inStock || currentStock === 0}
                    className="mt-2 w-full flex h-13 items-center justify-center gap-2.5 rounded-xl bg-[#22c55e] text-base font-extrabold text-black shadow-[0_4px_25px_rgba(34,197,94,0.35)] transition-all hover:bg-[#16a34a] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    {isOrdering ? (
                      <>
                        <RefreshCw className="size-4 animate-spin" />
                        <span>Processing Razorpay...</span>
                      </>
                    ) : currentStock === 0 ? (
                      <span>Currently Out of Stock</span>
                    ) : (
                      <>
                        <ShoppingBag className="size-5" />
                        <span>Pay ₹{totalPrice} with Razorpay</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 pt-0.5 text-[11px] font-medium text-white/50">
                    <ShieldCheck className="size-3.5 text-[#22c55e]" />
                    <span>Secured by Razorpay • UPI (GPay/PhonePe), Cards, NetBanking</span>
                  </div>
                </div>

              )}
            </div>

          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-24 border-t border-white/[0.08] pt-12">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
              More in {product.category}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to="/product/$slug"
                  params={{ slug: item.slug }}
                  className="group overflow-hidden rounded-xl border border-white/10 bg-[#0c0e10] p-0 transition-all duration-300 hover:-translate-y-1 hover:border-[#22c55e]/50 hover:shadow-xl"
                >
                  <div className="relative aspect-[1.42] w-full overflow-hidden bg-black/60">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Boxes className="size-8 text-white/20" />
                      </div>
                    )}

                    <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-md border border-white/10 bg-black/80 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-md">
                      <Layers3 className="size-3 text-[#22c55e]" />
                      <span>{item.variants.length || 1} versions</span>
                    </div>
                  </div>
                  <div className="p-3.5">
                    <p className="text-[10px] uppercase tracking-wider text-white/50">
                      {item.category}
                    </p>
                    <h4 className="mt-1 line-clamp-1 text-sm font-semibold text-white group-hover:text-[#22c55e] transition-colors">
                      {item.name}
                    </h4>
                    <p className="mt-2 font-display text-base font-bold text-white">
                      From ₹{item.retail_price.toLocaleString("en-IN")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

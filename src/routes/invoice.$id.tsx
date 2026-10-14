import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  KeyRound,
  Printer,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrderDetails } from "@/lib/store-config";

export const Route = createFileRoute("/invoice/$id")({
  loader: async ({ params }) => {
    try {
      const order = await getOrderDetails({ data: params.id });
      return { order, orderId: params.id };
    } catch (err) {
      console.error("Failed to load invoice order:", err);
      return { order: null, orderId: params.id };
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.order
          ? `Invoice #${loaderData.order.orderId || loaderData.orderId} — GurfMarket`
          : `Order Invoice — GurfMarket`,
      },
    ],
  }),
  component: InvoicePage,
});

function InvoicePage() {
  const { order, orderId } = Route.useLoaderData();
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const displayInvoiceNumber =
    order?.orderId && !order.orderId.startsWith("gurf_inv_")
      ? order.orderId
      : `GURF-${(order?.paymentId || orderId).replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase()}`;

  const keys = order?.keysDelivered || [];
  const credentialsText = keys.join("\n");

  const copyToClipboard = (text: string, type: "keys" | "id" | "url") => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === "keys") {
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 2000);
      } else if (type === "id") {
        setCopiedOrderId(true);
        setTimeout(() => setCopiedOrderId(false), 2000);
      } else {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      }
    }
  };

  const downloadCredentialsTxt = () => {
    const content = `========================================================\nGURFMARKET — OFFICIAL ORDER INVOICE & DELIVERABLES\n========================================================\nInvoice ID:     ${displayInvoiceNumber}\nPrivate Token:  ${orderId}\nPayment ID:     ${order?.paymentId || "N/A"}\nProduct:        ${order?.productName || "Digital Product"}\nVariant:        ${order?.variantName || "Standard"}\nTotal Paid:     ₹${order?.amount ? order.amount.toLocaleString("en-IN") : "0"}\nCustomer Email: ${order?.customerEmail || "N/A"}\nDate:           ${order?.date ? new Date(order.date).toLocaleString() : new Date().toLocaleString()}\n\n--------------------------------------------------------\nDELIVERED CREDENTIALS / ACCESS KEYS:\n--------------------------------------------------------\n${credentialsText || "No credentials attached"}\n\n========================================================\nNeed Help? 24/7 Replacement Warranty Guarantee\nTelegram Support Desk: https://t.me/gurfmarketsupport\nOfficial Telegram:     https://t.me/gurfmarket\nWhatsApp Support:      +91 94179 12634 (https://wa.me/919417912634)\n========================================================\n`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `GurfMarket-Invoice-${displayInvoiceNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // If order was not found
  if (!order) {
    return (
      <main className="min-h-screen bg-[#07090b] text-foreground flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full rounded-2xl border border-white/10 bg-[#0c0e12] p-8 shadow-2xl">
          <div className="mx-auto size-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <KeyRound className="size-7" />
          </div>
          <h1 className="mt-5 text-xl font-extrabold text-white">Invoice Not Found</h1>
          <p className="mt-2 text-xs text-white/60 leading-relaxed">
            We could not find an order matching ID <code className="text-[#22c55e]">{orderId}</code>. If you recently completed payment, please check your email or contact 24/7 support.
          </p>
          <div className="mt-6 flex flex-col gap-2.5">
            <Button asChild className="w-full bg-[#22c55e] text-black font-bold hover:bg-[#16a34a]">
              <Link to="/">Return to Storefront</Link>
            </Button>
            <a
              href="https://t.me/gurfmarketsupport"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-sky-500/30 bg-sky-500/10 px-4 py-2.5 text-xs font-semibold text-sky-400 hover:bg-sky-500/20"
            >
              Telegram Support Desk (@gurfmarketsupport) <ExternalLink className="size-3" />
            </a>
            <a
              href="https://wa.me/919417912634"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20"
            >
              WhatsApp Support (+91 94179 12634) <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      </main>
    );
  }

  const isPaid = order.status === "paid" || order.status === "fulfilled";

  return (
    <main className="min-h-screen bg-[#07090b] pb-24 text-foreground selection:bg-[#22c55e]/30 selection:text-white print:bg-white print:text-black print:pb-0">
      {/* Top Navbar matching Store & Supreme Market (Hidden on print) */}
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#07090b]/90 backdrop-blur-xl print:hidden">
        <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo-icon.png"
              alt="GurfMarket Crown Emblem"
              className="size-9.5 shrink-0 rounded-xl object-cover border border-[#22c55e]/50 shadow-[0_0_16px_rgba(34,197,94,0.35)]"
            />
            <div className="flex flex-col">
              <span className="text-[15px] font-extrabold tracking-[0.06em] text-white">GURFMARKET</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#22c55e]">
                Verified Digital Dispatch
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-white/10 cursor-pointer transition-colors"
            >
              <Printer className="size-3.5 text-[#22c55e]" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>

            <Button asChild variant="outline" size="sm" className="rounded-lg border-white/10 bg-white/[0.03] text-xs text-white/80 hover:bg-white/10 hover:text-white">
              <Link to="/">
                <ArrowLeft className="mr-1.5 size-3.5" /> Back to Store
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Printable Invoice Header (Only visible on paper / PDF print) */}
      <div className="hidden print:block p-8 border-b border-gray-300">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black text-black">GURFMARKET</h1>
            <p className="text-xs text-gray-500">Official Digital Delivery Tax Receipt & Invoice</p>
            <p className="text-xs text-gray-500 mt-1">Telegram Support: @gurfmarket</p>
          </div>
          <div className="text-right">
            <div className="inline-block bg-green-100 text-green-800 font-bold text-xs px-3 py-1 rounded">
              PAID & FULFILLED
            </div>
            <p className="text-xs font-mono text-gray-600 mt-1">Invoice #{order.orderId}</p>
            <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Supreme Market 3-Step Checkout Progress Tracker (Hidden on print) */}
      <div className="mx-auto max-w-[1240px] px-5 py-6 sm:px-8 print:hidden">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 rounded-xl border border-white/[0.08] bg-[#0c0e12] p-3 sm:p-4">
          {/* Step 1: Order Information */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="grid size-7 sm:size-8 place-items-center rounded-full bg-[#22c55e]/20 text-[#22c55e] shrink-0 border border-[#22c55e]/40">
              <Check className="size-4 stroke-[3]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">Step 1</p>
              <p className="truncate text-xs sm:text-sm font-semibold text-white/90">Order Info</p>
            </div>
          </div>

          {/* Step 2: Confirm & Pay */}
          <div className="flex items-center gap-2 sm:gap-3 border-l border-white/[0.06] pl-2 sm:pl-4">
            <div className="grid size-7 sm:size-8 place-items-center rounded-full bg-[#22c55e]/20 text-[#22c55e] shrink-0 border border-[#22c55e]/40">
              <Check className="size-4 stroke-[3]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">Step 2</p>
              <p className="truncate text-xs sm:text-sm font-semibold text-white/90">Payment</p>
            </div>
          </div>

          {/* Step 3: Receive Items (ACTIVE) */}
          <div className="flex items-center gap-2 sm:gap-3 border-l border-white/[0.06] pl-2 sm:pl-4">
            <div className="grid size-7 sm:size-8 place-items-center rounded-full bg-[#22c55e] text-black shrink-0 font-extrabold shadow-[0_0_16px_rgba(34,197,94,0.5)]">
              <Sparkles className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#22c55e]">Step 3 (Complete)</p>
              <p className="truncate text-xs sm:text-sm font-bold text-white">Receive Items</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Invoice Grid matching Supreme Market */}
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.85fr] lg:gap-10">
          
          {/* Left Column: Order Summary Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e12] p-6 shadow-xl print:border-gray-300 print:bg-white print:shadow-none">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-white print:text-black">
                  Order Summary
                </h2>
                <span className="rounded-md border border-[#22c55e]/30 bg-[#22c55e]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#22c55e]">
                  Verified
                </span>
              </div>

              {/* Product item details */}
              <div className="mt-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white print:text-black leading-snug">
                      {order.productName}
                    </h3>
                    {order.variantName && (
                      <p className="mt-0.5 text-xs font-medium text-[#22c55e]">
                        Plan: {order.variantName}
                      </p>
                    )}
                    <p className="mt-1 text-[11px] text-white/50 print:text-gray-500">
                      Qty: {order.quantity || 1} • Digital Instant License
                    </p>
                  </div>
                  <div className="text-right font-mono font-bold text-white print:text-black text-sm">
                    ₹{order.amount ? order.amount.toLocaleString("en-IN") : "0"}
                  </div>
                </div>

                <div className="border-t border-white/[0.06] pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-white/60 print:text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-mono text-white print:text-black">₹{order.amount ? order.amount.toLocaleString("en-IN") : "0"}</span>
                  </div>
                  <div className="flex justify-between text-white/60 print:text-gray-600">
                    <span>Processing & Delivery</span>
                    <span className="font-semibold text-[#22c55e]">FREE (Instant)</span>
                  </div>
                  <div className="flex justify-between items-baseline border-t border-white/[0.08] pt-3 text-sm">
                    <span className="font-bold text-white print:text-black">Total Paid</span>
                    <span className="font-mono text-xl font-extrabold text-[#22c55e]">
                      ₹{order.amount ? order.amount.toLocaleString("en-IN") : "0"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Email notice box */}
              {order.customerEmail && (
                <div className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-xs print:border-gray-200">
                  <p className="text-[11px] font-semibold text-white/50 print:text-gray-500 uppercase tracking-wider">
                    Receipt Sent To:
                  </p>
                  <p className="mt-1 font-mono font-medium text-white print:text-black break-all">
                    {order.customerEmail}
                  </p>
                </div>
              )}

              {/* 24/7 Support Card */}
              <div className="mt-6 rounded-xl border border-[#22c55e]/20 bg-[#22c55e]/[0.04] p-4 text-xs print:hidden space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <ShieldCheck className="size-4" />
                  <span>24/7 Replacement Warranty</span>
                </div>
                <p className="text-[11px] text-white/60 leading-relaxed">
                  Need help activating or instant replacements? Reach our direct support channels:
                </p>
                <div className="pt-1 flex flex-col gap-2">
                  <a
                    href="https://t.me/gurfmarketsupport"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#22c55e] py-2 text-center text-xs font-extrabold text-black hover:bg-[#16a34a] transition-colors"
                  >
                    Open Telegram Support (@gurfmarketsupport) →
                  </a>
                  <a
                    href="https://wa.me/919417912634"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 py-2 text-center text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                  >
                    WhatsApp Support (+91 94179 12634) →
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Invoice Status & Credentials Deliverables */}
          <section className="space-y-6">
            
            {/* Top Order Completed Alert Banner matching Supreme Market */}
            <div className="overflow-hidden rounded-2xl border border-emerald-500/30 bg-[#0c1410] p-6 shadow-xl print:border-gray-300 print:bg-white print:shadow-none">
              <div className="flex items-start gap-4">
                <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/40 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                  <CheckCircle2 className="size-7" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white print:text-black">
                      Order Completed
                    </h2>
                    <span className="rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/40">
                      ● Fulfilled
                    </span>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-white/70 print:text-gray-600">
                    Your items are ready. Check below for your delivered credentials and license key.
                  </p>
                </div>
              </div>
            </div>

            {/* Delivered Items Monospace Credentials Box matching Supreme Market */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e12] p-6 shadow-xl print:border-gray-300 print:bg-white print:shadow-none">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
                <div className="flex items-center gap-2">
                  <KeyRound className="size-4 text-[#22c55e]" />
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-white print:text-black">
                    Delivered Items: {order.productName}
                  </h3>
                </div>

                {/* Utility Buttons: Copy All & Download TXT (Hidden on print) */}
                <div className="flex items-center gap-2 print:hidden">
                  <button
                    onClick={() => copyToClipboard(credentialsText, "keys")}
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                  >
                    {copiedKey ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                    <span>{copiedKey ? "Copied All" : "Copy All"}</span>
                  </button>

                  <button
                    onClick={downloadCredentialsTxt}
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-[#22c55e]/10 px-3 py-1.5 text-xs font-bold text-[#22c55e] hover:bg-[#22c55e]/20 transition-all cursor-pointer"
                  >
                    <Download className="size-3.5" />
                    <span>Download TXT</span>
                  </button>
                </div>
              </div>

              {/* The Monospace Delivered Box */}
              <div className="mt-4">
                <div className="rounded-xl border border-emerald-500/40 bg-[#000000] p-4 font-mono text-xs text-[#4ade80] shadow-inner print:bg-gray-50 print:text-black print:border-gray-400">
                  {keys.length > 0 ? (
                    <div className="space-y-2 select-all">
                      {keys.map((k: string, idx: number) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] break-all print:bg-transparent print:border-none"
                        >
                          {k}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 text-white/50 italic">
                      Your digital order has been reserved. If keys do not appear instantly, our 24/7 support will issue fresh replacement credentials.
                    </div>
                  )}
                </div>
                <p className="mt-2 text-[11px] text-white/40 print:text-gray-500">
                  💡 Tip: Copy the credentials exactly as shown above to log in or activate your subscription.
                </p>
              </div>
            </div>

            {/* Thank You & Support Banner matching Supreme Market screenshot */}
            <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-r from-[#0d1611] via-[#0c0e12] to-[#0c0e12] p-6 print:border-gray-300 print:bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-[#22c55e]">
                      GurfMarket
                    </span>
                    <span className="text-white/20">•</span>
                    <span className="text-xs text-white/60">Verified Order Dispatch</span>
                  </div>
                  <h4 className="mt-1 text-lg font-black text-white print:text-black">
                    THANK YOU FOR YOUR PURCHASE!
                  </h4>
                  <p className="mt-1 text-xs text-white/60 print:text-gray-600 max-w-lg">
                    We appreciate your trust in GurfMarket. If you need any assistance or have questions about using your new subscription, please reach out to our team.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 print:hidden">
                  <a
                    href="https://t.me/gurfmarketsupport"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#22c55e] px-4 py-2.5 text-xs font-extrabold text-black hover:bg-[#16a34a] transition-all shadow-[0_0_15px_rgba(34,197,94,0.25)]"
                  >
                    <span>Telegram Support</span>
                    <ExternalLink className="size-3.5" />
                  </a>
                  <a
                    href="https://wa.me/919417912634"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-4 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 transition-all"
                  >
                    <span>WhatsApp</span>
                    <ExternalLink className="size-3.5" />
                  </a>
                  <a
                    href="https://t.me/gurfmarket"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2.5 text-xs font-bold text-white transition-all"
                  >
                    <span>Official Channel</span>
                    <ExternalLink className="size-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Order Information Metadata Table matching Supreme Market */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e12] p-6 shadow-xl print:border-gray-300 print:bg-white print:shadow-none">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-white print:text-black border-b border-white/[0.06] pb-3">
                Order Information
              </h3>

              <div className="mt-4 divide-y divide-white/[0.06] text-xs">
                {/* Invoice / Order ID */}
                <div className="flex items-center justify-between py-3">
                  <span className="text-white/50 print:text-gray-500">Invoice ID</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white print:text-black">
                      {displayInvoiceNumber}
                    </span>
                    <button
                      onClick={() => copyToClipboard(displayInvoiceNumber, "id")}
                      type="button"
                      className="text-white/50 hover:text-white print:hidden cursor-pointer"
                    >
                      {copiedOrderId ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                    </button>
                  </div>
                </div>

                {/* Security Token Status */}
                <div className="flex items-center justify-between py-3 print:hidden">
                  <span className="text-white/50">Private URL Security</span>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Unguessable 256-bit Token
                    </span>
                    <button
                      onClick={() => copyToClipboard(typeof window !== "undefined" ? window.location.href : "", "url")}
                      type="button"
                      className="text-white/50 hover:text-white cursor-pointer inline-flex items-center gap-1 text-[10px]"
                      title="Copy Private Invoice Link"
                    >
                      {copiedUrl ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                      <span>{copiedUrl ? "Copied Link" : "Copy Link"}</span>
                    </button>
                  </div>
                </div>

                {/* Razorpay Payment ID */}
                {order.paymentId && (
                  <div className="flex items-center justify-between py-3">
                    <span className="text-white/50 print:text-gray-500">Payment Reference</span>
                    <span className="font-mono text-emerald-400 font-semibold">{order.paymentId}</span>
                  </div>
                )}

                {/* Customer Email */}
                {order.customerEmail && (
                  <div className="flex items-center justify-between py-3">
                    <span className="text-white/50 print:text-gray-500">E-mail Address</span>
                    <span className="font-medium text-white print:text-black">{order.customerEmail}</span>
                  </div>
                )}

                {/* Customer Phone */}
                {order.customerPhone && (
                  <div className="flex items-center justify-between py-3">
                    <span className="text-white/50 print:text-gray-500">Phone Number</span>
                    <span className="font-medium text-white print:text-black">{order.customerPhone}</span>
                  </div>
                )}

                {/* Date */}
                <div className="flex items-center justify-between py-3">
                  <span className="text-white/50 print:text-gray-500">Date & Timestamp</span>
                  <span className="text-white/80 print:text-gray-700">
                    {order.date ? new Date(order.date).toLocaleString() : "Just now"}
                  </span>
                </div>

                {/* Payment Gateway */}
                <div className="flex items-center justify-between py-3">
                  <span className="text-white/50 print:text-gray-500">Payment Method</span>
                  <span className="font-semibold text-white print:text-black">
                    Razorpay (UPI, Cards, NetBanking)
                  </span>
                </div>

                {/* Total Price */}
                <div className="flex items-center justify-between py-3">
                  <span className="text-white/50 print:text-gray-500">Total Price</span>
                  <span className="font-mono text-base font-extrabold text-[#22c55e]">
                    ₹{order.amount ? order.amount.toLocaleString("en-IN") : "0"}
                  </span>
                </div>
              </div>

              {/* Bottom Action Buttons (Hidden on print) */}
              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/[0.08] pt-5 print:hidden">
                <Button
                  onClick={handlePrint}
                  className="bg-[#22c55e] text-black font-extrabold hover:bg-[#16a34a] shadow-[0_0_20px_rgba(34,197,94,0.3)] cursor-pointer"
                >
                  <Printer className="mr-2 size-4" />
                  Print / Save Official PDF
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="border-white/10 bg-white/[0.03] text-white hover:bg-white/10"
                >
                  <Link to="/">
                    <ShoppingBag className="mr-2 size-4" />
                    Browse More Products
                  </Link>
                </Button>
              </div>
            </div>

          </section>
        </div>
      </div>
    </main>
  );
}

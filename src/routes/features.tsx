import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  CreditCard,
  Lock,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { StoreFooter } from "@/components/StoreFooter";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features & Guarantees | GurfMarket" },
      {
        name: "description",
        content: "Discover GurfMarket features: Instant automated key dispatch, 100% verified inventory, 24/7 warranty, and multi-currency checkout.",
      },
    ],
  }),
  component: FeaturesPage,
});

function FeaturesPage() {
  const featuresList = [
    {
      icon: Zap,
      title: "Instant Automated Dispatch",
      desc: "Our automated backend talks directly to wholesale provider APIs. Once your payment clears via Razorpay, credentials appear on screen & arrive in your email inbox within 5 seconds.",
      badge: "Real-time",
      color: "text-amber-400 bg-amber-400/10 border-amber-400/25",
    },
    {
      icon: ShieldCheck,
      title: "Pre-Verified Stock & Live Warranty",
      desc: "Every digital account and license key is pre-tested. If any key fails within warranty period, our automated replacement system issues a fresh key with zero hassle.",
      badge: "100% Guaranteed",
      color: "text-[#22c55e] bg-[#22c55e]/10 border-[#22c55e]/25",
    },
    {
      icon: RefreshCw,
      title: "Live Supplier Stock Sync",
      desc: "Zero phantom orders. Stock levels and product availability reflect live inventory from Supreme Market. If it's listed as in stock, it's ready to ship immediately.",
      badge: "API Synced",
      color: "text-blue-400 bg-blue-400/10 border-blue-400/25",
    },
    {
      icon: CreditCard,
      title: "Localized INR & Secure Payments",
      desc: "Pay effortlessly using UPI (Google Pay, PhonePe, Paytm), Indian debit/credit cards, or Net Banking with bank-grade 256-bit encryption.",
      badge: "UPI & Cards",
      color: "text-purple-400 bg-purple-400/10 border-purple-400/25",
    },
    {
      icon: Lock,
      title: "End-to-End Privacy Protection",
      desc: "No unnecessary KYC or personal data collection. Only your email address is required to deliver your keys and invoice receipts safely.",
      badge: "Zero KYC",
      color: "text-rose-400 bg-rose-400/10 border-rose-400/25",
    },
    {
      icon: Cpu,
      title: "Self-Service Invoice & Token Tracking",
      desc: "Check your past orders anytime with our public invoice portal. Enter your payment ID or token to re-view credentials or download your invoice PDF.",
      badge: "Self-Service",
      color: "text-teal-400 bg-teal-400/10 border-teal-400/25",
    },
  ];

  return (
    <div className="min-h-screen bg-[#07090b] text-white">
      <Navbar />

      <main className="mx-auto max-w-[1240px] px-4 py-12 sm:px-8 sm:py-16">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 px-3.5 py-1 text-xs font-bold text-[#22c55e]">
            <Sparkles className="size-3.5" />
            <span>Why Buy On GurfMarket</span>
          </div>
          <h1 className="mt-4 font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Built for speed, security, and verified authenticity.
          </h1>
          <p className="mt-4 text-sm sm:text-base text-white/60 leading-relaxed">
            We removed the friction, delays, and scammers found on Telegram groups and unverified forums. Experience a modern enterprise-grade digital marketplace.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuresList.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0c0e12] p-6 shadow-xl transition-all duration-300 hover:border-white/20 hover:bg-[#101318]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`grid size-11 place-items-center rounded-xl border ${f.color}`}>
                      <Icon className="size-5" />
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/70">
                      {f.badge}
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-white">{f.title}</h3>
                  <p className="mt-2.5 text-xs sm:text-sm text-white/60 leading-relaxed">
                    {f.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-[#22c55e] font-semibold">
                  <CheckCircle2 className="size-4" />
                  <span>Standard on every order</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Callout */}
        <div className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-8 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#22c55e]">Comparison</span>
              <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold text-white">
                How GurfMarket Compares
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-white/60 leading-relaxed">
                Most platforms make you wait hours for manual admin responses or deliver burned credentials. We automated the entire supply chain.
              </p>
              <div className="mt-6">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-full bg-[#22c55e] px-6 py-3 text-xs sm:text-sm font-extrabold text-black hover:bg-[#16a34a] transition-all"
                >
                  <span>Browse Catalog</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#080a0d] p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] font-bold text-white">
                <span>Features</span>
                <span className="text-[#22c55e]">GurfMarket</span>
                <span className="text-white/40">Telegram / Forums</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-white/80">Delivery Speed</span>
                <span className="text-[#22c55e] font-bold">Instant (3-5 sec)</span>
                <span className="text-rose-400">1 to 24 hours</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-white/80">Stock Validation</span>
                <span className="text-[#22c55e] font-bold">Live API Synced</span>
                <span className="text-rose-400">Manual Check</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-white/80">Payment Method</span>
                <span className="text-[#22c55e] font-bold">UPI, Cards, NetBanking</span>
                <span className="text-rose-400">Direct unverified QR</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-white/80">Warranty Support</span>
                <span className="text-[#22c55e] font-bold">Automated Replacement</span>
                <span className="text-rose-400">Often ghosted</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  Layers,
  Lock,
  PackageCheck,
  ShieldCheck,
  Users2,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { StoreFooter } from "@/components/StoreFooter";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | GurfMarket" },
      {
        name: "description",
        content: "Learn about GurfMarket — India's verified digital goods storefront connecting buyers directly to wholesale digital account & subscription providers.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-[#07090b] text-white">
      <Navbar />

      <main className="mx-auto max-w-[1240px] px-4 py-12 sm:px-8 sm:py-16">
        {/* Hero Section */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 px-3.5 py-1 text-xs font-bold text-[#22c55e]">
            <span>About GurfMarket</span>
          </div>
          <h1 className="mt-4 font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Democratizing access to premium digital accounts and software.
          </h1>
          <p className="mt-5 text-sm sm:text-base text-white/60 leading-relaxed">
            GurfMarket was founded to solve a massive pain point in India and emerging markets: paying inflated prices in foreign currencies or falling victim to untrusted sellers on Telegram and Reddit.
          </p>
        </div>

        {/* Core Pillars Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e12] p-6 shadow-xl">
            <span className="grid size-11 place-items-center rounded-xl bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/25">
              <Zap className="size-5" />
            </span>
            <h3 className="mt-4 font-heading text-lg font-bold text-white">Direct API Integration</h3>
            <p className="mt-2 text-xs sm:text-sm text-white/60 leading-relaxed">
              We connect directly with Supreme Market's enterprise reseller infrastructure, removing middle-men and guaranteeing real-time inventory validation.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e12] p-6 shadow-xl">
            <span className="grid size-11 place-items-center rounded-xl bg-blue-400/10 text-blue-400 border border-blue-400/25">
              <ShieldCheck className="size-5" />
            </span>
            <h3 className="mt-4 font-heading text-lg font-bold text-white">Transparent Pricing (INR)</h3>
            <p className="mt-2 text-xs sm:text-sm text-white/60 leading-relaxed">
              No hidden international conversion fees or surprise forex markup. All prices are calculated with transparent retail multipliers in Indian Rupees.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e12] p-6 shadow-xl">
            <span className="grid size-11 place-items-center rounded-xl bg-purple-400/10 text-purple-400 border border-purple-400/25">
              <Lock className="size-5" />
            </span>
            <h3 className="mt-4 font-heading text-lg font-bold text-white">Automated Delivery & Warranty</h3>
            <p className="mt-2 text-xs sm:text-sm text-white/60 leading-relaxed">
              We built an automated order router that dispatches credentials immediately after payment, with full self-service warranty replacement support.
            </p>
          </div>
        </div>

        {/* Story & Stats Callout */}
        <div className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-r from-white/[0.03] to-white/[0.01] p-8 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="space-y-4">
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                500,000+ Products Delivered Safely
              </h2>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                Whether you need a private Claude Pro seat for AI development, a high-speed NordVPN server for secure research, or full-access Steam accounts for gaming, GurfMarket ensures your transactions are protected from checkout to activation.
              </p>
              <div className="pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-full bg-[#22c55e] px-6 py-3 text-xs sm:text-sm font-extrabold text-black hover:bg-[#16a34a] transition-all"
                >
                  <span>Explore Available Products</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-[#07090b] p-5 text-center">
                <span className="font-heading text-3xl sm:text-4xl font-extrabold text-[#22c55e]">50+</span>
                <p className="mt-1 text-xs text-white/60">Digital Products</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#07090b] p-5 text-center">
                <span className="font-heading text-3xl sm:text-4xl font-extrabold text-[#22c55e]">99.8%</span>
                <p className="mt-1 text-xs text-white/60">Success Rate</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#07090b] p-5 text-center">
                <span className="font-heading text-3xl sm:text-4xl font-extrabold text-[#22c55e]">&lt; 5s</span>
                <p className="mt-1 text-xs text-white/60">Instant Dispatch</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#07090b] p-5 text-center">
                <span className="font-heading text-3xl sm:text-4xl font-extrabold text-[#22c55e]">4.9★</span>
                <p className="mt-1 text-xs text-white/60">Verified Rating</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}

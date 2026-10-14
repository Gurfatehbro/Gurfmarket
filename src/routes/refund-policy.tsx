import { createFileRoute, Link } from "@tanstack/react-router";
import {
  RotateCcw,
  ShieldCheck,
  XCircle,
  CheckCircle2,
  HelpCircle,
  Clock,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { StoreFooter } from "@/components/StoreFooter";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund & Replacement Policy | GurfMarket" },
      {
        name: "description",
        content: "Read GurfMarket's Refund and Replacement Policy: Refunds cannot be initiated, but 100% replacements are held and guaranteed during active warranty.",
      },
    ],
  }),
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#07090b] text-white">
      <Navbar />

      <main className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16">
        {/* Header Banner */}
        <div className="border-b border-white/[0.08] pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs text-[#22c55e]">
            <RotateCcw className="size-3.5" />
            <span className="font-semibold uppercase tracking-wider">Buyer Protection Guarantee</span>
          </div>
          <h1 className="mt-4 font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Refund & Replacement Policy
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-white/60 max-w-2xl leading-relaxed">
            Please read this policy carefully before purchasing. Due to the digital delivery model of license keys and subscription credentials, strict rules apply to refunds and replacements.
          </p>
        </div>

        {/* 2 Big Core Pillars */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {/* Pillar 1: No Refunds */}
          <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-b from-rose-500/[0.08] to-rose-500/[0.02] p-6 sm:p-7 space-y-4">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-rose-500/20 text-rose-400">
                <XCircle className="size-5" />
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Policy Standard</span>
                <h3 className="font-heading text-lg font-extrabold text-white">Refunds Cannot Be Initiated</h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-white/75">
              Because digital accounts, redeem codes, tokens, and software licenses are irrevocable and consumable upon generation, <strong>we cannot issue monetary refunds or reversals</strong> once order credentials have been delivered or displayed.
            </p>
            <div className="rounded-xl border border-rose-500/20 bg-black/40 p-3.5 text-[11px] text-white/60 space-y-1.5">
              <p className="font-semibold text-rose-300">• All completed transactions are final.</p>
              <p>• Accidental purchases, change of mind, or device incompatibility cannot qualify for cash refunds.</p>
            </div>
          </div>

          {/* Pillar 2: Replacements Guaranteed */}
          <div className="rounded-2xl border border-[#22c55e]/40 bg-gradient-to-b from-[#22c55e]/[0.08] to-[#22c55e]/[0.02] p-6 sm:p-7 space-y-4">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-[#22c55e]/20 text-[#22c55e]">
                <CheckCircle2 className="size-5" />
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#22c55e]">100% Coverage</span>
                <h3 className="font-heading text-lg font-extrabold text-white">Replacements CAN Be Held & Issued</h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-white/75">
              If any delivered credential, token, or key is non-functional, invalid upon arrival, or experiences premature deactivation during its stated warranty period, <strong>a verified free replacement will be held and issued immediately</strong>.
            </p>
            <div className="rounded-xl border border-[#22c55e]/20 bg-black/40 p-3.5 text-[11px] text-white/60 space-y-1.5">
              <p className="font-semibold text-[#22c55e]">• 24/7 dedicated support desk.</p>
              <p>• Automated wholesale stock verification to swap defective credentials with fresh ones.</p>
            </div>
          </div>
        </div>

        {/* Detailed Guidelines */}
        <div className="mt-12 space-y-8 text-xs sm:text-sm text-white/80 leading-relaxed">
          {/* Section 1 */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Clock className="size-4 text-[#22c55e]" />
              Warranty Windows by Product Tier
            </h3>
            <p className="text-white/70">
              Each product on GurfMarket has an active replacement warranty explicitly stated in its product description:
            </p>
            <ul className="grid gap-2 sm:grid-cols-3 pt-2 text-xs">
              <li className="rounded-xl border border-white/[0.06] bg-black/30 p-3">
                <span className="font-bold text-white block">One-Time Keys / Codes</span>
                <span className="text-white/50 text-[11px] mt-1 block">Valid for instant activation upon delivery. Replaceable if non-working on first activation.</span>
              </li>
              <li className="rounded-xl border border-white/[0.06] bg-black/30 p-3">
                <span className="font-bold text-white block">1 Month Subscriptions</span>
                <span className="text-white/50 text-[11px] mt-1 block">Full 30-day warranty coverage. Instant replacements held if deactivation occurs.</span>
              </li>
              <li className="rounded-xl border border-white/[0.06] bg-black/30 p-3">
                <span className="font-bold text-white block">Extended (6-12 Months)</span>
                <span className="text-white/50 text-[11px] mt-1 block">Full duration warranty backup with 24/7 priority ticket support.</span>
              </li>
            </ul>
          </div>

          {/* How to claim a replacement */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="size-4 text-[#22c55e]" />
              How to Claim Your Replacement (3 Simple Steps)
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/[0.06] bg-black/40 p-4">
                <span className="text-[#22c55e] font-mono text-sm font-bold">Step 1</span>
                <h4 className="font-bold text-white mt-1 text-xs">Locate Your Order ID</h4>
                <p className="text-[11px] text-white/50 mt-1">
                  Keep your Razorpay Payment ID (`pay_...`) or Invoice Token from your order confirmation email ready.
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-black/40 p-4">
                <span className="text-[#22c55e] font-mono text-sm font-bold">Step 2</span>
                <h4 className="font-bold text-white mt-1 text-xs">Send Screenshot / Proof</h4>
                <p className="text-[11px] text-white/50 mt-1">
                  Take a quick screenshot showing the login error or key validation failure on the respective service.
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-black/40 p-4">
                <span className="text-[#22c55e] font-mono text-sm font-bold">Step 3</span>
                <h4 className="font-bold text-white mt-1 text-xs">Receive New Key</h4>
                <p className="text-[11px] text-white/50 mt-1">
                  Contact our support on Telegram or Discord. Our team validates and replaces it immediately.
                </p>
              </div>
            </div>
          </div>

          {/* Exceptions & Voided Warranty */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="size-4 text-amber-400" />
              Conditions That Void Replacement Warranty
            </h3>
            <ul className="space-y-1.5 list-disc pl-5 text-white/70 text-xs">
              <li>Changing email, master password, or subscription settings on accounts marked strictly as shared profile.</li>
              <li>Attempting to resell or redistribute keys to unauthorized third parties.</li>
              <li>Using unauthorized third-party mods, illegal scripts, or violating the terms of service of the target provider (e.g., cheating on game servers).</li>
              <li>Submitting replacement claims after the stated warranty duration has expired.</li>
            </ul>
          </div>
        </div>

        {/* Contact Support Bar */}
        <div className="mt-10 rounded-2xl border border-[#22c55e]/30 bg-[#22c55e]/[0.05] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">Need a replacement right now?</h3>
            <p className="text-xs text-white/60 mt-1">Our support agents are active 24/7 to fulfill your replacement request.</p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-[#22c55e] px-5 py-2.5 text-xs font-bold text-black hover:bg-[#16a34a] transition-all self-start sm:self-auto"
          >
            <MessageSquare className="size-3.5" />
            Open Support Ticket <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}

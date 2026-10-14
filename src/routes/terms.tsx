import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { StoreFooter } from "@/components/StoreFooter";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms and Conditions | GurfMarket" },
      {
        name: "description",
        content: "Read the official Terms and Conditions for purchasing digital subscriptions, accounts, and keys on GurfMarket.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-[#07090b] text-white">
      <Navbar />

      <main className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16">
        {/* Header */}
        <div className="border-b border-white/[0.08] pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-xs text-[#22c55e]">
            <FileText className="size-3.5" />
            <span className="font-semibold uppercase tracking-wider">Legal & Compliance</span>
          </div>
          <h1 className="mt-4 font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Terms and Conditions
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-white/60">
            Last updated: October 2026 • Effective immediately for all purchases on GurfMarket.
          </p>
        </div>

        {/* Content Sections */}
        <div className="mt-10 space-y-10 text-xs sm:text-sm leading-relaxed text-white/80">
          {/* Section 1 */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
              <span className="grid size-6 place-items-center rounded-lg bg-[#22c55e]/15 text-[#22c55e] text-xs font-mono">1</span>
              Acceptance of Agreement
            </h2>
            <p>
              By accessing, browsing, or purchasing digital items on <strong>GurfMarket</strong> ("gurfmarket.vercel.app" or the "Platform"), you agree to be bound by these Terms and Conditions and our associated policies. If you do not agree with any part of these terms, please do not use our services.
            </p>
            <p>
              GurfMarket operates as an independent direct-supplier marketplace delivering digital subscription accounts, software activation keys, virtual game tokens, and verified memberships.
            </p>
          </div>

          {/* Section 2 */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
              <span className="grid size-6 place-items-center rounded-lg bg-[#22c55e]/15 text-[#22c55e] text-xs font-mono">2</span>
              Digital Delivery & Instant Fulfillment
            </h2>
            <ul className="space-y-2 list-disc pl-5 text-white/70">
              <li>
                <strong>Automated Dispatch:</strong> All purchases are processed and dispatched via automated wholesale API integration upon verified payment via Razorpay.
              </li>
              <li>
                <strong>Access Details:</strong> Credentials, license keys, or activation tokens are shown on-screen immediately and sent via email confirmation to the email address provided at checkout.
              </li>
              <li>
                <strong>Customer Responsibility:</strong> You are responsible for providing an accurate, active email address and phone number. GurfMarket is not liable for delayed delivery resulting from incorrect email details entered by the user.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
              <span className="grid size-6 place-items-center rounded-lg bg-[#22c55e]/15 text-[#22c55e] text-xs font-mono">3</span>
              Account Usage & Safety Rules
            </h2>
            <p>
              Depending on the product specification:
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/[0.06] bg-black/40 p-4">
                <h3 className="font-semibold text-white text-xs mb-1">Shared Profiles / Subscriptions</h3>
                <p className="text-[11px] text-white/60">
                  You agree strictly not to alter master account credentials (email, plan settings, or other profiles) unless explicitly specified as a "Full Access" or "Private Own Account".
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-black/40 p-4">
                <h3 className="font-semibold text-white text-xs mb-1">Single Activation Keys</h3>
                <p className="text-[11px] text-white/60">
                  Software and VPN license keys are valid for the designated device/activation limit mentioned in the product description.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="rounded-2xl border border-[#22c55e]/20 bg-[#22c55e]/[0.03] p-6 sm:p-8 space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-[#22c55e] flex items-center gap-2.5">
              <span className="grid size-6 place-items-center rounded-lg bg-[#22c55e]/20 text-[#22c55e] text-xs font-mono">4</span>
              Refund & Replacement Summary
            </h2>
            <p className="text-white/80">
              As detailed in our <Link to="/refund-policy" className="text-[#22c55e] font-semibold underline hover:text-white">Refund and Replacement Policy</Link>:
            </p>
            <div className="flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-xs text-rose-200">
              <ShieldAlert className="size-5 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <strong className="text-rose-400">Refunds Cannot Be Initiated:</strong> Due to the instant, intangible, and irrevocable nature of digital goods and license tokens, monetary refunds cannot be issued once credentials have been generated or delivered.
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-emerald-200">
              <CheckCircle2 className="size-5 shrink-0 text-emerald-400 mt-0.5" />
              <div>
                <strong className="text-emerald-400">Replacements Guaranteed:</strong> In case of any non-functional key, incorrect credentials, or premature deactivation during the valid warranty duration, a 100% free replacement will be held and issued immediately by our support desk.
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
              <span className="grid size-6 place-items-center rounded-lg bg-[#22c55e]/15 text-[#22c55e] text-xs font-mono">5</span>
              Prohibited Conduct & Chargeback Abuse
            </h2>
            <p>
              Users agree not to engage in fraudulent chargebacks or payment disputes without first contacting GurfMarket 24/7 customer support for resolution. Filing unauthorized disputes against verified, delivered digital tokens will result in immediate blacklisting from our reseller wholesale network and termination of all active licenses.
            </p>
          </div>

          {/* Support CTA */}
          <div className="rounded-2xl border border-white/[0.1] bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">Have questions about these terms?</h3>
              <p className="text-xs text-white/60 mt-1">Our support team is available 24/7 to assist you.</p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-[#22c55e] px-4 py-2.5 text-xs font-bold text-black hover:bg-[#16a34a] transition-all self-start sm:self-auto"
            >
              Contact Support <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}

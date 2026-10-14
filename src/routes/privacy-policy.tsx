import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Lock, EyeOff, Server, CheckCircle2, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { StoreFooter } from "@/components/StoreFooter";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | GurfMarket" },
      {
        name: "description",
        content: "Learn how GurfMarket protects your personal data, ensures encrypted payment processing, and maintains customer confidentiality.",
      },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#07090b] text-white">
      <Navbar />

      <main className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16">
        {/* Header */}
        <div className="border-b border-white/[0.08] pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-xs text-[#22c55e]">
            <Lock className="size-3.5" />
            <span className="font-semibold uppercase tracking-wider">Data Protection & Trust</span>
          </div>
          <h1 className="mt-4 font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-white/60">
            Last updated: October 2026 • We respect your privacy and never sell or monetize your data.
          </p>
        </div>

        {/* Core Principles */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 space-y-2">
            <span className="grid size-9 place-items-center rounded-xl bg-[#22c55e]/15 text-[#22c55e]">
              <EyeOff className="size-4" />
            </span>
            <h3 className="font-bold text-white text-xs sm:text-sm">Zero Data Selling</h3>
            <p className="text-[11px] text-white/60 leading-relaxed">
              We never sell, rent, or lease customer contact info to third-party ad networks or brokers.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 space-y-2">
            <span className="grid size-9 place-items-center rounded-xl bg-[#22c55e]/15 text-[#22c55e]">
              <ShieldCheck className="size-4" />
            </span>
            <h3 className="font-bold text-white text-xs sm:text-sm">Encrypted Payments</h3>
            <p className="text-[11px] text-white/60 leading-relaxed">
              Transactions are handled via Razorpay with 256-bit SSL encryption. We never see card numbers.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 space-y-2">
            <span className="grid size-9 place-items-center rounded-xl bg-[#22c55e]/15 text-[#22c55e]">
              <Server className="size-4" />
            </span>
            <h3 className="font-bold text-white text-xs sm:text-sm">Secure Dispatch</h3>
            <p className="text-[11px] text-white/60 leading-relaxed">
              Order confirmations and access tokens are transmitted securely using authenticated email servers.
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-10 space-y-8 text-xs sm:text-sm text-white/80 leading-relaxed">
          {/* Section 1 */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-lg bg-[#22c55e]/15 text-[#22c55e] text-xs font-mono">1</span>
              Information We Collect
            </h2>
            <p>
              When you purchase a product on GurfMarket, we collect only the minimal information required to complete and deliver your order:
            </p>
            <ul className="space-y-1.5 list-disc pl-5 text-white/70 text-xs">
              <li>
                <strong>Email Address:</strong> Used solely to transmit your digital account credentials, invoice receipt, and order tracking links.
              </li>
              <li>
                <strong>Phone Number (Optional):</strong> Used if you request SMS order alerts or payment receipts.
              </li>
              <li>
                <strong>Transaction Identifier:</strong> Razorpay order ID and payment reference number to link your transaction with stock delivery.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-lg bg-[#22c55e]/15 text-[#22c55e] text-xs font-mono">2</span>
              Payment Processing Security
            </h2>
            <p>
              All payments on GurfMarket are processed through <strong>Razorpay</strong>, a PCI-DSS Level 1 compliant payment gateway.
            </p>
            <p className="text-white/70 text-xs">
              GurfMarket does not collect, process, or store credit card numbers, debit card PINs, CVV codes, UPI MPINs, or net banking passwords on our servers. All sensitive financial data is tokenized directly between your browser and Razorpay.
            </p>
          </div>

          {/* Section 3 */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-lg bg-[#22c55e]/15 text-[#22c55e] text-xs font-mono">3</span>
              How We Use Your Data
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 text-xs">
              <div className="rounded-xl border border-white/[0.06] bg-black/30 p-3 flex items-start gap-2">
                <CheckCircle2 className="size-4 text-[#22c55e] shrink-0 mt-0.5" />
                <span>Instant delivery of product access tokens and credentials.</span>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-black/30 p-3 flex items-start gap-2">
                <CheckCircle2 className="size-4 text-[#22c55e] shrink-0 mt-0.5" />
                <span>Customer support, warranty claims, and replacement fulfillment.</span>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-black/30 p-3 flex items-start gap-2">
                <CheckCircle2 className="size-4 text-[#22c55e] shrink-0 mt-0.5" />
                <span>Sending automated invoice tracking links and order receipts.</span>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-black/30 p-3 flex items-start gap-2">
                <CheckCircle2 className="size-4 text-[#22c55e] shrink-0 mt-0.5" />
                <span>Preventing fraud, duplicate redemptions, and chargeback abuse.</span>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-lg bg-[#22c55e]/15 text-[#22c55e] text-xs font-mono">4</span>
              Cookies & Local Browser Storage
            </h2>
            <p className="text-white/70 text-xs">
              GurfMarket uses local browser storage solely to maintain your active shopping cart state, temporary invoice lookup tokens, and display preferences. We do not use intrusive third-party cross-site tracking cookies.
            </p>
          </div>

          {/* Section 5 */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-lg bg-[#22c55e]/15 text-[#22c55e] text-xs font-mono">5</span>
              Data Retention & Removal
            </h2>
            <p className="text-white/70 text-xs">
              You may contact our support at any time to request the deletion or anonymization of your order record after the warranty period for your digital asset has concluded.
            </p>
          </div>

          {/* Contact Box */}
          <div className="rounded-2xl border border-white/[0.1] bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">Privacy Concerns or Questions?</h3>
              <p className="text-xs text-white/60 mt-1">Contact our data protection team via live chat or ticket.</p>
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

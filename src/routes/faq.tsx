import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, HelpCircle, MessageSquare, Search } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { StoreFooter } from "@/components/StoreFooter";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions | GurfMarket" },
      {
        name: "description",
        content: "Frequently Asked Questions about GurfMarket — instant delivery, warranty policy, UPI payment methods, and reseller integrations.",
      },
    ],
  }),
  component: FaqPage,
});

interface FaqItem {
  question: string;
  answer: string;
  category: "Delivery" | "Payments" | "Warranty" | "Reselling" | "General";
}

const FAQS_DATA: FaqItem[] = [
  {
    category: "Delivery",
    question: "How fast do I receive my purchased credentials or keys?",
    answer: "Delivery is completely automated 24/7. As soon as your Razorpay transaction completes, the account credentials or activation code are immediately displayed on your screen and dispatched to your email address within 3-5 seconds.",
  },
  {
    category: "Delivery",
    question: "Where can I view my purchased credentials if I close the tab?",
    answer: "You can track your order at any time using our Invoice Tracker (/invoice). Simply enter your payment ID or email to view credentials, receipts, and order timestamps.",
  },
  {
    category: "Payments",
    question: "What payment methods are supported on GurfMarket?",
    answer: "We support all major Indian payment methods through Razorpay: UPI (PhonePe, Google Pay, Paytm, BHIM), Indian Debit/Credit Cards (Visa, Mastercard, RuPay), and Net Banking across 50+ banks.",
  },
  {
    category: "Payments",
    question: "Are there any hidden international fees or extra forex conversion charges?",
    answer: "No! All prices shown on GurfMarket are final in Indian Rupees (INR). You pay exactly what is shown on checkout, with zero unexpected bank forex charges.",
  },
  {
    category: "Warranty",
    question: "What is your replacement and warranty policy?",
    answer: "Every digital product comes with a specified warranty window (e.g. 1 Month, 1 Year, or Lifetime). If your credentials ever stop working or have an issue during the active warranty period, our support issues a verified replacement key immediately.",
  },
  {
    category: "Warranty",
    question: "What should I do if an account password or key doesn't work?",
    answer: "First check your spam/junk folder for the full credential string. If there is still an issue, visit our Contact / Ticket page with your Invoice Token or Payment ID. Our automated checker or live agent will verify and replace the key in under 15 minutes.",
  },
  {
    category: "Reselling",
    question: "Where do these digital accounts and products come from?",
    answer: "We connect directly with Supreme Market's verified enterprise wholesale provider infrastructure. We maintain live inventory sync to ensure zero phantom stock and authentic digital goods.",
  },
  {
    category: "General",
    question: "Can I use these streaming and AI accounts on multiple devices?",
    answer: "Each product's description details device allowances. For instance, private Netflix accounts allow up to specified concurrent screens, while shared profiles are intended for single-device streaming.",
  },
  {
    category: "General",
    question: "Do you require KYC or identity verification?",
    answer: "No. We respect buyer privacy. We only ask for an email address so your digital receipt and activation keys can be securely dispatched.",
  },
];

function FaqPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Delivery", "Payments", "Warranty", "Reselling", "General"];

  const filteredFaqs = FAQS_DATA.filter((faq) => {
    const matchesCat = selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#07090b] text-white">
      <Navbar />

      <main className="mx-auto max-w-[1240px] px-4 py-12 sm:px-8 sm:py-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 px-3.5 py-1 text-xs font-bold text-[#22c55e]">
            <HelpCircle className="size-3.5" />
            <span>Support & Guidance</span>
          </div>
          <h1 className="mt-4 font-heading text-3xl sm:text-5xl font-extrabold text-white">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-white/60">
            Quick answers about instant delivery, payment methods, warranty replacement, and account activations.
          </p>

          {/* Search Bar */}
          <div className="mt-8 relative max-w-md mx-auto">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search delivery, UPI, replacement, Claude..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-10 pr-4 text-xs text-white placeholder:text-white/40 focus:border-[#22c55e] focus:outline-none"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#22c55e] text-black shadow-[0_0_15px_rgba(34,197,94,0.35)]"
                  : "border border-white/10 bg-white/[0.03] text-white/70 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-white/[0.08] rounded-2xl border border-white/10 bg-[#0c0e12] p-6 shadow-2xl">
          {filteredFaqs.length === 0 ? (
            <div className="py-8 text-center text-xs text-white/50">
              No matching questions found for "{searchQuery}".
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => (
              <details key={idx} className="group py-4.5 transition-colors cursor-pointer first:pt-0 last:pb-0">
                <summary className="flex list-none items-center justify-between gap-4 text-left font-heading text-sm font-bold text-white group-hover:text-[#22c55e] [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center gap-3">
                    <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/50">
                      {faq.category}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown className="size-4 shrink-0 text-white/40 transition-transform group-open:rotate-180 group-hover:text-[#22c55e]" />
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-white/70 leading-relaxed pl-1">
                  {faq.answer}
                </p>
              </details>
            ))
          )}
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}

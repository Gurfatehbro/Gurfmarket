import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle2,
  Clock,
  Mail,
  MessageCircle,
  MessageSquare,
  Send,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { StoreFooter } from "@/components/StoreFooter";
import { Button } from "@/components/ui/button";
import { submitContactTicket } from "@/lib/store-config";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Support | GurfMarket" },
      {
        name: "description",
        content: "Get 24/7 assistance on GurfMarket. Contact support for warranty replacements, payment inquiries, or custom wholesale orders.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState("");
  const [category, setCategory] = useState("Order Delivery Issue");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await submitContactTicket({
        data: {
          name,
          email,
          orderId: orderId || undefined,
          category,
          message,
        },
      });

      if (res.success) {
        setTicketId(res.ticketId || null);
        setSubmitted(true);
      } else {
        setErrorMessage(res.error || "Failed to submit inquiry. Please try again.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit inquiry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090b] text-white">
      <Navbar />

      <main className="mx-auto max-w-[1240px] px-4 py-12 sm:px-8 sm:py-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 px-3.5 py-1 text-xs font-bold text-[#22c55e]">
            <MessageCircle className="size-3.5" />
            <span>24/7 Customer Care</span>
          </div>
          <h1 className="mt-4 font-heading text-3xl sm:text-5xl font-extrabold text-white">
            We're Here to Help
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-white/60">
            Have questions about an order or need a warranty replacement? Reach out to our dedicated support team.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.2fr] items-start">
          {/* Quick Support Channels */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e12] p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="grid size-10 place-items-center rounded-xl bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/25">
                  <Clock className="size-5" />
                </span>
                <div>
                  <h3 className="font-heading text-sm font-bold text-white">Fast Response Guarantee</h3>
                  <p className="text-xs text-[#22c55e]">Average reply time: under 15 minutes</p>
                </div>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                Our support agents and automated verification bots operate 24/7 to resolve replacement requests and payment queries instantly.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e12] p-6 shadow-xl space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Direct Channels</h4>

              <a
                href="mailto:support@gurfmarket.com"
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs text-white/80 hover:border-[#22c55e]/40 hover:bg-white/[0.05] transition-all"
              >
                <span className="grid size-9 place-items-center rounded-lg bg-blue-400/10 text-blue-400">
                  <Mail className="size-4" />
                </span>
                <div>
                  <p className="font-bold text-white">Email Support</p>
                  <p className="text-[11px] text-white/50">support@gurfmarket.com</p>
                </div>
              </a>

              <a
                href="https://t.me/gurfmarket"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs text-white/80 hover:border-[#22c55e]/40 hover:bg-white/[0.05] transition-all"
              >
                <span className="grid size-9 place-items-center rounded-lg bg-[#22c55e]/10 text-[#22c55e]">
                  <MessageSquare className="size-4" />
                </span>
                <div>
                  <p className="font-bold text-white">Telegram Community & Announcements</p>
                  <p className="text-[11px] text-white/50">@gurfmarket (Official)</p>
                </div>
              </a>

              <div className="flex items-center gap-2 pt-2 text-[11px] text-white/50">
                <ShieldCheck className="size-4 text-[#22c55e]" />
                <span>We will never ask for your passwords or OTPs.</span>
              </div>
            </div>
          </div>

          {/* Ticket Submission Form */}
          <div className="rounded-2xl border border-white/10 bg-[#0c0e12] p-6 sm:p-8 shadow-2xl">
            {submitted ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="mx-auto size-14 text-[#22c55e] mb-3" />
                <h3 className="font-heading text-xl font-bold text-white">Ticket Created Successfully!</h3>
                {ticketId && (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono font-bold text-[#22c55e]">
                    <span>Ticket Reference:</span>
                    <span>{ticketId}</span>
                  </div>
                )}
                <p className="mt-3 text-xs sm:text-sm text-white/60 max-w-sm mx-auto">
                  We have received your request and logged it to our support queue. An agent will review and follow up at <span className="text-[#22c55e] font-semibold">{email}</span>.
                </p>
                <Button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage("");
                    setOrderId("");
                    setTicketId(null);
                  }}
                  className="mt-6 rounded-xl bg-[#22c55e] px-6 py-2.5 text-xs font-bold text-black hover:bg-[#16a34a] cursor-pointer"
                >
                  Submit Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-heading text-lg font-bold text-white">Open a Support Ticket</h3>
                <p className="text-xs text-white/50">Fill in the details below and we will investigate immediately.</p>

                {errorMessage && (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                    {errorMessage}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-white/70">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gurfateh"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1.5 h-10 w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 text-xs text-white focus:border-[#22c55e] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white/70">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="yourname@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1.5 h-10 w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 text-xs text-white focus:border-[#22c55e] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-white/70">Inquiry Topic</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1.5 h-10 w-full rounded-xl border border-white/15 bg-[#0c0e12] px-3 text-xs text-white focus:border-[#22c55e] focus:outline-none cursor-pointer"
                    >
                      <option value="Order Delivery Issue">Order Delivery Issue</option>
                      <option value="Warranty Replacement Request">Warranty Replacement Request</option>
                      <option value="Payment Inquiry">Payment Inquiry (Razorpay/UPI)</option>
                      <option value="Wholesale & Bulk Inquiries">Wholesale & Bulk Inquiries</option>
                      <option value="Other">Other Question</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white/70">Payment ID / Order ID (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. pay_Q8k2..."
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      className="mt-1.5 h-10 w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 text-xs text-white focus:border-[#22c55e] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70">Message / Issue Details *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe what happened or what product key needs verification..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/[0.04] p-3 text-xs text-white focus:border-[#22c55e] focus:outline-none resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-[#22c55e] py-3 text-xs font-extrabold text-black hover:bg-[#16a34a] transition-all cursor-pointer"
                >
                  {isSubmitting ? "Submitting..." : "Send Support Request"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}

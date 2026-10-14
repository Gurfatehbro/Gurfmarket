import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle2,
  Filter,
  MessageSquare,
  Quote,
  Send,
  Star,
  ThumbsUp,
  X,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { StoreFooter } from "@/components/StoreFooter";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Customer Reviews & Ratings | GurfMarket" },
      {
        name: "description",
        content: "Read verified customer reviews for GurfMarket. 4.9/5 stars based on 9,600+ real purchases for Netflix, Claude, NordVPN, and Steam keys.",
      },
    ],
  }),
  component: ReviewsPage,
});

interface CustomerReview {
  id: string;
  user: string;
  rating: number;
  date: string;
  product: string;
  text: string;
  verified: boolean;
  avatarChar: string;
  helpfulCount: number;
}

const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: "rev-1",
    user: "Aman S.",
    rating: 5,
    date: "12 Oct 2026",
    product: "Netflix 4K UHD [1 Month]",
    text: "Received the profile credentials within 10 seconds of UPI payment. Logged in and streaming in Ultra HD with zero issues. Absolutely seamless service!",
    verified: true,
    avatarChar: "A",
    helpfulCount: 42,
  },
  {
    id: "rev-2",
    user: "Rahul K.",
    rating: 5,
    date: "11 Oct 2026",
    product: "Claude Pro [1 Month]",
    text: "Best price in India! No need to deal with international cards. Razorpay UPI made it instant, and Claude Opus was active immediately.",
    verified: true,
    avatarChar: "R",
    helpfulCount: 29,
  },
  {
    id: "rev-3",
    user: "Vikram P.",
    rating: 5,
    date: "10 Oct 2026",
    product: "NordVPN Premium [1 Year]",
    text: "Was hesitant at first because of Telegram scammers elsewhere, but GurfMarket is legit. The automated receipt with my invoice token came right to my email.",
    verified: true,
    avatarChar: "V",
    helpfulCount: 38,
  },
  {
    id: "rev-4",
    user: "Sneha M.",
    rating: 5,
    date: "9 Oct 2026",
    product: "ChatGPT Plus [1 Month]",
    text: "GPT-4o access is blazing fast. Support also helped me quickly when I had a query regarding renewal. 10/10 recommended to all my friends.",
    verified: true,
    avatarChar: "S",
    helpfulCount: 19,
  },
  {
    id: "rev-5",
    user: "Karthik R.",
    rating: 4,
    date: "8 Oct 2026",
    product: "Steam Random Key FA",
    text: "Got an awesome AAA game key for just ₹149. Worked instantly on my Indian Steam account with zero region lock issues.",
    verified: true,
    avatarChar: "K",
    helpfulCount: 14,
  },
  {
    id: "rev-6",
    user: "Devansh T.",
    rating: 5,
    date: "6 Oct 2026",
    product: "Discord 14x Server Boosts",
    text: "My server reached Level 3 within 2 minutes of payment. Incredible automated bot delivery. Will definitely buy monthly now.",
    verified: true,
    avatarChar: "D",
    helpfulCount: 22,
  },
  {
    id: "rev-7",
    user: "Pooja G.",
    rating: 5,
    date: "5 Oct 2026",
    product: "Disney+ Hotstar Super",
    text: "Clear credentials, no password reset drama. Everything works exactly as advertised on the page.",
    verified: true,
    avatarChar: "P",
    helpfulCount: 11,
  },
  {
    id: "rev-8",
    user: "Harshil N.",
    rating: 5,
    date: "3 Oct 2026",
    product: "ExpressVPN [1 Month]",
    text: "Super high speeds, unblocks all geo-restricted sites. Instant delivery is a lifesaver.",
    verified: true,
    avatarChar: "H",
    helpfulCount: 8,
  },
];

function ReviewsPage() {
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);
  const [selectedRating, setSelectedRating] = useState<number | "all">("all");
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState("");
  const [newProduct, setNewProduct] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const filteredReviews = reviews.filter((r) => {
    if (selectedRating === "all") return true;
    return r.rating === selectedRating;
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newComment) return;

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      user: newAuthor,
      rating: newRating,
      date: "Just now",
      product: newProduct || "Verified Purchase",
      text: newComment,
      verified: true,
      avatarChar: newAuthor.charAt(0).toUpperCase(),
      helpfulCount: 0,
    };

    setReviews([newRev, ...reviews]);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsWriteModalOpen(false);
      setNewAuthor("");
      setNewProduct("");
      setNewComment("");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#07090b] text-white">
      <Navbar />

      <main className="mx-auto max-w-[1240px] px-4 py-12 sm:px-8 sm:py-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#22c55e]">
            Customer Feedback & Ratings
          </span>
          <h1 className="mt-3 font-heading text-3xl sm:text-5xl font-extrabold text-white">
            Loved by 9,600+ Buyers
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-white/60">
            Real feedback from gamers, developers, and digital creators across India and worldwide.
          </p>
        </div>

        {/* Rating Hero Card */}
        <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-white/10 bg-[#0c0e12] p-8 shadow-2xl">
          <div className="grid gap-6 sm:grid-cols-[160px_1fr] items-center">
            <div className="text-center sm:border-r sm:border-white/10 sm:pr-6">
              <span className="font-heading text-6xl font-extrabold text-white tracking-tight">4.9</span>
              <div className="mt-2 flex justify-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-1 text-xs text-white/50">9,635+ Total Reviews</p>
            </div>

            <div className="space-y-2">
              {[
                { stars: 5, pct: "94%" },
                { stars: 4, pct: "5%" },
                { stars: 3, pct: "1%" },
                { stars: 2, pct: "<1%" },
                { stars: 1, pct: "0%" },
              ].map((row) => (
                <div key={row.stars} className="flex items-center gap-3 text-xs">
                  <span className="w-12 text-white/70 font-medium">{row.stars} Stars</span>
                  <div className="h-2 flex-1 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-[#22c55e] rounded-full" style={{ width: row.pct }} />
                  </div>
                  <span className="w-8 text-right text-white/40">{row.pct}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/[0.08] flex items-center justify-between">
            <span className="text-xs text-white/60">Have you purchased from GurfMarket?</span>
            <Button
              onClick={() => setIsWriteModalOpen(true)}
              className="rounded-xl bg-[#22c55e] px-4 py-2 text-xs font-bold text-black hover:bg-[#16a34a] cursor-pointer"
            >
              Write a Review
            </Button>
          </div>
        </div>

        {/* Star Filter Pills */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedRating("all")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              selectedRating === "all"
                ? "bg-[#22c55e] text-black"
                : "border border-white/10 bg-white/[0.03] text-white/70 hover:text-white"
            }`}
          >
            All Ratings ({reviews.length})
          </button>
          {[5, 4, 3].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setSelectedRating(star)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                selectedRating === star
                  ? "bg-[#22c55e] text-black"
                  : "border border-white/10 bg-white/[0.03] text-white/70 hover:text-white"
              }`}
            >
              <Star className="size-3 fill-amber-400 text-amber-400" />
              <span>{star} Stars</span>
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0c0e12] p-5 shadow-lg hover:border-white/20 transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="size-4 text-white/15" />
                </div>
                <p className="mt-3.5 text-xs leading-relaxed text-white/90">
                  "{rev.text}"
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                <div className="flex items-center gap-2.5">
                  <div className="grid size-8 place-items-center rounded-full bg-[#22c55e] text-black text-xs font-bold">
                    {rev.avatarChar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">{rev.user}</span>
                      <CheckCircle2 className="size-3.5 text-[#22c55e]" />
                    </div>
                    <p className="text-[10px] text-white/40">{rev.product}</p>
                  </div>
                </div>
                <span className="text-[10px] text-white/40">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Write Review Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-[#0c0e12] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsWriteModalOpen(false)}
              className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-white/10 text-white/70 hover:text-white cursor-pointer"
            >
              <X className="size-4" />
            </button>

            {isSubmitted ? (
              <div className="text-center py-6">
                <CheckCircle2 className="mx-auto size-12 text-[#22c55e] mb-2" />
                <h3 className="font-heading text-lg font-bold text-white">Review Submitted!</h3>
                <p className="text-xs text-white/60">Thank you for sharing your experience.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview}>
                <h3 className="font-heading text-lg font-bold text-white">Share Your Review</h3>
                <p className="mt-1 text-xs text-white/50">Your feedback helps fellow buyers find the best deals.</p>

                <div className="mt-4">
                  <label className="text-xs font-semibold text-white/70">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gurfateh S."
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="mt-1.5 h-10 w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 text-xs text-white focus:border-[#22c55e] focus:outline-none"
                  />
                </div>

                <div className="mt-3">
                  <label className="text-xs font-semibold text-white/70">Product Purchased</label>
                  <input
                    type="text"
                    placeholder="e.g. Netflix 4K, Claude Pro"
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                    className="mt-1.5 h-10 w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 text-xs text-white focus:border-[#22c55e] focus:outline-none"
                  />
                </div>

                <div className="mt-3">
                  <label className="text-xs font-semibold text-white/70">Rating</label>
                  <div className="mt-1.5 flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setNewRating(s)}
                        className={`grid size-9 place-items-center rounded-xl border transition-all cursor-pointer ${
                          newRating >= s
                            ? "border-amber-400/50 bg-amber-400/20 text-amber-400"
                            : "border-white/10 bg-white/[0.03] text-white/30"
                        }`}
                      >
                        <Star className={`size-4 ${newRating >= s ? "fill-amber-400" : ""}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <label className="text-xs font-semibold text-white/70">Review Comments *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tell us about the delivery speed, account quality, etc."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/[0.04] p-3 text-xs text-white focus:border-[#22c55e] focus:outline-none resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="mt-5 w-full rounded-xl bg-[#22c55e] py-2.5 text-xs font-bold text-black hover:bg-[#16a34a] cursor-pointer"
                >
                  Publish Review
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      <StoreFooter />
    </div>
  );
}

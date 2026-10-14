import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  HelpCircle,
  Home,
  Info,
  Mail,
  MoreVertical,
  ShoppingBag,
  Sparkles,
  Star,
  X,
  FileText,
  Lock,
} from "lucide-react";

export const NAV_LINKS = [
  { name: "Home", href: "/", icon: Home, sub: "Storefront & hero showcase" },
  { name: "Products", href: "/products", icon: ShoppingBag, sub: "All 50+ digital accounts & keys" },
  { name: "Features", href: "/features", icon: Sparkles, sub: "Instant delivery & warranty" },
  { name: "Reviews", href: "/reviews", icon: Star, sub: "4.9/5 rated by 9,600+ buyers" },
  { name: "About", href: "/about", icon: Info, sub: "Wholesale sourcing & guarantees" },
  { name: "FAQ", href: "/faq", icon: HelpCircle, sub: "Answers & support guide" },
  { name: "Contact", href: "/contact", icon: Mail, sub: "24/7 ticket, Telegram & email" },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#07090b]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[64px] sm:h-[72px] max-w-[1240px] items-center justify-between gap-3 px-4 sm:px-8">
          {/* Logo */}
          <Link to="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3" aria-label="GurfMarket Home">
            <img
              src="/logo-icon.png"
              alt="GurfMarket Crown Emblem"
              className="size-8.5 sm:size-9.5 shrink-0 rounded-xl object-cover border border-[#22c55e]/50 shadow-[0_0_16px_rgba(34,197,94,0.35)]"
            />
            <div className="flex flex-col">
              <span className="truncate text-sm sm:text-[15px] font-extrabold tracking-[0.06em] text-white">GURFMARKET</span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#22c55e]">Market Live</span>
            </div>
          </Link>

          {/* Desktop Navigation — All 7 dynamic sections */}
          <nav aria-label="Main navigation" className="hidden items-center gap-6 xl:gap-8 text-[13px] md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = currentPath === link.href || (link.href !== "/" && currentPath.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`transition-colors font-medium ${
                    isActive
                      ? "text-[#22c55e] font-semibold"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              to="/products"
              className="inline-flex h-9 sm:h-10 items-center gap-1.5 rounded-full bg-[#22c55e] px-3.5 sm:px-5 text-xs sm:text-sm font-extrabold text-black shadow-[0_0_20px_rgba(34,197,94,0.35)] transition-all hover:bg-[#16a34a] active:scale-95 cursor-pointer"
            >
              <span>Explore All</span>
              <ArrowUpRight className="size-3.5 sm:size-4" />
            </Link>

            {/* Mobile 3-Dots Menu Trigger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Open navigation menu"
              title="Menu"
              className="grid size-9 sm:size-10 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-[#22c55e] hover:border-[#22c55e]/50 hover:bg-white/10 active:scale-95 transition-all md:hidden cursor-pointer shadow-sm"
            >
              {isMobileMenuOpen ? <X className="size-4 text-white" /> : <MoreVertical className="size-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation with all 7 Sections */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/85 backdrop-blur-md transition-opacity md:hidden">
          <div
            className="fixed inset-0"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-10 max-h-[85vh] w-full overflow-y-auto rounded-t-3xl border-t border-[#22c55e]/30 bg-[#0c0e12] p-5 shadow-[0_-15px_40px_rgba(0,0,0,0.9)]">
            {/* Grab handle */}
            <div className="mx-auto h-1.5 w-12 rounded-full bg-white/20 mb-4" />

            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#22c55e] animate-pulse" />
                  Navigation Menu
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Select a section to explore
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="grid size-8 place-items-center rounded-full bg-white/10 text-white/70 hover:text-white cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* 7 Header Sections Links */}
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentPath === item.href || (item.href !== "/" && currentPath.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-xl border p-3 transition-all active:scale-[0.98] cursor-pointer ${
                      isActive
                        ? "border-[#22c55e] bg-[#22c55e]/10 text-white"
                        : "border-white/[0.08] bg-white/[0.03] text-white/80 hover:border-[#22c55e]/40 hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`grid size-9 shrink-0 place-items-center rounded-xl border ${
                        isActive
                          ? "bg-[#22c55e]/20 border-[#22c55e] text-[#22c55e]"
                          : "bg-white/[0.05] border-white/10 text-white/70"
                      }`}>
                        <IconComponent className="size-4.5" />
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className={`font-bold text-sm ${isActive ? "text-[#22c55e]" : "text-white"}`}>
                          {item.name}
                        </span>
                        <span className="truncate text-[11px] text-white/50">
                          {item.sub}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className={`size-4 shrink-0 ${isActive ? "text-[#22c55e]" : "text-white/30"}`} />
                  </Link>
                );
              })}
            </div>

            {/* Quick External Actions */}
            <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center gap-2">
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-2.5 text-xs font-semibold text-white/80 active:scale-95 hover:border-white/20"
              >
                <Mail className="size-3.5 text-[#22c55e]" />
                <span>Support Desk</span>
              </Link>
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-2.5 text-xs font-semibold text-white/80 active:scale-95 hover:border-white/20"
              >
                <Lock className="size-3.5 text-amber-400" />
                <span>Admin Login</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

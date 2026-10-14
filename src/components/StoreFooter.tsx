import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ShieldCheck, Zap, RotateCcw, FileText, Lock } from "lucide-react";
import { NAV_LINKS } from "./Navbar";

export function StoreFooter() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#050709] text-xs text-white/60">
      <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 pb-10 border-b border-white/[0.08]">
          {/* Brand Info */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2.5 font-semibold tracking-[0.08em] text-white">
              <img
                src="/logo-icon.png"
                alt="GurfMarket Emblem"
                className="size-7 rounded-lg object-cover border border-[#22c55e]/50"
              />
              <span className="font-extrabold tracking-wider text-sm">GURFMARKET</span>
            </Link>
            <p className="text-xs text-white/50 leading-relaxed max-w-xs">
              Direct supplier-backed marketplace for premium streaming, AI memberships, VPNs, gaming keys, and digital accounts.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#22c55e]">
              <span className="size-2 rounded-full bg-[#22c55e] animate-pulse" />
              <span>Real-time Wholesale API Connected</span>
            </div>
            {/* Replacement Guarantee Badge */}
            <div className="pt-1">
              <Link
                to="/refund-policy"
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-[#22c55e] hover:bg-emerald-500/20 transition-all"
              >
                <RotateCcw className="size-3" />
                <span>Replacements Guaranteed</span>
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs">
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-white/60 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Customer Support</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://t.me/gurfmarketsupport"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors"
                >
                  <span>Telegram Support Desk</span>
                  <ArrowUpRight className="size-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/gurfmarket"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
                >
                  <span>Official Telegram Channel</span>
                  <ArrowUpRight className="size-3" />
                </a>
              </li>
              <li>
                <Link to="/contact" className="text-white/60 hover:text-white transition-colors">
                  Contact Support & Tickets
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-white/60 hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Legal & Policies</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/terms"
                  className="flex items-center gap-2 text-white/70 hover:text-[#22c55e] transition-colors"
                >
                  <FileText className="size-3.5 text-white/40" />
                  <span>Terms and Conditions</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="flex items-center gap-2 text-white/70 hover:text-[#22c55e] transition-colors"
                >
                  <RotateCcw className="size-3.5 text-[#22c55e]" />
                  <span className="font-medium text-white/90">Refund & Replace Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="flex items-center gap-2 text-white/70 hover:text-[#22c55e] transition-colors"
                >
                  <Lock className="size-3.5 text-white/40" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
            </ul>

            <div className="pt-2 space-y-2">
              <div className="flex items-start gap-2 text-[11px] text-white/60">
                <Zap className="size-3.5 text-[#22c55e] shrink-0 mt-0.5" />
                <span>Instant automated credential dispatch 24/7.</span>
              </div>
              <div className="flex items-start gap-2 text-[11px] text-white/60">
                <ShieldCheck className="size-3.5 text-[#22c55e] shrink-0 mt-0.5" />
                <span>100% pre-validated working credentials & warranty.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Policy Quick Links */}
        <div className="flex flex-col gap-4 pt-6 md:flex-row md:items-center md:justify-between text-[11px] text-white/50">
          <div>
            <span>© {new Date().getFullYear()} GurfMarket. All rights reserved. Supreme Market Reseller Integration.</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link to="/refund-policy" className="hover:text-white transition-colors text-white/80">
              Refund & Replace Policy
            </Link>
            <span>•</span>
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/admin" className="hover:text-white/70 transition-colors">
              Admin Portal
            </Link>
            <span>•</span>
            <a href="#top" className="inline-flex items-center gap-1 hover:text-white transition-colors">
              Back to top <ArrowUpRight className="size-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

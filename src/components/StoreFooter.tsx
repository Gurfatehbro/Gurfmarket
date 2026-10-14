import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ShieldCheck, Zap } from "lucide-react";
import { NAV_LINKS } from "./Navbar";

export function StoreFooter() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#050709] text-xs text-white/60">
      <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 pb-10 border-b border-white/[0.08]">
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

          {/* Quick Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Customer Support</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/faq" className="text-white/60 hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/60 hover:text-white transition-colors">
                  Contact Support & Tickets
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-white/60 hover:text-white transition-colors">
                  Warranty & Replacement Policy
                </Link>
              </li>
              <li>
                <Link to="/invoice/$id" params={{ id: "search" }} className="text-white/60 hover:text-white transition-colors">
                  Track Existing Invoice
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust Guarantees */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Guarantees</h4>
            <div className="flex items-start gap-2 text-xs text-white/70">
              <Zap className="size-4 text-[#22c55e] shrink-0 mt-0.5" />
              <span>Instant automated credential dispatch 24/7.</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-white/70">
              <ShieldCheck className="size-4 text-[#22c55e] shrink-0 mt-0.5" />
              <span>100% pre-validated working credentials & warranty.</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between text-[11px] text-white/40">
          <span>© {new Date().getFullYear()} GurfMarket. All rights reserved. Supreme Market Reseller Integration.</span>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="hover:text-white/70 transition-colors">Admin Portal</Link>
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

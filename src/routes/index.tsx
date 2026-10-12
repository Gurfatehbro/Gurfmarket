import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, ArrowUpRight, Boxes, ChevronDown, Layers3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import digitalCollection from "@/assets/digital-collection.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Northform — Digital goods for your next idea" },
      { name: "description", content: "A considered home for digital goods. The Northform collection is taking shape." },
      { property: "og:title", content: "Northform — Digital goods for your next idea" },
      { property: "og:description", content: "A considered home for digital goods. The Northform collection is taking shape." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="overflow-hidden bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto grid h-[72px] max-w-[1240px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 sm:flex sm:justify-between sm:px-8">
          <a href="#top" className="flex min-w-0 items-center gap-3" aria-label="Northform home">
            <span className="grid size-9 shrink-0 place-items-center rounded-sm border border-electric/50 bg-electric/10 text-[11px] font-extrabold tracking-[0.12em] text-electric-bright">N<span className="text-foreground">F</span></span>
            <span className="truncate text-[14px] font-bold tracking-[0.08em]">NORTHFORM</span>
          </a>

          <nav aria-label="Main navigation" className="hidden items-center gap-8 text-[13px] text-copy-secondary md:flex">
            <a className="transition-colors hover:text-foreground" href="#products">Collection</a>
            <a className="transition-colors hover:text-foreground" href="#bundles">Bundles</a>
            <a className="transition-colors hover:text-foreground" href="#about">About</a>
            <a className="transition-colors hover:text-foreground" href="#faq">FAQ</a>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <details className="group relative md:hidden">
              <summary aria-label="Open navigation" className="grid size-10 cursor-pointer list-none place-items-center rounded-sm border border-border text-sm [&::-webkit-details-marker]:hidden">
                <span className="flex flex-col gap-1"><span className="h-px w-4 bg-foreground"/><span className="h-px w-4 bg-foreground"/></span>
              </summary>
              <nav aria-label="Mobile navigation" className="absolute right-0 top-12 grid w-48 gap-1 rounded-sm border border-border bg-surface-raised p-2 shadow-xl">
                <a className="rounded-sm px-3 py-3 text-sm text-foreground hover:bg-accent" href="#products">Collection</a>
                <a className="rounded-sm px-3 py-3 text-sm text-foreground hover:bg-accent" href="#bundles">Bundles</a>
                <a className="rounded-sm px-3 py-3 text-sm text-foreground hover:bg-accent" href="#about">About</a>
                <a className="rounded-sm px-3 py-3 text-sm text-foreground hover:bg-accent" href="#faq">FAQ</a>
              </nav>
            </details>
            <Button asChild className="h-10 rounded-sm px-4 text-xs sm:px-5 sm:text-sm">
              <a href="#products">Explore collection <ArrowUpRight aria-hidden="true" /></a>
            </Button>
          </div>
        </div>
      </header>

      <section id="top" className="relative isolate border-b border-border/60">
        <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-full opacity-50" />
        <div className="mx-auto grid min-h-[610px] max-w-[1240px] items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:min-h-[680px] lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:py-16">
          <div className="max-w-[590px]">
            <p className="mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-electric-bright">
              <span className="h-px w-7 bg-electric" /> A new kind of digital storefront
            </p>
            <h1 className="font-display text-[clamp(3.35rem,7.1vw,6.25rem)] font-bold leading-[0.98] tracking-normal">
              Good tools.<br />
              <span className="text-electric-bright">Better ideas.</span>
            </h1>
            <p className="mt-7 max-w-[440px] text-base leading-7 text-copy-secondary sm:text-lg sm:leading-8">
              Digital goods for the things you want to make. Meet Northform — a considered collection, taking shape.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="h-12 rounded-sm px-5 text-sm">
                <a href="#products">Browse the collection <ArrowRight aria-hidden="true" /></a>
              </Button>
              <Button asChild variant="outline" className="h-12 rounded-sm border-border bg-surface-glass px-5 text-sm backdrop-blur-md hover:bg-accent">
                <a href="#about">Get to know us <ArrowDown aria-hidden="true" /></a>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-border/70 pt-5 text-xs text-copy-secondary sm:gap-x-9">
              <span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-electric"/> Digital goods</span>
              <span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-electric"/> One considered collection</span>
              <span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-electric"/> Made for what’s next</span>
            </div>
          </div>

          <div className="showcase-glow relative mx-auto w-full max-w-[540px] lg:ml-auto">
            <div aria-hidden="true" className="absolute -inset-5 -z-10 rounded-full bg-electric/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-sm border border-border/80 bg-surface-raised p-2 shadow-2xl sm:p-3">
              <img src={digitalCollection} alt="Layered digital design sheets and downloadable file concepts" width={1024} height={1280} fetchPriority="high" className="aspect-[1.14/1] w-full rounded-[2px] object-cover object-center sm:aspect-[1.03/1] lg:aspect-[0.92/1]" />
              <div className="pointer-events-none absolute inset-x-2 bottom-2 flex items-end justify-between bg-gradient-to-t from-background/95 via-background/60 to-transparent px-5 pb-5 pt-14 sm:inset-x-3 sm:bottom-3 sm:px-6 sm:pb-6">
                <div><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-electric-bright">NORTHFORM / 001</p><p className="mt-1 text-lg font-semibold">A space for better work.</p></div>
                <span className="mb-1 grid size-10 shrink-0 place-items-center rounded-sm border border-border bg-surface-glass text-electric-bright backdrop-blur-md"><Layers3 size={17} aria-hidden="true" /></span>
              </div>
            </div>
            <div className="absolute -left-2 top-[18%] hidden items-center gap-3 rounded-sm border border-border/80 bg-surface-glass px-4 py-3 shadow-xl backdrop-blur-xl sm:flex lg:-left-7">
              <span className="grid size-9 place-items-center rounded-sm bg-electric/10 text-electric-bright"><Sparkles size={16} aria-hidden="true" /></span>
              <span><span className="block text-xs font-semibold">A little more room</span><span className="mt-1 block text-[10px] text-copy-secondary">for your next idea</span></span>
            </div>
            <div className="absolute -right-2 bottom-[16%] hidden items-center gap-2 rounded-sm border border-border/80 bg-surface-glass px-3 py-2.5 text-xs shadow-xl backdrop-blur-xl sm:flex lg:-right-5">
              <span className="grid size-7 place-items-center rounded-sm bg-electric/10 text-electric-bright"><Boxes size={14} aria-hidden="true" /></span>
              <span className="font-medium">Digital, by design</span>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="scroll-mt-24 border-b border-border/60">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-electric-bright">The collection</p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">Find your next starting point.</h2>
            </div>
            <p className="max-w-[330px] text-sm leading-6 text-copy-secondary sm:text-right">A carefully chosen collection of digital goods is on its way.</p>
          </div>
          <div className="mt-10 grid min-h-[220px] place-items-center border border-dashed border-border bg-surface-raised/45 px-6 py-10 text-center sm:min-h-[250px]">
            <div className="max-w-md">
              <span className="mx-auto grid size-11 place-items-center rounded-sm border border-border bg-background text-electric-bright"><Layers3 size={19} aria-hidden="true" /></span>
              <p className="mt-4 text-base font-semibold">The shelves are still being set.</p>
              <p className="mt-2 text-sm leading-6 text-copy-secondary">Real products and prices will appear here when the Northform catalog is ready.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="bundles" className="scroll-mt-24 border-b border-border/60 bg-surface-raised/40">
        <div className="mx-auto grid max-w-[1240px] gap-8 px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="flex min-w-0 items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-sm border border-electric/30 bg-electric/10 text-electric-bright"><Boxes size={19} aria-hidden="true" /></span>
            <div className="min-w-0"><p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-electric-bright">Bundles</p><h2 className="mt-2 font-display text-2xl font-semibold">A little more, together.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-copy-secondary">Bundle details will live here as the collection comes together.</p></div>
          </div>
          <span className="inline-flex w-fit items-center gap-2 border border-border px-3 py-2 text-xs text-copy-secondary"><span className="size-1.5 rounded-full bg-success"/> Coming into focus</span>
        </div>
      </section>

      <section id="about" className="scroll-mt-24 border-b border-border/60">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-28">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-electric-bright">A note from Northform</p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">Useful things for ideas in motion.</h2>
            <p className="mt-5 text-base leading-7 text-copy-secondary">Northform is being shaped as a focused home for digital products. The collection is not listed yet; product details and pricing will be added when they’re ready.</p>
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24">
        <div className="mx-auto grid max-w-[1240px] gap-8 px-5 py-20 sm:px-8 sm:py-24 md:grid-cols-[0.7fr_1.3fr]">
          <div><p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-electric-bright">Good to know</p><h2 className="mt-3 font-display text-3xl font-semibold">A few first questions.</h2></div>
          <div className="divide-y divide-border border-y border-border">
            <details className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-medium [&::-webkit-details-marker]:hidden">Can I shop the collection now?<ChevronDown size={17} aria-hidden="true" className="shrink-0 text-copy-secondary transition-transform group-open:rotate-180" /></summary>
              <p className="mt-3 max-w-xl pr-8 text-sm leading-6 text-copy-secondary">Not yet. The storefront is ready to take shape, but real products and prices have not been added.</p>
            </details>
            <details className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-medium [&::-webkit-details-marker]:hidden">Where will product details appear?<ChevronDown size={17} aria-hidden="true" className="shrink-0 text-copy-secondary transition-transform group-open:rotate-180" /></summary>
              <p className="mt-3 max-w-xl pr-8 text-sm leading-6 text-copy-secondary">Product contents, file formats, pricing, and any purchase terms should be shown alongside each item once the catalog is connected.</p>
            </details>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/70">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-5 py-7 text-xs text-copy-secondary sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <a href="#top" className="flex items-center gap-2.5 font-semibold tracking-[0.08em] text-foreground"><span className="grid size-7 place-items-center rounded-sm border border-electric/50 bg-electric/10 text-[9px] font-extrabold text-electric-bright">NF</span> NORTHFORM</a>
          <span>Independent digital goods. Collection in progress.</span>
          <a href="#faq" className="inline-flex items-center gap-1 hover:text-foreground">Good to know <ArrowUpRight size={13} aria-hidden="true" /></a>
        </div>
      </footer>
    </main>
  );
}

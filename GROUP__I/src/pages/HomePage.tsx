import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { PropertyCard } from "../components/property/PropertyCard";
import { AnimatedStat } from "../components/ui/AnimatedStat";
import { useInView } from "../hooks/useCountUp";

const HERO_BG =
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600&q=90";

// ── Loader card that animates its progress bar on scroll in ─────────────────
function TxCard() {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="glass-card p-6 md:p-8 rounded-2xl border border-primary/20 -rotate-2 md:-rotate-3 translate-x-4"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-primary">
            account_balance_wallet
          </span>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant font-label">
            Transaction Verified
          </p>
          <p className="font-bold text-sm font-headline">42.5K OP Settled</p>
        </div>
      </div>
      {/* Progress bar — animates on scroll in */}
      <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-primary to-primary-container h-1.5 rounded-full transition-all duration-[1800ms] ease-out"
          style={{ width: inView ? "66%" : "0%" }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-on-surface-variant mt-1 font-label uppercase">
        <span>Progress</span>
        <span
          className={`transition-all duration-[1800ms] ${
            inView ? "text-primary" : ""
          }`}
        >
          {inView ? "66%" : "0%"}
        </span>
      </div>
    </div>
  );
}

export function HomePage() {
  const { listedProperties } = useApp();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuredProperties = listedProperties.slice(0, 3);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add("visible")
        ),
      { threshold: 0.08 }
    );
    document
      .querySelectorAll(".scroll-reveal")
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Hero parallax
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onScroll = () => {
      const bg = hero.querySelector(".hero-bg") as HTMLElement;
      if (bg) bg.style.transform = `translateY(${window.scrollY * 0.35}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="page-enter">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0 hero-bg">
          <img
            src={HERO_BG}
            alt="Modern coastal villa at dusk"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        </div>
        <div className="container mx-auto px-6 md:px-8 relative z-10">
          <div className="max-w-4xl space-y-6 md:space-y-8">
            <span
              className="font-label text-primary-container tracking-[0.3em] uppercase text-xs font-bold px-4 py-1 border border-primary-container/30 rounded-full inline-block animate-fadeInUp"
              style={{ animationDelay: ".1s", opacity: 0 }}
            >
              Web3 Real Estate Protocol
            </span>
            <h1
              className="font-headline text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight tracking-tighter text-on-background animate-fadeInUp"
              style={{ animationDelay: ".2s", opacity: 0 }}
            >
              The Future of <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">
                High-Liquidity
              </span>{" "}
              <br className="hidden sm:block" />
              Real Estate
            </h1>
            <p
              className="font-body text-base md:text-xl text-on-surface-variant max-w-xl leading-relaxed animate-fadeInUp"
              style={{ animationDelay: ".35s", opacity: 0 }}
            >
              Instant settlements, fractional ownership, and verifiable yield on
              premium coastal assets.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 pt-4 animate-fadeInUp"
              style={{ animationDelay: ".5s", opacity: 0 }}
            >
              <Link
                to="/marketplace"
                className="bg-primary-container text-on-primary px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg hover:shadow-[0_0_20px_rgba(0,210,255,0.4)] transition-all text-center font-headline luminous-button"
              >
                Explore Listings
              </Link>
              <a
                href="#how-it-works"
                className="border border-outline-variant/20 bg-surface-container-high/40 backdrop-blur-md text-primary px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg hover:bg-surface-container-high transition-all text-center font-headline"
              >
                How It Works
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-float">
          <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">
            Scroll to Discover
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
        </div>
      </section>

      {/* ── Stats (count-up on scroll) ─────────────────────── */}
      <section className="py-16 md:py-24 bg-surface-container-low border-y border-outline-variant/5">
        <div className="container mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
            <AnimatedStat
              label="Total Volume"
              value={1.42}
              prefix="$"
              suffix="B+"
              decimals={2}
              sub="+24.8% (24h)"
              subIcon="trending_up"
              duration={2000}
            />
            <AnimatedStat
              label="Active Properties"
              value={842}
              sub="Global verified assets"
              subColor="text-on-surface-variant/60"
            />
            <AnimatedStat
              label="Holders"
              value={12604}
              sub="On-chain verified"
              subIcon="verified"
            />
          </div>
        </div>
      </section>

      {/* ── Featured Listings ─────────────────────────────── */}
      <section className="py-20 md:py-32 bg-surface">
        <div className="container mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-4 scroll-reveal">
            <div>
              <span className="text-primary-container font-bold text-sm tracking-widest uppercase mb-2 block font-label">
                Curated Collection
              </span>
              <h2 className="font-headline text-3xl md:text-5xl font-extrabold text-on-background">
                Featured Listings
              </h2>
            </div>
            <Link
              to="/marketplace"
              className="text-primary flex items-center gap-2 font-bold hover:gap-4 transition-all pb-2 border-b border-primary/20 font-body text-sm"
            >
              View Marketplace{" "}
              <span className="material-symbols-outlined">arrow_right_alt</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredProperties.length > 0 ? (
              featuredProperties.map((p, i) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  variant="featured"
                  animationDelay={i * 100}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-20 text-on-surface-variant">
                No properties listed yet.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-16 md:py-24 container mx-auto px-6 md:px-8"
      >
        <div className="flex flex-col lg:flex-row gap-12 md:gap-16 items-center">
          <div className="lg:w-1/2 space-y-6 md:space-y-8 scroll-reveal">
            <h2 className="font-headline text-3xl md:text-5xl font-extrabold leading-tight">
              Beyond Static <br />
              <span className="text-primary">Real Estate Grids</span>
            </h2>
            <p className="text-base md:text-lg text-on-surface-variant leading-relaxed font-body">
              Traditional real estate is stuck in the 20th century. Ocean
              Properties leverages decentralized finance to bring speed,
              transparency, and liquidity to the world's most desirable coastal
              destinations.
            </p>
            <div className="grid grid-cols-2 gap-6 md:gap-8">
              {[
                {
                  icon: "speed",
                  title: "Instant Trading",
                  desc: "Exit your position in seconds, not months.",
                },
                {
                  icon: "token",
                  title: "Fractionalization",
                  desc: "Own a $50M villa for as little as $1,000.",
                },
                {
                  icon: "verified_user",
                  title: "On-Chain Warranty",
                  desc: "Smart-contract enforced maintenance escrow.",
                },
                {
                  icon: "account_balance",
                  title: "DeFi Yield",
                  desc: "Earn passive income from premium real estate.",
                },
              ].map((item) => (
                <div key={item.title} className="space-y-3">
                  <span className="material-symbols-outlined text-primary text-3xl md:text-4xl">
                    {item.icon}
                  </span>
                  <h4 className="font-bold font-headline text-sm md:text-base">
                    {item.title}
                  </h4>
                  <p className="text-xs md:text-sm text-on-surface-variant font-body">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Animated card image ── #2 ── */}
          <div
            className="lg:w-1/2 relative scroll-reveal"
            style={{ transitionDelay: ".15s" }}
          >
            <div className="aspect-square bg-gradient-to-br from-surface-container-high to-surface rounded-3xl overflow-hidden border border-outline-variant/20 rotate-2 md:rotate-3">
              <img
                src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80"
                alt=""
                className="w-full h-full object-cover mix-blend-overlay opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12">
                <TxCard />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-surface-container-low border-t border-outline-variant/5">
        <div className="container mx-auto px-6 md:px-8 text-center space-y-6 md:space-y-8 scroll-reveal">
          <h2 className="font-headline text-3xl md:text-5xl font-extrabold">
            Ready to Dive In?
          </h2>
          <p className="text-on-surface-variant font-body max-w-xl mx-auto">
            Connect your wallet and start exploring premium real estate
            on-chain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/marketplace"
              className="bg-primary-container text-on-primary px-8 py-4 rounded-lg font-bold text-lg hover:shadow-[0_0_20px_rgba(0,210,255,0.4)] transition-all font-headline luminous-button"
            >
              Browse Marketplace
            </Link>
            <Link
              to="/dashboard"
              className="border border-outline-variant/20 bg-surface-container-high text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-surface-container-highest transition-all font-headline"
            >
              Owner Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

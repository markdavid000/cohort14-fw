import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export function Navbar() {
  const location = useLocation();
  const { isConnected, address } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Marketplace", to: "/marketplace" },
    { label: "Portfolio", to: "/dashboard" },
  ];

  const isActive = (to: string) => location.pathname === to;

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-20 transition-all duration-300 glass-nav shadow-[0_20px_40px_rgba(0,210,255,0.08)] ${
          scrolled ? "border-b border-outline-variant/10" : ""
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-4 md:gap-8">
          <Link
            to="/"
            className="text-xl md:text-2xl font-bold text-primary tracking-tighter font-headline shrink-0"
          >
            Ocean Properties
          </Link>
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-1 font-headline tracking-tight">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1 rounded transition-all duration-300 text-sm font-medium ${
                  isActive(link.to)
                    ? "text-primary border-b-2 border-primary-container pb-1"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary-container"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search - desktop only */}
          <div className="hidden lg:flex items-center bg-surface-container-lowest px-4 py-2 rounded-full border border-outline-variant/15">
            <span className="material-symbols-outlined text-on-surface-variant text-sm mr-2">
              search
            </span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm text-on-surface placeholder-on-surface-variant/50 w-48 outline-none font-body"
              placeholder="Search coastal assets..."
              type="text"
            />
          </div>

          {/* Wallet Button — placeholder for wagmi/reown integration */}
          <button className="bg-primary-container text-on-primary px-4 md:px-6 py-2 rounded-lg font-bold text-sm hover:brightness-110 transition-all duration-200 luminous-button font-label whitespace-nowrap">
            {isConnected && address
              ? `${address.slice(0, 6)}...${address.slice(-4)}`
              : "Connect Wallet"}
          </button>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-on-surface-variant hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-20 left-0 right-0 z-40 glass-nav border-b border-outline-variant/10 p-4 flex flex-col gap-2 md:hidden animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-medium font-label transition-all ${
                isActive(link.to)
                  ? "bg-surface-container-high text-primary"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

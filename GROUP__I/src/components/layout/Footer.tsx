import { Link } from "react-router-dom";

export function Footer() {
  const links = [{ label: "Marketplace", to: "/marketplace" }];

  return (
    <footer className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center bg-surface-container-lowest border-t border-outline-variant/15 gap-8">
      <div className="space-y-2 text-center md:text-left">
        <Link
          to="/"
          className="block text-lg font-bold text-primary-container font-headline"
        >
          Ocean Properties
        </Link>
        <p className="font-label text-sm uppercase tracking-widest text-on-surface-variant opacity-60">
          © {new Date().getFullYear()} Ocean Properties. High-Liquidity Real
          Estate.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 md:gap-8 font-label text-sm uppercase tracking-widest">
        {links.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className="text-on-surface-variant hover:text-primary transition-colors opacity-70 hover:opacity-100"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-surface-container-low border border-outline-variant/10 flex items-center justify-center cursor-pointer hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined text-primary text-xl">
            share
          </span>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface-container-low border border-outline-variant/10 flex items-center justify-center cursor-pointer hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined text-primary text-xl">
            public
          </span>
        </div>
      </div>
    </footer>
  );
}

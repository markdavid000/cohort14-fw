import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-8 px-6 text-center page-enter">
      <div className="space-y-4">
        <h1 className="font-headline text-[120px] md:text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/20 leading-none">
          404
        </h1>
        <h2 className="font-headline text-2xl md:text-3xl font-bold text-on-surface">
          Page Not Found
        </h2>
        <p className="text-on-surface-variant font-body max-w-md mx-auto">
          The asset you're looking for has either been delisted or doesn't exist
          on-chain.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          to="/"
          className="bg-primary-container text-on-primary px-6 py-3 rounded-lg font-bold font-label luminous-button hover:brightness-110 transition-all"
        >
          Go Home
        </Link>
        <Link
          to="/marketplace"
          className="border border-outline-variant/20 bg-surface-container-high text-primary px-6 py-3 rounded-lg font-bold font-label hover:bg-surface-container-highest transition-all"
        >
          Browse Marketplace
        </Link>
      </div>
    </div>
  );
}

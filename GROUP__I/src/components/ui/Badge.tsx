import { type ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?:
    | "listed"
    | "sold"
    | "unlisted"
    | "verified"
    | "minting"
    | "rare"
    | "liquidity";
  pulse?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = "listed",
  pulse = false,
  className = "",
}: BadgeProps) {
  const variants = {
    listed: "bg-on-secondary-container text-secondary",
    sold: "bg-error-container/30 text-error",
    unlisted: "bg-surface-container-highest text-on-surface-variant",
    verified: "bg-primary-container/20 text-primary-container backdrop-blur-sm",
    minting: "bg-on-secondary-container text-secondary",
    rare: "bg-on-secondary-container text-secondary",
    liquidity:
      "bg-primary-container/20 text-primary-container backdrop-blur-sm",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${variants[variant]} ${className}`}
    >
      {pulse && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      )}
      {children}
    </span>
  );
}

export function formatPrice(price: bigint): string {
  // Convert from wei (1e18) to token units
  const units = Number(price) / 1e18;
  if (units >= 1_000_000) return `${(units / 1_000_000).toFixed(1)}M OP`;
  if (units >= 1_000) return `${(units / 1_000).toFixed(0)}K OP`;
  return `${units.toFixed(0)} OP`;
}

export function shortenAddress(addr: string): string {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function clsx(
  ...classes: (string | undefined | null | false)[]
): string {
  return classes.filter(Boolean).join(" ");
}

export const PROPERTY_TYPE_OPTIONS = [
  "All Types",
  "Villa",
  "Apartment",
  "Commercial",
  "Hospitality",
  "Residential",
];

export const PROPERTY_CATEGORY_OPTIONS = [
  "All Categories",
  "Beachfront",
  "Metropolitan",
  "Luxury Retreat",
  "Ultra-Luxury",
  "Commercial",
];

export const PRICE_RANGE_OPTIONS = [
  "All Ranges",
  "0 - 50K",
  "50K - 250K",
  "250K+",
];

export const WARRANTY_OPTIONS = [
  "5 years",
  "7 years",
  "10 years",
  "15 years",
  "20 years",
];

// Fake stats for hero section
export const MARKET_STATS = {
  totalVolume: "$1.42B+",
  volumeChange: "+24.8% (24h)",
  activeProperties: "842",
  holders: "12,604",
};

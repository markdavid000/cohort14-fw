import React from "react";
import { useCountUp, useInView } from "../../hooks/useCountUp";

interface AnimatedStatProps {
  label: string;
  /** numeric end value  */
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  sub?: string;
  subIcon?: string;
  subColor?: string;
  duration?: number;
}

export function AnimatedStat({
  label,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  sub,
  subIcon,
  subColor = "text-secondary",
  duration = 1800,
}: AnimatedStatProps) {
  const { ref, inView } = useInView();
  const display = useCountUp(
    { end: value, prefix, suffix, decimals, duration },
    inView
  );

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="space-y-2 text-center"
    >
      <p className="font-label text-on-surface-variant text-sm uppercase tracking-widest">
        {label}
      </p>
      <h3 className="font-headline text-5xl font-black text-primary text-glow transition-all">
        {display}
      </h3>
      {sub && (
        <div
          className={`flex items-center justify-center gap-2 text-xs font-bold ${subColor}`}
        >
          {subIcon && (
            <span className="material-symbols-outlined text-sm">{subIcon}</span>
          )}
          <span>{sub}</span>
        </div>
      )}
    </div>
  );
}

/** Compact version used in dashboard stat cards */
export function AnimatedDashStat({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1200,
  className = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const { ref, inView } = useInView();
  const display = useCountUp(
    { end: value, prefix, suffix, decimals, duration },
    inView
  );
  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>} className={className}>
      {display}
    </span>
  );
}

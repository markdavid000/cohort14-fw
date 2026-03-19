import { type ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  subIcon?: string;
  subColor?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  sub,
  subIcon,
  subColor = "text-secondary",
  className = "",
}: StatCardProps) {
  return (
    <div className={`space-y-2 text-center ${className}`}>
      <p className="font-label text-on-surface-variant text-sm uppercase tracking-widest">
        {label}
      </p>
      <h3 className="font-headline text-5xl font-black text-primary text-glow">
        {value}
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

interface DashboardStatCardProps {
  label: string;
  value: string;
  icon?: ReactNode;
  color?: string;
}

export function DashboardStatCard({
  label,
  value,
  icon,
  color = "text-primary",
}: DashboardStatCardProps) {
  return (
    <div className="col-span-1 p-6 rounded-xl bg-surface-container-low border border-outline-variant/10">
      <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-2 font-label">
        {label}
      </p>
      <div className={`flex items-center gap-2 ${color}`}>
        {icon}
        <p className={`text-3xl font-bold font-headline`}>{value}</p>
      </div>
    </div>
  );
}

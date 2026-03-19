// src/components/cards/StatsCard.tsx
import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon }) => {
  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm uppercase tracking-wide">{label}</span>
        {icon && <div className="text-gray-600">{icon}</div>}
      </div>
      <p className="text-white text-3xl font-bold">{value}</p>
    </div>
  );
};




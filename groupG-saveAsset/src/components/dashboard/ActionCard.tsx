import React, { type ReactNode } from 'react';

interface ActionCardProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({ icon, label, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 sm:p-6 bg-[#1a1c23] hover:bg-[#22252e] rounded-xl cursor-pointer transition-colors w-full h-[120px] border border-gray-800"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
    >
      <div className="mb-3 text-gray-400 p-2 rounded-full bg-[#121418] border border-gray-800/80">
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-300 text-center">{label}</span>
    </div>
  );
};

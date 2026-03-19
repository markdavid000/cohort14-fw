// src/components/cards/AccountCard.tsx
import React from 'react';
import { type Account } from '../../types/IMultisig';

interface AccountCardProps {
  account: Account;
  onClick?: () => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onClick }) => {
  // Generate gradient color based on account name
  const getGradient = (name: string) => {
    const gradients = [
      'from-purple-500 to-pink-500',
      'from-yellow-400 to-orange-500',
      'from-green-400 to-cyan-500',
    ];
    const index = name.length % gradients.length;
    return gradients[index];
  };

  return (
    <div
      onClick={onClick}
      className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 hover:border-[#7FFFD4] transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full bg-linear-to-br ${getGradient(account.name)} flex items-center justify-center`}>
          <span className="text-white font-bold text-lg">
            {account.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium truncate group-hover:text-[#7FFFD4] transition-colors">
            {account.name}
          </h3>
          <p className="text-gray-400 text-sm font-mono">{account.address}</p>
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <svg className="w-4 h-4 text-[#7FFFD4] opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-500 text-xs uppercase">{account.network}</span>
      </div>
    </div>
  );
};
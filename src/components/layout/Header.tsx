// src/components/layout/Header.tsx
// Single header used on ALL screen sizes.
// — Mobile: hamburger | logo | account pill
// — Desktop (lg+): hamburger hidden, account info + actions on the right

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { type Account } from '../../types/IMultisig';
import { truncateAddress } from '../../utils/mockData';

interface HeaderProps {
  selectedAccount: Account;
  accounts: Account[];
  onAccountSelect: (accountId: string) => void;
  onMenuClick: () => void; // triggers the mobile sidebar drawer
}

export const Header: React.FC<HeaderProps> = ({
  selectedAccount,
  accounts,
  onAccountSelect,
  onMenuClick,
}) => {
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  // Generate a deterministic colour from an address string
  const avatarColor = (address: string) => {
    const colors = [
      'bg-purple-500', 'bg-blue-500', 'bg-green-500',
      'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500',
    ];
    const idx = parseInt(address.slice(2, 4), 16) % colors.length;
    return colors[idx];
  };

  return (
    <div className="flex items-center justify-between px-4 md:px-6 h-14 bg-[#111]">

      {/* LEFT — hamburger (mobile only) + logo (mobile only) */}
      <div className="flex items-center gap-3">
        {/* Hamburger — only on mobile, hidden on lg+ */}
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5
                     transition-colors lg:hidden"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo — only shown on mobile (sidebar already shows it on desktop) */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="w-6 h-6 rounded-md bg-[#7FFFD4] flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <span className="text-white font-bold text-sm">MultisigLabs</span>
        </div>

        {/* Desktop: show current page contract address */}
        <div className="hidden lg:flex items-center gap-2">
          <a
            href={`https://sepolia.etherscan.io/address/${selectedAccount.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-gray-400 hover:text-white
                       transition-colors text-sm font-mono"
          >
            {truncateAddress(selectedAccount.address, 6)}
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* RIGHT — account switcher pill */}
      <div className="relative">
        <button
          onClick={() => setAccountDropdownOpen((v) => !v)}
          className="flex items-center gap-2.5 bg-[#1a1a1a] border border-gray-800
                     hover:border-gray-600 rounded-xl px-3 py-1.5 transition-colors"
        >
          {/* Avatar */}
          <div className={`w-6 h-6 rounded-full ${avatarColor(selectedAccount.address)}
                           flex items-center justify-center text-white text-xs font-bold shrink-0`}>
            {selectedAccount.name.slice(0, 1).toUpperCase()}
          </div>

          {/* Name + balance — truncated on mobile */}
          <div className="text-left min-w-0 hidden sm:block">
            <p className="text-white text-xs font-medium truncate max-w-[120px] md:max-w-[180px]">
              {truncateAddress(selectedAccount.address, 6)}
            </p>
            <p className="text-[#7FFFD4] text-xs">{selectedAccount.balance} TOKEN</p>
          </div>

          {/* Balance only on xs */}
          <p className="text-[#7FFFD4] text-xs font-medium sm:hidden">
            {selectedAccount.balance}
          </p>

          <svg
            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200
                        ${accountDropdownOpen ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Account dropdown */}
        {accountDropdownOpen && (
          <>
            {/* Click-away */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setAccountDropdownOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-64 z-20
                            bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-2xl
                            overflow-hidden">
              <div className="p-3 border-b border-gray-800">
                <p className="text-gray-500 text-xs uppercase tracking-wider">Switch Account</p>
              </div>
              {accounts.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => {
                    onAccountSelect(acc.id);
                    setAccountDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left
                               transition-colors hover:bg-white/5
                               ${acc.id === selectedAccount.id ? 'bg-[#7FFFD4]/5' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full ${avatarColor(acc.address)}
                                   flex items-center justify-center text-white text-xs
                                   font-bold shrink-0`}>
                    {acc.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-xs font-medium truncate">{acc.name}</p>
                    <p className="text-gray-500 text-xs font-mono truncate">
                      {truncateAddress(acc.address)}
                    </p>
                  </div>
                  {acc.id === selectedAccount.id && (
                    <svg className="w-4 h-4 text-[#7FFFD4] shrink-0" fill="none"
                         stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
              <div className="p-3 border-t border-gray-800">
                <Link
                  to="/new-transaction"
                  onClick={() => setAccountDropdownOpen(false)}
                  className="flex items-center gap-2 text-[#7FFFD4] text-xs
                             hover:underline transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 4v16m8-8H4" />
                  </svg>
                  New Transaction
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
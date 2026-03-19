// src/components/layout/Sidebar.tsx
// Shown only on lg+ via Layout's CSS. On mobile it slides in as a drawer.

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { type Account } from '../../types/IMultisig';

interface SidebarProps {
  selectedAccount: Account;
  accounts: Account[];
  onAccountSelect: (account: Account) => void;
  onNewTransaction: () => void;
}

const NAV = [
  {
    label: 'Home',
    href: '/home',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'Transactions',
    href: '/transactions',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: 'New Transaction',
    href: '/new-transaction',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    label: 'Approve',
    href: '/approve',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const SETTINGS_NAV = [
  {
    label: 'Change Signer',
    href: '/settings/change-signer',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    label: 'Change Owner',
    href: '/settings/change-owner',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ selectedAccount }) => {
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(true);

  const isActive = (href: string) => location.pathname === href;

  return (
    <aside className="w-full h-full bg-[#111] border-r border-gray-800 flex flex-col">

      {/* Logo */}
      <div className="p-5 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#7FFFD4] flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <span className="text-white font-bold text-base">MultisigLabs</span>
          <span className="text-[#7FFFD4] text-xs font-mono ml-auto px-1.5 py-0.5
                           border border-[#7FFFD4]/30 rounded">
            sepolia
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                        transition-colors border
              ${isActive(item.href)
                ? 'bg-[#7FFFD4]/10 text-[#7FFFD4] border-[#7FFFD4]/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
              }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}

        {/* Settings */}
        <div className="pt-4">
          <button
            onClick={() => setSettingsOpen((v) => !v)}
            className="w-full flex items-center justify-between px-3 py-2 text-gray-500
                       text-xs uppercase tracking-wider hover:text-gray-300 transition-colors"
          >
            <span>Settings</span>
            <svg
              className={`w-3 h-3 transition-transform duration-200
                          ${settingsOpen ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {settingsOpen && (
            <div className="mt-1 space-y-1">
              {SETTINGS_NAV.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                              transition-colors border
                    ${isActive(item.href)
                      ? 'bg-[#7FFFD4]/10 text-[#7FFFD4] border-[#7FFFD4]/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
                    }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#7FFFD4] animate-pulse" />
          <span className="text-gray-500 text-xs">Sepolia testnet</span>
        </div>
        <p className="text-gray-700 text-xs mt-1 font-mono truncate">
          {selectedAccount.tokenAddress.slice(0, 20)}…
        </p>
      </div>
    </aside>
  );
};
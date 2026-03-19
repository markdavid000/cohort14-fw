
// src/components/layout/Header.tsx
import React, { useState } from 'react';
import { type Account } from '../../types/IMultisig';
import { truncateAddress } from '../../utils/mockData';

interface HeaderProps {
  selectedAccount: Account | null;
  accounts: Account[];
  onAccountSelect: (accountId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedAccount,
  accounts,
  onAccountSelect,
}) => {
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  return (
    <div className="bg-black border-b border-gray-800 sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://docs.fuel.network"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white text-sm font-medium flex items-center gap-1"
          >
            DOCS
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          {/* Account Dropdown */}
          {selectedAccount && (
            <div className="relative">
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="flex items-center gap-3 bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 hover:border-gray-700 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {selectedAccount.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-medium truncate max-w-[150px]">
                    {selectedAccount.address}
                  </p>
                  <p className="text-[#7FFFD4] text-xs">{selectedAccount.balance} ETH</p>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${showAccountMenu ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showAccountMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-xl overflow-hidden">
                  {accounts.map((account) => (
                    <button
                      key={account.id}
                      onClick={() => {
                        onAccountSelect(account.id);
                        setShowAccountMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors ${
                        selectedAccount.id === account.id ? 'bg-gray-800' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {account.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-white text-sm font-medium truncate">{account.name}</p>
                        <p className="text-gray-400 text-xs font-mono">{account.address}</p>
                      </div>
                      {selectedAccount.id === account.id && (
                        <svg className="w-5 h-5 text-[#7FFFD4]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
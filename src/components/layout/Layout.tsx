// src/components/layout/Layout.tsx
import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { type Account } from '../../types/IMultisig';

interface LayoutProps {
  children: React.ReactNode;
  selectedAccount: Account | null;
  accounts: Account[];
  onAccountSelect: (accountId: string) => void;
  onNewTransaction: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  selectedAccount,
  accounts,
  onAccountSelect,
  onNewTransaction,
}) => {
  const handleAccountSelect = (account: Account) => {
    onAccountSelect(account.id);
  };

  if (!selectedAccount) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400">Loading account…</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Sidebar — full height, scrolls independently */}
      <aside className="w-72 shrink-0 h-screen overflow-y-auto border-r border-gray-800">
        <Sidebar
          selectedAccount={selectedAccount}
          accounts={accounts}
          onAccountSelect={handleAccountSelect}
          onNewTransaction={onNewTransaction}
        />
      </aside>

      {/* Right column — header pinned, main scrolls */}
      <div className="flex flex-col flex-1 min-w-0 h-screen">
        <header className="shrink-0 border-b border-gray-800">
          <Header
            selectedAccount={selectedAccount}
            accounts={accounts}
            onAccountSelect={onAccountSelect}
          />
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
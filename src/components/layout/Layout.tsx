// src/components/layout/Layout.tsx
import React, { useState } from 'react';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleAccountSelect = (account: Account) => {
    onAccountSelect(account.id);
    setSidebarOpen(false);
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

      {/* ------------------------------------------------------------------ */}
      {/* Mobile drawer backdrop                                               */}
      {/* ------------------------------------------------------------------ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* SIDEBAR — hidden on mobile, always visible on lg+                   */}
      {/* On mobile: slides in as a fixed drawer over the content             */}
      {/* ------------------------------------------------------------------ */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-72 h-screen overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:z-auto lg:flex lg:shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar
          selectedAccount={selectedAccount}
          accounts={accounts}
          onAccountSelect={handleAccountSelect}
          onNewTransaction={() => {
            onNewTransaction();
            setSidebarOpen(false);
          }}
        />
      </aside>

      {/* ------------------------------------------------------------------ */}
      {/* RIGHT COLUMN                                                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col flex-1 min-w-0 h-screen">

        {/* Single header for all breakpoints.                                */}
        {/* Header component receives onMenuClick — it renders the hamburger  */}
        {/* on mobile and hides it on lg+.                                    */}
        <header className="shrink-0 border-b border-gray-800">
          <Header
            selectedAccount={selectedAccount}
            accounts={accounts}
            onAccountSelect={onAccountSelect}
            onMenuClick={() => setSidebarOpen(true)}
          />
        </header>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
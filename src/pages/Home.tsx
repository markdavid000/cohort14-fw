// src/pages/Home.tsx
import React from 'react';
import { useAccounts } from '../hooks/useAccounts';
import { useTransactions } from '../hooks/useTransactions';
import { useModal } from '../hooks/useModal';
import { Layout } from '../components/layout/Layout';
import { StatsCard } from '../components/cards/StatsCard';
import { TransactionCard } from '../components/cards/TransactionCard';

export const Home: React.FC = () => {
  const { accounts, selectedAccount, selectAccount } = useAccounts();
  const { queuedTransactions } = useTransactions(selectedAccount?.id);
  const { openNewTransaction } = useModal();

  if (!selectedAccount) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">No account selected</div>
      </div>
    );
  }

  return (
    <Layout
      selectedAccount={selectedAccount}
      accounts={accounts}
      onAccountSelect={(id) => selectAccount(accounts.find((a) => a.id === id)!)}
      onNewTransaction={openNewTransaction}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard
          label="Balance"
          value={`${selectedAccount.balance} MTK`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        {/* Network badge in place of "Assets" — Account no longer has assetsCount */}
        <StatsCard
          label="Network"
          value={selectedAccount.network.toUpperCase()}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          }
        />

        <StatsCard
          label="Threshold"
          value={`${selectedAccount.threshold} / ${selectedAccount.owners.length}`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
        />

        {/* Fix: owners is Owner[] — use .length for the count */}
        <StatsCard
          label="Owners"
          value={selectedAccount.owners.length}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
      </div>

      {/* Token address bar */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-3 mb-6
                      flex items-center gap-3">
        <span className="text-gray-500 text-xs shrink-0">ERC-20 Token</span>
        <span className="text-[#7FFFD4] text-xs font-mono truncate">
          {selectedAccount.tokenAddress}
        </span>
        <a
          href={`https://sepolia.etherscan.io/address/${selectedAccount.tokenAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-gray-600 hover:text-gray-400 transition-colors"
          title="View on Etherscan"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Transaction Queue */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-semibold">Transaction queue</h2>
          {queuedTransactions.length > 0 && (
            <span className="text-gray-400 text-sm">
              {queuedTransactions.length} pending
            </span>
          )}
        </div>

        <div className="space-y-3">
          {queuedTransactions.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500">No pending transactions</p>
              <a
                href="/new-transaction"
                className="mt-4 inline-block bg-[#7FFFD4] text-black text-sm font-semibold
                           px-5 py-2 rounded-lg hover:bg-[#5eefc4] transition-colors"
              >
                Create Transaction
              </a>
            </div>
          ) : (
            <>
              {queuedTransactions.slice(0, 3).map((tx) => (
                <TransactionCard key={tx.id} transaction={tx} />
              ))}
              {queuedTransactions.length > 3 && (
                <a
                  href="/transactions"
                  className="block w-full text-center text-[#7FFFD4] hover:underline text-sm py-2"
                >
                  View all {queuedTransactions.length} transactions
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};
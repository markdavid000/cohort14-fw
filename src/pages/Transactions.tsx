// src/pages/Transactions.tsx
import React, { useState } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import { useTransactions } from '../hooks/useTransactions';
import { useModal } from '../hooks/useModal';
import { Layout } from '../components/layout/Layout';
import { TransactionCard } from '../components/cards/TransactionCard';

export const Transactions: React.FC = () => {
  const { accounts, selectedAccount, selectAccount } = useAccounts();
  const {  queuedTransactions, historyTransactions } = useTransactions(selectedAccount?.id);
  const { openNewTransaction } = useModal();
  const [activeTab, setActiveTab] = useState<'queue' | 'history'>('queue');

  if (!selectedAccount) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">No account selected</div>
      </div>
    );
  }

  const displayTransactions = activeTab === 'queue' ? queuedTransactions : historyTransactions;

  return (
    <Layout
      selectedAccount={selectedAccount}
      accounts={accounts}
      onAccountSelect={(id) => selectAccount(accounts.find((a) => a.id === id)!)}
      onNewTransaction={openNewTransaction}
    >
      <div>
        <h1 className="text-white text-3xl font-semibold mb-8">Transactions</h1>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-800 mb-6">
          <button
            onClick={() => setActiveTab('queue')}
            className={`pb-3 px-1 font-medium transition-colors relative ${
              activeTab === 'queue'
                ? 'text-white'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Queue
            {activeTab === 'queue' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7FFFD4]"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-1 font-medium transition-colors relative ${
              activeTab === 'history'
                ? 'text-white'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            History
            {activeTab === 'history' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7FFFD4]"></div>
            )}
          </button>
        </div>

        {/* Transactions List */}
        <div className="space-y-6">
          {displayTransactions.length === 0 ? (
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-12 text-center">
              <svg className="w-20 h-20 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-400 text-lg mb-2">
                No {activeTab === 'queue' ? 'pending' : 'completed'} transactions
              </p>
              <p className="text-gray-500 text-sm">
                {activeTab === 'queue'
                  ? 'Create a new transaction to get started'
                  : 'Your transaction history will appear here'}
              </p>
            </div>
          ) : (
            <>
              {/* Group by date */}
              {Object.entries(
                displayTransactions.reduce((groups, tx) => {
                  const date = tx.createdAt;
                  if (!groups[date]) groups[date] = [];
                  groups[date].push(tx);
                  return groups;
                }, {} as Record<string, typeof displayTransactions>)
              ).map(([date, txs]) => (
                <div key={date}>
                  <h3 className="text-gray-400 text-sm font-medium mb-3 uppercase tracking-wide">
                    {date}
                  </h3>
                  <div className="space-y-3">
                    {txs.map((tx) => (
                      <TransactionCard key={tx.id} transaction={tx} />
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};
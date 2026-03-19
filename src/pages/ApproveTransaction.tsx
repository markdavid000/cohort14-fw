// src/pages/ApproveTransaction.tsx
// — Reads live from transactionStore (re-renders on every state change)
// — URL param ?txId=xxx highlights a specific tx (used after CreateTransaction redirect)
// — URL param ?role=initiator shows the initiator approval CTA at the top
// — Shows correct action per connected address:
//     • Initiator   → "Approve as Initiator" (approveTxnWithId)
//     • Other signer → "Approve" (approveTransaction) — only after initiator approved
//     • Already approved → confirmed badge
//     • Not a signer → read-only view

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAccounts } from '../hooks/useAccounts';
import { useTransactions } from '../hooks/useTransactions';
import { useModal } from '../hooks/useModal';
import { multisigService } from '../services/MultisigService';
import { Layout } from '../components/layout/Layout';
import { type Transaction } from '../types/IMultisig';

type ActionState = 'idle' | 'loading' | 'success' | 'error';

// ---------------------------------------------------------------------------
// Single transaction approval card
// ---------------------------------------------------------------------------
const TxApproveCard: React.FC<{
  tx: Transaction;
  connectedAddress: string;
  threshold: number;
  isHighlighted: boolean;
}> = ({ tx, connectedAddress, threshold, isHighlighted }) => {
  const [actionState, setActionState] = useState<ActionState>('idle');
  const [feedback, setFeedback] = useState('');
  const [txHash, setTxHash] = useState('');

  const addr = connectedAddress.toLowerCase();
  const isInitiator = tx.initiator.toLowerCase() === addr;
  const initiatorApproved = tx.confirmations.some(
    (c) => c.owner.toLowerCase() === tx.initiator.toLowerCase()
  );
  const iHaveApproved = tx.confirmations.some((c) => c.owner.toLowerCase() === addr);
  const confirmCount = tx.confirmations.length;
  const progress = Math.min((confirmCount / threshold) * 100, 100);

  const statusStyle: Record<string, string> = {
    pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    executed: 'text-[#7FFFD4] bg-[#7FFFD4]/10 border-[#7FFFD4]/20',
    cancelled: 'text-red-400 bg-red-400/10 border-red-400/20',
  };

  const doApproveAsInitiator = async () => {
    setActionState('loading');
    // ABI: contract.approveTxnWithId(txId)
    const res = await multisigService.approveAsInitiator(tx.id, connectedAddress);
    if (res.success) {
      setTxHash(res.txHash ?? '');
      setFeedback('Initiator approval confirmed. Other signers can now approve.');
      setActionState('success');
    } else {
      setFeedback(res.error ?? 'Error');
      setActionState('error');
    }
  };

  const doApproveAsSigner = async () => {
    setActionState('loading');
    // ABI: contract.approveTransaction(txId)
    const res = await multisigService.approveAsSignerAndExecute(tx.id, connectedAddress);
    if (res.success) {
      setTxHash(res.txHash ?? '');
      const latestTx = (await Promise.resolve(tx)); // store already updated via subscription
      setFeedback(
        confirmCount + 1 >= threshold
          ? '🎉 Threshold reached — transaction executed!'
          : 'Approval recorded. Waiting for more signers.'
      );
      setActionState('success');
    } else {
      setFeedback(res.error ?? 'Error');
      setActionState('error');
    }
  };

  const doCancel = async () => {
    setActionState('loading');
    // ABI: contract.cancelTxn(txId)
    const res = await multisigService.cancelTransaction(tx.id, connectedAddress);
    if (res.success) {
      setFeedback('Transaction cancelled.');
      setActionState('success');
    } else {
      setFeedback(res.error ?? 'Error');
      setActionState('error');
    }
  };

  return (
    <div
      className={`rounded-xl border p-5 space-y-4 transition-all duration-300
        ${isHighlighted
          ? 'border-[#7FFFD4] bg-[#7FFFD4]/5 shadow-lg shadow-[#7FFFD4]/5'
          : 'border-gray-800 bg-[#1a1a1a]'
        }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white text-sm font-mono font-medium truncate">
              {tx.id}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium
                              ${statusStyle[tx.status]}`}>
              {tx.status}
            </span>
            {isInitiator && (
              <span className="text-xs px-2 py-0.5 rounded-full border
                               border-blue-400/20 bg-blue-400/10 text-blue-400">
                You initiated
              </span>
            )}
            {isHighlighted && (
              <span className="text-xs px-2 py-0.5 rounded-full border
                               border-[#7FFFD4]/30 bg-[#7FFFD4]/10 text-[#7FFFD4]">
                Just created
              </span>
            )}
          </div>
          <p className="text-gray-500 text-xs mt-1 font-mono truncate">To: {tx.to}</p>
          <p className="text-gray-600 text-xs font-mono truncate">
            Initiator: {tx.initiator.slice(0, 14)}…
          </p>
          <p className="text-gray-600 text-xs">
            Created: {new Date(tx.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-white font-semibold">{tx.value}</p>
          <p className="text-gray-600 text-xs">TOKEN</p>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>Confirmations</span>
          <span className={confirmCount >= threshold ? 'text-[#7FFFD4]' : ''}>
            {confirmCount} / {threshold} required
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5">
          <div
            className="bg-[#7FFFD4] h-1.5 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Confirmations list */}
      {tx.confirmations.length > 0 && (
        <div className="space-y-1.5">
          {tx.confirmations.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-[#7FFFD4] shrink-0" fill="currentColor"
                   viewBox="0 0 20 20">
                <path fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd" />
              </svg>
              <span className="text-gray-400 text-xs font-mono truncate">
                {c.owner}
              </span>
              {c.owner.toLowerCase() === tx.initiator.toLowerCase() && (
                <span className="text-gray-600 text-xs">(initiator)</span>
              )}
              {c.owner.toLowerCase() === addr && (
                <span className="text-gray-600 text-xs">(you)</span>
              )}
              <span className="text-gray-700 text-xs ml-auto shrink-0">
                {new Date(c.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Feedback line */}
      {actionState === 'loading' && (
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <div className="w-3 h-3 rounded-full border border-[#7FFFD4]
                          border-t-transparent animate-spin shrink-0" />
          Processing on Sepolia…
        </div>
      )}
      {actionState === 'success' && (
        <div className="text-[#7FFFD4] text-xs flex items-start gap-2">
          <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor"
               viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M5 13l4 4L19 7" />
          </svg>
          <span>{feedback}</span>
          {txHash && (
            <span className="text-gray-600 font-mono ml-auto shrink-0">
              {txHash.slice(0, 14)}…
            </span>
          )}
        </div>
      )}
      {actionState === 'error' && (
        <div className="text-red-400 text-xs flex items-center gap-2">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor"
               viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M6 18L18 6M6 6l12 12" />
          </svg>
          {feedback}
        </div>
      )}

      {/* Action buttons — only while pending and not already loading */}
      {tx.status === 'pending' && actionState !== 'loading' && (
        <div className="flex gap-2 flex-wrap pt-1 border-t border-gray-800">
          {/* Initiator approval — step 1 */}
          {isInitiator && !initiatorApproved && (
            <button
              onClick={doApproveAsInitiator}
              className="flex-1 bg-[#7FFFD4] text-black font-semibold py-2 rounded-lg
                         hover:bg-[#5eefc4] transition-colors text-xs"
            >
              Approve as Initiator
            </button>
          )}

          {/* Signer approval — step 2 (only after initiator approved) */}
          {!isInitiator && !iHaveApproved && initiatorApproved && (
            <button
              onClick={doApproveAsSigner}
              className="flex-1 bg-[#7FFFD4] text-black font-semibold py-2 rounded-lg
                         hover:bg-[#5eefc4] transition-colors text-xs"
            >
              Approve
            </button>
          )}

          {/* Cancel — initiator only */}
          {isInitiator && (
            <button
              onClick={doCancel}
              className="px-4 border border-red-500/30 text-red-400 py-2 rounded-lg
                         hover:bg-red-500/10 transition-colors text-xs"
            >
              Cancel
            </button>
          )}

          {/* Status messages */}
          {isInitiator && initiatorApproved && (
            <p className="text-gray-500 text-xs py-2 flex-1">
              ✓ You approved. Waiting for{' '}
              {threshold - confirmCount} more signer
              {threshold - confirmCount !== 1 ? 's' : ''}.
            </p>
          )}
          {!isInitiator && iHaveApproved && (
            <p className="text-[#7FFFD4] text-xs py-2">✓ You approved this transaction.</p>
          )}
          {!isInitiator && !iHaveApproved && !initiatorApproved && (
            <p className="text-gray-500 text-xs py-2">
              ⏳ Waiting for initiator to approve first.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export const ApproveTransaction: React.FC = () => {
  const [searchParams] = useSearchParams();
  const highlightTxId = searchParams.get('txId');
  const role = searchParams.get('role'); // 'initiator' | null

  const { accounts, selectedAccount, selectAccount } = useAccounts();
  const { openNewTransaction } = useModal();
  const { transactions, queuedTransactions, historyTransactions } = useTransactions(
    selectedAccount?.id
  );

  // Simulated connected wallet
  // TODO (live): replace with useWallet().wallet.address
  const connectedAddress = selectedAccount?.owners[0]?.address ?? '';

  const [tab, setTab] = useState<'pending' | 'all'>('pending');

  // Auto-switch to the highlighted tx's tab on redirect from CreateTransaction
  useEffect(() => {
    if (highlightTxId) setTab('pending');
  }, [highlightTxId]);

  // Scroll highlighted card into view
  useEffect(() => {
    if (highlightTxId) {
      setTimeout(() => {
        document.getElementById(`tx-${highlightTxId}`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 300);
    }
  }, [highlightTxId, transactions]);

  if (!selectedAccount) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">No account selected</p>
      </div>
    );
  }

  const displayed = tab === 'pending' ? queuedTransactions : transactions;

  return (
    <Layout
      selectedAccount={selectedAccount}
      accounts={accounts}
      onAccountSelect={(id) => selectAccount(accounts.find((a) => a.id === id)!)}
      onNewTransaction={openNewTransaction}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-white text-2xl font-semibold">Approve Transactions</h1>
          <p className="text-gray-400 text-sm mt-1">
            Threshold:{' '}
            <span className="text-[#7FFFD4]">
              {selectedAccount.threshold} of {selectedAccount.owners.length}
            </span>{' '}
            confirmations required
          </p>
        </div>

        {/* Tab toggle */}
        <div className="flex bg-[#111] border border-gray-800 rounded-lg overflow-hidden">
          {(['pending', 'all'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-xs font-medium capitalize transition-colors
                          relative ${tab === t
                            ? 'bg-[#7FFFD4] text-black'
                            : 'text-gray-400 hover:text-white'}`}
            >
              {t}
              {t === 'pending' && queuedTransactions.length > 0 && (
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold
                                  ${tab === 'pending'
                                    ? 'bg-black/20 text-black'
                                    : 'bg-yellow-400/20 text-yellow-400'}`}>
                  {queuedTransactions.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Connected wallet banner */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-3 mb-6
                      flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-[#7FFFD4] animate-pulse shrink-0" />
        <div className="min-w-0">
          <p className="text-gray-500 text-xs">Acting as (simulated)</p>
          <p className="text-white text-xs font-mono truncate">{connectedAddress}</p>
        </div>
        {role === 'initiator' && (
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full border
                           border-[#7FFFD4]/30 bg-[#7FFFD4]/10 text-[#7FFFD4] shrink-0">
            You just created a transaction ↓
          </span>
        )}
      </div>

      {/* Transaction list */}
      {displayed.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-12 text-center">
          <svg className="w-14 h-14 text-gray-700 mx-auto mb-4" fill="none"
               stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 text-sm">
            {tab === 'pending' ? 'No pending transactions.' : 'No transactions yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayed.map((tx) => (
            <div key={tx.id} id={`tx-${tx.id}`}>
              <TxApproveCard
                tx={tx}
                connectedAddress={connectedAddress}
                threshold={selectedAccount.threshold}
                isHighlighted={tx.id === highlightTxId}
              />
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};
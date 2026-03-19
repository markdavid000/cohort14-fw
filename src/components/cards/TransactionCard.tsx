// src/components/cards/TransactionCard.tsx
import React, { useState } from 'react';
import { type Transaction } from '../../types/IMultisig';
import { truncateAddress, copyToClipboard } from '../../utils/mockData';

interface TransactionCardProps {
  transaction: Transaction;
  onClick?: () => void;
  expanded?: boolean;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onClick,
  expanded = false,
}) => {
  const [showDetails, setShowDetails] = useState(expanded);
  const [copied, setCopied] = useState(false);

  // -------------------------------------------------------------------------
  // Status helpers
  // -------------------------------------------------------------------------
  const statusColor: Record<string, string> = {
    pending: 'text-yellow-400',
    executed: 'text-[#7FFFD4]',
    cancelled: 'text-red-400',
  };

  const statusBg: Record<string, string> = {
    pending: 'bg-yellow-400/10 border-yellow-400/30',
    executed: 'bg-[#7FFFD4]/10 border-[#7FFFD4]/30',
    cancelled: 'bg-red-400/10 border-red-400/30',
  };

  const handleCopy = async (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleDetails = () => {
    setShowDetails((v) => !v);
    onClick?.();
  };

  const confirmationCount = transaction.confirmations.length;
  const progress = Math.min(
    (confirmationCount / transaction.requiredConfirmations) * 100,
    100
  );

  // Initiator has approved = their address appears in confirmations
  const initiatorApproved = transaction.confirmations.some(
    (c) => c.owner.toLowerCase() === transaction.initiator.toLowerCase()
  );

  // Display date from createdAt ISO string
  const displayDate = new Date(transaction.createdAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`bg-[#1a1a1a] border rounded-lg transition-all ${
        showDetails
          ? 'border-[#7FFFD4]'
          : 'border-gray-800 hover:border-gray-700'
      }`}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Summary row                                                          */}
      {/* ------------------------------------------------------------------ */}
      <div
        onClick={toggleDetails}
        className="p-4 cursor-pointer flex items-center gap-4"
      >
        {/* Type icon */}
        <div
          className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
            transaction.type === 'receive' ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}
        >
          {transaction.type === 'receive' ? (
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="text-white font-medium capitalize">
              {transaction.type.replace('_', ' ')}
            </span>
            {transaction.status === 'pending' && (
              <span className="text-xs text-gray-400">
                ({confirmationCount}/{transaction.requiredConfirmations} confirmations)
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm font-mono truncate">
            To: {truncateAddress(transaction.to)}
          </p>
        </div>

        {/* Value */}
        <div className="text-right shrink-0">
          <p
            className={`font-mono font-medium ${
              transaction.type === 'receive' ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {transaction.type === 'receive' ? '+' : '-'}
            {transaction.value} TOKEN
          </p>
          <p className="text-gray-500 text-xs mt-0.5">
            {new Date(transaction.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Status badge */}
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium border shrink-0 ${
            statusBg[transaction.status]
          }`}
        >
          <span className={statusColor[transaction.status]}>
            {transaction.status}
          </span>
        </div>

        {/* Expand arrow */}
        <div className="shrink-0">
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              showDetails ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Expanded details                                                     */}
      {/* ------------------------------------------------------------------ */}
      {showDetails && (
        <div className="border-t border-gray-800 p-4 bg-black/40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ---- Left: tx details ---- */}
            <div className="space-y-4">
              <h4 className="text-[#7FFFD4] font-medium text-sm">Transaction Details</h4>

              {/* Recipient */}
              <div className="bg-gray-900 rounded-lg p-3 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-pink-500
                                flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {transaction.to.slice(2, 4).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-400 text-xs">Recipient</p>
                  <p className="text-white text-xs font-mono truncate">{transaction.to}</p>
                </div>
                <button
                  onClick={(e) => handleCopy(transaction.to, e)}
                  className="text-gray-400 hover:text-white transition-colors shrink-0"
                  title="Copy address"
                >
                  {copied ? (
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
                <a
                  href={`https://sepolia.etherscan.io/address/${transaction.to}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-gray-400 hover:text-white transition-colors shrink-0"
                  title="View on Etherscan"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              {/* Key/value rows */}
              <div className="space-y-2 text-sm">
                <Row label="Transaction ID" value={transaction.id} mono />
                <Row label="Nonce" value={String(transaction.nonce)} mono />
                <Row label="Value" value={`${transaction.value} TOKEN`} />
                <Row label="Data" value={transaction.data ?? '0x'} mono />
                <Row label="Created" value={displayDate} />
                {transaction.executedAt && (
                  <Row
                    label="Executed"
                    value={new Date(transaction.executedAt).toLocaleString()}
                  />
                )}
                {transaction.txHash && (
                  <Row label="Tx Hash" value={truncateAddress(transaction.txHash, 8)} mono />
                )}
                <Row label="Initiator" value={truncateAddress(transaction.initiator)} mono />
                <Row
                  label="Initiator approved"
                  value={initiatorApproved ? '✓ Yes' : '✗ No'}
                  valueClass={initiatorApproved ? 'text-[#7FFFD4]' : 'text-yellow-400'}
                />
              </div>
            </div>

            {/* ---- Right: confirmations ---- */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[#7FFFD4] font-medium text-sm">
                  Confirmations ({confirmationCount}/{transaction.requiredConfirmations})
                </h4>
              </div>

              {/* Progress bar */}
              <div>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <div
                    className="bg-[#7FFFD4] h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Confirmation list */}
              <div className="space-y-2">
                {transaction.confirmations.length === 0 ? (
                  <p className="text-gray-600 text-xs">
                    No confirmations yet. Initiator must approve first.
                  </p>
                ) : (
                  transaction.confirmations.map((conf:any, i:number) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-gray-900 rounded-lg p-2"
                    >
                      <svg
                        className="w-4 h-4 text-[#7FFFD4] shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="w-7 h-7 rounded-full bg-linear-to-br from-cyan-500 to-blue-500
                                      flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {conf.owner.slice(2, 4).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-mono truncate">{conf.owner}</p>
                        {conf.owner.toLowerCase() ===
                          transaction.initiator.toLowerCase() && (
                          <p className="text-gray-500 text-xs">initiator</p>
                        )}
                      </div>
                      <a
                        href={`https://sepolia.etherscan.io/address/${conf.owner}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-gray-500 hover:text-gray-300 transition-colors shrink-0"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  ))
                )}
              </div>

              {transaction.status === 'executed' && (
                <div className="flex items-center gap-2 text-[#7FFFD4] text-sm pt-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">Executed on-chain</span>
                </div>
              )}

              {transaction.status === 'cancelled' && (
                <div className="flex items-center gap-2 text-red-400 text-sm pt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="font-medium">Transaction cancelled</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Small helper component for key/value rows
// ---------------------------------------------------------------------------
const Row: React.FC<{
  label: string;
  value: string;
  mono?: boolean;
  valueClass?: string;
}> = ({ label, value, mono, valueClass }) => (
  <div className="flex justify-between gap-4">
    <span className="text-gray-500 shrink-0">{label}:</span>
    <span
      className={`text-right truncate ${mono ? 'font-mono' : ''} ${
        valueClass ?? 'text-white'
      }`}
    >
      {value}
    </span>
  </div>
);
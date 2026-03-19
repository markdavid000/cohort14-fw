// src/pages/ApproveTransaction.tsx
// Handles:
//   1. Initiator approval  → approveTxnWithId (onlyInitiator)
//   2. Signer approval     → approveTransaction (onlyValidSigner)
//   3. Cancel              → cancelTxn (onlyInitiator)
//
// ABI integration: replace multisigService calls with contract method calls.

import React, { useEffect, useState } from "react";
import { useAccounts } from "../hooks/useAccounts";
import { useTransactions } from "../hooks/useTransactions";
import { useModal } from "../hooks/useModal";
import { multisigService } from "../services/MultisigService";
import { Layout } from "../components/layout/Layout";
import { type Transaction } from "../types/IMultisig";

type ActionState = "idle" | "loading" | "success" | "error";

// ---------------------------------------------------------------------------
// Small sub-component: single transaction approval card
// ---------------------------------------------------------------------------
const TxApproveCard: React.FC<{
  tx: Transaction;
  connectedAddress: string;
  threshold: number;
  onRefresh: () => void;
}> = ({ tx, connectedAddress, threshold, onRefresh }) => {
  const [state, setState] = useState<ActionState>("idle");
  const [message, setMessage] = useState("");
  const [txHash, setTxHash] = useState("");

  const isInitiator =
    tx.initiator.toLowerCase() === connectedAddress.toLowerCase();
  const initiatorHasApproved = tx.confirmations.some(
    (c) => c.owner.toLowerCase() === tx.initiator.toLowerCase()
  );
  const alreadyApproved = tx.confirmations.some(
    (c) => c.owner.toLowerCase() === connectedAddress.toLowerCase()
  );
  const confirmationCount = tx.confirmations.length;
  const progress = Math.min((confirmationCount / threshold) * 100, 100);

  const statusColors: Record<string, string> = {
    pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    executed: "text-[#7FFFD4] bg-[#7FFFD4]/10 border-[#7FFFD4]/20",
    cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
  };

  const handleApproveAsInitiator = async () => {
    setState("loading");
    // ABI: contract.approveTxnWithId(txId)
    const result = await multisigService.approveAsInitiator(
      tx.id,
      connectedAddress
    );
    if (result.success) {
      setTxHash(result.txHash ?? "");
      setState("success");
      setMessage("Initiator approval submitted.");
      setTimeout(onRefresh, 1200);
    } else {
      setState("error");
      setMessage(result.error ?? "Error");
    }
  };

  const handleApproveAsSigner = async () => {
    setState("loading");
    // ABI: contract.approveTransaction(txId)
    const result = await multisigService.approveAsSignerAndExecute(
      tx.id,
      connectedAddress
    );
    if (result.success) {
      setTxHash(result.txHash ?? "");
      setState("success");
      setMessage(
        confirmationCount + 1 >= threshold
          ? "Threshold reached — transaction executed!"
          : "Approval recorded."
      );
      setTimeout(onRefresh, 1500);
    } else {
      setState("error");
      setMessage(result.error ?? "Error");
    }
  };

  const handleCancel = async () => {
    setState("loading");
    // ABI: contract.cancelTxn(txId)
    const result = await multisigService.cancelTransaction(
      tx.id,
      connectedAddress
    );
    if (result.success) {
      setState("success");
      setMessage("Transaction cancelled.");
      setTimeout(onRefresh, 1200);
    } else {
      setState("error");
      setMessage(result.error ?? "Error");
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-5 space-y-4">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-mono text-sm font-medium truncate">
              {tx.id}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                statusColors[tx.status]
              }`}
            >
              {tx.status}
            </span>
            {isInitiator && (
              <span
                className="text-xs px-2 py-0.5 rounded-full border border-blue-400/20
                               bg-blue-400/10 text-blue-400 font-medium"
              >
                You initiated
              </span>
            )}
          </div>
          <p className="text-gray-500 text-xs mt-1 font-mono truncate">
            To: {tx.to}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-white font-semibold">{tx.value}</p>
          <p className="text-gray-600 text-xs">TOKEN</p>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>Confirmations</span>
          <span>
            {confirmationCount}/{threshold} required
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5">
          <div
            className="bg-[#7FFFD4] h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Confirmations list */}
      {tx.confirmations.length > 0 && (
        <div className="space-y-1">
          {tx.confirmations.map((c) => (
            <div key={c.owner} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#7FFFD4]/20 flex items-center justify-center">
                <svg
                  className="w-2.5 h-2.5 text-[#7FFFD4]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-gray-400 text-xs font-mono truncate">
                {c.owner}
                {c.owner.toLowerCase() === tx.initiator.toLowerCase() && (
                  <span className="text-gray-600 ml-1">(initiator)</span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Feedback */}
      {state === "loading" && (
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <div className="w-3.5 h-3.5 rounded-full border border-[#7FFFD4] border-t-transparent animate-spin" />
          Processing…
        </div>
      )}
      {state === "success" && (
        <div className="flex items-center gap-2 text-[#7FFFD4] text-xs">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          {message}
          {txHash && (
            <span className="text-gray-500 font-mono ml-1 truncate">
              {txHash.slice(0, 18)}…
            </span>
          )}
        </div>
      )}
      {state === "error" && (
        <div className="flex items-center gap-2 text-red-400 text-xs">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          {message}
        </div>
      )}

      {/* Action buttons — only shown while transaction is pending */}
      {tx.status === "pending" && state !== "loading" && (
        <div className="flex gap-2 flex-wrap pt-1">
          {/* Initiator must approve first */}
          {isInitiator && !initiatorHasApproved && (
            <button
              onClick={handleApproveAsInitiator}
              className="flex-1 bg-[#7FFFD4] text-black font-semibold py-2 rounded-lg
                         hover:bg-[#5eefc4] transition-colors text-xs"
            >
              Approve as Initiator
            </button>
          )}

          {/* Signer approval (any owner who isn't the initiator, or initiator after they've approved) */}
          {!isInitiator && !alreadyApproved && initiatorHasApproved && (
            <button
              onClick={handleApproveAsSigner}
              className="flex-1 bg-[#7FFFD4] text-black font-semibold py-2 rounded-lg
                         hover:bg-[#5eefc4] transition-colors text-xs"
            >
              Approve as Signer
            </button>
          )}

          {/* Cancel — initiator only */}
          {isInitiator && (
            <button
              onClick={handleCancel}
              className="px-4 border border-red-500/30 text-red-400 py-2 rounded-lg
                         hover:bg-red-500/10 transition-colors text-xs"
            >
              Cancel
            </button>
          )}

          {/* Already approved message */}
          {alreadyApproved && (
            <span className="text-gray-500 text-xs py-2">
              ✓ You've already approved this transaction.
            </span>
          )}

          {/* Waiting for initiator message */}
          {!isInitiator && !initiatorHasApproved && (
            <span className="text-gray-500 text-xs py-2">
              Waiting for initiator to approve first.
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export const ApproveTransaction: React.FC = () => {
  const { accounts, selectedAccount, selectAccount } = useAccounts();
  const { openNewTransaction } = useModal();
  const { transactions, refetch } = useTransactions(selectedAccount?.id);

  // ---------------------------------------------------------------------------
  // TODO (live): replace with real wallet address from useWallet()
  // ---------------------------------------------------------------------------
  const connectedAddress = selectedAccount?.owners[0]?.address ?? "";

  const [filterStatus, setFilterStatus] = useState<"pending" | "all">(
    "pending"
  );

  const displayed =
    filterStatus === "pending"
      ? transactions.filter((tx) => tx.status === "pending")
      : transactions;

  if (!selectedAccount) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">No account selected</p>
      </div>
    );
  }

  return (
    <Layout
      selectedAccount={selectedAccount}
      accounts={accounts}
      onAccountSelect={selectAccount}
      onNewTransaction={openNewTransaction}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-white text-2xl font-semibold">
            Approve Transactions
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Threshold:{" "}
            <span className="text-[#7FFFD4]">
              {selectedAccount.threshold} of {selectedAccount.owners.length}
            </span>{" "}
            owners required
          </p>
        </div>

        {/* Filter toggle */}
        <div className="flex bg-[#111] border border-gray-800 rounded-lg overflow-hidden">
          {(["pending", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-4 py-2 text-xs font-medium transition-colors capitalize ${
                filterStatus === f
                  ? "bg-[#7FFFD4] text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Connected wallet info */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 mb-6 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-[#7FFFD4] animate-pulse" />
        <div className="min-w-0">
          <p className="text-gray-400 text-xs">Connected as (simulated)</p>
          <p className="text-white text-xs font-mono truncate">
            {connectedAddress}
          </p>
        </div>
        {/* TODO live: show real wallet connect button */}
      </div>

      {/* Transaction list */}
      {displayed.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-12 text-center">
          <svg
            className="w-14 h-14 text-gray-700 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-500">
            {filterStatus === "pending"
              ? "No pending transactions."
              : "No transactions found."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayed.map((tx) => (
            <TxApproveCard
              key={tx.id}
              tx={tx}
              connectedAddress={connectedAddress}
              threshold={selectedAccount.threshold}
              onRefresh={refetch}
            />
          ))}
        </div>
      )}
    </Layout>
  );
};

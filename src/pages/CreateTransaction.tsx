// src/pages/CreateTransaction.tsx
// Flow:
//   1. Initiator fills form → createTransaction() → tx added to store
//   2. On success → redirect to /approve?txId=xxx&role=initiator
//   3. Initiator lands on ApproveTransaction pre-focused on their new tx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccounts } from '../hooks/useAccounts';
import { useModal } from '../hooks/useModal';
import { multisigService } from '../services/MultisigService';
import { Layout } from '../components/layout/Layout';

type Step = 'form' | 'loading' | 'error';

export const CreateTransaction: React.FC = () => {
  const navigate = useNavigate();
  const { accounts, selectedAccount, selectAccount } = useAccounts();
  const { openNewTransaction } = useModal();

  // Simulated connected wallet = first owner of selected account
  // TODO (live): replace with useWallet().wallet.address
  const connectedAddress = selectedAccount?.owners[0]?.address ?? '';

  const [step, setStep] = useState<Step>('form');
  const [to, setTo] = useState('');
  const [value, setValue] = useState('');
  const [data, setData] = useState('0x');
  const [errorMsg, setErrorMsg] = useState('');

  if (!selectedAccount) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">No account selected</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !value) return;

    setStep('loading');

    // ABI integration: const tx = await contract.createATransaction(to, amount); await tx.wait();
    const result = await multisigService.createTransaction(
      selectedAccount.id,
      to,
      value,
      data,
      connectedAddress
    );

    if (result.success && result.txId) {
      // Redirect initiator straight to approve — pre-select their new tx
      navigate(`/approve?txId=${result.txId}&role=initiator`);
    } else {
      setErrorMsg(result.error ?? 'Unknown error');
      setStep('error');
    }
  };

  return (
    <Layout
      selectedAccount={selectedAccount}
      accounts={accounts}
      onAccountSelect={(id) => selectAccount(accounts.find((a) => a.id === id)!)}
      onNewTransaction={openNewTransaction}
    >
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-white text-2xl font-semibold">New Transaction</h1>
          <p className="text-gray-400 text-sm mt-1">
            Requires{' '}
            <span className="text-[#7FFFD4] font-medium">
              {selectedAccount.threshold} of {selectedAccount.owners.length}
            </span>{' '}
            confirmations to execute. You'll be taken to approve it immediately after.
          </p>
        </div>

        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">

          {/* ---- FORM ---- */}
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">
                  Recipient Address
                </label>
                <input
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="0x..."
                  required
                  className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-3
                             text-white text-sm font-mono placeholder-gray-600
                             focus:outline-none focus:border-[#7FFFD4] transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">
                  Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="any"
                    required
                    className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-3
                               text-white text-sm placeholder-gray-600 pr-20
                               focus:outline-none focus:border-[#7FFFD4] transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-mono">
                    TOKEN
                  </span>
                </div>
                <p className="text-gray-600 text-xs mt-1">
                  Available: {selectedAccount.balance} TOKEN
                </p>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">
                  Data <span className="text-gray-600 normal-case">(optional)</span>
                </label>
                <input
                  type="text"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-3
                             text-white text-sm font-mono
                             focus:outline-none focus:border-[#7FFFD4] transition-colors"
                />
              </div>

              {/* Initiator info */}
              <div className="bg-[#111] border border-gray-800 rounded-lg p-4 flex gap-3">
                <svg className="w-4 h-4 text-[#7FFFD4] mt-0.5 shrink-0" fill="none"
                     stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="min-w-0">
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Creating as{' '}
                    <span className="text-white font-mono">
                      {connectedAddress.slice(0, 10)}…
                    </span>
                    . After creation you'll be redirected to approve it as the
                    initiator before other signers can confirm.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#7FFFD4] text-black font-semibold py-3 rounded-lg
                           hover:bg-[#5eefc4] transition-colors text-sm"
              >
                Create Transaction
              </button>
            </form>
          )}

          {/* ---- LOADING ---- */}
          {step === 'loading' && (
            <div className="flex flex-col items-center py-12 gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-[#7FFFD4]
                              border-t-transparent animate-spin" />
              <p className="text-white font-medium">Creating transaction…</p>
              <p className="text-gray-500 text-xs">Broadcasting to Sepolia simulation</p>
            </div>
          )}

          {/* ---- ERROR ---- */}
          {step === 'error' && (
            <div className="flex flex-col items-center py-8 gap-5 text-center">
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30
                              flex items-center justify-center">
                <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor"
                     viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-lg">Failed</p>
                <p className="text-red-400 text-sm mt-1">{errorMsg}</p>
              </div>
              <button
                onClick={() => setStep('form')}
                className="w-full border border-gray-700 text-gray-300 py-2.5 rounded-lg
                           hover:border-gray-500 transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
// src/pages/CreateTransaction.tsx
import React, { useState } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import { useWallet } from '../hooks/useWallet';
import { multisigService } from '../services/MultisigService';
import { Layout } from '../components/layout/Layout';
import { useModal } from '../hooks/useModal';

type Step = 'form' | 'confirming' | 'success' | 'error';

export const CreateTransaction: React.FC = () => {
  const { accounts, selectedAccount, selectAccount } = useAccounts();
  const { openNewTransaction } = useModal();

  // ---------------------------------------------------------------------------
  // TODO (live integration): replace with real wallet hook
  // const { address } = useWallet();
  // ---------------------------------------------------------------------------
  const connectedAddress = selectedAccount?.owners[0]?.address ?? '';

  const [step, setStep] = useState<Step>('form');
  const [to, setTo] = useState('');
  const [value, setValue] = useState('');
  const [data, setData] = useState('0x');
  const [txHash, setTxHash] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!selectedAccount) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">No account selected</p>
      </div>
    );
  }

  const reset = () => {
    setTo('');
    setValue('');
    setData('0x');
    setStep('form');
    setTxHash('');
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !value) return;

    setIsLoading(true);
    setStep('confirming');

    // -----------------------------------------------------------------------
    // ABI integration point:
    // const contract = new ethers.Contract(selectedAccount.address, ABI, signer);
    // const tx = await contract.createATransaction(to, ethers.parseEther(value));
    // await tx.wait();
    // -----------------------------------------------------------------------
    const result = await multisigService.createTransaction(
      selectedAccount.id,
      to,
      value,
      data,
      connectedAddress
    );

    setIsLoading(false);

    if (result.success) {
      setTxHash(result.txHash ?? '');
      setStep('success');
    } else {
      setErrorMsg(result.error ?? 'Unknown error');
      setStep('error');
    }
  };

  return (
    <Layout
      selectedAccount={selectedAccount}
      accounts={accounts}
      onAccountSelect={selectAccount}
      onNewTransaction={openNewTransaction}
    >
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white text-2xl font-semibold">New Transaction</h1>
          <p className="text-gray-400 text-sm mt-1">
            Creates a pending on-chain transaction that requires{' '}
            <span className="text-[#7FFFD4] font-medium">
              {selectedAccount.threshold} confirmation
              {selectedAccount.threshold !== 1 ? 's' : ''}
            </span>{' '}
            to execute.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
          {/* ---------------------------------------------------------------- */}
          {/* FORM                                                              */}
          {/* ---------------------------------------------------------------- */}
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Recipient */}
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
                             text-white text-sm placeholder-gray-600
                             focus:outline-none focus:border-[#7FFFD4] focus:ring-1 focus:ring-[#7FFFD4]
                             transition-colors"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">
                  Amount (Token Units)
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
                               text-white text-sm placeholder-gray-600
                               focus:outline-none focus:border-[#7FFFD4] focus:ring-1 focus:ring-[#7FFFD4]
                               transition-colors pr-20"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-mono">
                    TOKEN
                  </span>
                </div>
                <p className="text-gray-600 text-xs mt-1">
                  Balance: {selectedAccount.balance}
                </p>
              </div>

              {/* Data (optional) */}
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">
                  Data{' '}
                  <span className="text-gray-600 normal-case">(optional)</span>
                </label>
                <textarea
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  rows={2}
                  className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-3
                             text-white text-sm font-mono placeholder-gray-600
                             focus:outline-none focus:border-[#7FFFD4] focus:ring-1 focus:ring-[#7FFFD4]
                             transition-colors resize-none"
                />
              </div>

              {/* Info row */}
              <div className="bg-[#111] border border-gray-800 rounded-lg p-4 flex items-start gap-3">
                <svg className="w-4 h-4 text-[#7FFFD4] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-400 text-xs leading-relaxed">
                  After creation you must{' '}
                  <span className="text-white font-medium">approve as initiator</span>{' '}
                  before other signers can confirm. The transaction auto-executes once
                  the threshold is reached.
                </p>
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

          {/* ---------------------------------------------------------------- */}
          {/* CONFIRMING                                                        */}
          {/* ---------------------------------------------------------------- */}
          {step === 'confirming' && (
            <div className="flex flex-col items-center py-10 gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-[#7FFFD4] border-t-transparent animate-spin" />
              <p className="text-white font-medium">Submitting transaction…</p>
              <p className="text-gray-500 text-xs">Simulating Sepolia broadcast</p>
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* SUCCESS                                                           */}
          {/* ---------------------------------------------------------------- */}
          {step === 'success' && (
            <div className="flex flex-col items-center py-8 gap-5 text-center">
              <div className="w-14 h-14 rounded-full bg-[#7FFFD4]/10 border border-[#7FFFD4]/30
                              flex items-center justify-center">
                <svg className="w-7 h-7 text-[#7FFFD4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-lg">Transaction Created</p>
                <p className="text-gray-400 text-sm mt-1">
                  Now approve it as the initiator so signers can confirm.
                </p>
              </div>
              {txHash && (
                <div className="w-full bg-[#111] rounded-lg p-3 border border-gray-800">
                  <p className="text-gray-500 text-xs mb-1">Tx Hash</p>
                  <p className="text-[#7FFFD4] text-xs font-mono break-all">{txHash}</p>
                </div>
              )}
              <div className="flex gap-3 w-full">
                <button
                  onClick={reset}
                  className="flex-1 border border-gray-700 text-gray-300 py-2.5 rounded-lg
                             hover:border-gray-500 transition-colors text-sm"
                >
                  New Transaction
                </button>
                <a
                  href="/transactions"
                  className="flex-1 bg-[#7FFFD4] text-black font-semibold py-2.5 rounded-lg
                             hover:bg-[#5eefc4] transition-colors text-sm text-center"
                >
                  View Queue
                </a>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* ERROR                                                             */}
          {/* ---------------------------------------------------------------- */}
          {step === 'error' && (
            <div className="flex flex-col items-center py-8 gap-5 text-center">
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30
                              flex items-center justify-center">
                <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-lg">Transaction Failed</p>
                <p className="text-red-400 text-sm mt-1">{errorMsg}</p>
              </div>
              <button
                onClick={reset}
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
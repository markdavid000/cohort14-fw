// src/pages/ChangeSigner.tsx
// Contract equivalent: changeSigner(address _oldSigner, address _newSigner) [onlyOwner]
// ABI integration: replace multisigService call with contract.changeSigner(old, new)

import React, { useState } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import { useModal } from '../hooks/useModal';
import { multisigService } from '../services/MultisigService';
import { Layout } from '../components/layout/Layout';

type Step = 'form' | 'loading' | 'success' | 'error';

export const ChangeSigner: React.FC = () => {
  const { accounts, selectedAccount, selectAccount } = useAccounts();
  const { openNewTransaction } = useModal();

  // ---------------------------------------------------------------------------
  // TODO (live): replace with wallet hook address
  // ---------------------------------------------------------------------------
  const connectedAddress = selectedAccount?.owners[0]?.address ?? '';

  const [step, setStep] = useState<Step>('form');
  const [selectedOld, setSelectedOld] = useState('');
  const [newSigner, setNewSigner] = useState('');
  const [txHash, setTxHash] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!selectedAccount) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">No account selected</p>
      </div>
    );
  }

  const isOwner =
    selectedAccount.owners[0]?.address.toLowerCase() ===
    connectedAddress.toLowerCase();

  const reset = () => {
    setStep('form');
    setSelectedOld('');
    setNewSigner('');
    setTxHash('');
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOld || !newSigner) return;

    setStep('loading');

    // -----------------------------------------------------------------------
    // ABI integration point:
    // const tx = await contract.changeSigner(selectedOld, newSigner);
    // await tx.wait();
    // -----------------------------------------------------------------------
    const result = await multisigService.changeSigner(
      selectedAccount.id,
      selectedOld,
      newSigner,
      connectedAddress
    );

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
      onAccountSelect={(id) => selectAccount(accounts.find((a) => a.id === id)!)}
      onNewTransaction={openNewTransaction}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white text-2xl font-semibold">Change Signer</h1>
          <p className="text-gray-400 text-sm mt-1">
            Replace an existing signer address with a new one. Only the{' '}
            <span className="text-[#7FFFD4]">contract owner</span> can perform
            this action.
          </p>
        </div>

        {/* Owner warning */}
        {!isOwner && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex gap-3">
            <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-red-400 text-xs">
              Your connected wallet is not the contract owner. This action will
              fail on-chain.
            </p>
          </div>
        )}

        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
          {/* ---------------------------------------------------------------- */}
          {/* FORM                                                              */}
          {/* ---------------------------------------------------------------- */}
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Current signers */}
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">
                  Current Signer to Replace
                </label>
                <div className="space-y-2">
                  {selectedAccount.owners.map((owner) => (
                    <button
                      key={owner.address}
                      type="button"
                      onClick={() => setSelectedOld(owner.address)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left
                        ${selectedOld === owner.address
                          ? 'border-[#7FFFD4] bg-[#7FFFD4]/5'
                          : 'border-gray-800 hover:border-gray-600 bg-[#111]'
                        }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#7FFFD4]/20 to-blue-500/20
                                      border border-gray-700 flex items-center justify-center text-xs font-bold
                                      text-gray-300 shrink-0">
                        {owner.address.slice(2, 4).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-xs font-mono truncate">{owner.address}</p>
                        {owner.name && (
                          <p className="text-gray-500 text-xs">{owner.name}</p>
                        )}
                      </div>
                      {selectedOld === owner.address && (
                        <svg className="w-4 h-4 text-[#7FFFD4] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* New signer */}
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">
                  New Signer Address
                </label>
                <input
                  type="text"
                  value={newSigner}
                  onChange={(e) => setNewSigner(e.target.value)}
                  placeholder="0x..."
                  required
                  className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-3
                             text-white text-sm placeholder-gray-600 font-mono
                             focus:outline-none focus:border-[#7FFFD4] focus:ring-1 focus:ring-[#7FFFD4]
                             transition-colors"
                />
              </div>

              {/* Warning */}
              <div className="bg-[#111] border border-yellow-500/20 rounded-lg p-4 flex gap-3">
                <svg className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-yellow-400 text-xs leading-relaxed">
                  This action is immediate and irreversible. The old signer will
                  lose all signing privileges.
                </p>
              </div>

              <button
                type="submit"
                disabled={!selectedOld || !newSigner}
                className="w-full bg-[#7FFFD4] text-black font-semibold py-3 rounded-lg
                           hover:bg-[#5eefc4] transition-colors text-sm
                           disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Change Signer
              </button>
            </form>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* LOADING                                                           */}
          {/* ---------------------------------------------------------------- */}
          {step === 'loading' && (
            <div className="flex flex-col items-center py-10 gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-[#7FFFD4] border-t-transparent animate-spin" />
              <p className="text-white font-medium">Changing signer…</p>
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
                <p className="text-white font-semibold text-lg">Signer Updated</p>
                <p className="text-gray-400 text-sm mt-1">
                  The old signer has been replaced successfully.
                </p>
              </div>
              {txHash && (
                <div className="w-full bg-[#111] rounded-lg p-3 border border-gray-800">
                  <p className="text-gray-500 text-xs mb-1">Tx Hash</p>
                  <p className="text-[#7FFFD4] text-xs font-mono break-all">{txHash}</p>
                </div>
              )}
              <button
                onClick={reset}
                className="w-full border border-gray-700 text-gray-300 py-2.5 rounded-lg
                           hover:border-gray-500 transition-colors text-sm"
              >
                Change Another Signer
              </button>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-white font-semibold text-lg">Action Failed</p>
              <p className="text-red-400 text-sm">{errorMsg}</p>
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
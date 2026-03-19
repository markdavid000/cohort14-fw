// src/pages/Landing.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccounts } from '../hooks/useAccounts';

export const Landing: React.FC = () => {
  const { selectedAccount: account } = useAccounts();
  const navigate = useNavigate();

  if (!account) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-[#7FFFD4]
                        border-t-transparent animate-spin" />
      </div>
    );
  }

  const handleEnter = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center">

          {/* Left — Welcome card */}
          <div className="bg-[#7FFFD4] rounded-2xl p-12 text-center">
            <h1 className="text-4xl font-bold text-black mb-4">
              Welcome to <span className="italic">MultisigLabs</span>
            </h1>
            <p className="text-black/70 text-lg leading-relaxed mb-8">
              The most trusted decentralized multisig platform on the Ethereum ecosystem
            </p>
            {/* Sepolia badge */}
            <div className="inline-flex items-center gap-2 bg-black/10 rounded-full
                            px-4 py-2">
              <div className="w-2 h-2 rounded-full bg-black/60" />
              <span className="text-black font-bold text-sm font-mono">
                Sepolia Testnet
              </span>
            </div>
          </div>

          {/* Right — Create / Enter */}
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#7FFFD4] flex items-center
                              justify-center shrink-0">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor"
                     viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-none">MultisigLabs</p>
                <p className="text-gray-500 text-sm mt-0.5">Ethereum · Sepolia</p>
              </div>
            </div>

            <h3 className="text-white text-xl font-semibold mb-2">
              MultisigLabs Account
            </h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              A multi-owner contract wallet that requires{' '}
              <span className="text-[#7FFFD4] font-medium">
                {account.threshold} of {account.owners.length}
              </span>{' '}
              confirmations to execute any transaction on Sepolia.
            </p>

            {/* Account info preview */}
            <div className="bg-[#111] border border-gray-800 rounded-xl p-4 mb-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Contract</span>
                <span className="text-white text-sm font-mono">
                  {account.address.slice(0, 10)}…{account.address.slice(-6)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Signers</span>
                <span className="text-white text-sm">{account.owners.length} owners</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Threshold</span>
                <span className="text-[#7FFFD4] text-sm font-medium">
                  {account.threshold} of {account.owners.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Network</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7FFFD4] animate-pulse" />
                  <span className="text-[#7FFFD4] text-sm font-mono">Sepolia</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleEnter}
              className="w-full bg-[#7FFFD4] text-black font-semibold py-3 rounded-xl
                         hover:bg-[#6eeec3] active:bg-[#5dddb2] transition-colors text-sm"
            >
              Open MultisigLabs
            </button>
          </div>
        </div>
      </div>

      {/* Signers list */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-white text-xl font-semibold">
            Signers ({account.owners.length})
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">on</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-[#7FFFD4] rounded-full animate-pulse" />
              <span className="text-[#7FFFD4] font-mono">Sepolia</span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {account.owners.map((owner, i) => (
            <div
              key={owner.address}
              className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4
                         hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br
                                from-[#7FFFD4]/20 to-blue-500/20 border border-gray-700
                                flex items-center justify-center text-sm font-bold
                                text-[#7FFFD4] shrink-0">
                  {i === 0 ? '★' : owner.name?.slice(0, 1).toUpperCase() ?? '?'}
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {owner.name ?? `Signer ${i + 1}`}
                  </p>
                  {i === 0 && (
                    <span className="text-[10px] text-yellow-400 font-medium">owner</span>
                  )}
                </div>
              </div>
              <p className="text-gray-600 text-sm font-mono truncate">
                {owner.address}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
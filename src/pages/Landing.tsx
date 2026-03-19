// src/pages/Landing.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccounts } from '../hooks/useAccounts';
import { Button } from '../components/buttons/Button';
import { AccountCard } from '../components/cards/AccountCard';

export const Landing: React.FC = () => {
  const { accounts, loading, selectAccount } = useAccounts();
  const navigate = useNavigate();

  const handleAccountClick = (accountId: string) => {
    selectAccount(accountId);
    navigate('/home');
  };

  const handleCreateAccount = () => {
    // For now, just navigate to home with the first account
    // In production, this would open a modal to create new account
    if (accounts.length > 0) {
      selectAccount(accounts[0].id);
      navigate('/home');
    } else {
      // If no accounts exist, create a mock one and navigate
      navigate('/home');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#7FFFD4] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Welcome Card */}
          <div className="bg-[#7FFFD4] rounded-2xl p-12 text-center">
            <h1 className="text-4xl font-bold text-black mb-4">
              Welcome to <span className="italic">Igniters</span>
            </h1>
            <p className="text-black/80 text-lg leading-relaxed mb-6">
              The most trusted decentralized multisig platform on FUEL ecosystem
            </p>
            <div className="flex items-center justify-center gap-2">
              <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16z" />
              </svg>
              <span className="text-black font-bold text-xl">FUEL</span>
            </div>
          </div>

          {/* Right Side - Create Account */}
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-12">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-8 h-8 text-[#7FFFD4]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 11a1 1 0 112 0v3a1 1 0 11-2 0v-3zm1-5a1 1 0 100 2 1 1 0 000-2z" />
              </svg>
              <h2 className="text-white text-2xl font-bold">Igniters</h2>
            </div>

            <h3 className="text-white text-xl font-semibold mb-3">
              Create Igniters Account
            </h3>
            <p className="text-gray-400 mb-8">
              A new Account that is controlled by one or multiple owners.
            </p>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleCreateAccount}
            >
              Create new Account
            </Button>
          </div>
        </div>
      </div>

      {/* My Accounts Section */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-white text-2xl font-semibold">
            My Igniters accounts ({accounts.length})
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">on</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-[#7FFFD4] rounded-full"></div>
              <span className="text-[#7FFFD4] font-mono">FUEL</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onClick={() => handleAccountClick(account.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
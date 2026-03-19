// src/hooks/useAccounts.ts

import { useEffect, useState } from 'react';
import { type Account, type Owner } from '../types/IMultisig';
import { mockAccounts } from '../utils/mockData';

export const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(
    mockAccounts[0] ?? null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate an API call / loading state (this is purely cosmetic)
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const selectAccount = (accountId: string) => {
    const account = accounts.find((acc) => acc.id === accountId);
    if (account) {
      setSelectedAccount(account);
    }
  };

  const createAccount = (name: string, threshold: number, owners: string[]) => {
    const now = new Date().toISOString();
    const resolvedOwners: Owner[] = owners.map((address) => ({
      address,
      addedAt: now,
      isActive: true,
    }));

    const newAccount: Account = {
      id: Date.now().toString(),
      name,
      address: `fuel1rku...${Math.random().toString(36).substring(7)}`,
      balance: '0',
      threshold,
      owners: resolvedOwners,
      network: 'sepolia',
      tokenAddress: '',
      createdAt: now,
    };
    setAccounts([...accounts, newAccount]);
    setSelectedAccount(newAccount);
  };

  return {
    accounts,
    selectedAccount,
    loading,
    selectAccount,
    createAccount,
  };
};







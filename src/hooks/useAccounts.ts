// src/hooks/useAccounts.ts
import { useState, useEffect } from 'react';
import { type Account, type Owner } from '../types/IMultisig';
import { mockAccounts, seedMockData } from '../utils/mockData';

interface UseAccountsReturn {
  accounts: Account[];
  selectedAccount: Account | null;
  selectAccount: (account: Account) => void;
  selectAccountById: (id: string) => void;   // ← used by Layout / Header
  createAccount: (name: string, threshold: number, ownerAddresses: string[]) => void;
}

export const useAccounts = (): UseAccountsReturn => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  useEffect(() => {
    seedMockData();
    setAccounts(mockAccounts);
    setSelectedAccount(mockAccounts[0] ?? null);
  }, []);

  const selectAccount = (account: Account) => {
    setSelectedAccount(account);
  };

  // Accepts a plain string id — used wherever onAccountSelect: (id: string) => void
  const selectAccountById = (id: string) => {
    const found = accounts.find((a) => a.id === id);
    if (found) setSelectedAccount(found);
  };

  const createAccount = (
    name: string,
    threshold: number,
    ownerAddresses: string[]
  ) => {
    const owners: Owner[] = ownerAddresses.map((address) => ({
      address,
      addedAt: new Date().toISOString(),
      isActive: true,
    }));

    const newAccount: Account = {
      id: Date.now().toString(),
      name,
      address: `0x${Math.random().toString(16).slice(2).padEnd(40, '0')}`,
      balance: '0',
      threshold,
      owners,
      network: 'sepolia',
      tokenAddress: '0x6c8DC5766872302FE930B23aE655DDDa362A0aB5',
      createdAt: new Date().toISOString(),
    };

    setAccounts((prev) => [...prev, newAccount]);
    setSelectedAccount(newAccount);
  };

  return {
    accounts,
    selectedAccount,
    selectAccount,
    selectAccountById,
    createAccount,
  };
};

// src/hooks/useTransactions.ts
// Subscribes to transactionStore — re-renders automatically whenever
// any write function (create/approve/cancel) mutates the store.

import { useState, useEffect } from 'react';
import { transactionStore } from '../store/transactionStore';
import { type Transaction } from '../types/IMultisig';

interface UseTransactionsReturn {
  transactions: Transaction[];
  queuedTransactions: Transaction[];
  historyTransactions: Transaction[];
  isLoading: boolean;
}

export const useTransactions = (accountId: string | undefined): UseTransactionsReturn => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!accountId) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    // Initial read
    setTransactions(transactionStore.getByAccount(accountId));
    setIsLoading(false);

    // Subscribe — called every time the store mutates
    const unsubscribe = transactionStore.subscribe(() => {
      setTransactions(transactionStore.getByAccount(accountId));
    });

    return unsubscribe;
  }, [accountId]);

  const queuedTransactions = transactions.filter((tx) => tx.status === 'pending');
  const historyTransactions = transactions.filter((tx) => tx.status !== 'pending');

  return { transactions, queuedTransactions, historyTransactions, isLoading };
};
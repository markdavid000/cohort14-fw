// src/hooks/useTransactions.ts
// Added: refetch(), historyTransactions, filter/setFilter for ApproveTransaction page

import { useState, useEffect, useCallback } from 'react';
import { multisigService } from '../services/MultisigService';
import { type Transaction, type TransactionStatus } from '../types/IMultisig';

interface UseTransactionsReturn {
  transactions: Transaction[];
  queuedTransactions: Transaction[];     // pending only
  historyTransactions: Transaction[];    // executed + cancelled
  filter: TransactionStatus | 'all';
  setFilter: (f: TransactionStatus | 'all') => void;
  refetch: () => void;
  isLoading: boolean;
}

export const useTransactions = (
  accountId: string | undefined
): UseTransactionsReturn => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<TransactionStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);

  const fetchTransactions = useCallback(() => {
    if (!accountId) {
      setTransactions([]);
      return;
    }
    setIsLoading(true);
    // ABI integration: replace with on-chain event log fetch or subgraph query
    const txs = multisigService.getAccountTransactions(accountId);
    setTransactions(txs);
    setIsLoading(false);
  }, [accountId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const queuedTransactions = transactions.filter(
    (tx) => tx.status === 'pending'
  );

  const historyTransactions = transactions.filter(
    (tx) => tx.status !== 'pending'
  );

  return {
    transactions,
    queuedTransactions,
    historyTransactions,
    filter,
    setFilter,
    refetch: fetchTransactions,
    isLoading,
  };
};
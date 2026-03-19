// src/store/transactionStore.ts
// A lightweight reactive store — no Redux/Zustand needed.
// Components subscribe to changes; the service writes to this store.
// When going live: replace store reads with on-chain event listeners / subgraph queries.

import { type Transaction } from '../types/IMultisig';

type Listener = () => void;

class TransactionStore {
  private transactions: Map<string, Transaction> = new Map();
  private listeners: Set<Listener> = new Set();

  // ---------------------------------------------------------------------------
  // Subscribe / unsubscribe
  // ---------------------------------------------------------------------------
  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  // ---------------------------------------------------------------------------
  // Write
  // ---------------------------------------------------------------------------
  add(tx: Transaction) {
    this.transactions.set(tx.id, { ...tx });
    this.notify();
  }

  update(txId: string, patch: Partial<Transaction>) {
    const existing = this.transactions.get(txId);
    if (!existing) return;
    this.transactions.set(txId, { ...existing, ...patch });
    this.notify();
  }

  // ---------------------------------------------------------------------------
  // Read
  // ---------------------------------------------------------------------------
  getAll(): Transaction[] {
    return Array.from(this.transactions.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getByAccount(accountId: string): Transaction[] {
    return this.getAll().filter((tx) => tx.accountId === accountId);
  }

  getById(txId: string): Transaction | undefined {
    return this.transactions.get(txId);
  }

  getPending(accountId: string): Transaction[] {
    return this.getByAccount(accountId).filter((tx) => tx.status === 'pending');
  }

  // Seed existing mock transactions without notifying (called once on boot)
  seed(txs: Transaction[]) {
    txs.forEach((tx) => this.transactions.set(tx.id, { ...tx }));
  }
}

export const transactionStore = new TransactionStore();
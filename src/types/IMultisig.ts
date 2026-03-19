// src/types/IMultisig.ts

export type Network = 'sepolia';
export type TransactionType = 'send' | 'receive' | 'contract_interaction';
export type TransactionStatus = 'pending' | 'executed' | 'cancelled';

export interface Account {
  id: string;
  name: string;
  address: string; // Contract address
  balance: string;
  threshold: number;
  owners: Owner[];
  network: Network;
  tokenAddress: string; // ERC20 token address
  createdAt: string;
}

export interface Owner {
  address: string;
  name?: string;
  addedAt: string;
  isActive: boolean;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  to: string;
  value: string;
  data?: string;
  nonce: number;
  status: TransactionStatus;
  initiator: string;
  confirmations: Confirmation[];
  requiredConfirmations: number;
  createdAt: string;
  executedAt?: string;
  txHash?: string;
}

export interface Confirmation {
  owner: string;
  signature?: string;
  timestamp: string;
}

// Write Function Types
export interface CreateTransactionParams {
  to: string;
  value: string;
  data?: string;
}

export interface ApproveTransactionParams {
  transactionId: string;
}

export interface ExecuteTransactionParams {
  transactionId: string;
}

export interface AddOwnerParams {
  newOwner: string;
  newThreshold: number;
}

export interface RemoveOwnerParams {
  ownerToRemove: string;
  newThreshold: number;
}

export interface ChangeThresholdParams {
  newThreshold: number;
}

export interface ReplaceOwnerParams {
  oldOwner: string;
  newOwner: string;
}

// Modal States
export interface ModalState {
  newTransaction: boolean;
  approveTransaction: string | null;
  addOwner: boolean;
  removeOwner: boolean;
  changeThreshold: boolean;
  replaceOwner: boolean;
}

// Wallet State
export interface WalletState {
  connected: boolean;
  address: string | null;
  network: Network | null;
}

// Contract Interaction Result
export interface TransactionResult {
  success: boolean;
  txHash?: string;
  error?: string;
}
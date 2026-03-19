// src/services/multisigService.ts
// All writes go through transactionStore so every subscribed component
// re-renders automatically — no polling, no manual refetch.
//
// ABI integration: replace each method body with contract.method(...) calls.
// The store.update() / store.add() calls become event listeners on the contract.

import { type Transaction, type Account, type TransactionResult } from '../types/IMultisig';
import { transactionStore } from '../store/transactionStore';

// ---------------------------------------------------------------------------
// Account state (stays in memory — replace with on-chain reads when live)
// ---------------------------------------------------------------------------
const accounts = new Map<string, Account>();
const nonces = new Map<string, number>();

const generateTxHash = () =>
  `0x${Math.random().toString(16).slice(2).padEnd(16, '0')}${Date.now().toString(16)}`;

const simulateDelay = (ms = 1200) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

// ---------------------------------------------------------------------------
class MultisigService {
  // =========================================================================
  // WRITE 1 — createTransaction
  // Contract: createATransaction(address _to, uint _amount) [onlyValidSigner]
  // =========================================================================
  async createTransaction(
    accountId: string,
    to: string,
    value: string,
    data = '0x',
    initiatorAddress: string
  ): Promise<TransactionResult & { txId?: string }> {
    try {
      await simulateDelay(1400);

      const account = accounts.get(accountId);
      if (!account) throw new Error('Account not found');

      const isOwner = account.owners.some(
        (o) => o.address.toLowerCase() === initiatorAddress.toLowerCase()
      );
      if (!isOwner) throw new Error('Only owners can create transactions');

      const nonce = nonces.get(accountId) ?? 0;
      nonces.set(accountId, nonce + 1);

      const tx: Transaction = {
        id: `tx-${Date.now()}`,
        accountId,
        type: value === '0' ? 'contract_interaction' : 'send',
        to,
        value,
        data,
        nonce,
        status: 'pending',
        initiator: initiatorAddress,
        confirmations: [],           // initiator has NOT approved yet
        requiredConfirmations: account.threshold,
        createdAt: new Date().toISOString(),
      };

      // Push to reactive store — all subscribers re-render immediately
      transactionStore.add(tx);

      return { success: true, txHash: generateTxHash(), txId: tx.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // =========================================================================
  // WRITE 2 — approveAsInitiator
  // Contract: approveTxnWithId(uint _txnId) [onlyInitiator]
  // =========================================================================
  async approveAsInitiator(
    transactionId: string,
    initiatorAddress: string
  ): Promise<TransactionResult> {
    try {
      await simulateDelay(1000);

      const tx = transactionStore.getById(transactionId);
      if (!tx) throw new Error('Transaction not found');
      if (tx.status !== 'pending') throw new Error(`Transaction is ${tx.status}`);
      if (tx.initiator.toLowerCase() !== initiatorAddress.toLowerCase())
        throw new Error('Only the initiator can call this');

      const alreadyApproved = tx.confirmations.some(
        (c) => c.owner.toLowerCase() === initiatorAddress.toLowerCase()
      );
      if (alreadyApproved) throw new Error('Already approved');

      const updated: Transaction = {
        ...tx,
        confirmations: [
          ...tx.confirmations,
          { owner: initiatorAddress, timestamp: new Date().toISOString() },
        ],
      };

      // Auto-execute check after initiator approves (edge case: threshold = 1)
      const account = accounts.get(tx.accountId);
      if (account && updated.confirmations.length >= account.threshold) {
        updated.status = 'executed';
        updated.executedAt = new Date().toISOString();
        updated.txHash = generateTxHash();
        account.balance = (
          parseFloat(account.balance) - parseFloat(tx.value)
        ).toFixed(4);
      }

      transactionStore.update(transactionId, updated);
      return { success: true, txHash: generateTxHash() };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // =========================================================================
  // WRITE 3 — approveAsSignerAndExecute
  // Contract: approveTransaction(uint _txnId) [onlyValidSigner]
  // Auto-executes when threshold is reached.
  // =========================================================================
  async approveAsSignerAndExecute(
    transactionId: string,
    signerAddress: string
  ): Promise<TransactionResult> {
    try {
      await simulateDelay(1200);

      const tx = transactionStore.getById(transactionId);
      if (!tx) throw new Error('Transaction not found');

      const account = accounts.get(tx.accountId);
      if (!account) throw new Error('Account not found');

      if (tx.status !== 'pending') throw new Error(`Transaction is ${tx.status}`);

      const initiatorApproved = tx.confirmations.some(
        (c) => c.owner.toLowerCase() === tx.initiator.toLowerCase()
      );
      if (!initiatorApproved) throw new Error('Initiator must approve first');

      const isOwner = account.owners.some(
        (o) => o.address.toLowerCase() === signerAddress.toLowerCase()
      );
      if (!isOwner) throw new Error('Not a valid signer');

      const alreadyApproved = tx.confirmations.some(
        (c) => c.owner.toLowerCase() === signerAddress.toLowerCase()
      );
      if (alreadyApproved) throw new Error('Already approved by this signer');

      const newConfirmations = [
        ...tx.confirmations,
        { owner: signerAddress, timestamp: new Date().toISOString() },
      ];

      const updated: Transaction = { ...tx, confirmations: newConfirmations };

      // Auto-execute at threshold
      if (newConfirmations.length >= account.threshold) {
        const balance = parseFloat(account.balance);
        const amount = parseFloat(tx.value);
        if (amount > balance) throw new Error('Insufficient balance');

        updated.status = 'executed';
        updated.executedAt = new Date().toISOString();
        updated.txHash = generateTxHash();
        account.balance = (balance - amount).toFixed(4);
      }

      transactionStore.update(transactionId, updated);
      return { success: true, txHash: updated.txHash ?? generateTxHash() };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // =========================================================================
  // WRITE 4 — cancelTransaction
  // Contract: cancelTxn(uint _txnId) [onlyInitiator]
  // =========================================================================
  async cancelTransaction(
    transactionId: string,
    initiatorAddress: string
  ): Promise<TransactionResult> {
    try {
      await simulateDelay(800);

      const tx = transactionStore.getById(transactionId);
      if (!tx) throw new Error('Transaction not found');
      if (tx.initiator.toLowerCase() !== initiatorAddress.toLowerCase())
        throw new Error('Only the initiator can cancel');
      if (tx.status !== 'pending') throw new Error(`Transaction is already ${tx.status}`);

      transactionStore.update(transactionId, { status: 'cancelled' });
      return { success: true, txHash: generateTxHash() };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // =========================================================================
  // WRITE 5 — changeSigner
  // Contract: changeSigner(address _oldSigner, address _newSigner) [onlyOwner]
  // =========================================================================
  async changeSigner(
    accountId: string,
    oldSigner: string,
    newSigner: string,
    callerAddress: string
  ): Promise<TransactionResult> {
    try {
      await simulateDelay(1500);

      const account = accounts.get(accountId);
      if (!account) throw new Error('Account not found');

      if (account.owners[0]?.address.toLowerCase() !== callerAddress.toLowerCase())
        throw new Error('Only the contract owner can change signers');

      const idx = account.owners.findIndex(
        (o) => o.address.toLowerCase() === oldSigner.toLowerCase()
      );
      if (idx === -1) throw new Error('Old signer not found');

      if (account.owners.some((o) => o.address.toLowerCase() === newSigner.toLowerCase()))
        throw new Error('New signer already exists');

      account.owners[idx] = { address: newSigner, addedAt: new Date().toISOString(), isActive: true };
      return { success: true, txHash: generateTxHash() };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // =========================================================================
  // WRITE 6 — changeOwner
  // Contract: changeOwner(address _newOwner) [onlyOwner]
  // =========================================================================
  async changeOwner(
    accountId: string,
    newOwnerAddress: string,
    callerAddress: string
  ): Promise<TransactionResult> {
    try {
      await simulateDelay(1200);

      const account = accounts.get(accountId);
      if (!account) throw new Error('Account not found');

      if (account.owners[0]?.address.toLowerCase() !== callerAddress.toLowerCase())
        throw new Error('Only the current owner can transfer ownership');

      if (!newOwnerAddress || newOwnerAddress.length < 10)
        throw new Error('Invalid address');

      account.owners[0] = { ...account.owners[0], address: newOwnerAddress, addedAt: new Date().toISOString() };
      return { success: true, txHash: generateTxHash() };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // =========================================================================
  // Account management
  // =========================================================================
  getAccount(accountId: string): Account | undefined {
    return accounts.get(accountId);
  }

  getAllAccounts(): Account[] {
    return Array.from(accounts.values());
  }

  initializeAccount(account: Account) {
    accounts.set(account.id, { ...account });
    nonces.set(account.id, 0);
  }

  seedTransaction(tx: Transaction) {
    // Seeds directly into the store (called once from mockData.seedMockData)
    transactionStore.seed([tx]);
  }
}

export const multisigService = new MultisigService();
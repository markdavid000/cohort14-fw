// src/services/multisigService.ts
// Simulation layer — swap each method body for ethers.js / viem contract calls when going live.
// Every write function is annotated with its contract equivalent and ABI integration point.

import {
  type Transaction,
  type Account,
  type TransactionResult,
} from '../types/IMultisig';

// ---------------------------------------------------------------------------
// Simulated on-chain state
// ---------------------------------------------------------------------------
let multisigState = {
  accounts: new Map<string, Account>(),
  transactions: new Map<string, Transaction>(),
  nonces: new Map<string, number>(),
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const generateTxHash = () =>
  `0x${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;

const simulateDelay = (ms = 1000) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

// ---------------------------------------------------------------------------
// MultisigService
// ---------------------------------------------------------------------------
class MultisigService {
  // =========================================================================
  // WRITE FUNCTION 1 — createTransaction
  // Contract: createATransaction(address _to, uint _amount)  [onlyValidSigner]
  // =========================================================================
  async createTransaction(
    accountId: string,
    to: string,
    value: string,
    data = '0x',
    initiatorAddress: string
  ): Promise<TransactionResult> {
    try {
      await simulateDelay(1500);

      const account = multisigState.accounts.get(accountId);
      if (!account) throw new Error('Account not found');

      const isOwner = account.owners.some(
        (o) => o.address.toLowerCase() === initiatorAddress.toLowerCase()
      );
      if (!isOwner) throw new Error('Only owners can create transactions');

      const nonce = multisigState.nonces.get(accountId) ?? 0;
      multisigState.nonces.set(accountId, nonce + 1);

      const transaction: Transaction = {
        id: `tx-${Date.now()}`,
        accountId,
        type: value === '0' ? 'contract_interaction' : 'send',
        to,
        value,
        data,
        nonce,
        status: 'pending',
        initiator: initiatorAddress,
        confirmations: [],
        requiredConfirmations: account.threshold,
        createdAt: new Date().toISOString(),
      };

      multisigState.transactions.set(transaction.id, transaction);

      return { success: true, txHash: generateTxHash() };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // =========================================================================
  // WRITE FUNCTION 2 — approveAsInitiator
  // Contract: approveTxnWithId(uint _txnId)  [onlyInitiator]
  // Must be called BEFORE signers can approve.
  // =========================================================================
  async approveAsInitiator(
    transactionId: string,
    initiatorAddress: string
  ): Promise<TransactionResult> {
    try {
      await simulateDelay(1000);

      const transaction = multisigState.transactions.get(transactionId);
      if (!transaction) throw new Error('Transaction not found');
      if (transaction.status === 'executed')
        throw new Error('Transaction already executed');
      if (transaction.status === 'cancelled')
        throw new Error('Transaction already cancelled');
      if (
        transaction.initiator.toLowerCase() !== initiatorAddress.toLowerCase()
      )
        throw new Error('Only the initiator can call this function');

      const alreadyApproved = transaction.confirmations.some(
        (c) => c.owner.toLowerCase() === initiatorAddress.toLowerCase()
      );
      if (alreadyApproved) throw new Error('Initiator already approved');

      transaction.confirmations.push({
        owner: initiatorAddress,
        timestamp: new Date().toISOString(),
      });

      return { success: true, txHash: generateTxHash() };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // =========================================================================
  // WRITE FUNCTION 3 — approveAsSignerAndExecute
  // Contract: approveTransaction(uint _txnId)  [onlyValidSigner]
  // Auto-executes when threshold is met.
  // =========================================================================
  async approveAsSignerAndExecute(
    transactionId: string,
    signerAddress: string
  ): Promise<TransactionResult> {
    try {
      await simulateDelay(1200);

      const transaction = multisigState.transactions.get(transactionId);
      if (!transaction) throw new Error('Transaction not found');

      const account = multisigState.accounts.get(transaction.accountId);
      if (!account) throw new Error('Account not found');

      if (transaction.status === 'executed')
        throw new Error('Transaction already executed');
      if (transaction.status === 'cancelled')
        throw new Error('Transaction already cancelled');

      const initiatorHasApproved = transaction.confirmations.some(
        (c) => c.owner.toLowerCase() === transaction.initiator.toLowerCase()
      );
      if (!initiatorHasApproved)
        throw new Error('Initiator must approve first');

      const isOwner = account.owners.some(
        (o) => o.address.toLowerCase() === signerAddress.toLowerCase()
      );
      if (!isOwner) throw new Error('Only valid signers can approve');

      const alreadyApproved = transaction.confirmations.some(
        (c) => c.owner.toLowerCase() === signerAddress.toLowerCase()
      );
      if (alreadyApproved) throw new Error('Already approved by this signer');

      transaction.confirmations.push({
        owner: signerAddress,
        timestamp: new Date().toISOString(),
      });

      if (transaction.confirmations.length >= account.threshold) {
        const currentBalance = parseFloat(account.balance);
        const txValue = parseFloat(transaction.value);
        if (txValue > currentBalance) throw new Error('Insufficient balance');

        transaction.status = 'executed';
        transaction.executedAt = new Date().toISOString();
        transaction.txHash = generateTxHash();
        account.balance = (currentBalance - txValue).toFixed(4);
      }

      return { success: true, txHash: transaction.txHash ?? generateTxHash() };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // =========================================================================
  // WRITE FUNCTION 4 — changeSigner
  // Contract: changeSigner(address _oldSigner, address _newSigner)  [onlyOwner]
  // =========================================================================
  async changeSigner(
    accountId: string,
    oldSigner: string,
    newSigner: string,
    callerAddress: string
  ): Promise<TransactionResult> {
    try {
      await simulateDelay(1500);

      const account = multisigState.accounts.get(accountId);
      if (!account) throw new Error('Account not found');

      const isOwner =
        account.owners[0]?.address.toLowerCase() ===
        callerAddress.toLowerCase();
      if (!isOwner)
        throw new Error('Only the contract owner can change signers');

      const ownerIndex = account.owners.findIndex(
        (o) => o.address.toLowerCase() === oldSigner.toLowerCase()
      );
      if (ownerIndex === -1) throw new Error('Old signer not found');

      const newExists = account.owners.some(
        (o) => o.address.toLowerCase() === newSigner.toLowerCase()
      );
      if (newExists) throw new Error('New signer already exists');

      account.owners[ownerIndex] = {
        address: newSigner,
        addedAt: new Date().toISOString(),
        isActive: true,
      };

      return { success: true, txHash: generateTxHash() };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // =========================================================================
  // WRITE FUNCTION 5 — changeOwner
  // Contract: changeOwner(address _newOwner)  [onlyOwner]
  // =========================================================================
  async changeOwner(
    accountId: string,
    newOwnerAddress: string,
    callerAddress: string
  ): Promise<TransactionResult> {
    try {
      await simulateDelay(1200);

      const account = multisigState.accounts.get(accountId);
      if (!account) throw new Error('Account not found');

      const isCurrentOwner =
        account.owners[0]?.address.toLowerCase() ===
        callerAddress.toLowerCase();
      if (!isCurrentOwner)
        throw new Error('Only the current owner can transfer ownership');

      if (!newOwnerAddress || newOwnerAddress.length < 10)
        throw new Error('Invalid new owner address');

      account.owners[0] = {
        ...account.owners[0],
        address: newOwnerAddress,
        addedAt: new Date().toISOString(),
      };

      return { success: true, txHash: generateTxHash() };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // =========================================================================
  // WRITE FUNCTION 6 — cancelTransaction
  // Contract: cancelTxn(uint _txnId)  [onlyInitiator]
  // =========================================================================
  async cancelTransaction(
    transactionId: string,
    initiatorAddress: string
  ): Promise<TransactionResult> {
    try {
      await simulateDelay(800);

      const transaction = multisigState.transactions.get(transactionId);
      if (!transaction) throw new Error('Transaction not found');

      if (
        transaction.initiator.toLowerCase() !== initiatorAddress.toLowerCase()
      )
        throw new Error('Only the initiator can cancel');
      if (transaction.status === 'executed')
        throw new Error('Cannot cancel an executed transaction');
      if (transaction.status === 'cancelled')
        throw new Error('Already cancelled');

      transaction.status = 'cancelled';

      return { success: true, txHash: generateTxHash() };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // =========================================================================
  // READ FUNCTIONS
  // =========================================================================
  getAccount(accountId: string): Account | undefined {
    return multisigState.accounts.get(accountId);
  }

  getTransaction(transactionId: string): Transaction | undefined {
    return multisigState.transactions.get(transactionId);
  }

  getAccountTransactions(accountId: string): Transaction[] {
    return Array.from(multisigState.transactions.values())
      .filter((tx) => tx.accountId === accountId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  getPendingTransactions(accountId: string): Transaction[] {
    return this.getAccountTransactions(accountId).filter(
      (tx) => tx.status === 'pending'
    );
  }

  getAllAccounts(): Account[] {
    return Array.from(multisigState.accounts.values());
  }

  // Used by seedMockData() in mockData.ts to pre-populate the simulation
  seedTransaction(tx: Transaction) {
    if (!multisigState.transactions.has(tx.id)) {
      multisigState.transactions.set(tx.id, { ...tx });
    }
  }

  initializeAccount(account: Account) {
    multisigState.accounts.set(account.id, { ...account });
    multisigState.nonces.set(account.id, 0);
  }
}

export const multisigService = new MultisigService();
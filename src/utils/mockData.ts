// src/utils/mockData.ts
import { type Account, type Transaction, type Owner } from '../types/IMultisig';

// ---------------------------------------------------------------------------
// Owners
// ---------------------------------------------------------------------------
export const mockOwners: Owner[] = [
  {
    address: '0xA1b2C3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0',
    name: 'Henry P',
    addedAt: '2024-01-10T10:00:00Z',
    isActive: true,
  },
  {
    address: '0xB2c3D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c1',
    name: 'Signer 22',
    addedAt: '2024-01-10T10:00:00Z',
    isActive: true,
  },
  {
    address: '0xC3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0C1d2',
    name: 'Signer 8',
    addedAt: '2024-01-11T09:00:00Z',
    isActive: true,
  },
  {
    address: '0xD4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c1D2e3',
    name: 'Alice K',
    addedAt: '2024-01-12T08:00:00Z',
    isActive: true,
  },
];

// ---------------------------------------------------------------------------
// Accounts
// ---------------------------------------------------------------------------
export const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'magnificent-fuel-igniters',
    address: '0xAaaa1111Bbbb2222Cccc3333Dddd4444Eeee5555',
    balance: '16.23',
    threshold: 2,
    owners: [mockOwners[0], mockOwners[1], mockOwners[2], mockOwners[3]],
    network: 'sepolia',
    tokenAddress: '0xF1f2f3f4f5f6f7f8f9f0a1a2a3a4a5a6a7a8a9b0',
    createdAt: '2024-01-10T10:00:00Z',
  },
  {
    id: '2',
    name: 'glorious-fuel-igniters',
    address: '0xBbbb2222Cccc3333Dddd4444Eeee5555Ffff6666',
    balance: '8.45',
    threshold: 2,
    owners: [mockOwners[0], mockOwners[1], mockOwners[2]],
    network: 'sepolia',
    tokenAddress: '0xF1f2f3f4f5f6f7f8f9f0a1a2a3a4a5a6a7a8a9b0',
    createdAt: '2024-01-11T10:00:00Z',
  },
  {
    id: '3',
    name: 'funny-fuel-igniters',
    address: '0xCccc3333Dddd4444Eeee5555Ffff6666Aaaa7777',
    balance: '12.67',
    threshold: 3,
    owners: [mockOwners[0], mockOwners[1], mockOwners[2], mockOwners[3]],
    network: 'sepolia',
    tokenAddress: '0xF1f2f3f4f5f6f7f8f9f0a1a2a3a4a5a6a7a8a9b0',
    createdAt: '2024-01-12T10:00:00Z',
  },
];

// ---------------------------------------------------------------------------
// Transactions
// ---------------------------------------------------------------------------
export const mockTransactions: Transaction[] = [
  {
    id: 'tx-22',
    accountId: '1',
    type: 'receive',
    to: '0xAaaa1111Bbbb2222Cccc3333Dddd4444Eeee5555',
    value: '300',
    data: '0x',
    nonce: 21,
    status: 'executed',
    initiator: mockOwners[0].address,
    confirmations: [
      { owner: mockOwners[0].address, timestamp: '2023-09-14T19:15:00Z' },
      { owner: mockOwners[1].address, timestamp: '2023-09-14T19:18:00Z' },
    ],
    requiredConfirmations: 2,
    createdAt: '2023-09-14T12:53:00Z',
    executedAt: '2023-09-14T13:16:53Z',
    txHash: '0xc5c6cf2d63995d1111aabbccddeeff00',
  },
  {
    id: 'tx-21',
    accountId: '1',
    type: 'send',
    to: '0xD4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c1D2e3',
    value: '300',
    data: '0x',
    nonce: 20,
    status: 'executed',
    initiator: mockOwners[0].address,
    confirmations: [
      { owner: mockOwners[0].address, timestamp: '2023-09-10T11:10:00Z' },
      { owner: mockOwners[2].address, timestamp: '2023-09-10T11:11:00Z' },
    ],
    requiredConfirmations: 2,
    createdAt: '2023-09-10T11:05:00Z',
    executedAt: '2023-09-10T11:12:00Z',
    txHash: '0xa1b2c33d74006e2222bbccddee001122',
  },
  {
    id: 'tx-19',
    accountId: '1',
    type: 'send',
    to: '0xB2c3D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c1',
    value: '0.1',
    data: '0x',
    nonce: 18,
    status: 'pending',
    initiator: mockOwners[0].address,
    confirmations: [
      // initiator has approved; one signer still pending
      { owner: mockOwners[0].address, timestamp: '2023-09-07T14:25:00Z' },
    ],
    requiredConfirmations: 2,
    createdAt: '2023-09-07T14:20:00Z',
  },
  {
    id: 'tx-18',
    accountId: '1',
    type: 'send',
    to: '0xC3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0C1d2',
    value: '0.1',
    data: '0x',
    nonce: 17,
    status: 'pending',
    initiator: mockOwners[1].address,
    // initiator has NOT approved yet — waiting on approveTxnWithId
    confirmations: [],
    requiredConfirmations: 2,
    createdAt: '2023-09-07T16:05:00Z',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export const truncateAddress = (address: string, chars = 4): string => {
  if (!address) return '';
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

// Seed the multisig service with mock accounts on app start
// Call this once in main.tsx / App.tsx before rendering
import { multisigService } from '../services/MultisigService';

export const seedMockData = () => {
  mockAccounts.forEach((acc) => {
    if (!multisigService.getAccount(acc.id)) {
      multisigService.initializeAccount(acc);
    }
  });
  // Seed mock transactions into the service state
  mockTransactions.forEach((tx) => {
    // Access internal via a public helper — see multisigService.seedTransaction
    multisigService.seedTransaction(tx);
  });
};
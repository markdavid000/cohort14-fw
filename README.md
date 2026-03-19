# MultisigLabs — Multisig Wallet Frontend

A decentralized multisig wallet interface built with React, TypeScript, and Tailwind CSS v4, running on **Ethereum Sepolia testnet**.

## 🎨 Features

- ✅ Landing page with contract and signer overview
- ✅ Home dashboard with live stats and transaction queue
- ✅ Transactions page with real-time queue and history tabs
- ✅ Approve transactions — initiator approval + signer approval flow
- ✅ Create transactions with redirect to approve page
- ✅ Change signer (owner only)
- ✅ Transfer ownership (owner only)
- ✅ Simulated wallet address switcher (simulate different signers)
- ✅ LocalStorage-persisted transaction state (survives page refresh)
- ✅ Reactive store — all pages update in real time on every action
- ✅ Responsive layout — sidebar on desktop, drawer on mobile
- ✅ Settings restricted to contract owner only
- ✅ Dark theme with mint green (`#7FFFD4`) accents
- ✅ Ready for live ABI + wagmi integration (dual-mode service)

## 📁 Project Structure

```
src/
├── abis/
│   └── index.ts                  ← Multisig + ERC20 ABIs
├── components/
│   ├── buttons/
│   │   └── Button.tsx
│   ├── cards/
│   │   ├── StatsCard.tsx
│   │   └── TransactionCard.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Layout.tsx
│   └── wallet/
│       ├── AddressSwitcher.tsx   ← Simulate different signers
├
├── hooks/
│   ├── useAccounts.ts
│   ├── useTransactions.ts        ← Subscribes to transactionStore
│   ├── useWallet.ts              ← Wagmi wallet connection
│   └── useModal.ts
├── pages/
│   ├── Landing.tsx
│   ├── Home.tsx
│   ├── Transactions.tsx
│   ├── CreateTransaction.tsx
│   ├── ApproveTransaction.tsx
│   ├── ChangeSigner.tsx
│   └── ChangeOwner.tsx
├── services/
│   └── multisigService.ts        ← Dual-mode: simulation + live contract calls
├── store/
│   └── transactionStore.ts       ← Reactive localStorage-backed store
├── types/
│   └── IMultisig.ts
├── utils/
│   └── mockData.ts               ← Single account + 4 owners, no mock txns
@theme {
  --color-primary: #7fffd4;
  --color-primary-hover: #6eeec3;
  --color-primary-active: #5dddb2;
}
```

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#000000` | Page background |
| Card | `#1a1a1a` | Cards, panels |
| Surface | `#111111` | Sidebar, header |
| Primary | `#7FFFD4` | CTAs, active states, accents |
| Text | `#FFFFFF` | Headings |
| Muted | `#9CA3AF` | Secondary text |

## 🔌 Going Live (Next Steps)

1. Deploy ERC20 token on Sepolia → get `tokenAddress`
2. Deploy `Multisig.sol` passing `[signerAddresses]` and `tokenAddress` → get `address`
3. Update `src/utils/mockData.ts` with real addresses
4. Update `mockOwners` with real signer wallet addresses
5. Connect MetaMask — the UI switches to live mode automatically
6. Use `useContract.ts` hooks to read live balance and signers on-chain

## 🐛 Troubleshooting

**Tailwind styles not working**
- Ensure `@import "tailwindcss";` is the first line of `index.css`
- No `tailwind.config.js` needed — Tailwind v4 uses `@theme` in CSS
- Restart dev server after CSS changes

**Transactions not showing after refresh**
- Check `localStorage` → Application tab → `multisig_transactions_v1`
- If missing, the store initialised before `seedMockData()` ran — check `main.tsx` calls `seedMockData()` before `ReactDOM.createRoot()`

**Settings not visible**
- Switch to **Henry P** (★ owner) in the address switcher top-right

**"Only owners can create transactions" error**
- The connected address must be one of the 4 signers in `mockOwners`
- Switch to a valid signer in the address switcher

## 📝 License

MIT

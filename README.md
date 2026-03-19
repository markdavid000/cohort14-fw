# Igniters Multisig Wallet - Frontend

A professional multisig wallet interface built with React, TypeScript, and Tailwind CSS.

## 🎨 Features

- ✅ Landing page with account overview
- ✅ Home dashboard with stats and transaction queue
- ✅ Transactions page with queue and history tabs
- ✅ Expandable transaction details with confirmations
- ✅ Account switching
- ✅ Responsive sidebar navigation
- ✅ Dark theme with mint green (#7FFFD4) accents
- ✅ Custom hooks for state management
- ✅ Mock data (ready for blockchain integration)

## 📁 Project Structure

```
src/
├── components/
│   ├── buttons/
│   │   └── Button.tsx
│   ├── cards/
│   │   ├── AccountCard.tsx
│   │   ├── StatsCard.tsx
│   │   └── TransactionCard.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Layout.tsx
├── hooks/
│   ├── useAccounts.ts
│   ├── useTransactions.ts
│   ├── useWallet.ts
│   ├── useModal.ts
│   └── useCopyToClipboard.ts
├── pages/
│   ├── Landing.tsx
│   ├── Home.tsx
│   └── Transactions.tsx
├── types/
│   └── index.ts
├── utils/
│   └── mockData.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Install required packages:**
```bash
npm install react-router-dom
npm install -D @types/react-router-dom
```

3. **Start development server:**
```bash
npm run dev
```

4. **Open browser:**
```
http://localhost:5173
```

## 🎯 File Setup Checklist

Create these files in your project:

### Types
- [x] `src/types/index.ts` - TypeScript interfaces

### Utils
- [x] `src/utils/mockData.ts` - Mock data and helper functions

### Hooks
- [x] `src/hooks/useAccounts.ts`
- [x] `src/hooks/useTransactions.ts`
- [x] `src/hooks/useWallet.ts`
- [x] `src/hooks/useModal.ts`
- [x] `src/hooks/useCopyToClipboard.ts`

### Components
- [x] `src/components/buttons/Button.tsx`
- [x] `src/components/cards/AccountCard.tsx`
- [x] `src/components/cards/StatsCard.tsx`
- [x] `src/components/cards/TransactionCard.tsx`
- [x] `src/components/layout/Header.tsx`
- [x] `src/components/layout/Sidebar.tsx`
- [x] `src/components/layout/Layout.tsx`

### Pages
- [x] `src/pages/Landing.tsx`
- [x] `src/pages/Home.tsx`
- [x] `src/pages/Transactions.tsx`

### Config
- [x] `src/App.tsx`
- [x] `src/main.tsx`
- [x] `src/index.css` (includes Tailwind v4 @theme config)
- [ ] ~~`tailwind.config.js`~~ - **NOT NEEDED for Tailwind v4!**

## 🎨 Color Scheme

**Tailwind v4 Configuration** (in `src/index.css`):
```css
@theme {
  --color-primary: #7fffd4;
  --color-primary-hover: #6eeec3;
  --color-primary-active: #5dddb2;
}
```

- **Background**: `#000000` (Pure Black)
- **Cards**: `#1a1a1a` (Dark Gray)
- **Borders**: `#2a2a2a` (Border Gray)
- **Primary**: `#7FFFD4` (Mint Green) - CTAs, accents
- **Text**: `#FFFFFF` (White)
- **Secondary Text**: `#9CA3AF` (Gray 400)

**Note**: Tailwind v4 doesn't use `tailwind.config.js`! All configuration is in CSS using `@theme`.

## 🔧 Custom Hooks Usage

### useAccounts
```typescript
const { accounts, selectedAccount, selectAccount } = useAccounts();
```

### useTransactions
```typescript
const { transactions, queuedTransactions, historyTransactions } = useTransactions(accountId);
```

### useModal
```typescript
const { openNewTransaction, closeNewTransaction } = useModal();
```

## 📱 Pages Overview

### 1. Landing (`/`)
- Welcome section with platform description
- Create new account button
- List of existing multisig accounts

### 2. Home (`/home`)
- Account stats (Balance, Assets, Threshold, Owners)
- Transaction queue with pending transactions
- Quick access to create new transaction

### 3. Transactions (`/transactions`)
- Queue tab (pending transactions)
- History tab (completed transactions)
- Expandable transaction cards with full details
- Confirmation progress tracking

## 🎭 Components

### Button
```typescript
<Button variant="primary" size="lg" fullWidth>
  Click Me
</Button>
```

Variants: `primary`, `secondary`, `ghost`
Sizes: `sm`, `md`, `lg`

### AccountCard
```typescript
<AccountCard account={account} onClick={handleClick} />
```

### TransactionCard
```typescript
<TransactionCard transaction={tx} expanded={false} />
```

### StatsCard
```typescript
<StatsCard label="Balance" value="16.23 ETH" icon={<Icon />} />
```

## 🔌 Integration Guide (Next Steps)

When ready to connect to your smart contract:

1. **Install Web3 libraries:**
```bash
npm install ethers viem wagmi
```

2. **Replace mock hooks with real data:**
   - Update `useAccounts` to fetch from blockchain
   - Update `useTransactions` to query contract events
   - Add contract interaction methods

3. **Add wallet connection:**
   - Update `useWallet` to use MetaMask/WalletConnect
   - Add network switching
   - Handle account changes

4. **Implement transaction signing:**
   - Multi-signature confirmation flow
   - Transaction execution
   - Gas estimation

## 🎨 Customization

### Change Primary Color (Tailwind v4)
Edit `src/index.css`:
```css
@theme {
  --color-primary: #YOUR_COLOR; /* Replace #7fffd4 */
  --color-primary-hover: #YOUR_HOVER_COLOR;
}
```

**Important**: Tailwind v4 uses CSS-based configuration with `@theme`, not `tailwind.config.js`!

### Add New Pages
1. Create page in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation item in `Sidebar.tsx`

## 📦 Production Build

```bash
npm run build
```

Output will be in `dist/` folder.

## 🐛 Troubleshooting

### Tailwind styles not working
1. Make sure `@import "tailwindcss";` is in `index.css`
2. Restart dev server
3. Clear browser cache

### Routes not working
1. Check `react-router-dom` is installed
2. Verify `BrowserRouter` wraps the app
3. Check route paths match navigation links

### TypeScript errors
1. Run `npm install -D @types/react @types/react-dom`
2. Check all imports are correct
3. Verify TypeScript version (4.9+)

## 📝 License

MIT

## 🙏 Credits

Built with ❤️ for the Web3 community

---

**Ready to build the future of decentralized finance!** 🚀
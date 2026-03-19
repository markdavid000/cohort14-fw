import React from 'react';
import { Card } from '../ui/Card';
import { MdAccountBalanceWallet } from 'react-icons/md';

interface TokenBalanceCardProps {
  symbol: string;
  balance: string;
  fiatValue: string;
}

export const TokenBalanceCard: React.FC<TokenBalanceCardProps> = ({ symbol, balance, fiatValue }) => {
  return (
    <Card variant="default" className="flex flex-col justify-between bg-[#121418] border-gray-800/80">
      <div className="flex justify-between items-start mb-6">
        <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">{symbol} Balance</span>
        <div className="text-[#00d4ff]">
          <MdAccountBalanceWallet className="text-xl" />
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold text-white mb-1">{balance}</h2>
        <span className="text-lg text-gray-300 font-semibold inline-block mb-1">{symbol}</span>
        <p className="text-gray-500 text-sm">~ {fiatValue}</p>
      </div>
    </Card>
  );
};

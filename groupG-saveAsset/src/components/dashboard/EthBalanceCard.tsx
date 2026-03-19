import React from 'react';
import { Card } from '../ui/Card';

interface EthBalanceCardProps {
  balance: string;
  fiatValue: string;
}

export const EthBalanceCard: React.FC<EthBalanceCardProps> = ({ balance, fiatValue }) => {
  return (
    <Card variant="default" className="flex flex-col justify-between">
      <div className="flex justify-between items-start mb-6">
        <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">ETH Balance</span>
        <div className="text-gray-500">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
          </svg>
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold text-white mb-1">{balance} ETH</h2>
        <p className="text-[#00e676] text-sm">~ {fiatValue}</p>
      </div>
    </Card>
  );
};

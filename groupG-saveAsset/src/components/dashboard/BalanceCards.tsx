import React, { useMemo } from 'react';
import { EthBalanceCard } from './EthBalanceCard';
import { TokenBalanceCard } from './TokenBalanceCard';
import { AddressCard } from './AddressCard';

interface BalanceCardsProps {
  ethBalance: string;
  tokenBalance: string;
  vaultAddress: string;
}

export const BalanceCards: React.FC<BalanceCardsProps> = ({ ethBalance, tokenBalance, vaultAddress }) => {
  const ethFiat = useMemo(() => 
    `$${(parseFloat(ethBalance || '0') * 1836.73).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  [ethBalance]);

  const rbnntFiat = useMemo(() => 
    `$${(parseFloat(tokenBalance || '0') * 0.20).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  [tokenBalance]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <EthBalanceCard balance={ethBalance} fiatValue={ethFiat} />
      <TokenBalanceCard symbol="RBNNT" balance={tokenBalance} fiatValue={rbnntFiat} />
      <AddressCard address={vaultAddress || 'Not Connected'} />
    </div>
  );
};

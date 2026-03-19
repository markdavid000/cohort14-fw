// src/hooks/useWallet.ts
import { useState, useEffect } from 'react';
import { type WalletState } from '../types/IMultisig';

// WalletState = { connected: boolean; address: string | null; network: Network | null }

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    network: null,
  });
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    // Re-hydrate from storage on mount
    const savedAddress = localStorage.getItem('wallet_address');
    if (savedAddress) {
      setWallet({
        connected: true,
        address: savedAddress,
        network: 'sepolia',
      });
    }
  }, []);

  const connect = async () => {
    setConnecting(true);

    // -----------------------------------------------------------------------
    // TODO (live): replace with MetaMask / wagmi / ethers provider connect
    // const provider = new ethers.BrowserProvider(window.ethereum);
    // await provider.send('eth_requestAccounts', []);
    // const signer = await provider.getSigner();
    // const address = await signer.getAddress();
    // -----------------------------------------------------------------------
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));

    // Simulated Sepolia address — replace with real address from signer
    const mockAddress = '0xA1b2C3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0';
    localStorage.setItem('wallet_address', mockAddress);

    setWallet({
      connected: true,
      address: mockAddress,
      network: 'sepolia',
    });
    setConnecting(false);
  };

  const disconnect = () => {
    localStorage.removeItem('wallet_address');
    setWallet({
      connected: false,
      address: null,
      network: null,
    });
  };

  return {
    wallet,
    connecting,
    connect,
    disconnect,
  };
};
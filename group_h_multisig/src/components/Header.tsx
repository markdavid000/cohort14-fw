/**
 * Header Component
 * 
 * Top header bar with wallet connection and status indicators.
 * Displays connected wallet address and network status.
 */

import { Wifi, CopyIcon, LogOut } from 'lucide-react'
import { useState } from 'react'

/**
 * Header with wallet and connection info
 */
export default function Header() {
  const [copied, setCopied] = useState(false);
  
  // Mock connected wallet address
  const walletAddress = '0x71C...4F32';
  const fullAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976';

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Left section - Connection status */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-gray-600">
            ETH Mainnet
          </span>
        </div>

        {/* Right section - Wallet info */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleCopyAddress}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Copy full address"
          >
            <span className="text-sm font-mono text-gray-700">{walletAddress}</span>
            <CopyIcon className="w-4 h-4 text-gray-500" />
          </button>
          
          {copied && (
            <span className="text-xs text-green-600 font-medium">Copied!</span>
          )}

          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Wifi className="w-5 h-5 text-gray-600" />
          </button>

          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <LogOut className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}

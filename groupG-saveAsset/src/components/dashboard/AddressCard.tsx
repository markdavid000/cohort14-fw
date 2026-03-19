import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { MdContentCopy, MdCheck } from 'react-icons/md';
import toast from 'react-hot-toast';

interface AddressCardProps {
  address: string;
}

export const AddressCard: React.FC<AddressCardProps> = ({ address }) => {
  const [copied, setCopied] = useState(false);

  const formatAddress = (addr: string) => {
    if (!addr || addr === 'Not Connected') return 'Not Connected';
    if (addr.length < 10) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleCopy = async () => {
    if (!address || address === 'Not Connected') return;
    try {
      await navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard!');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy address');
    }
  };

  return (
    <Card variant="default" className="flex flex-col justify-between border-gray-700/50 bg-[#121418]">
      <div className="mb-6">
        <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">Vault Address</span>
      </div>
      <div>
        <h2 className="text-2xl font-medium text-white tracking-wide mb-4" title={address}>
          {formatAddress(address)}
        </h2>
        <Button 
          type="button"
          variant="secondary" 
          fullWidth 
          className="py-2.5 bg-[#1a1c23] border border-gray-700 hover:bg-[#22252e] transition-colors" 
          onClick={handleCopy}
          disabled={!address || address === 'Not Connected'}
        >
          {copied ? (
            <span className="flex items-center font-semibold text-white"><MdCheck className="mr-2 text-green-400 text-lg" /> Copied!</span>
          ) : (
            <span className="flex items-center font-medium"><MdContentCopy className="mr-2 text-gray-400 text-lg" /> Copy Address</span>
          )}
        </Button>
      </div>
    </Card>
  );
};

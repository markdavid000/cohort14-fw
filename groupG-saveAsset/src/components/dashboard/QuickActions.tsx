import React from 'react';
import { Card } from '../ui/Card';
import { ActionCard } from './ActionCard';
import { 
  MdAddCircleOutline, 
  MdRemoveCircleOutline, 
  MdSend, 
  MdArrowDownward, 
  MdArrowUpward, 
  MdLocalFireDepartment 
} from 'react-icons/md';

const ACTIONS = [
  { id: 'deposit-eth', label: 'Deposit ETH', icon: <MdAddCircleOutline className="text-2xl" /> },
  { id: 'withdraw-eth', label: 'Withdraw ETH', icon: <MdRemoveCircleOutline className="text-2xl" /> },
  { id: 'send-token', label: 'Send Token', icon: <MdSend className="text-2xl" /> },
  { id: 'deposit-erc20', label: 'Deposit ERC20', icon: <MdArrowDownward className="text-2xl" /> },
  { id: 'withdraw-erc20', label: 'Withdraw ERC20', icon: <MdArrowUpward className="text-2xl" /> },
  { id: 'burn-token', label: 'Burn Token', icon: <MdLocalFireDepartment className="text-2xl text-red-400" /> },
];

export const QuickActions: React.FC<{ onActionClick: (id: string) => void }> = ({ onActionClick }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <div className="w-1 h-4 bg-[#00d4ff] rounded-full"></div>
        Quick Actions
      </h3>
      <Card variant="default" className="border-gray-800/80 bg-[#121418] p-4 sm:p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {ACTIONS.map((action) => (
            <ActionCard
              key={action.id}
              icon={action.icon}
              label={action.label}
              onClick={() => onActionClick(action.id)}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

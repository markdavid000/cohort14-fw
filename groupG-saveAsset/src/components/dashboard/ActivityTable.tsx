import React from 'react';
import { Card } from '../ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { MdOpenInNew } from 'react-icons/md';
import { type Activity } from '../../context';

interface ActivityTableProps {
  activities: Activity[];
}

export const ActivityTable: React.FC<ActivityTableProps> = ({ activities }) => {
  return (
    <Card variant="default" className="border-gray-800/60 p-0 overflow-hidden bg-[#121418]">
      <div className="p-6 flex items-center justify-between border-b border-gray-800">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Recent vault activity</h3>
          <p className="text-sm text-gray-500">Real-time update of your obsidian ledger.</p>
        </div>
        <a href="#" className="text-sm text-[#00d4ff] hover:text-[#55e3ff] font-medium transition-colors">
          View All Activity
        </a>
      </div>
      
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-none">
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.length === 0 ? (
              <TableRow className="hover:bg-transparent border-none">
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No recent activity found.
                </TableCell>
              </TableRow>
            ) : (
              activities.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="text-gray-400">{tx.date}</TableCell>
                  <TableCell className="text-white">{tx.type}</TableCell>
                  <TableCell className={`font-medium ${tx.isPositive ? 'text-[#00e676]' : 'text-gray-300'}`}>
                    {tx.amount}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded ${
                      tx.status === 'COMPLETED' 
                        ? 'bg-green-500/10 text-[#00e676]' 
                        : tx.status === 'PENDING'
                        ? 'bg-orange-500/10 text-orange-400'
                        : 'bg-red-500/10 text-red-500'
                    }`}>
                      {tx.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <button className="text-gray-500 hover:text-white transition-colors p-2 text-lg">
                      <MdOpenInNew />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

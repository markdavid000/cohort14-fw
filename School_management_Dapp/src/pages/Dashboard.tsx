import { useEffect, useState } from 'react';
import { getStudents, getTreasuryBalance, subscribe } from '../lib/mockData';

export function Dashboard() {
  const [, setVersion] = useState(0);

  useEffect(() => {
    return subscribe(() => {
      setVersion((value) => value + 1);
    });
  }, []);

  const students = getStudents();
  const treasuryBalance = getTreasuryBalance();
  const studentCount = students.length;
  const paidStudents = students.filter((student) => student.isPaid).length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-slate-500 truncate">Treasury Balance</dt>
            <dd className="mt-1 text-3xl font-semibold text-slate-900">{treasuryBalance} STKN</dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-slate-500 truncate">Total Students</dt>
            <dd className="mt-1 text-3xl font-semibold text-slate-900">{studentCount}</dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-slate-500 truncate">Paid Students</dt>
            <dd className="mt-1 text-3xl font-semibold text-slate-900">{paidStudents}</dd>
          </div>
        </div>
      </div>
    </div>
  );
}
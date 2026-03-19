import { useEffect, useState } from 'react';
import {
  approveAllowance,
  consumeAllowance,
  getAllowance,
  getStudentById,
  getTuitionFee,
  payStudentTuition,
  subscribe,
} from '../lib/mockData';

export function Payments() {
  const [, setVersion] = useState(0);
  const [studentId, setStudentId] = useState('');

  useEffect(() => {
    return subscribe(() => {
      setVersion((value) => value + 1);
    });
  }, []);

  const parsedStudentId = Number(studentId) || 0;
  const student = parsedStudentId ? getStudentById(parsedStudentId) : undefined;
  const fee = student ? getTuitionFee(student.level) : 0;
  const allowance = getAllowance();
  const needsApproval = allowance < fee;

  const handleApprove = () => {
    approveAllowance(fee);
  };

  const handlePay = () => {
    if (!student) {
      return;
    }
    payStudentTuition(student.id);
    consumeAllowance(fee);
    setStudentId('');
  };

  return (
    <div className="space-y-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-slate-900">Pay Tuition</h3>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <input
              type="number"
              placeholder="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-slate-300 rounded-md p-2 border"
              required
            />
            <input
              type="text"
              placeholder="Fee Amount (STKN)"
              value={fee}
              disabled
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-slate-300 rounded-md p-2 border bg-slate-100"
            />

            {needsApproval ? (
              <button
                onClick={handleApprove}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Approve {fee} STKN
              </button>
            ) : (
              <button
                onClick={handlePay}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Pay Tuition
              </button>
            )}
          </div>
          <div className="mt-4 text-sm text-slate-500">Current Allowance: {allowance} STKN</div>
        </div>
      </div>
    </div>
  );
}
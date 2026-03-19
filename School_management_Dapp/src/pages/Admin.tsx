import { useState, type FormEvent } from 'react';
import { setTuitionFee } from '../lib/mockData';

export function Admin() {
  const [level, setLevel] = useState('1');
  const [fee, setFee] = useState('100');

  const handleUpdateFee = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTuitionFee(Number(level), Number(fee));
    setLevel('1');
    setFee('100');
  };

  return (
    <div className="space-y-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-slate-900">Update Tuition Fee</h3>
          <form onSubmit={handleUpdateFee} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <input
              type="number"
              placeholder="Level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-slate-300 rounded-md p-2 border"
              required
            />
            <input
              type="number"
              placeholder="New Fee (STKN)"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-slate-300 rounded-md p-2 border"
              required
            />
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Fee
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

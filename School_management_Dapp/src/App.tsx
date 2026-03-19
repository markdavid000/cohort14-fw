/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Dashboard } from "../src/pages/Dashboard";
import { Students } from "../src/pages/Students";
import { Staff } from "../src/pages/Staff";
import { Admin } from "../src/pages/Admin";
import { Payments } from "../src/pages/Payments";
import { GraduationCap } from "lucide-react";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <GraduationCap className="h-8 w-8 text-indigo-600" />
                  <span className="ml-2 text-xl font-bold text-slate-900">
                    EduChain SMS
                  </span>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/"
                    className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/students"
                    className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Students
                  </Link>
                  <Link
                    to="/staff"
                    className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Staff
                  </Link>
                  <Link
                    to="/admin"
                    className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Admin
                  </Link>
                  <Link
                    to="/payments"
                    className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Payments
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center rounded-full bg-blue-400 text-white px-3 py-1 text-xs font-medium text-slate-700">
                  Connect Wallet
                </span>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/payments" element={<Payments />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

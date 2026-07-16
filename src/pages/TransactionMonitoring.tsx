import React, { useState, useEffect } from 'react';
import TransactionTable from '../components/TransactionTable';
import AreaChart from '../charts/AreaChart';
import PieChart from '../charts/PieChart';
import { fraudAPI } from '../services/fraudAPI';
import { Transaction } from '../db-store';
import { CRYPTO_STANDARDS, CATEGORIES } from '../utils/constants';

export default function TransactionMonitoring() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showInjectModal, setShowInjectModal] = useState(false);
  const [username, setUsername] = useState('Michael Chang');
  const [amount, setAmount] = useState('4500');
  const [merchant, setMerchant] = useState('SWIFT Core Settlement');
  const [category, setCategory] = useState('Wire Transfer');
  const [location, setLocation] = useState('New York, USA');
  const [encryption, setEncryption] = useState('AES-256-GCM');

  const fetchTransactions = async () => {
    try {
      const data = await fraudAPI.getTransactions();
      setTransactions(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleInjectTx = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fraudAPI.createTransaction({
        username,
        amount: parseFloat(amount),
        currency: 'USD',
        merchant,
        category,
        location,
        encryptionType: encryption
      });
      setShowInjectModal(false);
      fetchTransactions();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6" id="transaction-monitoring-page">
      {/* Page Header */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 tracking-wider">SWIFT WIRE MONITORING</h2>
          <p className="text-xs text-slate-400 mt-0.5">Continuous integrity audits of transaction ciphers and destination vectors.</p>
        </div>
        <button
          onClick={() => setShowInjectModal(true)}
          className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors cursor-pointer"
        >
          Inject Live Transaction
        </button>
      </div>

      {/* Analytical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#102B46] border border-slate-800 rounded-xl p-5">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest block mb-4">Total Liquidity Volume Traced</span>
          <AreaChart />
        </div>
        <div className="bg-[#102B46] border border-slate-800 rounded-xl p-5">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest block mb-4">Transfer Category Allocation</span>
          <PieChart />
        </div>
      </div>

      {/* Main Ledger Table */}
      <TransactionTable transactions={transactions} onAddTransactionClick={() => setShowInjectModal(true)} />

      {/* Inject Transaction Modal */}
      {showInjectModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-lg bg-[#102B46] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 tracking-wider">Inject Simulated SWIFT Wire</h3>
              <button onClick={() => setShowInjectModal(false)} className="text-slate-400 hover:text-slate-200 text-sm">✕</button>
            </div>

            <form onSubmit={handleInjectTx} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1">Sender Name</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1">Transfer Amount ($)</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-semibold mb-1">Recipient Merchant / Institution</label>
                <input
                  type="text"
                  required
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  className="w-full bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 outline-none font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 outline-none cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1">Cipher Standard</label>
                  <select
                    value={encryption}
                    onChange={(e) => setEncryption(e.target.value)}
                    className="w-full bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 outline-none cursor-pointer"
                  >
                    {CRYPTO_STANDARDS.map((std) => (
                      <option key={std.value} value={std.value}>{std.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-semibold mb-1">Terminal Geolocation</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowInjectModal(false)}
                  className="px-4 py-2 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Inject Sequence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

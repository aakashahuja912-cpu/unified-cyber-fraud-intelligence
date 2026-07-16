import { useState } from 'react';
import { Search, Filter, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Transaction } from '../db-store';

interface TransactionTableProps {
  transactions: Transaction[];
  onAddTransactionClick?: () => void;
}

export default function TransactionTable({ transactions, onAddTransactionClick }: TransactionTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = transactions.filter(tx => {
    const matchesSearch = 
      tx.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      statusFilter === 'ALL' || 
      (statusFilter === 'BLOCKED' && tx.status === 'Blocked') ||
      (statusFilter === 'COMPLETED' && tx.status === 'Completed') ||
      (statusFilter === 'QUANTUM' && tx.isQuantumSensitive);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-[#102B46] border border-slate-800 rounded-xl p-5" id="transaction-table-component">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-800/80 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-200 tracking-wider">Transactional Ledger Monitoring</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Continuous evaluation of classical vs quantum sensitive SWIFT transfers.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="flex items-center gap-2 bg-slate-950/30 border border-slate-800 rounded-lg px-2.5 py-1.5 min-w-[200px] text-xs">
            <Search size={12} className="text-slate-500" />
            <input
              type="text"
              placeholder="Search sender, hash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-slate-200 outline-none w-full"
            />
          </div>
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950/30 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none"
          >
            <option value="ALL">All Triggers</option>
            <option value="COMPLETED">Cleared</option>
            <option value="BLOCKED">Blocked</option>
            <option value="QUANTUM">Quantum Sensitive</option>
          </select>
          {/* Add Tx button */}
          {onAddTransactionClick && (
            <button
              onClick={onAddTransactionClick}
              className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Inject SWIFT
            </button>
          )}
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] uppercase font-bold tracking-widest text-slate-500">
              <th className="py-3 px-4">TX REF</th>
              <th className="py-3 px-4">SENDER</th>
              <th className="py-3 px-4">RECIPIENT / MERCHANT</th>
              <th className="py-3 px-4">AMOUNT</th>
              <th className="py-3 px-4">CIPHER SUITE</th>
              <th className="py-3 px-4">LOCATION</th>
              <th className="py-3 px-4">STATUS</th>
            </tr>
          </thead>
          <tbody className="text-xs text-slate-300 divide-y divide-slate-800/40">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-slate-500 font-medium">
                  No matching transaction sequences located.
                </td>
              </tr>
            ) : (
              filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-950/15 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-400">{tx.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">{tx.username}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-300">
                    <span className="block">{tx.merchant}</span>
                    <span className="text-[10px] text-slate-500 font-semibold">{tx.category}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                    ${tx.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[11px] font-semibold text-slate-300">{tx.encryptionType}</span>
                      {tx.isQuantumSensitive ? (
                        <span className="bg-red-500/10 text-red-400 border border-red-500/10 text-[9px] px-1.5 py-0.2 rounded font-bold" title="Harvest Now Decrypt Later (HNDL) Vulnerable">
                          Q-VULN
                        </span>
                      ) : (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 text-[9px] px-1.5 py-0.2 rounded font-bold" title="Post-Quantum Cryptographic session encryption">
                          PQC
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-medium">{tx.location}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider inline-flex items-center gap-1.5 border ${
                      tx.status === 'Blocked' ? 'bg-red-500/10 text-red-400 border-red-500/15' :
                      tx.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15' :
                      'bg-orange-500/10 text-orange-400 border-orange-500/15'
                    }`}>
                      {tx.status === 'Blocked' ? <ShieldAlert size={10} /> : <ShieldCheck size={10} />}
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

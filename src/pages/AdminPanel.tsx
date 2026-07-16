import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/authAPI';
import { User, Shield, Key, RefreshCw, Plus } from 'lucide-react';

export default function AdminPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Security Analyst');

  const [showAddUser, setShowAddUser] = useState(false);
  const [success, setSuccess] = useState('');

  const fetchUsers = async () => {
    try {
      const data = await authAPI.getUsers();
      setUsers(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    try {
      await authAPI.register({ username, email, password, role });
      setSuccess('Operator created successfully!');
      setUsername('');
      setEmail('');
      setPassword('');
      setShowAddUser(false);
      fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6" id="admin-panel-page">
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 tracking-wider">CLEARANCE & ROLES PANEL</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage terminal user clearance profiles and cryptographic session keys.</p>
        </div>
        <button
          onClick={() => setShowAddUser(true)}
          className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus size={13} />
          <span>Provision User</span>
        </button>
      </div>

      {success && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg font-semibold">
          {success}
        </div>
      )}

      {/* Grid: Users ledger list */}
      <div className="bg-[#102B46] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest block">Clearance Accounts Ledger</span>
          <button onClick={fetchUsers} className="text-slate-500 hover:text-cyan-400 transition-colors">
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500 py-10 text-center animate-pulse">Decompiling security credentials...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] uppercase font-bold tracking-widest text-slate-500">
                  <th className="py-3 px-4">Operator Name</th>
                  <th className="py-3 px-4">Mail / SIP Endpoint</th>
                  <th className="py-3 px-4">Assigned Clearance</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs text-slate-300 divide-y divide-slate-800/40">
                {users.map((user) => (
                  <tr key={user.id || user.username} className="hover:bg-slate-950/15">
                    <td className="py-3 px-4 font-bold text-slate-200 flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] text-cyan-400 font-extrabold">
                        {user.username.substring(0, 2).toUpperCase()}
                      </div>
                      <span>{user.username}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-400">{user.email || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-cyan-500/10 text-cyan-400 border-cyan-500/15 uppercase tracking-wide">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-bold font-mono">● ENCRYPTED ACTIVE</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Provision User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-md bg-[#102B46] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 tracking-wider">Provision Operator Profile</h3>
              <button onClick={() => setShowAddUser(false)} className="text-slate-400 hover:text-slate-200 text-sm">✕</button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 font-semibold mb-1">Username / Tag</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 outline-none"
                  placeholder="e.g. analyst_sarah"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-semibold mb-1">Secure Mail</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 outline-none"
                  placeholder="sarah@apexbank.com"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-semibold mb-1">Temporary Passphrase</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-semibold mb-1">Security Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 outline-none cursor-pointer"
                >
                  <option value="Security Analyst">Security Analyst</option>
                  <option value="Fraud Analyst">Fraud Analyst</option>
                  <option value="Auditor">Auditor (Read-Only)</option>
                  <option value="Admin">Administrator</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="px-4 py-2 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Confirm Provisioning
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

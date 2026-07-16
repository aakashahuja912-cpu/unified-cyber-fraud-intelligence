import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/authAPI';
import { Shield, Key, User, Mail, ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Security Analyst');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authAPI.register({ username, email, password, role });
      setSuccess('Analyst profile registered successfully! Redirecting...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Tag credentials could be already used.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071B2F] flex items-center justify-center p-4" id="register-page">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-[#102B46]/80 backdrop-blur-md border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="text-center space-y-2 mb-6">
          <div className="bg-cyan-500/10 h-14 w-14 rounded-2xl border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/5">
            <Shield size={28} className="animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-slate-100 tracking-wider">APEX RISK NET</h2>
          <p className="text-xs text-slate-400">Initialize Security Clearance Profile</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg flex items-center gap-2 mb-4">
            <AlertTriangle size={14} className="shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg flex items-center gap-2 mb-4">
            <CheckCircle size={14} className="shrink-0" />
            <span className="font-semibold">{success}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ident Tag / Username</label>
            <div className="flex items-center gap-2.5 bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-2.5 focus-within:border-cyan-500 transition-colors">
              <User size={14} className="text-slate-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-transparent text-xs text-slate-200 outline-none w-full placeholder:text-slate-600 font-semibold"
                placeholder="analyst_jane"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Secure Mail Address</label>
            <div className="flex items-center gap-2.5 bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-2.5 focus-within:border-cyan-500 transition-colors">
              <Mail size={14} className="text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-xs text-slate-200 outline-none w-full placeholder:text-slate-600 font-semibold"
                placeholder="jane@apexbank.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Terminal Passphrase</label>
            <div className="flex items-center gap-2.5 bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-2.5 focus-within:border-cyan-500 transition-colors">
              <Key size={14} className="text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent text-xs text-slate-200 outline-none w-full placeholder:text-slate-600 font-semibold"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Security Clearance Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#102B46] border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-slate-200 font-semibold focus:border-cyan-500 outline-none cursor-pointer"
            >
              <option value="Security Analyst">Security Analyst</option>
              <option value="Fraud Analyst">Fraud Analyst</option>
              <option value="Auditor">Auditor (Read-Only)</option>
              <option value="Admin">Administrator (Full Access)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer mt-5"
          >
            <span>{loading ? 'Submitting clearances...' : 'Request Credentials Clearance'}</span>
            <ArrowRight size={13} />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-850 text-center text-xs">
          <span className="text-slate-500">Already cleared? </span>
          <Link to="/login" className="text-cyan-400 hover:underline font-bold">Access existing session</Link>
        </div>
      </div>
    </div>
  );
}

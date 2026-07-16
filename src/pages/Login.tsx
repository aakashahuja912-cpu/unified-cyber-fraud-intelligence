import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/authAPI';
import { Shield, Key, User, ArrowRight, AlertTriangle } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authAPI.login({ username, password });
      onLoginSuccess(data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login sequence failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071B2F] flex items-center justify-center p-4" id="login-page">
      {/* Background accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-[#102B46]/80 backdrop-blur-md border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="text-center space-y-2 mb-8">
          <div className="bg-cyan-500/10 h-14 w-14 rounded-2xl border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/5">
            <Shield size={28} className="animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-slate-100 tracking-wider">APEX RISK NET</h2>
          <p className="text-xs text-slate-400">Cybersecurity & Fraud Intelligence Core Terminal</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg flex items-center gap-2 mb-5">
            <AlertTriangle size={14} className="shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="Enter admin, analyst_sec..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Terminal Password</label>
            <div className="flex items-center gap-2.5 bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-2.5 focus-within:border-cyan-500 transition-colors">
              <Key size={14} className="text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent text-xs text-slate-200 outline-none w-full placeholder:text-slate-600 font-semibold"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer mt-6"
          >
            <span>{loading ? 'Validating FIPS Key...' : 'Establish Terminal Session'}</span>
            <ArrowRight size={13} />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-850 text-center text-xs">
          <span className="text-slate-500">Need credentials? </span>
          <Link to="/register" className="text-cyan-400 hover:underline font-bold">Register new analyst profile</Link>
        </div>

        {/* Quick Info Box */}
        <div className="mt-6 bg-slate-950/25 border border-slate-850 p-3 rounded-lg text-[10px] text-slate-500 font-semibold text-center">
          DEFAULT DEMO OPERATOR: <span className="text-cyan-400 font-bold">admin</span> / PASSWORD: <span className="text-cyan-400 font-bold">admin123</span>
        </div>
      </div>
    </div>
  );
}

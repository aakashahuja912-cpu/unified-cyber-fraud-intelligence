import { User, Shield, Key, Mail, Fingerprint } from 'lucide-react';

interface UserProfileProps {
  user: any;
}

export default function UserProfile({ user }: UserProfileProps) {
  if (!user) return null;

  return (
    <div className="bg-[#102B46] border border-slate-800 rounded-xl p-5 space-y-4" id="user-profile-component">
      <div className="pb-3 border-b border-slate-800/80 flex items-center gap-3">
        <div className="bg-cyan-500/10 p-2.5 rounded-lg border border-cyan-500/20 text-cyan-400">
          <User size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-200 tracking-wider">Terminal Access Credentials</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Cryptography signature details for authenticated analyst.</p>
        </div>
      </div>

      <div className="space-y-3.5 font-semibold text-xs text-slate-300">
        <div className="flex justify-between items-center bg-slate-950/25 p-3 border border-slate-800/60 rounded-lg">
          <span className="text-slate-400 flex items-center gap-1.5"><Fingerprint size={12} /> SECURE IDENTITY</span>
          <span className="font-bold text-slate-100">{user.username}</span>
        </div>

        <div className="flex justify-between items-center bg-slate-950/25 p-3 border border-slate-800/60 rounded-lg">
          <span className="text-slate-400 flex items-center gap-1.5"><Mail size={12} /> SECURE REGISTERED EMAIL</span>
          <span className="font-mono text-slate-100">{user.email}</span>
        </div>

        <div className="flex justify-between items-center bg-slate-950/25 p-3 border border-slate-800/60 rounded-lg">
          <span className="text-slate-400 flex items-center gap-1.5"><Shield size={12} /> SECURITY ROLE</span>
          <span className="font-bold text-cyan-400 uppercase tracking-wider">{user.role}</span>
        </div>

        <div className="flex justify-between items-center bg-slate-950/25 p-3 border border-slate-800/60 rounded-lg">
          <span className="text-slate-400 flex items-center gap-1.5"><Key size={12} /> CRYPTOGRAPHIC SESSION LEVEL</span>
          <span className="font-mono text-emerald-400">SESSION_ACTIVE_AES_256</span>
        </div>
      </div>
    </div>
  );
}

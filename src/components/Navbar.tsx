import { useState, useEffect } from 'react';
import { Bell, Search, Shield, Wifi, Calendar, User, LogOut } from 'lucide-react';
import { clearAuthToken } from '../services/api';

interface NavbarProps {
  user: any;
  onLogout: () => void;
  notifications: any[];
  onClearNotification: (id: string) => void;
}

export default function Navbar({ user, onLogout, notifications, onClearNotification }: NavbarProps) {
  const [time, setTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-[#102B46]/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-40" id="navbar">
      {/* Search Bar */}
      <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-800 rounded-full px-3.5 py-1.5 w-80 focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all duration-200">
        <Search size={14} className="text-slate-500" />
        <input
          type="text"
          placeholder="Query transactions, hash values, IP subnets..."
          className="bg-transparent text-xs text-slate-200 outline-none w-full placeholder:text-slate-500 font-medium"
        />
      </div>

      {/* Live Information & Actions */}
      <div className="flex items-center gap-6">
        {/* UTC Time */}
        <div className="hidden lg:flex items-center gap-2 text-slate-400 font-mono text-xs font-semibold bg-slate-950/25 border border-slate-800/60 px-3 py-1.5 rounded-lg">
          <Calendar size={13} className="text-cyan-400" />
          <span>{time.toISOString().replace('T', ' ').substring(0, 19)} UTC</span>
        </div>

        {/* Network State */}
        <div className="hidden md:flex items-center gap-1.5 bg-emerald-500/5 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-400">
          <Wifi size={10} className="animate-pulse" />
          <span>LIVE CORRELATOR</span>
        </div>

        {/* System Health */}
        <div className="hidden md:flex items-center gap-1.5 bg-cyan-500/5 border border-cyan-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold text-cyan-400">
          <Shield size={10} />
          <span>FIPS 140-3 SAFE</span>
        </div>

        {/* Notifications Icon with Badge */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileDropdown(false);
            }}
            className="p-2 text-slate-400 hover:text-slate-100 bg-slate-950/30 rounded-lg border border-slate-800/60 hover:bg-slate-800/30 transition-all relative"
            id="notification-bell"
          >
            <Bell size={16} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full animate-bounce"></span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-[#102B46] border border-slate-800 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-2">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Active Telemetry Logs</h3>
                <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded font-bold">{notifications.length} alerts</span>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2 scrollbar-thin">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No unhandled security indicators</p>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className="p-2.5 bg-slate-950/30 rounded-lg border border-slate-800/80 hover:bg-slate-850 transition-colors flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-200 truncate">{notif.type || 'Threat Alert'}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">{notif.message}</p>
                      </div>
                      <button
                        onClick={() => onClearNotification(notif.id)}
                        className="text-[10px] text-slate-500 hover:text-cyan-400 font-bold whitespace-nowrap self-center"
                      >
                        Acknowledge
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Area */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 bg-slate-950/30 border border-slate-800/60 p-1.5 rounded-full hover:border-slate-700 transition-all cursor-pointer"
          >
            <div className="bg-cyan-500/10 h-7 w-7 rounded-full flex items-center justify-center text-cyan-400 font-bold border border-cyan-500/20 uppercase text-xs">
              {user ? user.username.charAt(0) : 'U'}
            </div>
            <div className="text-left hidden lg:block pr-3">
              <p className="text-xs font-bold text-slate-200 leading-none">{user ? user.username : 'Sec. Console'}</p>
              <span className="text-[9px] text-cyan-400 font-semibold uppercase">{user ? user.role : 'Guest'}</span>
            </div>
          </button>

          {/* Profile Dropdown Panel */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-3 w-48 bg-[#102B46] border border-slate-800 rounded-xl shadow-2xl p-2 z-50">
              <div className="p-3 border-b border-slate-800 mb-1.5 text-center lg:hidden">
                <p className="text-xs font-bold text-slate-200">{user ? user.username : 'User'}</p>
                <span className="text-[9px] text-cyan-400 font-bold uppercase">{user ? user.role : 'Guest'}</span>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors text-left"
              >
                <LogOut size={14} />
                <span>Disconnect Terminal</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

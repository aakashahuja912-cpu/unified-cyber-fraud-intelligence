import { NavLink } from 'react-router-dom';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Fingerprint, 
  TrendingUp, 
  Settings, 
  Cpu, 
  FileLock, 
  History, 
  Terminal, 
  LogOut, 
  Users, 
  User, 
  CheckSquare, 
  MapPin, 
  BarChart4 
} from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
  user?: any;
}

export default function Sidebar({ onLogout, user }: SidebarProps) {
  const menuItems = [
    { name: 'Overview Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Transaction Monitor', path: '/transactions', icon: TrendingUp },
    { name: 'Cyber Telemetry', path: '/telemetry', icon: Fingerprint },
    { name: 'Fraud Detection Engine', path: '/fraud', icon: ShieldAlert },
    { name: 'Threat Intelligence', path: '/threats', icon: Terminal },
    { name: 'Quantum Monitoring', path: '/quantum', icon: Cpu },
    { name: 'Explainable AI', path: '/explainability', icon: FileLock },
    { name: 'Incident Alerts', path: '/alerts', icon: CheckSquare },
    { name: 'Audit Reports', path: '/reports', icon: History },
    { name: 'System Settings', path: '/settings', icon: Settings },
  ];

  // Admin and Auditor extras
  const userRole = user?.role;
  const isAdmin = userRole === 'Admin';
  const isAuditor = userRole === 'Auditor';

  return (
    <aside className="w-64 bg-[#102B46]/95 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0" id="sidebar">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20 text-cyan-400">
          <ShieldAlert size={22} className="animate-pulse" />
        </div>
        <div>
          <h1 className="font-bold text-sm text-slate-100 tracking-wider">APEX RISK NET</h1>
          <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-widest">Securities & Fraud</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/5'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 border border-transparent'
                }`
              }
            >
              <Icon size={16} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}

        {/* Dynamic Admin/Auditor Routes */}
        {(isAdmin || isAuditor) && (
          <div className="pt-4 border-t border-slate-800/60 mt-4 px-3">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Admin Console</span>
            <div className="space-y-1.5 mt-2">
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 border border-transparent'
                  }`
                }
              >
                <Users size={16} />
                <span>Identity Manager</span>
              </NavLink>
              <NavLink
                to="/audit-logs"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 border border-transparent'
                  }`
                }
              >
                <Terminal size={16} />
                <span>Audit Logs</span>
              </NavLink>
              <NavLink
                to="/analytics"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 border border-transparent'
                  }`
                }
              >
                <BarChart4 size={16} />
                <span>Advanced Analytics</span>
              </NavLink>
            </div>
          </div>
        )}
      </nav>

      {/* Sidebar Footer User Card */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="bg-cyan-500/10 h-8 w-8 rounded-full flex items-center justify-center text-cyan-400 font-bold border border-cyan-500/20 uppercase text-xs">
              {user ? user.username.charAt(0) : 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate leading-tight">{user ? user.username : 'Sec. Console'}</p>
              {user?.email && (
                <p className="text-[9px] text-slate-400 truncate leading-none mt-0.5" title={user.email}>
                  {user.email}
                </p>
              )}
              <span className="text-[9px] text-cyan-400 truncate uppercase font-semibold block mt-1">{userRole || 'Analyst'}</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
            title="Log Out Terminal"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

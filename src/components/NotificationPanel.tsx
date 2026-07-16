import { Bell, ShieldAlert, CheckCircle, Info } from 'lucide-react';

interface NotificationPanelProps {
  notifications: any[];
  onClear: (id: string) => void;
}

export default function NotificationPanel({ notifications, onClear }: NotificationPanelProps) {
  return (
    <div className="bg-[#102B46] border border-slate-800 rounded-xl p-5 space-y-4" id="notification-panel-component">
      <div className="pb-3 border-b border-slate-800/80 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-slate-200 tracking-wider">Dynamic Stream Feed</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Unacknowledged network alarms and cyber exception packets.</p>
        </div>
        <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded font-mono font-bold">
          {notifications.length} Unresolved
        </span>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin">
        {notifications.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">Telemetry logs quiet. All system flags healthy.</p>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className="p-3 bg-slate-950/30 rounded-xl border border-slate-800/80 flex justify-between items-center gap-3">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 bg-cyan-500/10 text-cyan-400 rounded-md shrink-0 mt-0.5">
                  <Bell size={12} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200 block">{notif.type}</span>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{notif.message}</p>
                </div>
              </div>
              <button
                onClick={() => onClear(notif.id)}
                className="text-[10px] text-cyan-400 hover:text-white bg-cyan-600/10 hover:bg-cyan-600 border border-cyan-500/10 hover:border-cyan-500 font-bold px-2 py-1 rounded transition-colors cursor-pointer shrink-0"
              >
                Resolve
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

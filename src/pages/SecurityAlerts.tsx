import SecurityAlertsComponent from '../components/SecurityAlerts';
import NotificationPanel from '../components/NotificationPanel';

interface SecurityAlertsProps {
  notifications: any[];
  onClearNotification: (id: string) => void;
}

export default function SecurityAlerts({ notifications, onClearNotification }: SecurityAlertsProps) {
  return (
    <div className="space-y-6" id="security-alerts-page">
      <div>
        <h2 className="text-lg font-bold text-slate-100 tracking-wider">INCIDENT RESPONSE COMMAND</h2>
        <p className="text-xs text-slate-400 mt-0.5">Real-time resolution of machine-learning-flagged exceptions and travel velocities.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SecurityAlertsComponent />
        <NotificationPanel notifications={notifications || []} onClear={onClearNotification} />
      </div>
    </div>
  );
}

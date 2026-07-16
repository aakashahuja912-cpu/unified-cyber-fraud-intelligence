import ActivityLogs from '../components/ActivityLogs';

export default function AuditLogs() {
  return (
    <div className="space-y-6" id="audit-logs-page">
      <div>
        <h2 className="text-lg font-bold text-slate-100 tracking-wider">SYSTEM OPERATION LOGS & AUDITS</h2>
        <p className="text-xs text-slate-400 mt-0.5">Chronological record of security clearance entries, settings changes, and SWIFT transactions.</p>
      </div>

      <ActivityLogs />
    </div>
  );
}

import WorldMap from '../components/WorldMap';
import ThreatTimeline from '../components/ThreatTimeline';
import ThreatSeverityCard from '../components/ThreatSeverityCard';

export default function ThreatMonitoring() {
  return (
    <div className="space-y-6" id="threat-monitoring-page">
      <div>
        <h2 className="text-lg font-bold text-slate-100 tracking-wider">THREAT INTELLIGENCE AND VECTORS</h2>
        <p className="text-xs text-slate-400 mt-0.5">Continuous correlation mapping of security incidents, compromised nodes, and travel indicators.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WorldMap />
        </div>
        <div>
          <ThreatSeverityCard />
        </div>
      </div>

      <div className="pt-2">
        <ThreatTimeline />
      </div>
    </div>
  );
}

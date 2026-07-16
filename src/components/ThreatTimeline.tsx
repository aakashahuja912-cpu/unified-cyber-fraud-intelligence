import TimelineChart from '../charts/TimelineChart';

export default function ThreatTimeline() {
  return (
    <div className="bg-[#102B46] border border-slate-800 rounded-xl p-5" id="threat-timeline-component">
      <div className="pb-3 border-b border-slate-800/80 mb-4">
        <h3 className="text-sm font-bold text-slate-200 tracking-wider">Correlation Threat Sequence Timeline</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">Chronological execution sequence of network and transaction indicators.</p>
      </div>
      <TimelineChart />
    </div>
  );
}

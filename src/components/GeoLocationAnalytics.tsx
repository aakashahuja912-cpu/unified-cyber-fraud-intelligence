import { MapPin, PlaneTakeoff, ShieldAlert } from 'lucide-react';

export default function GeoLocationAnalytics() {
  const anomalies = [
    {
      user: 'Sarah Jenkins',
      origin: 'New York, USA',
      dest: 'Lagos, Nigeria',
      timeSpan: '10 minutes',
      distance: '5,000+ miles',
      velocity: '30,000 mph (Impossible)',
      status: 'Interdicted'
    },
    {
      user: 'Elena Rostova',
      origin: 'Boston, USA',
      dest: 'Nicosia, Cyprus',
      timeSpan: '35 minutes',
      distance: '4,800 miles',
      velocity: '8,200 mph (Impossible)',
      status: 'Awaiting MFA validation'
    }
  ];

  return (
    <div className="bg-[#102B46] border border-slate-800 rounded-xl p-5 space-y-4" id="geolocation-analytics-component">
      <div>
        <h3 className="text-sm font-bold text-slate-200 tracking-wider flex items-center gap-2">
          <PlaneTakeoff size={16} className="text-red-400" />
          <span>Impossible Travel Velocity Analytics</span>
        </h3>
        <p className="text-[11px] text-slate-400 mt-0.5">Automated detection of synchronized session hijacking from separate geographic coordinates.</p>
      </div>

      <div className="space-y-3">
        {anomalies.map((anom, idx) => (
          <div key={idx} className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
              <span className="text-xs font-bold text-slate-200">{anom.user}</span>
              <span className="text-[10px] bg-red-500/15 border border-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">
                {anom.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500 block">ORIGIN NODE</span>
                <span className="text-slate-300 flex items-center gap-1"><MapPin size={10} /> {anom.origin}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500 block">DESTINATION NODE</span>
                <span className="text-slate-300 flex items-center gap-1"><MapPin size={10} /> {anom.dest}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/40 text-[10px] font-semibold text-slate-400">
              <div>
                <span className="text-slate-500 block">TIME INTERVAL</span>
                <span>{anom.timeSpan}</span>
              </div>
              <div>
                <span className="text-slate-500 block">GEODESIC DISTANCE</span>
                <span>{anom.distance}</span>
              </div>
              <div>
                <span className="text-slate-500 block">VELOCITY INDEX</span>
                <span className="text-red-400 font-bold">{anom.velocity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

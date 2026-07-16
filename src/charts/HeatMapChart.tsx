export default function HeatMapChart() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['00-04', '04-08', '08-12', '12-16', '16-20', '20-24'];

  // Seed data matrix representing threat index (0-5)
  // Rows: days, Columns: hours
  const matrix = [
    [1, 0, 2, 4, 3, 2], // Mon
    [0, 1, 3, 5, 2, 1], // Tue
    [2, 2, 4, 3, 5, 4], // Wed
    [3, 1, 2, 4, 2, 3], // Thu
    [1, 0, 3, 5, 4, 5], // Fri
    [4, 3, 1, 2, 1, 2], // Sat
    [2, 4, 0, 1, 2, 3], // Sun
  ];

  const getColorClass = (value: number) => {
    switch (value) {
      case 0: return 'bg-slate-900 border-slate-800';
      case 1: return 'bg-emerald-950 text-emerald-300 border-emerald-900/30';
      case 2: return 'bg-cyan-900 text-cyan-200 border-cyan-800/30';
      case 3: return 'bg-orange-900 text-orange-200 border-orange-800/30';
      case 4: return 'bg-red-900/80 text-red-100 border-red-800/30';
      case 5: return 'bg-red-600 text-white animate-pulse border-red-500';
      default: return 'bg-slate-900 border-slate-800';
    }
  };

  const getLabel = (value: number) => {
    if (value === 5) return 'CRIT';
    if (value === 4) return 'HIGH';
    if (value === 3) return 'WARN';
    return 'OK';
  };

  return (
    <div className="w-full flex flex-col justify-between h-full py-2" id="heatmap-container">
      {/* Legend */}
      <div className="flex justify-end gap-3 text-[10px] text-slate-400 mb-4 px-1">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-slate-900 border border-slate-800 rounded"></span> Normal</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-950 rounded"></span> Low Risk</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-cyan-900 rounded"></span> Moderate</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-orange-900 rounded"></span> Elevated</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-600 rounded"></span> Critical</span>
      </div>

      <div className="grid grid-cols-[40px_1fr] gap-3">
        {/* Y Axis Days */}
        <div className="flex flex-col justify-around text-xs font-semibold text-slate-400">
          {days.map(day => (
            <div key={day} className="h-8 flex items-center">{day}</div>
          ))}
        </div>

        {/* Matrix Grid */}
        <div className="flex flex-col gap-2">
          {matrix.map((row, rIdx) => (
            <div key={rIdx} className="grid grid-cols-6 gap-2 h-8">
              {row.map((val, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`border rounded flex items-center justify-center text-[9px] font-mono font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer ${getColorClass(val)}`}
                  title={`${days[rIdx]}, Hours ${hours[cIdx]}: Threat Level ${val}/5`}
                >
                  {getLabel(val)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* X Axis Hours */}
      <div className="grid grid-cols-6 gap-2 text-[10px] text-slate-400 font-semibold pl-[40px] pt-3 text-center">
        {hours.map(hour => (
          <div key={hour}>{hour}</div>
        ))}
      </div>
    </div>
  );
}

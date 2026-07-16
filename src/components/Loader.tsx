export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[350px] space-y-4" id="cyber-loader">
      <div className="relative flex items-center justify-center">
        {/* Outer pulse */}
        <div className="absolute h-16 w-16 rounded-full border-2 border-cyan-500/10 animate-ping"></div>
        {/* Middle rotater */}
        <div className="absolute h-12 w-12 rounded-full border-2 border-t-cyan-400 border-r-transparent border-b-cyan-400/20 border-l-transparent animate-spin"></div>
        {/* Inner static core */}
        <div className="h-6 w-6 rounded-full bg-[#102B46] border border-cyan-500/30 flex items-center justify-center">
          <div className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
        </div>
      </div>
      <div className="text-center">
        <h4 className="text-xs font-bold text-slate-200 tracking-widest uppercase">Decoupling Telemetry Arrays</h4>
        <p className="text-[10px] text-slate-500 mt-0.5">FIPS 140-3 cryptography validation in progress...</p>
      </div>
    </div>
  );
}

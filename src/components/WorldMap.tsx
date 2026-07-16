import { useState } from 'react';
import { Globe, MapPin, Zap } from 'lucide-react';

export default function WorldMap() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  // Geographic coordinates mapped to SVG viewbox (1000 x 500)
  const attackNodes = [
    { id: '1', name: 'Zürich, Switzerland', x: 495, y: 165, type: 'Wire Destination', severity: 'Critical', ip: '198.51.100.42' },
    { id: '2', name: 'Lagos, Nigeria', x: 490, y: 285, type: 'Impossible Travel Login', severity: 'Critical', ip: '102.89.23.14' },
    { id: '3', name: 'Moscow, Russia', x: 560, y: 130, type: 'SSH Brute Force Host', severity: 'High', ip: '203.0.113.111' },
    { id: '4', name: 'Nicosia, Cyprus', x: 525, y: 185, type: 'Crypto OTC Transfer', severity: 'Medium', ip: '203.0.113.88' },
    { id: '5', name: 'New York, USA', x: 280, y: 175, type: 'Legitimate Head Office', severity: 'Low', ip: '192.168.1.10' }
  ];

  return (
    <div className="bg-[#102B46] border border-slate-800 rounded-xl p-6 space-y-4" id="worldmap-component">
      <div className="flex justify-between items-center pb-3 border-b border-slate-800/80">
        <div>
          <h3 className="text-sm font-bold text-slate-200 tracking-wider flex items-center gap-2">
            <Globe size={15} className="text-cyan-400" />
            <span>Interactive Cyber Attack Vector Map</span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Real-time geographic geolocation of suspicious login activity and transfer endpoints.</p>
        </div>
      </div>

      <div className="relative border border-slate-800/60 rounded-lg overflow-hidden bg-slate-950/40 p-1">
        {/* SVG Drawing container */}
        <svg viewBox="0 0 1000 500" className="w-full h-auto text-slate-800" strokeLinecap="round">
          {/* Decorative GRID lines */}
          <g stroke="#1e293b" strokeWidth="0.5" opacity="0.3">
            <line x1="100" y1="0" x2="100" y2="500" strokeDasharray="5 5" />
            <line x1="200" y1="0" x2="200" y2="500" strokeDasharray="5 5" />
            <line x1="300" y1="0" x2="300" y2="500" strokeDasharray="5 5" />
            <line x1="400" y1="0" x2="400" y2="500" strokeDasharray="5 5" />
            <line x1="500" y1="0" x2="500" y2="500" strokeDasharray="5 5" />
            <line x1="600" y1="0" x2="600" y2="500" strokeDasharray="5 5" />
            <line x1="700" y1="0" x2="700" y2="500" strokeDasharray="5 5" />
            <line x1="800" y1="0" x2="800" y2="500" strokeDasharray="5 5" />
            <line x1="900" y1="0" x2="900" y2="500" strokeDasharray="5 5" />
            
            <line x1="0" y1="100" x2="1000" y2="100" strokeDasharray="5 5" />
            <line x1="0" y1="200" x2="1000" y2="200" strokeDasharray="5 5" />
            <line x1="0" y1="300" x2="1000" y2="300" strokeDasharray="5 5" />
            <line x1="0" y1="400" x2="1000" y2="400" strokeDasharray="5 5" />
          </g>

          {/* Simple Stylized Abstract Map Outline - SVG Paths */}
          {/* North America */}
          <path d="M 120,120 L 250,80 L 320,140 L 300,240 L 180,240 L 150,170 Z" fill="none" stroke="#102b46" strokeWidth="2.5" />
          {/* South America */}
          <path d="M 280,260 L 320,290 L 340,360 L 290,440 L 270,360 Z" fill="none" stroke="#102b46" strokeWidth="2.5" />
          {/* Eurasia / Europe / Asia */}
          <path d="M 420,120 L 520,80 L 680,60 L 850,100 L 800,250 L 720,280 L 640,180 L 460,220 Z" fill="none" stroke="#102b46" strokeWidth="2.5" />
          {/* Africa */}
          <path d="M 450,230 L 540,240 L 530,340 L 490,410 L 460,320 Z" fill="none" stroke="#102b46" strokeWidth="2.5" />
          {/* Australia */}
          <path d="M 760,320 L 840,310 L 820,380 L 750,370 Z" fill="none" stroke="#102b46" strokeWidth="2.5" />

          {/* Draw connecting threat travel lines / Vectors */}
          {/* New York (280, 175) to Lagos (490, 285) - Impossible travel vector */}
          <path
            d="M 280,175 Q 380,200 490,285"
            fill="none"
            stroke="#ef4444"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="animate-pulse"
          />
          {/* Zurich (495, 165) to Moscow (560, 130) - Cyber Threat vector */}
          <path
            d="M 495,165 Q 525,140 560,130"
            fill="none"
            stroke="#f97316"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          {/* Node Pin Renderers */}
          {attackNodes.map((node) => {
            const isCritical = node.severity === 'Critical';
            const isHigh = node.severity === 'High';
            
            return (
              <g 
                key={node.id} 
                className="cursor-pointer group"
                onClick={() => setActiveNode(node.id === activeNode ? null : node.id)}
              >
                {/* Ping rings */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="12"
                  fill="transparent"
                  stroke={isCritical ? '#ef4444' : isHigh ? '#f97316' : '#06b6d4'}
                  strokeWidth="1"
                  className="animate-ping"
                  style={{ animationDuration: '2s' }}
                />
                
                {/* Pin core */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="4.5"
                  fill={isCritical ? '#ef4444' : isHigh ? '#f97316' : '#06b6d4'}
                  stroke="#071B2F"
                  strokeWidth="1.5"
                  className="transition-transform group-hover:scale-125"
                />
              </g>
            );
          })}
        </svg>

        {/* Selected Node Details HUD overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md border border-slate-800 p-3 rounded-lg max-w-xs font-mono text-[10px] space-y-1">
          {activeNode ? (() => {
            const node = attackNodes.find(n => n.id === activeNode);
            if (!node) return null;
            return (
              <>
                <div className="flex items-center gap-1.5 font-bold text-slate-100">
                  <MapPin size={10} className="text-cyan-400" />
                  <span>{node.name}</span>
                </div>
                <div className="text-slate-400">TYPE: <span className="text-cyan-300">{node.type}</span></div>
                <div className="text-slate-400">IP LOG: <span className="text-cyan-300">{node.ip}</span></div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-400">ALERT:</span>
                  <span className={`font-bold px-1 py-0.1 rounded text-[8px] uppercase ${
                    node.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                    node.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-cyan-500/20 text-cyan-400'
                  }`}>{node.severity}</span>
                </div>
              </>
            );
          })() : (
            <div className="text-slate-500">
              <span className="flex items-center gap-1.5"><Zap size={10} /> CLICK INTERCEPT NODE PIN</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

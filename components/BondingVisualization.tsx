import React from 'react';

interface BondingVisualizationProps {
  category: string;
  symbol: string;
}

export const BondingVisualization: React.FC<BondingVisualizationProps> = ({ category, symbol }) => {
  const isMetallic = category.includes('metal');
  const isNoble = category === 'noble gas';
  const isCovalent = category.includes('nonmetal') || category === 'metalloid';

  const renderMetallic = () => (
    <svg viewBox="0 0 200 120" className="w-full h-full">
      <defs>
        <radialGradient id="nucleusGrad">
          <stop offset="10%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </radialGradient>
      </defs>
      {/* Cation Grid */}
      {[0, 1, 2].map(x => [0, 1].map(y => (
        <circle key={`${x}-${y}`} cx={40 + x * 60} cy={30 + y * 60} r="12" fill="url(#nucleusGrad)" opacity="0.8">
          <animate attributeName="r" values="12;13;12" dur="3s" repeatCount="indefinite" />
        </circle>
      )))}
      {/* Sea of Electrons */}
      {[...Array(12)].map((_, i) => (
        <circle key={i} r="2" fill="#22d3ee" className="shadow-cyan-400 shadow-sm">
          <animateMotion 
            path={`M ${Math.random() * 200} ${Math.random() * 120} Q ${Math.random() * 200} ${Math.random() * 120} ${Math.random() * 200} ${Math.random() * 120} T ${Math.random() * 200} ${Math.random() * 120}`}
            dur={`${2 + Math.random() * 2}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
      <text x="10" y="110" fontSize="8" className="fill-slate-500 font-bold uppercase tracking-widest">Metallic: Sea of Electrons</text>
    </svg>
  );

  const renderCovalent = () => (
    <svg viewBox="0 0 200 120" className="w-full h-full">
      {/* Shared Orbital Path */}
      <ellipse cx="100" cy="60" rx="60" ry="30" fill="none" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="4 2" opacity="0.3" />
      
      {/* Two Atoms */}
      <circle cx="65" cy="60" r="18" fill="#1e293b" stroke="#475569" strokeWidth="2" />
      <text x="65" y="64" fontSize="10" textAnchor="middle" className="fill-white font-bold">{symbol}</text>
      
      <circle cx="135" cy="60" r="18" fill="#1e293b" stroke="#475569" strokeWidth="2" />
      <text x="135" y="64" fontSize="10" textAnchor="middle" className="fill-white font-bold">{symbol}</text>

      {/* Shared Electrons */}
      <circle r="3" fill="#22d3ee">
        <animateMotion 
          path="M 100,30 A 60,30 0 1,1 100,90 A 60,30 0 1,1 100,30"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      <circle r="3" fill="#22d3ee">
        <animateMotion 
          path="M 100,30 A 60,30 0 1,1 100,90 A 60,30 0 1,1 100,30"
          dur="2s"
          begin="1s"
          repeatCount="indefinite"
        />
      </circle>
      <text x="10" y="110" fontSize="8" className="fill-slate-500 font-bold uppercase tracking-widest">Covalent: Shared Valency</text>
    </svg>
  );

  const renderNoble = () => (
    <svg viewBox="0 0 200 120" className="w-full h-full">
      <circle cx="100" cy="60" r="25" fill="#1e293b" stroke="#6366f1" strokeWidth="2" opacity="0.6">
        <animate attributeName="cx" values="100;105;95;100" dur="5s" repeatCount="indefinite" />
        <animate attributeName="cy" values="60;55;65;60" dur="7s" repeatCount="indefinite" />
      </circle>
      <text x="100" y="65" fontSize="12" textAnchor="middle" className="fill-white font-black">{symbol}</text>
      
      {/* Repulsion field */}
      <circle cx="100" cy="60" r="45" fill="none" stroke="#6366f1" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.2">
         <animate attributeName="r" values="40;50;40" dur="3s" repeatCount="indefinite" />
      </circle>

      <text x="10" y="110" fontSize="8" className="fill-slate-500 font-bold uppercase tracking-widest">Inert: Stable Octet</text>
    </svg>
  );

  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-900/20 dark:bg-slate-950/40 rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
      {isMetallic && renderMetallic()}
      {isCovalent && renderCovalent()}
      {isNoble && renderNoble()}
      {!isMetallic && !isCovalent && !isNoble && (
         <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Complex Interaction Mapping...</div>
      )}
    </div>
  );
};
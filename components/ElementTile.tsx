
import React from 'react';
import type { ElementData } from '../types';
import { CATEGORY_COLORS, CATEGORY_GLOW_COLORS, CATEGORY_ACCENT_COLORS } from '../constants';
import { useMastery } from '../contexts/MasteryContext';

interface ElementTileProps {
  element: ElementData;
  onClick: (element: ElementData) => void;
  isDimmed: boolean;
  onHover: (element: ElementData | null) => void;
  heatmapProperty?: keyof ElementData | null;
  isResponsive?: boolean;
}

// Inset polygon to ensure vertices never touch neighbors even with small gaps
const hexagonPath = 'polygon(50% 2%, 100% 25%, 100% 75%, 50% 98%, 0% 75%, 0% 25%)';

export const ElementTile: React.FC<ElementTileProps> = ({ 
  element, 
  onClick, 
  isDimmed, 
  onHover, 
  heatmapProperty, 
  isResponsive 
}) => {
  const { isMastered } = useMastery();
  const mastered = isMastered(element.number);
  
  const colorClass = CATEGORY_COLORS[element.category] || 'bg-slate-200/40 text-slate-600 border-slate-300 dark:bg-slate-800/40 dark:text-slate-300 dark:border-slate-500/50';
  const accent = CATEGORY_ACCENT_COLORS[element.category];
  
  // Dynamic glow based on category for the hover state
  const hoverGlow = accent ? `hover:shadow-[0_0_25px_-5px_rgba(0,0,0,0.1)] hover:dark:shadow-[0_0_30px_-5px_#${accent.bg.split('-')[3]}]` : '';

  return (
    <button
      onClick={() => onClick(element)}
      onMouseEnter={() => onHover(element)}
      onMouseLeave={() => onHover(null)}
      style={{
        clipPath: hexagonPath,
        aspectRatio: '1 / 1.15'
      }}
      className={`group relative w-full transition-all duration-500 flex flex-col items-center justify-center
        ${isDimmed 
          ? 'opacity-10 scale-90 blur-[2px] grayscale pointer-events-none' 
          : 'opacity-100 scale-100 hover:scale-[1.3] hover:z-[60] cursor-pointer'
        }
      `}
    >
      {/* Outer Border Layer (Energy Frame) */}
      <div className={`absolute inset-0 border-[1.5px] ${colorClass.split(' ')[2]} opacity-40 group-hover:opacity-100 transition-opacity duration-500`} style={{ clipPath: hexagonPath }}></div>

      {/* Main Background Layer (Glass Core) */}
      <div className={`absolute inset-[1.5px] ${colorClass.split(' ')[0]} backdrop-blur-sm transition-all duration-500 group-hover:brightness-125`} style={{ clipPath: hexagonPath }}>
        {/* Top-down subtle lighting */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent dark:from-white/5 pointer-events-none"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full pb-1">
        {/* Atomic Number */}
        <span className={`absolute top-[18%] left-1/2 -translate-x-1/2 font-black transition-all duration-300
          ${isResponsive ? 'text-[clamp(6px,1vw,10px)]' : 'text-[9px]'} 
          text-slate-500 dark:text-slate-400 opacity-60 group-hover:opacity-100 group-hover:text-cyan-500 group-hover:scale-110
        `}>
          {element.number}
        </span>
        
        {/* Symbol */}
        <span className={`font-black font-ubuntu tracking-tighter transition-all duration-500 transform 
          ${isResponsive ? 'text-[clamp(12px,2.2vw,22px)]' : 'text-2xl'}
          text-slate-900 dark:text-white group-hover:scale-125 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]
        `}>
          {element.symbol}
        </span>

        {/* Atomic Mass - Primary info when not responsive */}
        {!isResponsive && (
          <span className="absolute bottom-[18%] left-1/2 -translate-x-1/2 text-[7px] font-bold opacity-40 group-hover:opacity-100 text-slate-500 dark:text-slate-400 uppercase tracking-tighter transition-opacity">
            {element.atomic_mass}
          </span>
        )}
      </div>

      {/* Interactive Spotlight Effect (Visible on Hover) */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.15),transparent_70%)]"></div>

      {/* Mastery Indicator */}
      {mastered && (
        <div className="absolute top-[32%] right-[22%] w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] group-hover:scale-150 transition-transform"></div>
      )}

      {/* Heatmap Overlay */}
      {heatmapProperty && (
        <div className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay pointer-events-none group-hover:bg-transparent transition-colors"></div>
      )}
    </button>
  );
};

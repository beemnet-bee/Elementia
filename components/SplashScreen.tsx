import React, { useEffect, useState, useMemo } from 'react';

const hexagonPath = "M50 5 L93.3 30 L93.3 80 L50 105 L6.7 80 L6.7 30 Z";

const bootLogs = [
  "Initializing Quantum Registry v2.8...",
  "Retrieving Atomic Isotope Tables...",
  "Calibrating Spectral Signatures...",
  "Synchronizing Electron Probabilities...",
  "Mapping Orbital Shell Dynamics...",
  "Consulting Neural Archive...",
  "Initializing Laboratory Grid...",
  "Stabilizing Noble Gas Buffers...",
  "Atomic Lattice Verified.",
  "System Nominal. Launching Registry."
];

const symbols = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Au', 'Pt', 'U', 'Og', 'Ts', 'Lv', 'Am', 'Pu', 'No', 'Fl', 'Ds', 'Mc', 'Nh', 'Cn', 'Rg'];

export const SplashScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const fragments = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 10 + Math.random() * 80,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 20,
      type: i % 6 === 0 ? 'symbol' : (i % 6 === 1 ? 'orbital' : (i % 6 === 2 ? 'data' : (i % 6 === 3 ? 'line' : (i % 6 === 4 ? 'dot' : 'lattice')))),
      content: symbols[i % symbols.length],
      rotation: Math.random() * 360,
      blur: Math.random() > 0.7 ? 'blur(1px)' : 'none',
      opacity: 0.1 + Math.random() * 0.4
    }));
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 20, y: (e.clientY / window.innerHeight - 0.5) * 20 });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev < 100 ? prev + 1 : 100;
        if (next === 100) {
          setTimeout(() => setIsFinishing(true), 800);
        }
        return next;
      });
    }, 35);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const logInterval = setInterval(() => {
      setLogIndex((prev) => (prev < bootLogs.length - 1 ? prev + 1 : prev));
    }, 380);
    return () => clearInterval(logInterval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-slate-100 select-none overflow-hidden font-ubuntu">
      {/* Background Layer: Dynamic Scanning Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-[-100px] opacity-[0.03] transition-transform duration-1000 ease-out"
          style={{ 
            backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            transform: `translate(${mousePos.x}px, ${mousePos.y}px)`
          }}
        ></div>
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none"></div>
        
        {/* Laser Scanning Line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent shadow-[0_0_15px_rgba(6,182,212,0.8)] animate-scan-y"></div>
      </div>

      {/* Background Particles Layer */}
      <div className="absolute inset-0 z-0 opacity-40 overflow-hidden pointer-events-none">
        {fragments.map((frag) => (
          <div
            key={frag.id}
            className="absolute animate-float-fragment"
            style={{
              left: `${frag.x}%`,
              top: `${frag.y}%`,
              animationDelay: `-${frag.delay}s`,
              animationDuration: `${frag.duration}s`,
              filter: frag.blur,
              opacity: frag.opacity
            }}
          >
            {frag.type === 'symbol' && (
              <div 
                className="flex items-center justify-center border border-cyan-500/20 bg-cyan-950/10 backdrop-blur-[1px] rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                style={{ width: frag.size, height: frag.size, transform: `rotate(${frag.rotation}deg)` }}
              >
                <span className="text-cyan-400/50 font-black text-lg">{frag.content}</span>
              </div>
            )}
            {frag.type === 'orbital' && (
              <svg width={frag.size} height={frag.size} viewBox="0 0 100 100" className="opacity-30 text-cyan-400">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" className="animate-[spin_20s_linear_infinite]" />
                <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="50" cy="10" r="2" fill="currentColor" className="animate-[spin_5s_linear_infinite]" />
              </svg>
            )}
            {frag.type === 'data' && (
              <div className="flex flex-col space-y-1 opacity-20 font-mono text-[7px] text-cyan-200">
                <span className="bg-cyan-500/20 px-1 border border-cyan-500/30">LATTICE_{Math.random().toString(36).substr(2, 4).toUpperCase()}</span>
                <div className="w-12 h-[0.5px] bg-cyan-400"></div>
                <span>VAL: {(Math.random() * 100).toFixed(2)}</span>
              </div>
            )}
            {frag.type === 'line' && (
              <div className="h-[0.5px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" style={{ width: frag.size * 3 }}></div>
            )}
            {frag.type === 'dot' && (
              <div className="w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
            )}
            {frag.type === 'lattice' && (
              <div className="opacity-10 border border-cyan-400/30 rotate-45" style={{ width: frag.size, height: frag.size }}></div>
            )}
          </div>
        ))}
      </div>

      {/* Main UI Container */}
      <div className={`relative z-10 flex flex-col items-center max-w-lg w-full px-10 transition-all duration-1000 ${isFinishing ? 'scale-125 opacity-0 blur-3xl' : 'scale-100 opacity-100 blur-0'}`}>
        
        {/* CUSTOM PROGRESS LOADER - Circular Assembly */}
        <div className="relative w-64 h-64 mb-16 flex items-center justify-center">
          {/* Animated Cinematic Logo in the center */}
          <div className="absolute z-20 scale-75 transition-transform duration-500 hover:scale-90">
            <svg viewBox="0 0 100 110" className="w-24 h-24 drop-shadow-[0_0_35px_rgba(6,182,212,0.6)]">
              <path d={hexagonPath} fill="none" stroke="rgba(34, 211, 238, 0.1)" strokeWidth="1" />
              <path d={hexagonPath} className="animate-draw-path" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeDasharray="400" strokeDashoffset="400" />
              <text x="50" y="62" className="text-center font-black fill-white text-[32px] tracking-tighter" textAnchor="middle" style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))' }}>El</text>
            </svg>
          </div>

          {/* Progress Assembly Rings */}
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
             {/* Outer Progress Ring */}
             <circle 
               cx="50" cy="50" r="48" 
               fill="none" 
               stroke="rgba(6, 182, 212, 0.05)" 
               strokeWidth="0.5"
             />
             <circle 
               cx="50" cy="50" r="48" 
               fill="none" 
               stroke="url(#progressGradient)" 
               strokeWidth="2.5" 
               strokeLinecap="round"
               strokeDasharray="301.59"
               strokeDashoffset={301.59 - (301.59 * progress / 100)}
               className="transition-all duration-300 ease-out"
             />
             
             {/* Middle Segmented Ring */}
             <circle 
               cx="50" cy="50" r="40" 
               fill="none" 
               stroke="rgba(6, 182, 212, 0.3)" 
               strokeWidth="5" 
               strokeDasharray="4 8"
               className="animate-[spin_8s_linear_infinite]"
             />
             
             {/* Inner Solid Tech Ring */}
             <circle 
               cx="50" cy="50" r="34" 
               fill="none" 
               stroke="rgba(255, 255, 255, 0.1)" 
               strokeWidth="0.5" 
             />
             <circle 
               cx="50" cy="50" r="34" 
               fill="none" 
               stroke="rgba(34, 211, 238, 0.5)" 
               strokeWidth="1.5" 
               strokeDasharray="60 15"
               className="animate-[spin_12s_linear_infinite_reverse]"
             />

             <defs>
               <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                 <stop offset="0%" stopColor="#22d3ee" />
                 <stop offset="100%" stopColor="#ffffff" />
               </linearGradient>
             </defs>
          </svg>

          {/* Glow effects around rings */}
          <div className="absolute inset-[-20px] border border-cyan-500/5 rounded-full animate-[ping_5s_linear_infinite] opacity-20"></div>
          <div className="absolute inset-[-10px] border border-cyan-500/10 rounded-full animate-[ping_4s_linear_infinite_reverse] opacity-30"></div>
          
          {/* Centered % text */}
          <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md border border-white/10 px-6 py-1.5 rounded-full shadow-lg group">
            <span className="text-[14px] font-black font-mono tracking-tighter text-white">
               {progress}% <span className="text-cyan-500 ml-1 opacity-60 group-hover:opacity-100 transition-opacity">SYNCED</span>
            </span>
          </div>
        </div>

        {/* Title Block */}
        <div className="text-center w-full space-y-3 mb-12 relative">
          <h1 className="text-6xl font-black tracking-[0.4em] text-white animate-reveal-title leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            ELEMENTIA
          </h1>
          <div className="flex items-center justify-center space-x-6 opacity-60">
             <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
             <p className="text-[10px] font-black tracking-[0.6em] text-cyan-400 uppercase animate-pulse">Astrometric Registry</p>
             <div className="h-[1px] w-12 bg-gradient-to-l from-transparent via-cyan-500 to-transparent"></div>
          </div>
          
          {/* Periodic Glitch Overlay */}
          <div className="absolute inset-0 opacity-0 animate-glitch-peek pointer-events-none flex items-center justify-center">
            <h1 className="text-6xl font-black tracking-[0.4em] text-cyan-400/20 blur-[1px]">ELEMENTIA</h1>
          </div>
        </div>

        {/* Status Logs UI */}
        <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] space-y-4 shadow-2xl">
           <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_#06b6d4]"></div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Quantum Engine Online</span>
              </div>
              <span className="text-[8px] font-mono text-cyan-400/40">MS: {Math.floor(Date.now() / 1000000)}</span>
           </div>
           
           <div className="h-8 overflow-hidden relative">
              <div className="text-[11px] font-bold text-cyan-400/90 tracking-wider h-full flex items-center animate-status-slide">
                 <span className="opacity-50 mr-2 text-[10px] font-mono">&gt;</span>
                 {bootLogs[logIndex]}
              </div>
           </div>

           <div className="flex justify-between items-center pt-3 border-t border-white/10">
              <div className="flex space-x-2">
                 {Array.from({length: 10}).map((_, i) => (
                   <div key={i} className={`w-3 h-1 rounded-full transition-all duration-700 ${progress > (i+1)*10 ? 'bg-cyan-500 shadow-[0_0_10px_#22d3ee]' : 'bg-slate-800'}`}></div>
                 ))}
              </div>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">CORE REV 2.8.4</span>
           </div>
        </div>
      </div>

      <style>{`
        .bg-radial-vignette {
          background: radial-gradient(circle at center, transparent 0%, rgba(2, 6, 23, 0.4) 70%, rgba(2, 6, 23, 0.9) 100%);
        }
        @keyframes scan-y {
          0% { top: -10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
        .animate-scan-y { animation: scan-y 6s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        
        @keyframes float-fragment {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translate(120px, -300px) rotate(90deg); opacity: 0; }
        }
        @keyframes glitch-peek {
          0%, 94%, 100% { opacity: 0; transform: scale(1); }
          95% { opacity: 1; transform: scale(1.02) skewX(2deg); }
          96% { opacity: 0.5; transform: scale(0.98) skewX(-2deg); }
          97% { opacity: 1; transform: scale(1.01); }
        }
        .animate-glitch-peek { animation: glitch-peek 4s infinite; }
        
        @keyframes draw-path { to { stroke-dashoffset: 0; } }
        @keyframes reveal-title {
          from { letter-spacing: -0.2em; opacity: 0; filter: blur(20px); transform: translateY(30px); }
          to { letter-spacing: 0.4em; opacity: 1; filter: blur(0); transform: translateY(0); }
        }
        @keyframes status-slide {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-float-fragment { animation: float-fragment linear infinite; }
        .animate-draw-path { animation: draw-path 3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-reveal-title { animation: reveal-title 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-status-slide { animation: status-slide 0.3s cubic-bezier(0, 0.55, 0.45, 1); }
      `}</style>
    </div>
  );
};
import React from 'react';

const nobleGasConfig: Record<string, number[]> = {
  He: [2],
  Ne: [2, 8],
  Ar: [2, 8, 8],
  Kr: [2, 8, 18, 8],
  Xe: [2, 8, 18, 18, 8],
  Rn: [2, 8, 18, 32, 18, 8],
  Og: [2, 8, 18, 32, 32, 18, 8],
};

const superscriptDigits: Record<string, string> = {
    '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9'
};

const normalizeSuperscripts = (text: string): string => {
    return text.split('').map(char => superscriptDigits[char] || char).join('');
}

const parseElectronConfigurationToShells = (configStr: string): number[] => {
  let shells: number[] = [];
  let config = normalizeSuperscripts(configStr);

  const coreMatch = config.match(/\[(\w+)\]/);
  if (coreMatch) {
    const core = coreMatch[1];
    if (nobleGasConfig[core]) {
      shells = [...nobleGasConfig[core]];
    }
    config = config.replace(coreMatch[0], '').trim();
  }
  
  const orbitals = config.match(/\d[spdfg]\d{1,2}/g) || [];
  orbitals.forEach((orbital: string) => {
    const shellNumber = parseInt(orbital[0], 10);
    const electronsString = orbital.substring(2);
    const electrons = parseInt(electronsString, 10);

    while (shells.length < shellNumber) {
      shells.push(0);
    }
    shells[shellNumber - 1] = (shells[shellNumber - 1] || 0) + electrons;
  });

  return shells.filter(count => count > 0);
};

interface AtomAnimationProps {
  electron_configuration: string;
  animationsEnabled?: boolean;
}

export const AtomAnimation: React.FC<AtomAnimationProps> = ({ electron_configuration, animationsEnabled = true }) => {
  const shells = parseElectronConfigurationToShells(electron_configuration);
  const nucleusColor = '#22d3ee';
  
  return (
    <div className="relative w-full h-full min-h-[250px] flex items-center justify-center perspective-1000">
      {/* Nucleus with Glow */}
      <div 
        className={`w-6 h-6 rounded-full z-10 ${animationsEnabled ? 'animate-pulse' : ''}`} 
        style={{ 
          backgroundColor: nucleusColor,
          boxShadow: `0 0 30px ${nucleusColor}, 0 0 60px ${nucleusColor}44` 
        }}
      ></div>
      
      {/* Orbits and Electrons */}
      {shells.map((electronCount, shellIndex) => {
        if (electronCount === 0) return null;
        const orbitSize = (shellIndex + 1) * 35 + 40;
        const orbitDuration = (shellIndex + 1) * 3 + 2;
        
        return (
          <div 
            key={shellIndex}
            className={`absolute border border-slate-700/40 rounded-full ${animationsEnabled ? 'animate-spin-orbit' : ''}`}
            style={{
              width: `${orbitSize}px`,
              height: `${orbitSize}px`,
              animationDuration: `${orbitDuration}s`,
              animationDirection: shellIndex % 2 === 0 ? 'normal' : 'reverse',
              transform: animationsEnabled ? undefined : 'rotate3d(1, 0.5, 0.2, 45deg)'
            }}
          >
            {Array.from({ length: electronCount }).map((_, electronIndex) => {
              const angle = (360 / electronCount) * electronIndex;
              return (
                <div 
                  key={electronIndex}
                  className="absolute top-1/2 left-1/2 w-2 h-2 -m-[4px]"
                  style={{ transform: `rotate(${angle}deg) translate(${orbitSize / 2}px)` }}
                >
                  <div 
                    className="w-full h-full rounded-full shadow-[0_0_8px_#fff]"
                    style={{
                      backgroundColor: '#fff',
                      opacity: 0.8
                    }}
                  ></div>
                </div>
              );
            })}
          </div>
        );
      })}
       <style>{`
        @keyframes spin-orbit {
          from { transform: rotate3d(1, 0.5, 0.2, 0deg); }
          to { transform: rotate3d(1, 0.5, 0.2, 360deg); }
        }
        .animate-spin-orbit {
          animation: spin-orbit linear infinite;
        }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
};
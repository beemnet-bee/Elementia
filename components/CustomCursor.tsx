
import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
      
      // Update dot position immediately
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('cursor-pointer');
      
      setIsHovering(!!isInteractive);
    };

    const animateRing = () => {
      // Smooth interpolation for the outer ring (elastic feel)
      const ease = 0.18; // Slightly faster for more responsive tracking
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ease;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ease;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', onMouseOver);
    const animId = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* Precision Core - Larger and high contrast */}
      <div 
        ref={dotRef}
        className={`fixed top-0 left-0 w-2.5 h-2.5 -ml-[5px] -mt-[5px] rounded-full bg-white shadow-[0_0_15px_#06b6d4,0_0_5px_#06b6d4] ring-2 ring-cyan-500 transition-transform duration-75 ease-out`}
      />

      {/* Fluid Ring - More visible borders and subtle fill */}
      <div 
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border-2 border-cyan-400/50 transition-all duration-300 ease-out flex items-center justify-center
          ${isHovering 
            ? 'w-14 h-14 -ml-7 -mt-7 border-cyan-300 bg-cyan-400/10 scale-110 shadow-[0_0_20px_rgba(34,211,238,0.3)]' 
            : 'w-10 h-10 -ml-5 -mt-5 bg-cyan-400/5'
          }
          ${isClicking ? 'scale-75 opacity-80' : 'scale-100'}
        `}
      >
        {/* Techy Brackets (Enhanced on hover) */}
        {isHovering && (
          <>
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400 rounded-tl-sm animate-pulse" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400 rounded-tr-sm animate-pulse" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400 rounded-bl-sm animate-pulse" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400 rounded-br-sm animate-pulse" />
          </>
        )}
      </div>

      {/* Click Shockwave */}
      {isClicking && (
        <div 
          className="fixed top-0 left-0 w-24 h-24 -ml-12 -mt-12 rounded-full border-2 border-cyan-400 animate-shockwave"
          style={{ transform: `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)` }}
        />
      )}

      <style>{`
        @keyframes shockwave {
          0% { transform: scale(0.1); opacity: 1; border-width: 6px; }
          100% { transform: scale(1.8); opacity: 0; border-width: 0.5px; }
        }
        .animate-shockwave {
          animation: shockwave 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

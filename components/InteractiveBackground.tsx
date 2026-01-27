
import React, { useEffect, useRef, useMemo } from 'react';

const SYMBOLS = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Au', 'Pt', 'U', 'Og', 'Ts', 'Lv'];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  symbol: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  type: 'symbol' | 'orbital';
}

export const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  
  const particles = useMemo(() => {
    const p: Particle[] = [];
    for (let i = 0; i < 45; i++) {
      p.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: 15 + Math.random() * 25,
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        opacity: 0.05 + Math.random() * 0.15,
        type: Math.random() > 0.8 ? 'orbital' : 'symbol'
      });
    }
    return p;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      timeRef.current += 0.015;
      
      // Background Environment (Particles) - No longer reacting to mouse
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Bounce off walls
        if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
        if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        if (p.type === 'symbol') {
          ctx.font = `bold ${p.size}px Ubuntu`;
          ctx.fillStyle = '#06b6d4';
          ctx.fillText(p.symbol, -p.size/2, p.size/2);
        } else {
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particles]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[5]"
      style={{ filter: 'none' }}
    />
  );
};

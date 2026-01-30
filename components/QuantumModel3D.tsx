
import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

interface QuantumModel3DProps {
  electrons: number;
  config: string;
  color?: string;
  meltingPoint?: number | string;
  boilingPoint?: number | string;
  density?: number | string;
  electronegativity?: number | string;
}

export const QuantumModel3D: React.FC<QuantumModel3DProps> = ({ 
  electrons, 
  config, 
  color = '#22d3ee',
  meltingPoint,
  boilingPoint,
  density,
  electronegativity
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  // External zoom target reference for the Three.js loop
  const zoomTargetRef = useRef(20);

  const handleZoomIn = useCallback(() => {
    zoomTargetRef.current = Math.max(8, zoomTargetRef.current - 4);
  }, []);

  const handleZoomOut = useCallback(() => {
    zoomTargetRef.current = Math.min(48, zoomTargetRef.current + 4);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-' || e.key === '_') handleZoomOut();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleZoomIn, handleZoomOut]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Simulated initialization progress
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 55;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
        setTimeout(() => setIsReady(true), 150);
      }
      setLoadingProgress(Math.floor(prog));
    }, 30);

    // --- Setup Scene ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 65; // Start further out for cinematic approach

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
      logarithmicDepthBuffer: true,
      powerPreference: 'high-performance' 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.4;
    containerRef.current.appendChild(renderer.domElement);

    // --- Container Group ---
    const atomGroup = new THREE.Group();
    scene.add(atomGroup);

    // --- Holographic Bounding Box ---
    const cageGeo = new THREE.BoxGeometry(26, 26, 26);
    const cageEdges = new THREE.EdgesGeometry(cageGeo);
    const cageMat = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.02 });
    const cage = new THREE.LineSegments(cageEdges, cageMat);
    scene.add(cage);

    // --- Advanced Laboratory Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);
    
    const rimLight = new THREE.PointLight(0xffffff, 20, 150);
    rimLight.position.set(20, 20, -20);
    scene.add(rimLight);

    const mainKeyLight = new THREE.PointLight(color, 28, 120);
    mainKeyLight.position.set(-15, 25, 20);
    scene.add(mainKeyLight);

    // --- Shared Geometries (Optimization) ---
    const particleGeo = new THREE.IcosahedronGeometry(0.4, 1);
    const electronGeo = new THREE.SphereGeometry(0.26, 12, 12);
    const electronGlowGeo = new THREE.SphereGeometry(0.7, 12, 12);
    const cloudGeoBase = new THREE.SphereGeometry(1, 24, 24);
    const ringGeoBase = new THREE.TorusGeometry(1, 0.008, 6, 128);

    // --- Nucleus (High-Fidelity Cluster) ---
    const nucleusGroup = new THREE.Group();
    atomGroup.add(nucleusGroup);

    const protonMat = new THREE.MeshPhysicalMaterial({ 
      color: '#ff4444', 
      emissive: '#aa0000', 
      emissiveIntensity: 1.6,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1.0
    });
    
    const neutronMat = new THREE.MeshPhysicalMaterial({ 
      color: '#7f8ea3', 
      metalness: 0.1, 
      roughness: 0.9,
      sheen: 0.9
    });

    const clusterSize = Math.min(electrons, 45);
    for (let i = 0; i < clusterSize; i++) {
      const isProton = i % 2 === 0;
      const mesh = new THREE.Mesh(particleGeo, isProton ? protonMat : neutronMat);
      
      const phi = Math.acos(-1 + (2 * i) / clusterSize);
      const theta = Math.sqrt(clusterSize * Math.PI) * phi;
      const r = 1.15 * Math.pow(Math.random(), 0.4);
      
      mesh.position.set(
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(phi)
      );
      mesh.rotation.set(Math.random(), Math.random(), Math.random());
      nucleusGroup.add(mesh);
    }

    const nucleusGlowCore = new THREE.Mesh(
      new THREE.SphereGeometry(1.9, 16, 16),
      new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.18, side: THREE.BackSide })
    );
    nucleusGroup.add(nucleusGlowCore);

    const nucleusGlowHalo = new THREE.Mesh(
      new THREE.SphereGeometry(2.8, 16, 16),
      new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.05, side: THREE.BackSide })
    );
    nucleusGroup.add(nucleusGlowHalo);

    // --- Orbital Shells (CO-PLANAR CONFIGURATION) ---
    const shellCounts = [2, 8, 18, 32, 32, 18, 8]; 
    const electronMeshes: { mesh: THREE.Group, angle: number, speed: number, radius: number }[] = [];

    let totalRemaining = electrons;
    for (let i = 0; i < shellCounts.length && totalRemaining > 0; i++) {
      const currentShellCount = Math.min(totalRemaining, shellCounts[i]);
      const radius = 5.5 + i * 3.0;
      
      const shellGroup = new THREE.Group();
      atomGroup.add(shellGroup);

      // Force shell group to be exactly co-planar on the horizontal plane
      shellGroup.rotation.x = Math.PI / 2; 

      // Probability Cloud (Disk approximation)
      const cloud = new THREE.Mesh(cloudGeoBase, new THREE.MeshBasicMaterial({ 
        color: color, 
        transparent: true, 
        opacity: 0.005,
        wireframe: i % 2 === 0,
        blending: THREE.AdditiveBlending
      }));
      cloud.scale.set(radius, radius, 0.1); // Squashed sphere to look like an orbital cloud
      shellGroup.add(cloud);

      // Orbital Ring
      const orbitalRing = new THREE.Mesh(ringGeoBase, new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.12 }));
      orbitalRing.scale.set(radius, radius, 1);
      shellGroup.add(orbitalRing);

      for (let j = 0; j < currentShellCount; j++) {
        const eGroup = new THREE.Group();
        
        const electron = new THREE.Mesh(electronGeo, new THREE.MeshStandardMaterial({ 
          color: color, 
          emissive: color, 
          emissiveIntensity: 4.5,
          metalness: 0.95,
          roughness: 0.1
        }));
        eGroup.add(electron);

        const eGlow = new THREE.Mesh(electronGlowGeo, new THREE.MeshBasicMaterial({ 
          color: color, 
          transparent: true, 
          opacity: 0.5, 
          blending: THREE.AdditiveBlending 
        }));
        eGroup.add(eGlow);
        
        const angle = (j / currentShellCount) * Math.PI * 2;
        const speed = 0.002 + (1 / (radius * 1.8)) * 0.045;
        
        electronMeshes.push({ mesh: eGroup, angle, speed, radius });
        shellGroup.add(eGroup);
      }
      totalRemaining -= currentShellCount;
    }

    // Nice default tilt
    atomGroup.rotation.x = 0.45;
    atomGroup.rotation.y = 0.45;

    // --- Interaction ---
    let isDragging = false;
    let previousPointerPosition = { x: 0, y: 0 };
    let rotationVelocity = { x: 0, y: 0 };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousPointerPosition = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousPointerPosition.x;
      const deltaY = e.clientY - previousPointerPosition.y;
      
      atomGroup.rotation.y += deltaX * 0.007;
      atomGroup.rotation.x += deltaY * 0.007;
      
      rotationVelocity.y = deltaX * 0.004;
      rotationVelocity.x = deltaY * 0.004;
      
      previousPointerPosition = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => isDragging = false;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomTargetRef.current += e.deltaY * 0.015;
      zoomTargetRef.current = Math.max(8, Math.min(zoomTargetRef.current, 50));
    };

    const container = containerRef.current;
    container.addEventListener('pointerdown', handlePointerDown);
    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    const clock = new THREE.Clock();
    let animFrameId: number;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      
      if (isReady) {
        camera.position.z += (zoomTargetRef.current - camera.position.z) * 0.12;
      }

      if (!isDragging) {
        atomGroup.rotation.y += rotationVelocity.y;
        atomGroup.rotation.x += rotationVelocity.x;
        rotationVelocity.x *= 0.95;
        rotationVelocity.y *= 0.95;
      }

      // Smooth Nucleus Vibration
      nucleusGroup.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh && child !== nucleusGlowCore && child !== nucleusGlowHalo) {
          const shift = 0.004 * Math.sin(time * 3 + i);
          child.position.x += shift;
          child.position.y += shift * 0.4;
        }
      });
      
      const glowScale = 1 + Math.sin(time * 2.8) * 0.08;
      nucleusGlowCore.scale.setScalar(glowScale);
      nucleusGlowHalo.scale.setScalar(glowScale * 1.15);

      // Co-Planar Electron Dynamics
      electronMeshes.forEach((e, idx) => {
        e.angle += e.speed;
        e.mesh.position.set(
          Math.cos(e.angle) * e.radius,
          Math.sin(e.angle) * e.radius,
          0 // Locked to shell group plane
        );
        
        const pulse = 0.8 + Math.sin(time * 8.0 + (idx * 0.3)) * 0.3;
        e.mesh.children[1].scale.setScalar(pulse);
        (e.mesh.children[1].material as THREE.MeshBasicMaterial).opacity = 0.25 + pulse * 0.25;
      });

      cage.rotation.y = time * 0.035;
      cage.rotation.z = time * 0.018;

      renderer.render(scene, camera);
    };
    animate();

    const resize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', resize);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animFrameId);
      container.removeEventListener('pointerdown', handlePointerDown);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', resize);
      if (containerRef.current) {
        try { containerRef.current.removeChild(renderer.domElement); } catch(e) {}
      }
      
      scene.clear();
      renderer.dispose();
      particleGeo.dispose();
      electronGeo.dispose();
      electronGlowGeo.dispose();
      cloudGeoBase.dispose();
      ringGeoBase.dispose();
      cageEdges.dispose();
      cageGeo.dispose();
      protonMat.dispose();
      neutronMat.dispose();
      cageMat.dispose();
    };
  }, [electrons, config, color, isReady]);

  return (
    <div className="w-full h-full relative group bg-black/40 rounded-[3.5rem] overflow-hidden shadow-2xl border border-white/5">
      {/* Cinematic Loading Overlay */}
      {!isReady && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-6 bg-slate-950/95 backdrop-blur-2xl">
          <div className="relative w-16 h-16">
             <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
             <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin shadow-[0_0_15px_#22d3ee]"></div>
          </div>
          <div className="flex flex-col items-center space-y-3">
            <span className="text-[12px] font-black uppercase tracking-[0.8em] text-cyan-400">Atomic Forge Engine</span>
            <div className="w-56 h-0.5 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyan-500 shadow-[0_0_10px_#22d3ee] transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <p className="text-[9px] font-bold text-slate-500 font-mono uppercase tracking-[0.4em]">{loadingProgress}% CALIBRATED</p>
          </div>
        </div>
      )}

      {/* Interface HUD */}
      {isReady && (
        <div className="absolute inset-0 z-10 pointer-events-none p-10 flex flex-col justify-between">
          <div className="flex justify-between items-start animate-fade-in">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}` }}></div>
                  <span className="text-[11px] font-black uppercase tracking-[0.6em] text-white/90">Lattice System: Active</span>
                </div>
                <div className="text-[10px] font-mono font-bold text-slate-500 tracking-[0.3em]">RENDER v3.5 // GPU-ACCEL</div>
              </div>
            </div>
            
            <div className="text-right flex flex-col items-end space-y-6">
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-60">Optics Module</div>
                <div className="flex justify-end space-x-1.5 opacity-20">
                   {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="w-0.5 h-4 bg-white" style={{ height: `${Math.random() * 20 + 5}px` }}></div>)}
                </div>
              </div>
              
              {/* Unified Zoom Control Set */}
              <div className="flex flex-col items-center p-2 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 pointer-events-auto shadow-2xl space-y-2">
                 <button 
                    onClick={handleZoomIn}
                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white hover:bg-cyan-500/40 hover:border-cyan-500/50 transition-all active:scale-90 group relative"
                    title="Zoom In (+)"
                 >
                   <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                 </button>
                 
                 <div className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 py-1">Zoom</div>
                 
                 <button 
                    onClick={handleZoomOut}
                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white hover:bg-cyan-500/40 hover:border-cyan-500/50 transition-all active:scale-90 group relative"
                    title="Zoom Out (-)"
                 >
                   <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg>
                 </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-end animate-fade-in-delayed">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-x-10 gap-y-6 bg-black/70 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group/hud">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                <HUDItem label="MP" value={meltingPoint} unit="K" color={color} />
                <HUDItem label="BP" value={boilingPoint} unit="K" color={color} />
                <HUDItem label="DENS" value={density} unit="g/cm³" color={color} />
                <HUDItem label="NEG" value={electronegativity} unit="χ" color={color} />
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mb-2">Planar Lock Status</span>
                <div className="flex space-x-1.5">
                   {[1,2,3,4,5,6].map(i => <div key={i} className="w-1.5 h-4 rounded-full opacity-30 bg-cyan-400 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>)}
                </div>
              </div>
              <div className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600 text-right max-w-[160px] leading-relaxed">
                XZ-AXIS COORDINATE RESTRICTION: SYNCED
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rendering Surface */}
      <div 
        ref={containerRef} 
        className={`w-full h-full cursor-grab active:cursor-grabbing touch-none transition-all duration-1000 ${isReady ? 'opacity-100' : 'opacity-0 scale-95 blur-xl'}`} 
      />
      
      {/* Spectral Overlay */}
      {isReady && (
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none overflow-hidden opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
             <path d="M0,50 Q125,5 250,50 T500,50 T750,50 T1000,50" fill="none" stroke={color} strokeWidth="3">
                <animate attributeName="d" values="M0,50 Q125,5 250,50 T500,50 T750,50 T1000,50; M0,50 Q125,95 250,50 T500,50 T750,50 T1000,50; M0,50 Q125,5 250,50 T500,50 T750,50 T1000,50" dur="10s" repeatCount="indefinite" />
             </path>
          </svg>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-15px); filter: blur(15px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes fade-in-delayed {
          from { opacity: 0; transform: translateY(15px); filter: blur(15px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-fade-in { animation: fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-delayed { animation: fade-in-delayed 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

const HUDItem = ({ label, value, unit, color }: { label: string; value?: any; unit: string; color: string }) => (
  <div className="flex flex-col group/hud-item">
    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2 group-hover/hud-item:text-cyan-400 transition-colors">{label}</span>
    <div className="flex items-baseline space-x-2">
      <span className="text-lg font-mono font-black" style={{ color: color }}>{value ?? '--'}</span>
      <span className="text-[10px] font-bold text-slate-600 opacity-60 uppercase">{unit}</span>
    </div>
  </div>
);

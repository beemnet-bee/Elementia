
import React, { useEffect, useRef, useState } from 'react';
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

  useEffect(() => {
    if (!containerRef.current) return;

    // Simulated initialization progress
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 40;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
        setTimeout(() => setIsReady(true), 200);
      }
      setLoadingProgress(Math.floor(prog));
    }, 50);

    // --- Setup Scene ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    // Start camera far away for cinematic zoom-in
    camera.position.z = 40;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // --- Container Group ---
    const atomGroup = new THREE.Group();
    scene.add(atomGroup);

    // --- Holographic Cage (Containment Field) ---
    const cageGeo = new THREE.BoxGeometry(20, 20, 20);
    const cageEdges = new THREE.EdgesGeometry(cageGeo);
    const cageMat = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.05 });
    const cage = new THREE.LineSegments(cageEdges, cageMat);
    scene.add(cage);

    // --- Cinematic Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const keyLight = new THREE.PointLight(0xffffff, 15, 100);
    keyLight.position.set(15, 20, 15);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(color, 8, 100);
    fillLight.position.set(-15, -10, -15);
    scene.add(fillLight);

    // --- Nucleus (Proton/Neutron Cluster) ---
    const nucleusGroup = new THREE.Group();
    atomGroup.add(nucleusGroup);

    const protonMat = new THREE.MeshStandardMaterial({ 
      color: '#ef4444', 
      emissive: '#7f1d1d', 
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1
    });
    
    const neutronMat = new THREE.MeshStandardMaterial({ 
      color: '#94a3b8', 
      metalness: 0.4,
      roughness: 0.6
    });

    const particleGeo = new THREE.IcosahedronGeometry(0.38, 1);
    
    const clusterSize = Math.min(electrons, 45); 
    for (let i = 0; i < clusterSize; i++) {
      const isProton = i % 2 === 0;
      const mesh = new THREE.Mesh(particleGeo, isProton ? protonMat : neutronMat);
      
      const phi = Math.acos(-1 + (2 * i) / clusterSize);
      const theta = Math.sqrt(clusterSize * Math.PI) * phi;
      const r = 0.9 * Math.pow(Math.random(), 0.5);
      
      mesh.position.set(
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(phi)
      );
      nucleusGroup.add(mesh);
    }

    const nucleusGlow = new THREE.Mesh(
      new THREE.SphereGeometry(1.6, 32, 32),
      new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.08, side: THREE.BackSide })
    );
    nucleusGroup.add(nucleusGlow);

    // --- Orbits and Electrons ---
    const shellCounts = [2, 8, 18, 32, 32, 18, 8]; 
    const electronMeshes: { mesh: THREE.Group, angle: number, speed: number, radius: number }[] = [];

    let totalRemaining = electrons;
    for (let i = 0; i < shellCounts.length && totalRemaining > 0; i++) {
      const currentShellCount = Math.min(totalRemaining, shellCounts[i]);
      const radius = 4.5 + i * 2.4;
      
      const shellGroup = new THREE.Group();
      atomGroup.add(shellGroup);

      // Random fixed tilt for variety
      shellGroup.rotation.x = (Math.random() - 0.5) * 0.4;
      shellGroup.rotation.z = (Math.random() - 0.5) * 0.4;

      // Probability Cloud (Faint mesh)
      const cloudGeo = new THREE.SphereGeometry(radius, 32, 32);
      const cloudMat = new THREE.MeshBasicMaterial({ 
        color: color, 
        transparent: true, 
        opacity: 0.015,
        wireframe: i % 2 === 0
      });
      const cloud = new THREE.Mesh(cloudGeo, cloudMat);
      shellGroup.add(cloud);

      const torusGeometry = new THREE.TorusGeometry(radius, 0.012, 8, 160);
      const torusMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.1 });
      const orbitalRing = new THREE.Mesh(torusGeometry, torusMaterial);
      orbitalRing.rotation.x = Math.PI / 2;
      shellGroup.add(orbitalRing);

      for (let j = 0; j < currentShellCount; j++) {
        const eGroup = new THREE.Group();
        
        const electronGeo = new THREE.SphereGeometry(0.24, 20, 20);
        const electronMat = new THREE.MeshStandardMaterial({ 
          color: color, 
          emissive: color, 
          emissiveIntensity: 3,
          metalness: 0.7,
          roughness: 0.2
        });
        const electron = new THREE.Mesh(electronGeo, electronMat);
        eGroup.add(electron);

        const eGlow = new THREE.Mesh(
          new THREE.SphereGeometry(0.65, 12, 12),
          new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.4 })
        );
        eGroup.add(eGlow);
        
        const angle = (j / currentShellCount) * Math.PI * 2;
        const speed = 0.0035 + (1 / (radius * 1.8)) * 0.04;
        
        electronMeshes.push({ mesh: eGroup, angle, speed, radius });
        shellGroup.add(eGroup);
      }
      totalRemaining -= currentShellCount;
    }

    // --- Interaction & Controls ---
    let isDragging = false;
    let previousPointerPosition = { x: 0, y: 0 };
    let rotationVelocity = { x: 0, y: 0 };
    let zoomTarget = 16;

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousPointerPosition = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousPointerPosition.x;
      const deltaY = e.clientY - previousPointerPosition.y;
      
      atomGroup.rotation.y += deltaX * 0.006;
      atomGroup.rotation.x += deltaY * 0.006;
      
      rotationVelocity.y = deltaX * 0.003;
      rotationVelocity.x = deltaY * 0.003;
      
      previousPointerPosition = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => isDragging = false;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomTarget += e.deltaY * 0.02;
      zoomTarget = Math.max(8, Math.min(zoomTarget, 35));
    };

    const container = containerRef.current;
    container.addEventListener('pointerdown', handlePointerDown);
    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      const delta = clock.getDelta();

      // Smooth Cinematic Entrance & Zoom
      if (isReady) {
        camera.position.z += (zoomTarget - camera.position.z) * 0.05;
      }

      if (!isDragging) {
        atomGroup.rotation.y += rotationVelocity.y;
        atomGroup.rotation.x += rotationVelocity.x;
        rotationVelocity.x *= 0.95;
        rotationVelocity.y *= 0.95;
      }

      // Subatomic Jitter Simulation
      nucleusGroup.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh && child !== nucleusGlow) {
          const jitter = 0.0015;
          child.position.x += (Math.random() - 0.5) * jitter;
          child.position.y += (Math.random() - 0.5) * jitter;
          child.position.z += (Math.random() - 0.5) * jitter;
        }
      });
      
      nucleusGlow.scale.setScalar(1 + Math.sin(time * 3) * 0.08);

      electronMeshes.forEach(e => {
        e.angle += e.speed;
        e.mesh.position.set(
          Math.cos(e.angle) * e.radius,
          0, 
          Math.sin(e.angle) * e.radius
        );
        // Electron pulse effect
        e.mesh.children[1].scale.setScalar(1 + Math.sin(time * 15 + e.angle) * 0.5);
      });

      cage.rotation.y = time * 0.05;
      cage.rotation.z = time * 0.03;

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
      container.removeEventListener('pointerdown', handlePointerDown);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', resize);
      if (containerRef.current) {
        try { containerRef.current.removeChild(renderer.domElement); } catch(e) {}
      }
      scene.clear();
    };
  }, [electrons, config, color]);

  return (
    <div className="w-full h-full relative group bg-black/20 rounded-[3rem] overflow-hidden">
      {/* Loading Overlay */}
      {!isReady && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-4 bg-slate-900/60 backdrop-blur-md">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400">Atomic Reconstruction</span>
          </div>
          <div className="w-56 h-1 bg-white/5 rounded-full overflow-hidden border border-white/10 shadow-inner">
            <div 
              className="h-full bg-cyan-500 shadow-[0_0_15px_#22d3ee] transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between w-56 text-[10px] font-black font-mono text-slate-400">
            <span>PROBING LATTICE</span>
            <span>{loadingProgress}%</span>
          </div>
        </div>
      )}

      {/* Enhanced Technical HUD */}
      {isReady && (
        <div className="absolute inset-0 z-10 pointer-events-none p-8 flex flex-col justify-between">
          <div className="flex justify-between items-start animate-fade-in">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></div>
                  <span className="text-[9px] font-black uppercase tracking-[0.5em] opacity-60">Status: Nominal</span>
                </div>
                <div className="text-[10px] font-mono font-bold opacity-30 tracking-widest">Q-CORE SECURE // v3.0.4</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/5 space-y-2">
                 <span className="text-[7px] font-black uppercase tracking-widest opacity-40">Binding Energy</span>
                 <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 animate-pulse" style={{ width: '85%' }}></div>
                 </div>
              </div>
            </div>
            
            <div className="text-right space-y-4">
              <div className="space-y-1">
                <div className="text-[9px] font-black uppercase tracking-widest opacity-40">Wavefunction Probe</div>
                <div className="flex justify-end space-x-1 opacity-20">
                   {[1,2,3,4,5,6].map(i => <div key={i} className="w-0.5 h-4 bg-white" style={{ height: `${Math.random() * 15 + 5}px` }}></div>)}
                </div>
              </div>
              <div className="flex justify-end space-x-3 opacity-40">
                 <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                    <span className="text-[8px] font-black">P+</span>
                 </div>
                 <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                    <span className="text-[8px] font-black">N⁰</span>
                 </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-end animate-fade-in-delayed">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 bg-white/5 dark:bg-black/30 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10 shadow-2xl">
                <HUDItem label="Melting" value={meltingPoint} unit="K" color={color} />
                <HUDItem label="Boiling" value={boilingPoint} unit="K" color={color} />
                <HUDItem label="Density" value={density} unit="g/cm³" color={color} />
                <HUDItem label="Electro" value={electronegativity} unit="χ" color={color} />
              </div>
              <div className="flex items-center space-x-3 opacity-20 ml-2">
                 <div className="w-24 h-[1px] bg-white"></div>
                 <span className="text-[8px] font-black uppercase tracking-widest">Analytics End</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-3">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40 mb-1">Scale Control</span>
                <div className="flex space-x-1">
                   {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-4 rounded-full opacity-20" style={{ backgroundColor: color }}></div>)}
                </div>
              </div>
              <div className="text-[8px] font-black uppercase tracking-[0.2em] opacity-30 text-right max-w-[120px]">
                USE WHEEL TO ZOOM DEPTH LATTICE
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Model Rendering Surface */}
      <div 
        ref={containerRef} 
        className={`w-full h-full cursor-grab active:cursor-grabbing touch-none transition-all duration-1000 ${isReady ? 'opacity-100' : 'opacity-0 scale-75'}`} 
      />
      
      {/* Dynamic Spectrum Wave (Bottom Overlay) */}
      {isReady && (
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none overflow-hidden opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
             <path d="M0,50 Q125,10 250,50 T500,50 T750,50 T1000,50" fill="none" stroke={color} strokeWidth="2">
                <animate attributeName="d" values="M0,50 Q125,10 250,50 T500,50 T750,50 T1000,50; M0,50 Q125,90 250,50 T500,50 T750,50 T1000,50; M0,50 Q125,10 250,50 T500,50 T750,50 T1000,50" dur="4s" repeatCount="indefinite" />
             </path>
          </svg>
        </div>
      )}

      {isReady && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-60 transition-opacity pointer-events-none">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Quantum Manipulation Active</span>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-15px); filter: blur(10px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes fade-in-delayed {
          from { opacity: 0; transform: translateY(15px); filter: blur(10px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-fade-in { animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-delayed { animation: fade-in-delayed 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

const HUDItem = ({ label, value, unit, color }: { label: string; value?: any; unit: string; color: string }) => (
  <div className="flex flex-col group/hud">
    <span className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1 group-hover/hud:text-white transition-colors">{label}</span>
    <div className="flex items-baseline space-x-1.5">
      <span className="text-sm font-mono font-black" style={{ color: color }}>{value ?? '--'}</span>
      <span className="text-[8px] font-bold opacity-30">{unit}</span>
    </div>
  </div>
);


import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface QuantumModel3DProps {
  electrons: number;
  config: string;
  color?: string;
}

export const QuantumModel3D: React.FC<QuantumModel3DProps> = ({ electrons, config, color = '#22d3ee' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Simulated initialization progress
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 25;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
        setTimeout(() => setIsReady(true), 150);
      }
      setLoadingProgress(Math.floor(prog));
    }, 80);

    // --- Setup Scene ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // --- Container Group ---
    const atomGroup = new THREE.Group();
    scene.add(atomGroup);

    // --- Cinematic Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const keyLight = new THREE.PointLight(color, 8, 50);
    keyLight.position.set(10, 10, 10);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xffffff, 3, 50);
    rimLight.position.set(-10, -10, -10);
    scene.add(rimLight);

    // --- Nucleus ---
    const nucleusGroup = new THREE.Group();
    atomGroup.add(nucleusGroup);

    const nucleusGeometry = new THREE.IcosahedronGeometry(1, 3);
    const nucleusMaterial = new THREE.MeshStandardMaterial({ 
      color: color, 
      emissive: color, 
      emissiveIntensity: 0.4,
      metalness: 0.9,
      roughness: 0.1,
      flatShading: false
    });
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    nucleusGroup.add(nucleus);

    // Outer Glow Shell
    const glowGeometry = new THREE.SphereGeometry(1.4, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({ 
      color: color, 
      transparent: true, 
      opacity: 0.08,
      side: THREE.BackSide
    });
    const nucleusGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    nucleusGroup.add(nucleusGlow);

    // --- Orbits and Electrons ---
    const shellCounts = [2, 8, 18, 32, 32, 18, 8]; 
    const electronMeshes: { mesh: THREE.Group, angle: number, speed: number, radius: number }[] = [];

    let totalRemaining = electrons;
    for (let i = 0; i < shellCounts.length && totalRemaining > 0; i++) {
      const currentShellCount = Math.min(totalRemaining, shellCounts[i]);
      const radius = 3.5 + i * 1.8;
      
      const shellGroup = new THREE.Group();
      atomGroup.add(shellGroup);

      // Orbital Path
      const torusGeometry = new THREE.TorusGeometry(radius, 0.015, 8, 120);
      const torusMaterial = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.12 });
      const orbitalRing = new THREE.Mesh(torusGeometry, torusMaterial);
      orbitalRing.rotation.x = Math.PI / 2;
      shellGroup.add(orbitalRing);

      for (let j = 0; j < currentShellCount; j++) {
        const eGroup = new THREE.Group();
        
        const electronGeo = new THREE.SphereGeometry(0.18, 16, 16);
        const electronMat = new THREE.MeshStandardMaterial({ 
          color: '#ffffff', 
          emissive: color, 
          emissiveIntensity: 1.5,
          metalness: 0.5,
          roughness: 0.2
        });
        const electron = new THREE.Mesh(electronGeo, electronMat);
        eGroup.add(electron);

        const eGlowGeo = new THREE.SphereGeometry(0.4, 12, 12);
        const eGlowMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.2 });
        const eGlow = new THREE.Mesh(eGlowGeo, eGlowMat);
        eGroup.add(eGlow);
        
        const angle = (j / currentShellCount) * Math.PI * 2;
        const speed = 0.008 + (1 / (radius * 1.5)) * 0.05;
        
        electronMeshes.push({ mesh: eGroup, angle, speed, radius });
        shellGroup.add(eGroup);
      }
      totalRemaining -= currentShellCount;
    }

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
      rotationVelocity.y = deltaX * 0.005;
      rotationVelocity.x = deltaY * 0.005;
      atomGroup.rotation.y += rotationVelocity.y;
      atomGroup.rotation.x += rotationVelocity.x;
      previousPointerPosition = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => isDragging = false;

    const container = containerRef.current;
    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // --- Animation ---
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      if (!isDragging) {
        atomGroup.rotation.y += rotationVelocity.y;
        atomGroup.rotation.x += rotationVelocity.x;
        rotationVelocity.x *= 0.95;
        rotationVelocity.y *= 0.95;
        atomGroup.rotation.y += 0.15 * delta;
        atomGroup.rotation.z += 0.05 * delta;
      }

      const pulseScale = 1 + Math.sin(time * 2.5) * 0.06;
      nucleus.scale.setScalar(pulseScale);
      nucleus.rotation.y += 0.2 * delta;
      nucleusGlow.scale.setScalar(1.2 + Math.sin(time * 2.5) * 0.2);

      electronMeshes.forEach(e => {
        e.angle += e.speed;
        e.mesh.position.set(
          Math.cos(e.angle) * e.radius,
          0,
          Math.sin(e.angle) * e.radius
        );
        e.mesh.children[1].scale.setScalar(1 + Math.sin(time * 10 + e.angle) * 0.3);
      });

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
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', resize);
      if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
      scene.clear();
    };
  }, [electrons, config, color]);

  return (
    <div className="w-full h-full relative group">
      {/* Loading Overlay */}
      {!isReady && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-4 bg-slate-50/10 dark:bg-slate-950/20 backdrop-blur-sm rounded-[2.5rem]">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-600 dark:text-cyan-400">Structure Analysis</span>
          </div>
          <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-white/5 shadow-inner">
            <div 
              className="h-full bg-cyan-500 shadow-[0_0_10px_#22d3ee] transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between w-48 text-[9px] font-black font-mono text-slate-400">
            <span>CALIBRATING</span>
            <span>{loadingProgress}%</span>
          </div>
        </div>
      )}

      {/* Model Container */}
      <div 
        ref={containerRef} 
        className={`w-full h-full cursor-grab active:cursor-grabbing touch-none transition-all duration-1000 ${isReady ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} 
      />
      
      {/* Interaction Hint */}
      {isReady && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none">
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Drag to rotate lattice</span>
        </div>
      )}
    </div>
  );
};

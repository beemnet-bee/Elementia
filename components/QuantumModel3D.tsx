
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface QuantumModel3DProps {
  electrons: number;
  config: string;
  color?: string;
}

export const QuantumModel3D: React.FC<QuantumModel3DProps> = ({ electrons, config, color = '#22d3ee' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

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
      // ALIGNMENT FIX: Removed random tilt to keep all shells on the same level
      atomGroup.add(shellGroup);

      // Orbital Path
      const torusGeometry = new THREE.TorusGeometry(radius, 0.015, 8, 120);
      const torusMaterial = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.12 });
      const orbitalRing = new THREE.Mesh(torusGeometry, torusMaterial);
      // Ensure the ring lies flat on the XZ plane
      orbitalRing.rotation.x = Math.PI / 2;
      shellGroup.add(orbitalRing);

      for (let j = 0; j < currentShellCount; j++) {
        const eGroup = new THREE.Group();
        
        // Electron Core
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

        // Small Local Glow
        const eGlowGeo = new THREE.SphereGeometry(0.4, 12, 12);
        const eGlowMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.2 });
        const eGlow = new THREE.Mesh(eGlowGeo, eGlowMat);
        eGroup.add(eGlow);
        
        const angle = (j / currentShellCount) * Math.PI * 2;
        // Outer shells move slower naturally
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
        // Continuous slow rotation for presentation
        atomGroup.rotation.y += 0.15 * delta;
        atomGroup.rotation.z += 0.05 * delta;
      }

      // Nucleus Pulsing
      const pulseScale = 1 + Math.sin(time * 2.5) * 0.06;
      nucleus.scale.setScalar(pulseScale);
      nucleus.rotation.y += 0.2 * delta;
      nucleusGlow.scale.setScalar(1.2 + Math.sin(time * 2.5) * 0.2);

      // Electron movement - kept on the same plane
      electronMeshes.forEach(e => {
        e.angle += e.speed;
        e.mesh.position.set(
          Math.cos(e.angle) * e.radius,
          0, // Y is 0, keeping them strictly on the XZ plane of their group
          Math.sin(e.angle) * e.radius
        );
        // Breathing pulse for electron glows
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
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', resize);
      if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
      scene.clear();
    };
  }, [electrons, config, color]);

  return <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none" />;
};

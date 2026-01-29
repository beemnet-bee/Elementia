
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
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // --- Container Group for Rotation ---
    const atomGroup = new THREE.Group();
    scene.add(atomGroup);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(color, 2.5, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // --- Nucleus ---
    const nucleusGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const nucleusMaterial = new THREE.MeshPhongMaterial({ 
      color: color, 
      emissive: color, 
      emissiveIntensity: 0.6,
      shininess: 100 
    });
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    atomGroup.add(nucleus);

    // Nucleus Core Glow
    const glowGeometry = new THREE.SphereGeometry(1.0, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.15 });
    const nucleusGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    atomGroup.add(nucleusGlow);

    // --- Orbits and Electrons ---
    const shellCounts = [2, 8, 18, 32, 32, 18, 8]; 
    const electronMeshes: { mesh: THREE.Mesh, angle: number, speed: number, radius: number }[] = [];

    let totalRemaining = electrons;
    for (let i = 0; i < shellCounts.length && totalRemaining > 0; i++) {
      const currentShellCount = Math.min(totalRemaining, shellCounts[i]);
      const radius = 2.5 + i * 1.5;
      
      const shellGroup = new THREE.Group();
      atomGroup.add(shellGroup);

      // Create Orbital Path
      const torusGeometry = new THREE.TorusGeometry(radius, 0.012, 16, 100);
      const torusMaterial = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.1 });
      const orbitalRing = new THREE.Mesh(torusGeometry, torusMaterial);
      orbitalRing.rotation.x = Math.PI / 2;
      shellGroup.add(orbitalRing);

      // Distribute electrons
      for (let j = 0; j < currentShellCount; j++) {
        const electronGeo = new THREE.SphereGeometry(0.12, 16, 16);
        const electronMat = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 0.8 });
        const electron = new THREE.Mesh(electronGeo, electronMat);
        
        const angle = (j / currentShellCount) * Math.PI * 2;
        const speed = 0.01 + (1 / radius) * 0.03;
        
        electronMeshes.push({ mesh: electron, angle, speed, radius });
        shellGroup.add(electron);
      }
      totalRemaining -= currentShellCount;
    }

    // --- Interactive Rotation Logic ---
    let isDragging = false;
    let previousPointerPosition = { x: 0, y: 0 };
    let targetRotationX = 0;
    let targetRotationY = 0;
    let rotationVelocityX = 0;
    let rotationVelocityY = 0;

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousPointerPosition = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - previousPointerPosition.x;
      const deltaY = e.clientY - previousPointerPosition.y;

      // Update velocities based on movement
      rotationVelocityY = deltaX * 0.005;
      rotationVelocityX = deltaY * 0.005;

      atomGroup.rotation.y += rotationVelocityY;
      atomGroup.rotation.x += rotationVelocityX;

      previousPointerPosition = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const container = containerRef.current;
    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // --- Animation Loop ---
    const animate = () => {
      requestAnimationFrame(animate);

      // Smooth deceleration / Damping
      if (!isDragging) {
        atomGroup.rotation.y += rotationVelocityY;
        atomGroup.rotation.x += rotationVelocityX;
        
        rotationVelocityX *= 0.95;
        rotationVelocityY *= 0.95;

        // Baseline slow auto-rotation
        atomGroup.rotation.y += 0.002;
        atomGroup.rotation.z += 0.001;
      }

      // Pulse effects
      const time = Date.now() * 0.002;
      nucleus.scale.setScalar(1 + Math.sin(time) * 0.04);
      nucleusGlow.scale.setScalar(1.2 + Math.sin(time) * 0.15);

      // Electron movement
      electronMeshes.forEach(e => {
        e.angle += e.speed;
        e.mesh.position.set(
          Math.cos(e.angle) * e.radius,
          0,
          Math.sin(e.angle) * e.radius
        );
      });

      renderer.render(scene, camera);
    };
    animate();

    // --- Resize Handler ---
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
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
    };
  }, [electrons, config, color]);

  return <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none" />;
};

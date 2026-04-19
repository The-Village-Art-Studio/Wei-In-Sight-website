'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useHomepageState } from '@/context/HomepageContext';

export default function BodyModel() {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const { hoveredSection, selectedSection } = useHomepageState();
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setShouldReduceMotion(mediaQuery.matches);
      const handler = (event: MediaQueryListEvent) => setShouldReduceMotion(event.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  // Load the realistic mannequin GLB
  const { scene } = useGLTF('/models/human%20form.glb') as any;

  // Ensure our material is created and applied to all meshes
  useEffect(() => {
    if (!materialRef.current) {
      materialRef.current = new THREE.MeshBasicMaterial({
        color: "#ff69b4",
        wireframe: true,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
      });
    }
    
    if (scene) {
      scene.traverse((child: any) => {
        if (child.isMesh) {
          child.material = materialRef.current;
        }
      });
    }
  }, [scene]);

  useFrame((state) => {
    // Subtle idle sway — disabled if prefers-reduced-motion: reduce
    if (groupRef.current && !shouldReduceMotion) {
      const t = state.clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.04;
    }

    // Material react to interactions globally
    if (materialRef.current) {
      const isTargeted = !!hoveredSection || !!selectedSection;
      const baseColor = new THREE.Color("#ff69b4"); 
      const glowColor = new THREE.Color("#ffffff"); 
      
      const targetColor = isTargeted ? glowColor : baseColor;
      
      materialRef.current.color.lerp(targetColor, 0.05);
      materialRef.current.opacity = THREE.MathUtils.lerp(
        materialRef.current.opacity,
        isTargeted ? 0.7 : 0.15, 
        0.05
      );
    }
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <group ref={groupRef}>
      {scene && (
        <group rotation={[0, 0, 0]}>
          <primitive 
            object={scene} 
            scale={1.5} 
            position={[0, -1.2, 0]} 
            rotation={[0, 0, 0]} 
          />
        </group>
      )}

    </group>
  );
}

// Preload the model to prevent jank
useGLTF.preload('/models/human%20form.glb');

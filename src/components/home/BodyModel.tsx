'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useHomepageState } from '@/context/HomepageContext';



export default function BodyModel() {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const { hoveredSection, selectedSection } = useHomepageState();

  // Load the realistic mannequin GLB
  const { scene } = useGLTF('/models/human%20form.glb') as any;

  // Ensure our material is created and applied to all meshes
  useEffect(() => {
    if (!materialRef.current) {
      materialRef.current = new THREE.MeshBasicMaterial({
        color: "#ff69b4",
        wireframe: true,
        transparent: true,
        opacity: 0.5
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
    // Keep subtle ambient breathing/drifting
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.02; 
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.05;
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
        isTargeted ? 0.6 : 0.1, 
        0.05
      );
    }
  });

  return (
    <group ref={groupRef}>
      {scene && (
        <group rotation={[0, 0, 0]}>
          <primitive object={scene} scale={1.5} position={[0, -1.2, 0]} rotation={[0, 0, 0]} />
        </group>
      )}

    </group>
  );
}

// Preload the model to prevent jank
useGLTF.preload('/models/human%20form.glb');

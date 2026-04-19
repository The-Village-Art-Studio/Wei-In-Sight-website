'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useHomepageState } from '@/context/HomepageContext';

function Anchor({ position, id }: { position: [number, number, number], id: string }) {
  const { hoveredSection, selectedSection } = useHomepageState();
  const materialRef = useRef<any>(null);
  
  const isTargeted = hoveredSection === id || selectedSection === id;

  useFrame(() => {
    if (materialRef.current) {
      const targetColor = new THREE.Color(isTargeted ? "#ff69b4" : "#ffffff");
      materialRef.current.color.lerp(targetColor, 0.05);
      materialRef.current.opacity = THREE.MathUtils.lerp(
        materialRef.current.opacity,
        isTargeted ? 0.3 : 0.0,
        0.05
      );
    }
  });

  return (
    <mesh position={position}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshBasicMaterial 
        ref={materialRef} 
        wireframe={false} 
        transparent 
        opacity={0.0} 
        color="#ffffff" 
        depthTest={false}
      />
    </mesh>
  );
}

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

      {/* Invisible anchor helpers for Ears/Eyes/Chest/Wrist matching original behavior */}
      <Anchor id="dream" position={[0,    1.52, 0.1]} />  {/* Crown of head */}
      <Anchor id="sight" position={[0,    1.44, 0.15]} /> {/* Eyes/face */}
      <Anchor id="sound" position={[-0.12, 1.44, 0.1]} /> {/* Left ear */}
      <Anchor id="voice" position={[0,    1.36, 0.15]} /> {/* Throat/neck */}
      <Anchor id="heart" position={[0,    1.1,  0.15]} /> {/* Chest/heart */}
      <Anchor id="touch" position={[-0.38, 0.18, 0.1]} /> {/* Left hand */}
      <Anchor id="pulse" position={[0.28,  0.38, 0.1]} /> {/* Right hand */}
    </group>
  );
}

// Preload the model to prevent jank
useGLTF.preload('/models/human%20form.glb');

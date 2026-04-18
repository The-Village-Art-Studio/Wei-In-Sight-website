'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function MockBody() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={1.5}>
      <MeshDistortMaterial
        color="#ff00ff"
        speed={1.5}
        distort={0.4}
        wireframe
        opacity={0.3}
        transparent
      />
    </Sphere>
  );
}

export default function BodyScene() {
  return (
    <div className="scene-wrapper">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ff00ff" />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        <MockBody />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>

      <div className="scene-label">
        <span className="text-xs text-neon">CORE — BODY NAVIGATION PLACEHOLDER</span>
      </div>

      <style jsx>{`
        .scene-wrapper {
          width: 100%;
          height: 100%;
          cursor: grab;
          position: relative;
        }
        .scene-label {
          position: absolute;
          bottom: var(--spacing-m);
          right: var(--spacing-m);
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}

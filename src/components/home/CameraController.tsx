'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useHomepageState } from '@/context/HomepageContext';
import { NAV_SECTIONS } from '@/lib/constants';

export default function CameraController() {
  const { camera, size } = useThree();
  const { selectedSection } = useHomepageState();
  const controlsRef = useRef<any>(null);
  
  const isMobile = useMemo(() => size.width < 768, [size.width]);
  const activeSection = useMemo(() => 
    NAV_SECTIONS.find(s => s.id === selectedSection), 
    [selectedSection]
  );

  // Initial values
  const defaultPos = new THREE.Vector3(0, 0, 4);
  const defaultTarget = new THREE.Vector3(0, 0, 0);

  useFrame(() => {
    if (isMobile) {
      // Static centered view for mobile to avoid jitter
      camera.position.lerp(defaultPos, 0.05);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(defaultTarget, 0.05);
      }
      return;
    }

    if (activeSection) {
      // Focus transition
      const targetPos = new THREE.Vector3(...activeSection.cameraPos3D);
      const targetLookAt = new THREE.Vector3(...activeSection.cameraTarget3D);
      
      camera.position.lerp(targetPos, 0.05);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLookAt, 0.05);
      }
    } else {
      // Return to base
      camera.position.lerp(defaultPos, 0.05);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(defaultTarget, 0.05);
      }
    }
  });

  return (
    <OrbitControls 
      ref={controlsRef}
      enableZoom={false} 
      enablePan={false}
      makeDefault
    />
  );
}

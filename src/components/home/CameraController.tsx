'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useHomepageState } from '@/context/HomepageContext';
import { NAV_SECTIONS } from '@/lib/constants';

export default function CameraController() {
  const { camera, size } = useThree();
  const { selectedSection } = useHomepageState();
  const controlsRef = useRef<any>(null);
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
  
  const isMobile = useMemo(() => size.width < 768, [size.width]);
  const activeSection = useMemo(() => 
    NAV_SECTIONS.find(s => s.id === selectedSection), 
    [selectedSection]
  );

  // Initial values
  const defaultPos = new THREE.Vector3(0, 0, 4);
  const defaultTarget = new THREE.Vector3(0, 0, 0);

  useFrame(() => {
    const lerpFactor = shouldReduceMotion ? 0.5 : 0.03; // Slower, more cinematic default

    if (isMobile) {
      // Static centered view for mobile to avoid jitter
      camera.position.lerp(defaultPos, lerpFactor);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(defaultTarget, lerpFactor);
      }
      return;
    }

    if (activeSection) {
      // Focus transition
      const targetPos = new THREE.Vector3(...activeSection.cameraPos3D);
      const targetLookAt = new THREE.Vector3(...activeSection.cameraTarget3D);
      
      camera.position.lerp(targetPos, lerpFactor);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLookAt, lerpFactor);
      }
    } else {
      // Return to base
      camera.position.lerp(defaultPos, lerpFactor);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(defaultTarget, lerpFactor);
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

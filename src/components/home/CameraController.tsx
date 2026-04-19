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
  

  const activeSection = useMemo(() => 
    NAV_SECTIONS.find(s => s.id === selectedSection), 
    [selectedSection]
  );

  // Initial values
  const defaultPos = new THREE.Vector3(0, 0, 4);
  const defaultTarget = new THREE.Vector3(0, 0, 0);

  useFrame(() => {
    const lerpFactor = shouldReduceMotion ? 0.5 : 0.03; // Slower, more cinematic default

    const targetPos = activeSection ? new THREE.Vector3(...activeSection.cameraPos3D) : defaultPos;
    const targetLookAtOrigin = activeSection ? new THREE.Vector3(...activeSection.cameraTarget3D) : defaultTarget;
    
    // On mobile, frame the model HIGHER only when a section is active to fit submenus.
    // Otherwise, keep it centered on the hero page.
    const mobileOffset = (size.width < 768 && activeSection) ? -0.4 : 0;
    const targetLookAt = targetLookAtOrigin.clone().add(new THREE.Vector3(0, mobileOffset, 0));

    // Smoothly track the focal point
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt, lerpFactor);
    }
    const currentTarget = controlsRef.current?.target || defaultTarget;

    // Convert positions to relative Spherical coordinates
    const currentSpherical = new THREE.Spherical().setFromVector3(
      camera.position.clone().sub(currentTarget)
    );
    const targetSpherical = new THREE.Spherical().setFromVector3(
      targetPos.clone().sub(targetLookAt)
    );

    // Interpolate spherical properties for a perfect orbital arc
    currentSpherical.radius = THREE.MathUtils.lerp(currentSpherical.radius, targetSpherical.radius, lerpFactor);
    currentSpherical.phi = THREE.MathUtils.lerp(currentSpherical.phi, targetSpherical.phi, lerpFactor);
    
    // Calculate shortest path for angular rotation (theta)
    let dTheta = targetSpherical.theta - currentSpherical.theta;
    while (dTheta > Math.PI) dTheta -= Math.PI * 2;
    while (dTheta < -Math.PI) dTheta += Math.PI * 2;
    currentSpherical.theta += dTheta * lerpFactor;

    // Apply converted orbital position back to the Cartesian camera
    const newPos = new THREE.Vector3().setFromSpherical(currentSpherical).add(currentTarget);
    camera.position.copy(newPos);
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

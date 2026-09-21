'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Procedural luxury crystal geometries for stunning 3D refraction
 * crystalType: 'Amethyst' | 'Rose Quartz' | 'Pyrite' | 'Labradorite' | 'Clear Quartz' | 'Selenite' | 'Black Obsidian' | 'Citrine'
 */
export function ProceduralCrystal({
  crystalType = 'Amethyst',
  color,
  scale = 1,
  wireframe = false,
  ior,
  transmission = 1,
  roughness = 0.05,
}) {
  const meshRef = useRef();
  const innerRef = useRef();

  // Dynamic color palette per crystal type
  const crystalConfigs = {
    Amethyst: {
      color: color || '#8b5cf6',
      attenuationColor: '#4c1d95',
      ior: ior || 2.4,
      geometryType: 'octahedron',
      chromaticAberration: 0.08,
      thickness: 1.5,
    },
    'Rose Quartz': {
      color: color || '#f472b6',
      attenuationColor: '#db2777',
      ior: ior || 2.1,
      geometryType: 'dodecahedron',
      chromaticAberration: 0.04,
      thickness: 1.2,
    },
    Pyrite: {
      color: color || '#f59e0b',
      attenuationColor: '#78350f',
      ior: ior || 2.8,
      geometryType: 'boxCluster',
      chromaticAberration: 0.02,
      roughness: 0.15,
      thickness: 1.8,
    },
    Labradorite: {
      color: color || '#38bdf8',
      attenuationColor: '#1e3a8a',
      ior: ior || 2.5,
      geometryType: 'prism',
      chromaticAberration: 0.12,
      thickness: 1.6,
    },
    'Clear Quartz': {
      color: color || '#ffffff',
      attenuationColor: '#e0e7ff',
      ior: ior || 2.42,
      geometryType: 'prism',
      chromaticAberration: 0.06,
      thickness: 1.4,
    },
    Selenite: {
      color: color || '#f1f5f9',
      attenuationColor: '#cbd5e1',
      ior: ior || 1.9,
      geometryType: 'tower',
      chromaticAberration: 0.03,
      roughness: 0.08,
      thickness: 1.3,
    },
    'Black Obsidian': {
      color: color || '#1e1b4b',
      attenuationColor: '#09090b',
      ior: ior || 2.6,
      geometryType: 'disk',
      chromaticAberration: 0.02,
      thickness: 2.0,
    },
    Citrine: {
      color: color || '#fbbf24',
      attenuationColor: '#b45309',
      ior: ior || 2.35,
      geometryType: 'prism',
      chromaticAberration: 0.07,
      thickness: 1.4,
    },
    "Tiger's Eye": {
      color: color || '#d97706',
      attenuationColor: '#78350f',
      ior: ior || 2.65,
      geometryType: 'dodecahedron',
      chromaticAberration: 0.05,
      roughness: 0.12,
      thickness: 1.6,
    },
  };

  const config = crystalConfigs[crystalType] || crystalConfigs['Amethyst'];

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.25;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.15;
    }
  });

  const renderGeometry = (type) => {
    switch (type) {
      case 'dodecahedron':
        return <dodecahedronGeometry args={[1.2, 0]} />;
      case 'prism':
        return <cylinderGeometry args={[0.7, 1.0, 2.2, 6]} />;
      case 'tower':
        return <cylinderGeometry args={[0.5, 0.9, 2.6, 8]} />;
      case 'disk':
        return <cylinderGeometry args={[1.3, 1.3, 0.35, 32]} />;
      case 'boxCluster':
        return <boxGeometry args={[1.3, 1.3, 1.3]} />;
      case 'octahedron':
      default:
        return <octahedronGeometry args={[1.3, 0]} />;
    }
  };

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <group scale={scale}>
        {/* Inner core refractive facet */}
        <mesh ref={innerRef} scale={0.5}>
          <octahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial
            color={config.attenuationColor}
            emissive={config.color}
            emissiveIntensity={0.3}
            roughness={0.2}
            metalness={0.8}
            wireframe={wireframe}
          />
        </mesh>

        {/* Outer refractive crystal shell */}
        <mesh ref={meshRef} castShadow receiveShadow>
          {renderGeometry(config.geometryType)}
          <MeshTransmissionMaterial
            backside={false}
            samples={10}
            resolution={512}
            transmission={transmission}
            roughness={roughness || config.roughness || 0.05}
            thickness={config.thickness}
            ior={config.ior}
            chromaticAberration={config.chromaticAberration}
            anisotropy={0.3}
            distortion={0.2}
            distortionScale={0.3}
            temporalDistortion={0.05}
            clearcoat={1}
            attenuationDistance={0.6}
            attenuationColor={config.attenuationColor}
            color={config.color}
            wireframe={wireframe}
          />
        </mesh>

        {/* Magical ambient energy sparkles around the stone */}
        <Sparkles count={35} scale={3.5} size={2.5} speed={0.4} opacity={0.6} color={config.color} />
      </group>
    </Float>
  );
}

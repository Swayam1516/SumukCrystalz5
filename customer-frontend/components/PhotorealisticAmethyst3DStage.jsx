'use client';

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Sparkles, Environment } from '@react-three/drei';
import * as THREE from 'three';
import Image from 'next/image';
import { Rotate3d, Sparkles as SparklesIcon, Eye } from 'lucide-react';

/**
 * Procedural Natural Quartz Crystal Generator
 * Generates an asymmetric hexagonal prism with a 6-sided rhombohedral pyramidal apex.
 */
function createNaturalQuartzGeometry({
  radius = 1,
  height = 3,
  tipRatio = 0.38,
  asymmetry = [0, 0, 0, 0, 0, 0],
  apexOffset = [0, 0],
} = {}) {
  const geom = new THREE.BufferGeometry();
  const positions = [];
  const bodyHeight = height * (1 - tipRatio);
  const halfH = height / 2;
  const shoulderY = -halfH + bodyHeight;
  const baseY = -halfH;
  const apexY = halfH;

  // 6 base vertices around hexagonal perimeter with organic variations
  const ring = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    // Real quartz rhombohedral alternating face thickness
    const rFactor = 1.0 + (i % 2 === 0 ? 0.08 : -0.06) + (asymmetry[i] || 0);
    const r = radius * rFactor;
    ring.push({
      x: Math.cos(angle) * r,
      z: Math.sin(angle) * r,
    });
  }

  // Apex with natural organic offset
  const apex = {
    x: apexOffset[0] * radius,
    y: apexY,
    z: apexOffset[1] * radius,
  };

  // 6 side quads (12 triangles)
  for (let i = 0; i < 6; i++) {
    const next = (i + 1) % 6;
    const p1 = ring[i];
    const p2 = ring[next];

    // Triangle 1
    positions.push(p1.x, baseY, p1.z);
    positions.push(p2.x, baseY, p2.z);
    positions.push(p2.x, shoulderY, p2.z);

    // Triangle 2
    positions.push(p1.x, baseY, p1.z);
    positions.push(p2.x, shoulderY, p2.z);
    positions.push(p1.x, shoulderY, p1.z);
  }

  // 6 tip triangles converging at the apex
  for (let i = 0; i < 6; i++) {
    const next = (i + 1) % 6;
    const p1 = ring[i];
    const p2 = ring[next];

    positions.push(p1.x, shoulderY, p1.z);
    positions.push(p2.x, shoulderY, p2.z);
    positions.push(apex.x, apex.y, apex.z);
  }

  // Base bottom cap (6 triangles)
  for (let i = 0; i < 6; i++) {
    const next = (i + 1) % 6;
    positions.push(0, baseY, 0);
    positions.push(ring[next].x, baseY, ring[next].z);
    positions.push(ring[i].x, baseY, ring[i].z);
  }

  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geom.computeVertexNormals();
  return geom;
}

/**
 * Craggy Volcanic Basalt Rock Bedrock Generator
 * Anchors the crystal cluster to the earth with rough dark basalt matrix.
 */
function createCraggyRockGeometry(radius = 1.7, height = 0.8) {
  const geom = new THREE.CylinderGeometry(radius * 0.9, radius * 1.2, height, 11, 3);
  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const angle = Math.atan2(z, x);
    const noise = Math.sin(angle * 4) * 0.16 + Math.cos(y * 5) * 0.1;
    pos.setXYZ(i, x * (1 + noise), y + noise * 0.4, z * (1 + noise));
  }
  geom.computeVertexNormals();
  return geom;
}

/**
 * Individual Faceted Amethyst Point with Inner Core
 */
function AmethystPoint({
  geom,
  innerGeom,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  outerMaterial,
  innerMaterial,
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Inner Phantom Core (radiant violet luminescence) */}
      <mesh geometry={innerGeom} material={innerMaterial} scale={0.62} />
      {/* Outer Translucent Faceted Crystal Shell */}
      <mesh geometry={geom} material={outerMaterial} castShadow receiveShadow />
    </group>
  );
}

/**
 * The Complete Natural Amethyst Cluster Composition
 */
function AmethystCluster({ isHovered, entranceProgress }) {
  // Geometries for the 12 crystal points in the cluster
  const geometries = useMemo(() => {
    return {
      // 1. Dominant cathedral obelisk
      main: createNaturalQuartzGeometry({
        radius: 0.92,
        height: 3.35,
        tipRatio: 0.38,
        asymmetry: [0.08, -0.04, 0.05, -0.06, 0.04, -0.02],
        apexOffset: [0.03, -0.02],
      }),
      mainInner: createNaturalQuartzGeometry({
        radius: 0.92,
        height: 3.35,
        tipRatio: 0.42,
        asymmetry: [0.05, -0.02, 0.03, -0.04, 0.02, -0.01],
      }),

      // 2. Companion 1: Front-Right (catches the warm gold luxury highlight)
      comp1: createNaturalQuartzGeometry({
        radius: 0.62,
        height: 2.3,
        tipRatio: 0.36,
        asymmetry: [-0.03, 0.06, -0.02, 0.05, -0.04, 0.03],
        apexOffset: [-0.04, 0.03],
      }),
      comp1Inner: createNaturalQuartzGeometry({ radius: 0.62, height: 2.3, tipRatio: 0.38 }),

      // 3. Companion 2: Front-Left Point
      comp2: createNaturalQuartzGeometry({
        radius: 0.54,
        height: 1.85,
        tipRatio: 0.35,
        asymmetry: [0.04, -0.05, 0.03, -0.02, 0.05, -0.03],
      }),
      comp2Inner: createNaturalQuartzGeometry({ radius: 0.54, height: 1.85, tipRatio: 0.38 }),

      // 4. Companion 3: Back-Left Pillar
      comp3: createNaturalQuartzGeometry({
        radius: 0.72,
        height: 2.65,
        tipRatio: 0.38,
        asymmetry: [-0.05, 0.04, -0.03, 0.06, -0.02, 0.03],
      }),
      comp3Inner: createNaturalQuartzGeometry({ radius: 0.72, height: 2.65, tipRatio: 0.4 }),

      // 5. Companion 4: Back-Right Anchor
      comp4: createNaturalQuartzGeometry({
        radius: 0.66,
        height: 2.15,
        tipRatio: 0.36,
        asymmetry: [0.03, -0.04, 0.05, -0.02, 0.04, -0.05],
      }),
      comp4Inner: createNaturalQuartzGeometry({ radius: 0.66, height: 2.15, tipRatio: 0.38 }),

      // 6. Druzy 1: Front Center Base
      druzy1: createNaturalQuartzGeometry({ radius: 0.4, height: 1.25, tipRatio: 0.4 }),
      druzy1Inner: createNaturalQuartzGeometry({ radius: 0.4, height: 1.25, tipRatio: 0.42 }),

      // 7. Druzy 2: Side Left Base
      druzy2: createNaturalQuartzGeometry({ radius: 0.36, height: 1.1, tipRatio: 0.4 }),
      druzy2Inner: createNaturalQuartzGeometry({ radius: 0.36, height: 1.1, tipRatio: 0.42 }),

      // 8. Druzy 3: Side Right Base
      druzy3: createNaturalQuartzGeometry({ radius: 0.38, height: 1.18, tipRatio: 0.38 }),
      druzy3Inner: createNaturalQuartzGeometry({ radius: 0.38, height: 1.18, tipRatio: 0.4 }),

      // 9. Satellite 1: Far Left Flank
      sat1: createNaturalQuartzGeometry({ radius: 0.42, height: 1.45, tipRatio: 0.36 }),
      sat1Inner: createNaturalQuartzGeometry({ radius: 0.42, height: 1.45, tipRatio: 0.38 }),

      // 10. Satellite 2: Far Right Flank
      sat2: createNaturalQuartzGeometry({ radius: 0.44, height: 1.5, tipRatio: 0.36 }),
      sat2Inner: createNaturalQuartzGeometry({ radius: 0.44, height: 1.5, tipRatio: 0.38 }),

      // Basalt rock bedrock base
      bedrock: createCraggyRockGeometry(1.85, 0.8),
    };
  }, []);

  // Luminous translucent physical material for authentic amethyst facets
  const outerMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#9333ea'), // Vibrant amethyst violet
      emissive: new THREE.Color('#581c87'), // Internal luminescence
      emissiveIntensity: 0.35,
      roughness: 0.08, // Mirror-smooth facet finish
      metalness: 0.04,
      transmission: 0.48, // Balanced optical translucency
      ior: 1.54, // Natural quartz index of refraction
      thickness: 1.8, // Volumetric depth
      specularIntensity: 1.6, // Brilliant facet shine
      specularColor: new THREE.Color('#ffffff'),
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      flatShading: true, // Razor-sharp polygonal gemstone facets
    });
  }, []);

  // Radiant inner phantom core material
  const innerMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#3b0764'),
      emissive: new THREE.Color('#c084fc'),
      emissiveIntensity: 0.55,
      roughness: 0.2,
      metalness: 0.35,
      flatShading: true,
    });
  }, []);

  // Dark basalt bedrock material
  const bedrockMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#14101e'),
      roughness: 0.88,
      metalness: 0.12,
      flatShading: true,
    });
  }, []);

  // Ground pool glow material
  const groundGlowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#7e22ce'),
      transparent: true,
      opacity: 0.28,
    });
  }, []);

  // Dynamically enhance facet highlights when hovered
  useEffect(() => {
    if (outerMaterial) {
      outerMaterial.specularIntensity = isHovered ? 2.2 : 1.6;
      outerMaterial.emissiveIntensity = isHovered ? 0.45 : 0.35;
      outerMaterial.roughness = isHovered ? 0.05 : 0.08;
    }
  }, [isHovered, outerMaterial]);

  return (
    <group>
      {/* 1. DOMINANT CATHEDRAL AMETHYST POINT */}
      <AmethystPoint
        geom={geometries.main}
        innerGeom={geometries.mainInner}
        position={[0, 0.25, 0]}
        rotation={[-0.05, 0.16, 0.04]}
        scale={[1.12, 1.12, 1.12]}
        outerMaterial={outerMaterial}
        innerMaterial={innerMaterial}
      />

      {/* 2. COMPANION FRONT-RIGHT (Catches champagne gold highlights) */}
      <AmethystPoint
        geom={geometries.comp1}
        innerGeom={geometries.comp1Inner}
        position={[0.88, -0.32, 0.46]}
        rotation={[0.18, 0.46, -0.22]}
        outerMaterial={outerMaterial}
        innerMaterial={innerMaterial}
      />

      {/* 3. COMPANION FRONT-LEFT */}
      <AmethystPoint
        geom={geometries.comp2}
        innerGeom={geometries.comp2Inner}
        position={[-0.82, -0.58, 0.54]}
        rotation={[-0.14, -0.36, 0.24]}
        outerMaterial={outerMaterial}
        innerMaterial={innerMaterial}
      />

      {/* 4. COMPANION BACK-LEFT PILLAR */}
      <AmethystPoint
        geom={geometries.comp3}
        innerGeom={geometries.comp3Inner}
        position={[-0.72, -0.18, -0.48]}
        rotation={[-0.18, 0.6, 0.14]}
        outerMaterial={outerMaterial}
        innerMaterial={innerMaterial}
      />

      {/* 5. COMPANION BACK-RIGHT ANCHOR */}
      <AmethystPoint
        geom={geometries.comp4}
        innerGeom={geometries.comp4Inner}
        position={[0.7, -0.32, -0.54]}
        rotation={[0.22, -0.4, -0.16]}
        outerMaterial={outerMaterial}
        innerMaterial={innerMaterial}
      />

      {/* 6. SATELLITE FAR LEFT */}
      <AmethystPoint
        geom={geometries.sat1}
        innerGeom={geometries.sat1Inner}
        position={[-1.15, -0.72, 0.1]}
        rotation={[-0.1, -0.5, 0.35]}
        outerMaterial={outerMaterial}
        innerMaterial={innerMaterial}
      />

      {/* 7. SATELLITE FAR RIGHT */}
      <AmethystPoint
        geom={geometries.sat2}
        innerGeom={geometries.sat2Inner}
        position={[1.15, -0.68, 0.12]}
        rotation={[0.1, 0.55, -0.32]}
        outerMaterial={outerMaterial}
        innerMaterial={innerMaterial}
      />

      {/* 8. DRUZY CLUSTER FRONT BASE */}
      <AmethystPoint
        geom={geometries.druzy1}
        innerGeom={geometries.druzy1Inner}
        position={[0.2, -0.86, 0.92]}
        rotation={[0.26, 0.18, 0.08]}
        outerMaterial={outerMaterial}
        innerMaterial={innerMaterial}
      />

      {/* 9. DRUZY CLUSTER SIDE LEFT */}
      <AmethystPoint
        geom={geometries.druzy2}
        innerGeom={geometries.druzy2Inner}
        position={[-0.42, -0.9, 0.86]}
        rotation={[0.3, -0.24, -0.14]}
        outerMaterial={outerMaterial}
        innerMaterial={innerMaterial}
      />

      {/* 10. DRUZY CLUSTER RIGHT FLANK */}
      <AmethystPoint
        geom={geometries.druzy3}
        innerGeom={geometries.druzy3Inner}
        position={[1.08, -0.82, 0.28]}
        rotation={[0.14, 0.54, -0.3]}
        outerMaterial={outerMaterial}
        innerMaterial={innerMaterial}
      />

      {/* CRAGGY BASALT BEDROCK MATRIX BASE */}
      <mesh
        geometry={geometries.bedrock}
        material={bedrockMaterial}
        position={[0, -1.22, 0]}
        receiveShadow
        castShadow
      />

      {/* FAINT PURPLE GROUND REFLECTION DISK */}
      <mesh
        material={groundGlowMaterial}
        position={[0, -1.32, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[2.5, 32]} />
      </mesh>
    </group>
  );
}

/**
 * Animated Amethyst Scene with Entrance Sequence & Parallax
 */
function AmethystScene({ isHovered, isMobile, onSceneReady }) {
  const groupRef = useRef();
  const [entranceProgress, setEntranceProgress] = useState(0);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const currentRot = useRef({ x: 0, y: 0 });

  // Notify parent component when scene initialized
  useEffect(() => {
    if (onSceneReady) onSceneReady();
  }, [onSceneReady]);

  // Window mouse parallax listener (Desktop only, passive)
  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      // Controlled, restrained perspective movement (max ±0.08 rad)
      mouseTarget.current = {
        x: nx * 0.09,
        y: -ny * 0.06,
      };
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  useFrame((state, delta) => {
    // 1. Cinematic entrance progress (takes ~2 seconds)
    if (entranceProgress < 1) {
      setEntranceProgress((prev) => Math.min(1, prev + delta / 1.9));
    }
    // Cubic ease-out
    const ease = 1 - Math.pow(1 - entranceProgress, 3);

    // 2. Scale: starts at 0.88, smoothly swells to 1.0
    const hoverScale = isHovered ? 1.025 : 1.0;
    const scaleVal = (0.88 + 0.12 * ease) * hoverScale;

    // 3. Inertial mouse parallax interpolation
    currentRot.current.x += (mouseTarget.current.x - currentRot.current.x) * 0.05;
    currentRot.current.y += (mouseTarget.current.y - currentRot.current.y) * 0.05;

    if (groupRef.current) {
      groupRef.current.scale.setScalar(scaleVal);

      // Subtle breathing float motion
      const time = state.clock.elapsedTime;
      const breatheY = Math.sin(time * 0.7) * 0.035;
      const breatheRotY = Math.sin(time * 0.35) * 0.02;
      const breatheRotX = Math.sin(time * 0.5) * 0.012;

      // Position: starts slightly back (-0.5), glides forward
      const targetZ = -0.5 * (1 - ease);
      groupRef.current.position.set(0, breatheY - 0.06, targetZ);

      // Controlled rotation combining breathing and pointer parallax
      groupRef.current.rotation.y = breatheRotY + currentRot.current.x;
      groupRef.current.rotation.x = breatheRotX + currentRot.current.y;
    }
  });

  // Calculate dynamic lighting based on entrance progress and hover state
  const ease = 1 - Math.pow(1 - entranceProgress, 3);
  const lightMultiplier = 0.3 + 0.7 * ease;
  const hoverBoost = isHovered ? 1.15 : 1.0;

  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          CINEMATIC STUDIO LIGHTING SYSTEM
          ══════════════════════════════════════════════════════════ */}
      {/* 1. Ambient baseline fill (mysterious midnight purple) */}
      <ambientLight intensity={0.75 * lightMultiplier} color="#3b0764" />

      {/* 2. Soft Violet Key Light (from upper-left, illuminating front facets) */}
      <directionalLight
        position={[-2.5, 3.8, 3.8]}
        intensity={3.4 * lightMultiplier * hoverBoost}
        color="#d8b4fe"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* 3. Cool Lavender Rim Light (behind crystal, crisp silhouette facets) */}
      <directionalLight
        position={[2.8, 4.0, -3.8]}
        intensity={3.6 * lightMultiplier}
        color="#ede9fe"
      />

      {/* 4. Warm Champagne-Gold Luxury Highlight (catches selected front facets) */}
      <directionalLight
        position={[3.8, 2.4, 2.8]}
        intensity={2.8 * lightMultiplier * hoverBoost}
        color="#fef08a"
      />

      {/* 5. Radiant Core Light: Internal glow radiating through translucent facets */}
      <pointLight
        position={[0, 0.3, 0.4]}
        intensity={4.8 * lightMultiplier * hoverBoost}
        color="#c084fc"
        distance={5}
        decay={1.6}
      />

      {/* 6. Faint Purple Ground Reflection Uplight */}
      <pointLight
        position={[0, -2.2, 1.8]}
        intensity={1.8 * lightMultiplier}
        color="#9333ea"
        distance={4}
      />

      {/* 7. Controlled Studio Environment Map for realistic glossy facet reflections */}
      <Environment preset="studio" environmentIntensity={0.55 * lightMultiplier} />

      {/* 8. Subtle Ambient Atmospheric Particles (behind crystal) */}
      <Sparkles
        count={isMobile ? 18 : 28}
        scale={4.8}
        size={isMobile ? 1.8 : 2.4}
        speed={0.25}
        opacity={0.42 * lightMultiplier}
        color="#c084fc"
        position={[0, 0.2, -0.6]}
      />

      {/* 9. Main 3D Crystal Cluster */}
      <group ref={groupRef}>
        <AmethystCluster isHovered={isHovered} entranceProgress={entranceProgress} />
      </group>

      {/* 10. Soft Ground Contact Shadows beneath basalt bedrock */}
      <ContactShadows
        position={[0, -1.34, 0]}
        opacity={0.75 * lightMultiplier}
        scale={8.5}
        blur={2.4}
        far={3.5}
        color="#000000"
      />
    </>
  );
}

/**
 * Main Export: PhotorealisticAmethyst3DStage
 * Includes WebGL detection, responsive scaling, interactive mode toggle, and seamless fallback.
 */
export default function PhotorealisticAmethyst3DStage({ className = '' }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewMode, setViewMode] = useState('3d'); // '3d' | '4k'

  // Check mobile & WebGL support on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768 || window.matchMedia('(hover: none)').matches);

      // WebGL detection test
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
          setWebglSupported(false);
        }
      } catch (e) {
        setWebglSupported(false);
      }
    }
  }, []);

  return (
    <div
      className={`relative w-full h-[420px] sm:h-[490px] lg:h-[550px] flex items-center justify-center select-none overflow-visible ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ══════════════════════════════════════════════════════════
          ATMOSPHERIC INTEGRATION GLOWS (NO RECTANGULAR BOX)
          ══════════════════════════════════════════════════════════ */}
      {/* Deep Violet Center Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[520px] lg:w-[600px] h-[380px] sm:h-[520px] lg:h-[600px] bg-purple-900/28 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Subtle Warm Champagne Glow Accent */}
      <div className="absolute top-1/3 right-1/4 w-[260px] h-[260px] bg-amber-500/12 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Bottom Dissolve Gradient (blends ground seamlessly into #000000) */}
      <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#000000] via-[#000000]/60 to-transparent pointer-events-none z-10" />

      {/* ══════════════════════════════════════════════════════════
          3D REAL-TIME WEBGL CANVAS STAGE (OR 4K SPECIMEN VIEW)
          ══════════════════════════════════════════════════════════ */}
      {webglSupported && viewMode === '3d' ? (
        <Canvas
          shadows
          camera={{ position: [0, 0.25, 4.3], fov: 38 }}
          dpr={isMobile ? [1, 1.3] : [1, 1.8]}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
            preserveDrawingBuffer: false,
          }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', (e) => {
              e.preventDefault();
              setWebglSupported(false);
            });
          }}
          className="w-full h-full cursor-grab active:cursor-grabbing !bg-transparent"
        >
          <Suspense fallback={null}>
            <AmethystScene
              isHovered={isHovered}
              isMobile={isMobile}
              onSceneReady={() => setIsLoaded(true)}
            />
          </Suspense>
        </Canvas>
      ) : (
        /* ══════════════════════════════════════════════════════════
           HIGH-DEFINITION SPECIMEN VIEW (RADIAL ALPHA MASK)
           Seamlessly integrated with zero rectangular cutoffs.
           ══════════════════════════════════════════════════════════ */
        <div className="relative w-full h-full flex items-center justify-center transition-all duration-700 animate-fadeIn">
          <div
            className="relative w-full h-full max-w-[580px] max-h-[500px] flex items-center justify-center group"
            style={{
              maskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 50%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 85% 85% at 50% 50%, black 50%, transparent 100%)',
            }}
          >
            <Image
              src="/images/hero-amethyst-4k.jpg"
              alt="Authentic Glowing Amethyst Natural Specimen - Sumuk Crystalz 5"
              fill
              priority
              quality={98}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 580px"
              className="object-contain filter drop-shadow-[0_20px_50px_rgba(147,51,234,0.5)] transition-transform duration-700 group-hover:scale-103"
            />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          COLLECTOR CONTROLS: 3D ROTATABLE / 4K SPECIMEN TOGGLE
          ══════════════════════════════════════════════════════════ */}
      {webglSupported && (
        <div className="absolute bottom-2 right-4 flex items-center gap-2 z-20">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === '3d' ? '4k' : '3d')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 hover:bg-black/70 border border-purple-500/30 hover:border-purple-400/60 backdrop-blur-md text-[10px] font-mono tracking-widest text-purple-200 transition-all cursor-pointer shadow-lg hover:scale-105"
            title="Toggle between 3D Real-Time Matrix and 4K Consecrated Macro Specimen"
          >
            {viewMode === '3d' ? (
              <>
                <Rotate3d className="w-3 h-3 text-purple-300 animate-spin" style={{ animationDuration: '10s' }} />
                <span>3D MATRIX</span>
                <span className="text-purple-400/60 font-sans text-[9px] ml-1">| 4K VIEW</span>
              </>
            ) : (
              <>
                <Eye className="w-3 h-3 text-amber-300" />
                <span className="text-amber-200">4K SPECIMEN</span>
                <span className="text-purple-300/60 font-sans text-[9px] ml-1">| 3D MATRIX</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

'use client';

import { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Environment,
  ContactShadows,
  PresentationControls,
  Html,
  OrbitControls,
} from '@react-three/drei';
import { ProceduralCrystal } from './ProceduralCrystal';
import { RotateCw, Sparkles, Layers, Eye } from 'lucide-react';

function LoadingFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-luxe-900/80 backdrop-blur border border-white/10 text-xs text-luxe-300">
        <div className="w-5 h-5 border-2 border-gold-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="font-mono tracking-wider">HARMONIZING CRYSTAL MATRIX…</span>
      </div>
    </Html>
  );
}

/**
 * Luxury 3D Crystal Showcase with refraction, caustics, and interactive controls
 */
export default function CrystalShowcase({
  crystalType = 'Amethyst',
  color,
  scale = 1,
  className = '',
  showControls = true,
  interactive = true,
}) {
  const [wireframe, setWireframe] = useState(false);
  const [lightingPreset, setLightingPreset] = useState('studio'); // studio | city | sunset | night
  const [roughness, setRoughness] = useState(0.05);

  return (
    <div className={`relative aspect-square w-full rounded-2xl overflow-hidden bg-gradient-to-b from-luxe-850/60 to-luxe-950/80 border border-white/10 ${className}`}>
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 4.2], fov: 40 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      >
        <ambientLight intensity={0.5} />
        <spotLight
          position={[5, 8, 5]}
          angle={0.4}
          penumbra={0.8}
          intensity={1.8}
          color="#fff7ed"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-4, -2, -3]} intensity={0.8} color="#c084fc" />
        <pointLight position={[3, -3, 3]} intensity={0.6} color="#e5b84c" />

        <PresentationControls
          global={interactive}
          rotation={[0, 0, 0]}
          polar={[-0.4, 0.4]}
          azimuth={[-Infinity, Infinity]}
          config={{ mass: 1, tension: 170, friction: 26 }}
          snap={false}
        >
          <Suspense fallback={<LoadingFallback />}>
            <ProceduralCrystal
              crystalType={crystalType}
              color={color}
              scale={scale}
              wireframe={wireframe}
              roughness={roughness}
            />
            <Environment preset={lightingPreset} />
          </Suspense>
        </PresentationControls>

        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.6}
          scale={7}
          blur={2.5}
          far={3}
          color="#000000"
        />
      </Canvas>

      {/* Floating 3D Badge */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-luxe-900/80 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-widest text-gold-400">
        <Sparkles className="w-3 h-3 text-gold-400 animate-pulse" />
        <span>3D Photonic Matrix</span>
      </div>

      {/* Interactive Controls Overlay */}
      {showControls && (
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 p-1.5 rounded-xl bg-luxe-900/85 backdrop-blur-md border border-white/10 text-xs text-luxe-300">
          <button
            type="button"
            onClick={() => setWireframe(!wireframe)}
            title="Toggle Facet Wireframe"
            className={`p-1.5 rounded-lg transition ${
              wireframe ? 'bg-gold-500/20 text-gold-400 border border-gold-500/40' : 'hover:bg-white/10 text-luxe-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              const presets = ['studio', 'city', 'sunset', 'night'];
              const next = presets[(presets.indexOf(lightingPreset) + 1) % presets.length];
              setLightingPreset(next);
            }}
            title={`Lighting: ${lightingPreset}`}
            className="p-1.5 rounded-lg hover:bg-white/10 text-luxe-300 transition capitalize flex items-center gap-1 text-[11px]"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lightingPreset}</span>
          </button>
        </div>
      )}

      {/* Drag hint */}
      {interactive && (
        <div className="absolute bottom-3 left-3 text-[10px] text-luxe-400/80 flex items-center gap-1 pointer-events-none">
          <RotateCw className="w-3 h-3 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Drag to inspect facets</span>
        </div>
      )}
    </div>
  );
}

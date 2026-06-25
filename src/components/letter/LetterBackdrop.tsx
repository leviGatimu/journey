"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import PhotoCard from "@/components/three/PhotoCard";
import Particles from "@/components/three/Particles";
import { PHOTOS } from "@/lib/photos";

function DriftingDepthPhotos() {
  const group = useRef<THREE.Group>(null);
  const picks = useMemo(() => {
    const out = [];
    for (let i = 0; i < 10; i++) out.push(PHOTOS[(i * 6 + 2) % PHOTOS.length]);
    return out;
  }, []);
  const placed = useMemo(
    () =>
      picks.map((url, i) => ({
        url,
        position: [
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 10,
          -6 - Math.random() * 10,
        ] as [number, number, number],
        scale: 0.5 + Math.random() * 0.6,
        seed: i * 2.3,
      })),
    [picks]
  );

  useFrame((s) => {
    if (group.current) group.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.05) * 0.1;
  });

  return (
    <group ref={group}>
      {placed.map((p, i) => (
        <PhotoCard
          key={i}
          url={p.url}
          position={p.position}
          scale={p.scale}
          floatSeed={p.seed}
          framed={false}
          emissiveBoost={-0.1}
        />
      ))}
    </group>
  );
}

export default function LetterBackdrop() {
  return (
    <Canvas
      className="!fixed inset-0 -z-10"
      camera={{ position: [0, 0, 6], fov: 60 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={["#050409"]} />
      <fog attach="fog" args={["#050409", 6, 22]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 5]} intensity={12} color="#e79aa6" distance={30} />
      <Suspense fallback={null}>
        <DriftingDepthPhotos />
      </Suspense>
      <Particles count={600} color="#f4d9c6" size={0.035} spread={26} rise={0.06} opacity={0.5} />
      <Particles count={300} color="#cdbfe6" size={0.05} spread={22} rise={0.03} opacity={0.4} />
    </Canvas>
  );
}

"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import PhotoCard from "@/components/three/PhotoCard";
import Particles from "@/components/three/Particles";
import { PHOTOS } from "@/lib/photos";

function shuffle<T>(arr: T[], seed = 7) {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function DriftingPhotos() {
  const picks = useMemo(() => shuffle(PHOTOS).slice(0, 14), []);
  const placed = useMemo(
    () =>
      picks.map((url, i) => ({
        url,
        position: [
          (Math.random() - 0.5) * 11,
          (Math.random() - 0.5) * 6,
          -2 - Math.random() * 9,
        ] as [number, number, number],
        rotation: [0, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.3] as [
          number,
          number,
          number
        ],
        scale: 0.7 + Math.random() * 0.7,
        seed: i * 1.7,
      })),
    [picks]
  );

  return (
    <>
      {placed.map((p, i) => (
        <Float
          key={i}
          speed={1 + (i % 3) * 0.3}
          rotationIntensity={0.3}
          floatIntensity={0.6}
        >
          <PhotoCard
            url={p.url}
            position={p.position}
            rotation={p.rotation}
            scale={p.scale}
            floatSeed={p.seed}
            float={false}
          />
        </Float>
      ))}
    </>
  );
}

export default function WaitingRoomCanvas() {
  return (
    <Canvas
      className="!fixed inset-0"
      camera={{ position: [0, 0, 6], fov: 55 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={["#0a0810"]} />
      <fog attach="fog" args={["#0a0810", 6, 16]} />
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 3, 4]} intensity={20} color="#e79aa6" distance={20} />
      <pointLight position={[-5, -2, 2]} intensity={12} color="#cdbfe6" distance={20} />
      <Suspense fallback={null}>
        <DriftingPhotos />
      </Suspense>
      <Particles count={350} color="#f4d9c6" size={0.045} spread={20} rise={0.1} opacity={0.5} />
    </Canvas>
  );
}

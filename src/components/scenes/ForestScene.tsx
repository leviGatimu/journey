"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import PhotoCard from "@/components/three/PhotoCard";
import Particles from "@/components/three/Particles";
import FragmentObject from "@/components/three/FragmentObject";
import { fragmentsForWorld } from "@/lib/fragments";
import { useExperience } from "@/lib/store";
import { useCollect } from "@/lib/useCollect";
import { picksFor } from "@/lib/photoPick";
import { getWorld } from "@/lib/worlds";
import { scaled } from "@/lib/perf";

function Tree({ x, z, h }: { x: number; z: number; h: number }) {
  return (
    <mesh position={[x, h / 2 - 3, z]}>
      <cylinderGeometry args={[0.08, 0.16, h, 6]} />
      <meshStandardMaterial color="#22150f" roughness={1} />
    </mesh>
  );
}

function HangingPhoto({
  url,
  position,
  seed,
}: {
  url: string;
  position: [number, number, number];
  seed: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.7 + seed) * 0.12;
  });
  return (
    <group position={position}>
      {/* string */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 1.6, 4]} />
        <meshBasicMaterial color="#3a2d20" />
      </mesh>
      <group ref={ref}>
        <PhotoCard url={url} scale={0.62} float={false} floatSeed={seed} />
      </group>
    </group>
  );
}

export default function ForestScene() {
  const world = getWorld("forest")!;
  const photos = useMemo(() => picksFor("forest", 11), []);
  const frags = fragmentsForWorld("forest");
  const has = useExperience((s) => s.hasCollected);
  const collect = useCollect();

  const trees = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        x: (Math.random() - 0.5) * 22,
        z: -2 - Math.random() * 14,
        h: 7 + Math.random() * 5,
      })),
    []
  );

  const hanging = useMemo(
    () =>
      photos.map((url, i) => ({
        url,
        position: [
          (Math.random() - 0.5) * 14,
          1.5 + Math.random() * 2.5,
          -1 - Math.random() * 9,
        ] as [number, number, number],
        seed: i * 2.1,
      })),
    [photos]
  );

  return (
    <>
      <color attach="background" args={["#0c1710"]} />
      <fog attach="fog" args={["#0c1710", 8, 26]} />
      <hemisphereLight args={["#9fe6b8", "#1a2a1e", 0.6]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 6, 2]} intensity={30} color={world.glow} distance={30} />
      <spotLight
        position={[-6, 10, 4]}
        angle={0.6}
        penumbra={1}
        intensity={40}
        color="#cdbfff"
        distance={40}
      />

      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, -4]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#0a120c" roughness={1} />
      </mesh>

      {trees.map((t, i) => (
        <Tree key={i} {...t} />
      ))}

      {hanging.map((h, i) => (
        <Float key={i} speed={1} rotationIntensity={0.15} floatIntensity={0.3}>
          <HangingPhoto url={h.url} position={h.position} seed={h.seed} />
        </Float>
      ))}

      {/* fragments hidden among the branches */}
      {frags.map((f, i) => (
        <FragmentObject
          key={f.id}
          position={i === 0 ? [4.2, 2.2, -3] : [-3.6, 1.2, -5]}
          glow={world.glow}
          found={has(f.id)}
          onCollect={() => collect(f.id)}
          hint="behind the leaves…"
        />
      ))}

      <Particles count={scaled(300)} color="#bfeccb" size={0.05} spread={26} rise={0.05} opacity={0.4} />
    </>
  );
}

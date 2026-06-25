"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import PhotoCard from "@/components/three/PhotoCard";
import Particles from "@/components/three/Particles";
import FragmentObject from "@/components/three/FragmentObject";
import { fragmentsForWorld } from "@/lib/fragments";
import { useExperience } from "@/lib/store";
import { useCollect } from "@/lib/useCollect";
import { picksFor } from "@/lib/photoPick";
import { getWorld } from "@/lib/worlds";
import { reflectorRes, scaled, isLow } from "@/lib/perf";

const LANE_START = 14;
const LANE_END = -14;
const SPEED = 1.1;

function DriftingFrame({
  url,
  offset,
  lane,
  speed,
}: {
  url: string;
  offset: number;
  lane: number;
  speed: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((s, dt) => {
    if (!ref.current) return;
    ref.current.position.x -= dt * speed;
    if (ref.current.position.x < LANE_END) ref.current.position.x = LANE_START;
    ref.current.position.y =
      0.6 + Math.sin(s.clock.elapsedTime * 0.8 + offset) * 0.12;
    ref.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.5 + offset) * 0.06;
  });
  return (
    <group ref={ref} position={[LANE_START - offset, 0.6, lane]} rotation={[-0.35, 0, 0]}>
      <PhotoCard url={url} scale={0.6} float={false} />
    </group>
  );
}

function DriftingFragment({
  position,
  glow,
  found,
  onCollect,
}: {
  position: [number, number, number];
  glow: string;
  found: boolean;
  onCollect: () => void;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((s, dt) => {
    if (!ref.current) return;
    ref.current.position.x -= dt * SPEED * 0.7;
    if (ref.current.position.x < LANE_END) ref.current.position.x = LANE_START;
  });
  return (
    <group ref={ref} position={position}>
      <FragmentObject
        position={[0, 0, 0]}
        glow={glow}
        found={found}
        onCollect={onCollect}
        hint="floating by…"
      />
    </group>
  );
}

export default function RiverScene() {
  const world = getWorld("river")!;
  const photos = useMemo(() => picksFor("river", 10), []);
  const frags = fragmentsForWorld("river");
  const has = useExperience((s) => s.hasCollected);
  const collect = useCollect();

  const frames = useMemo(
    () =>
      photos.map((url, i) => ({
        url,
        offset: (i / photos.length) * (LANE_START - LANE_END),
        lane: -1.5 + (i % 3) * 1.4,
        speed: SPEED * (0.8 + Math.random() * 0.5),
      })),
    [photos]
  );

  return (
    <>
      <color attach="background" args={["#08131f"]} />
      <fog attach="fog" args={["#08131f", 10, 30]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 5, 6]} intensity={40} color={world.glow} distance={40} />
      <pointLight position={[-8, 4, -4]} intensity={20} color="#9a7fe6" distance={30} />
      <directionalLight position={[2, 8, 2]} intensity={1.2} color="#cfe6ff" />

      {/* water */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <planeGeometry args={[80, 60]} />
        <MeshReflectorMaterial
          blur={isLow() ? [128, 64] : [400, 120]}
          resolution={reflectorRes()}
          mixBlur={1}
          mixStrength={6}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          roughness={0.6}
          metalness={0.2}
          color="#0a1c2e"
          mirror={0.55}
        />
      </mesh>

      {frames.map((f, i) => (
        <DriftingFrame key={i} {...f} />
      ))}

      {frags.map((f, i) => (
        <DriftingFragment
          key={f.id}
          position={[i === 0 ? 6 : -2, 0.9, i === 0 ? 0.5 : -1]}
          glow={world.glow}
          found={has(f.id)}
          onCollect={() => collect(f.id)}
        />
      ))}

      <Particles count={scaled(250)} color="#bfe0ff" size={0.04} spread={28} rise={0.08} opacity={0.4} />
    </>
  );
}

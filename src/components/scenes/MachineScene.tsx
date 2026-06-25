"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
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

function Gear({
  urls,
  position,
  radius,
  dir,
  power,
}: {
  urls: string[];
  position: [number, number, number];
  radius: number;
  dir: number;
  power: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * dir * (0.05 + power * 0.5);
  });
  return (
    <group ref={ref} position={position}>
      {/* hub */}
      <mesh>
        <cylinderGeometry args={[radius * 0.25, radius * 0.25, 0.2, 24]} />
        <meshStandardMaterial color="#5a3d2a" metalness={0.5} roughness={0.5} />
      </mesh>
      {urls.map((url, i) => {
        const a = (i / urls.length) * Math.PI * 2;
        return (
          <group
            key={i}
            position={[Math.cos(a) * radius, Math.sin(a) * radius, 0]}
            rotation={[0, 0, a + Math.PI / 2]}
          >
            <PhotoCard url={url} scale={radius * 0.32} float={false} framed />
          </group>
        );
      })}
    </group>
  );
}

export default function MachineScene() {
  const world = getWorld("machine")!;
  const photos = useMemo(() => picksFor("machine", 13), []);
  const frags = fragmentsForWorld("machine");
  const has = useExperience((s) => s.hasCollected);
  const count = useExperience((s) => s.collected.length);
  const total = useExperience((s) => s.total());
  const collect = useCollect();
  const power = Math.min(1, count / total);

  const gears = useMemo(
    () => [
      { urls: photos.slice(0, 7), position: [0, 0.5, -2] as [number, number, number], radius: 2.4, dir: 1 },
      { urls: photos.slice(7, 12), position: [3.6, -1.2, -3] as [number, number, number], radius: 1.5, dir: -1 },
      { urls: photos.slice(2, 6), position: [-3.4, -1.6, -2.4] as [number, number, number], radius: 1.2, dir: -1 },
    ],
    [photos]
  );

  return (
    <>
      <color attach="background" args={["#1a1210"]} />
      <fog attach="fog" args={["#1a1210", 9, 28]} />
      <ambientLight intensity={0.4} />
      <pointLight
        position={[0, 1, 5]}
        intensity={30 + power * 60}
        color={world.glow}
        distance={40}
      />
      <pointLight position={[-6, 3, -2]} intensity={15} color="#ff8a4a" distance={30} />

      {gears.map((g, i) => (
        <Gear key={i} {...g} power={power} />
      ))}

      {/* central glowing core that brightens with power */}
      <mesh position={[0, 0.5, -1.9]}>
        <sphereGeometry args={[0.5 + power * 0.4, 24, 24]} />
        <meshStandardMaterial
          color={world.glow}
          emissive={world.glow}
          emissiveIntensity={1 + power * 5}
          toneMapped={false}
        />
      </mesh>

      {frags.map((f, i) => (
        <FragmentObject
          key={f.id}
          position={i === 0 ? [5.5, 1.5, -1] : [-5.2, 1.8, -1.5]}
          glow={world.glow}
          found={has(f.id)}
          onCollect={() => collect(f.id)}
          hint="feed it to the machine"
        />
      ))}

      <Particles count={scaled(300)} color="#ffb070" size={0.05} spread={24} rise={0.2} opacity={0.5} />
    </>
  );
}

"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import * as THREE from "three";
import PhotoCard from "@/components/three/PhotoCard";
import Particles from "@/components/three/Particles";
import FragmentObject from "@/components/three/FragmentObject";
import { fragmentsForWorld } from "@/lib/fragments";
import { useExperience } from "@/lib/store";
import { useCollect } from "@/lib/useCollect";
import { picksFor } from "@/lib/photoPick";
import { getWorld } from "@/lib/worlds";
import { ambient } from "@/lib/audio";
import { scaled } from "@/lib/perf";

function Drawer({
  position,
  glow,
  fragId,
  found,
  onCollect,
}: {
  position: [number, number, number];
  glow: string;
  fragId: string;
  found: boolean;
  onCollect: () => void;
}) {
  const [open, setOpen] = useState(false);
  const drawer = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!drawer.current) return;
    const target = open ? 0.9 : 0;
    drawer.current.position.z = THREE.MathUtils.lerp(
      drawer.current.position.z,
      target,
      0.12
    );
  });
  return (
    <group position={position}>
      {/* cabinet body */}
      <mesh>
        <boxGeometry args={[1.6, 1.1, 1.2]} />
        <meshStandardMaterial color="#3b2c20" roughness={0.85} />
      </mesh>
      {/* drawer */}
      <group
        ref={drawer}
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          ambient.thunk();
          setOpen((o) => !o);
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <mesh position={[0, 0, 0.62]}>
          <boxGeometry args={[1.4, 0.46, 0.1]} />
          <meshStandardMaterial color="#5a4632" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.05, 0.68]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#caa56a" metalness={0.6} roughness={0.3} />
        </mesh>
        {!open && (
          <Html center position={[0, -0.45, 0.7]} distanceFactor={9}>
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#f4d9c6",
                opacity: 0.6,
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              open
            </div>
          </Html>
        )}
      </group>
      {/* fragment revealed inside */}
      {open && (
        <FragmentObject
          position={[0, 0.1, 1.3]}
          glow={glow}
          found={found}
          onCollect={onCollect}
          scale={0.8}
          hint="tucked in the drawer"
        />
      )}
    </group>
  );
}

export default function AtticScene() {
  const world = getWorld("attic")!;
  const photos = useMemo(() => picksFor("attic", 12), []);
  const frags = fragmentsForWorld("attic");
  const has = useExperience((s) => s.hasCollected);
  const collect = useCollect();

  const floaters = useMemo(
    () =>
      photos.map((url, i) => ({
        url,
        position: [
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 7,
          -1 - Math.random() * 8,
        ] as [number, number, number],
        rot: [
          (Math.random() - 0.5) * 0.6,
          (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 0.5,
        ] as [number, number, number],
        scale: 0.5 + Math.random() * 0.6,
        seed: i * 1.3,
      })),
    [photos]
  );

  return (
    <>
      <color attach="background" args={["#171221"]} />
      <fog attach="fog" args={["#171221", 9, 28]} />
      <ambientLight intensity={0.35} />
      {/* volumetric shaft */}
      <spotLight
        position={[3, 9, 3]}
        angle={0.5}
        penumbra={1}
        intensity={120}
        color="#ffd9a0"
        distance={40}
        castShadow={false}
      />
      <pointLight position={[-5, 2, 4]} intensity={18} color={world.glow} distance={26} />

      {/* faint floor + back wall to ground the room */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, -4]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#0f0b16" roughness={1} />
      </mesh>

      {floaters.map((f, i) => (
        <Float key={i} speed={1.2} rotationIntensity={0.5} floatIntensity={1}>
          <PhotoCard
            url={f.url}
            position={f.position}
            rotation={f.rot}
            scale={f.scale}
            floatSeed={f.seed}
            float={false}
          />
        </Float>
      ))}

      {frags.map((f, i) => (
        <Drawer
          key={f.id}
          position={i === 0 ? [-3.5, -2, -1] : [4, -1.5, -3]}
          glow={world.glow}
          fragId={f.id}
          found={has(f.id)}
          onCollect={() => collect(f.id)}
        />
      ))}

      <Particles count={scaled(500)} color="#ffe6c0" size={0.035} spread={22} rise={-0.04} opacity={0.5} />
    </>
  );
}

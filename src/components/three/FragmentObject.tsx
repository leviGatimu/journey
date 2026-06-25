"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface Props {
  position: [number, number, number];
  glow: string;
  found: boolean;
  onCollect: () => void;
  /** screen-space hint when very close/hovered */
  hint?: string;
  scale?: number;
}

export default function FragmentObject({
  position,
  glow,
  found,
  onCollect,
  hint = "a piece of the letter",
  scale = 1,
}: Props) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [collecting, setCollecting] = useState(false);
  const progress = useRef(0);
  const color = new THREE.Color(glow);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.8;
    group.current.rotation.z = Math.sin(t * 1.2) * 0.2;
    group.current.position.y = position[1] + Math.sin(t * 1.5) * 0.18;

    if (collecting) {
      progress.current = Math.min(1, progress.current + delta * 1.6);
      const p = progress.current;
      group.current.scale.setScalar(scale * (1 + p * 2.5));
      group.current.rotation.y += delta * 12;
      const mat = (group.current.children[0] as THREE.Mesh)
        .material as THREE.MeshStandardMaterial;
      mat.opacity = 1 - p;
      mat.emissiveIntensity = 1 + p * 4;
    }
  });

  if (found) return null;

  return (
    <group
      ref={group}
      position={position}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        if (collecting) return;
        setCollecting(true);
        document.body.style.cursor = "auto";
        setTimeout(onCollect, 520);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* folded paper scrap */}
      <mesh rotation={[0, 0, Math.PI * 0.06]}>
        <planeGeometry args={[0.5, 0.62]} />
        <meshStandardMaterial
          color="#f7eede"
          emissive={color}
          emissiveIntensity={hovered ? 1.6 : 0.9}
          transparent
          opacity={1}
          side={THREE.DoubleSide}
          roughness={0.7}
        />
      </mesh>
      {/* fold crease */}
      <mesh position={[0, 0, 0.001]} rotation={[0, 0, Math.PI * 0.06]}>
        <planeGeometry args={[0.5, 0.01]} />
        <meshBasicMaterial color="#d8c8ab" />
      </mesh>
      {/* halo */}
      <sprite scale={hovered ? 2.6 : 2}>
        <spriteMaterial
          map={haloTexture()}
          color={color}
          transparent
          opacity={collecting ? 0.9 : 0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      <pointLight color={color} intensity={hovered ? 4 : 2} distance={4} />

      {hovered && !collecting && (
        <Html center distanceFactor={8} position={[0, 0.7, 0]}>
          <div
            style={{
              whiteSpace: "nowrap",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#f4d9c6",
              background: "rgba(10,8,16,0.6)",
              padding: "6px 12px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(6px)",
              pointerEvents: "none",
              transform: "translateY(-4px)",
            }}
          >
            {hint}
          </div>
        </Html>
      )}
    </group>
  );
}

// cached radial-gradient halo
let _halo: THREE.Texture | null = null;
function haloTexture() {
  if (_halo) return _halo;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.3, "rgba(255,255,255,0.5)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  _halo = new THREE.CanvasTexture(c);
  return _halo;
}

"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface PhotoCardProps {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  /** gentle floating motion */
  float?: boolean;
  floatSeed?: number;
  /** cream polaroid border */
  framed?: boolean;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
  emissiveBoost?: number;
}

export default function PhotoCard({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  float = true,
  floatSeed = 0,
  framed = true,
  onClick,
  emissiveBoost = 0,
}: PhotoCardProps) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const texture = useTexture(url);

  // fit to a 1 x ratio plane; default portrait-ish
  const aspect = useMemo(() => {
    const img = texture.image as HTMLImageElement | undefined;
    if (img && img.width && img.height) return img.width / img.height;
    return 0.8;
  }, [texture]);

  const w = aspect >= 1 ? 1.4 : 1.4 * aspect;
  const h = aspect >= 1 ? 1.4 / aspect : 1.4;

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime + floatSeed;
    if (float) {
      group.current.position.y = position[1] + Math.sin(t * 0.6) * 0.12;
      group.current.rotation.z = rotation[2] + Math.sin(t * 0.4) * 0.05;
      group.current.rotation.y = rotation[1] + Math.sin(t * 0.3) * 0.08;
    }
    const target = hovered ? 1.12 : 1;
    group.current.scale.lerp(
      new THREE.Vector3(scale * target, scale * target, scale * target),
      0.1
    );
  });

  return (
    <group
      ref={group}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        if (onClick) document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {framed && (
        <mesh position={[0, -0.04, -0.01]}>
          <planeGeometry args={[w + 0.16, h + 0.28]} />
          <meshStandardMaterial
            color="#f6ecdf"
            emissive="#f6ecdf"
            emissiveIntensity={0.12 + emissiveBoost}
            roughness={0.9}
          />
        </mesh>
      )}
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={(hovered ? 0.5 : 0.18) + emissiveBoost}
          roughness={0.85}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

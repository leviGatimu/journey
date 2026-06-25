"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { PHOTOS } from "@/lib/photos";
import { dprCap, scaled } from "@/lib/perf";

const DEPTH = 90; // length of the tunnel along z
const NEAR = 6; // where a photo gets recycled once it passes the camera

interface Item {
  x: number;
  y: number;
  z: number;
  rot: number;
  scale: number;
  tex: number;
}

function Tunnel({
  duration,
  onDone,
}: {
  duration: number;
  onDone: () => void;
}) {
  const textures = useTexture(PHOTOS) as THREE.Texture[];
  const group = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const start = useRef(0);
  const fired = useRef(false);
  const { camera } = useThree();

  const items = useMemo<Item[]>(() => {
    const n = scaled(110);
    return Array.from({ length: n }, () => ({
      x: (Math.random() - 0.5) * 9,
      y: (Math.random() - 0.5) * 6,
      z: -Math.random() * DEPTH,
      rot: (Math.random() - 0.5) * 0.6,
      scale: 0.7 + Math.random() * 1.1,
      tex: Math.floor(Math.random() * PHOTOS.length),
    }));
  }, []);

  useFrame((state, dt) => {
    if (!start.current) start.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - start.current;
    const p = Math.min(1, t / duration);
    // accelerate as we "dive in"
    const speed = 10 + p * p * 70;

    for (let i = 0; i < items.length; i++) {
      const m = meshes.current[i];
      if (!m) continue;
      m.position.z += speed * dt;
      m.rotation.z += dt * 0.15;
      if (m.position.z > NEAR) {
        m.position.z -= DEPTH;
        m.position.x = (Math.random() - 0.5) * 9;
        m.position.y = (Math.random() - 0.5) * 6;
      }
    }

    // subtle dive: camera eases forward + tiny sway, fov punches in at the end
    camera.position.x = Math.sin(t * 0.6) * 0.25;
    camera.position.y = Math.cos(t * 0.5) * 0.2;
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = 60 + p * p * 25;
    cam.updateProjectionMatrix();

    if (p >= 1 && !fired.current) {
      fired.current = true;
      onDone();
    }
  });

  return (
    <group ref={group}>
      {items.map((it, i) => {
        const tex = textures[it.tex];
        const img = tex?.image as HTMLImageElement | undefined;
        const aspect = img && img.width ? img.width / img.height : 0.8;
        const w = aspect >= 1 ? 1.6 : 1.6 * aspect;
        const h = aspect >= 1 ? 1.6 / aspect : 1.6;
        return (
          <mesh
            key={i}
            ref={(el) => (meshes.current[i] = el)}
            position={[it.x, it.y, it.z]}
            rotation={[0, 0, it.rot]}
            scale={it.scale}
          >
            <planeGeometry args={[w, h]} />
            <meshStandardMaterial
              map={tex}
              emissiveMap={tex}
              emissive="#ffffff"
              emissiveIntensity={0.35}
              toneMapped={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function PhotoTunnel({
  duration = 7,
  onDone,
}: {
  duration?: number;
  onDone: () => void;
}) {
  return (
    <Canvas
      className="!fixed inset-0"
      camera={{ position: [0, 0, 0], fov: 60 }}
      dpr={[1, dprCap()]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#050409"]} />
      <fog attach="fog" args={["#050409", 10, 70]} />
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 0, 3]} intensity={20} color="#e79aa6" distance={30} />
      <pointLight position={[0, 0, -20]} intensity={30} color="#cdbfe6" distance={60} />
      <Suspense fallback={null}>
        <Tunnel duration={duration} onDone={onDone} />
      </Suspense>
    </Canvas>
  );
}

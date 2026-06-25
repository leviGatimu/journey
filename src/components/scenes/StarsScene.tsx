"use client";

import { useMemo, useState } from "react";
import { Line, Html, Billboard } from "@react-three/drei";
import * as THREE from "three";
import PhotoCard from "@/components/three/PhotoCard";
import { haloTexture } from "@/components/three/halo";
import { ambient } from "@/lib/audio";
import { scaled } from "@/lib/perf";
import Particles from "@/components/three/Particles";
import FragmentObject from "@/components/three/FragmentObject";
import { fragmentsForWorld } from "@/lib/fragments";
import { useExperience } from "@/lib/store";
import { useCollect } from "@/lib/useCollect";
import { picksFor } from "@/lib/photoPick";
import { getWorld } from "@/lib/worlds";

// tiny personal one-liners — keep them small and cute, never dramatic
const NOTES = [
  "still one of my favourite photos",
  "this one is hilarious 😭",
  "clock ittt",
  "you were SO happy here",
  "no notes. iconic.",
  "i think about this day a lot",
  "the lighting?? unreal",
  "okay supermodel",
];

function StarPhoto({
  url,
  position,
  note,
}: {
  url: string;
  position: [number, number, number];
  note: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <group position={position}>
      <Billboard>
        <group
          onClick={(e) => {
            e.stopPropagation();
            ambient.ping();
            setOpen((o) => !o);
          }}
        >
          <PhotoCard url={url} scale={0.4} float floatSeed={position[0]} framed />
          <sprite scale={1.7} position={[0, 0, -0.1]}>
            <spriteMaterial
              map={haloTexture()}
              color="#c9b6ff"
              transparent
              opacity={0.5}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </sprite>
        </group>
        {open && (
          <Html center position={[0, 0.9, 0]} distanceFactor={10}>
            <div
              style={{
                whiteSpace: "nowrap",
                fontSize: 13,
                fontStyle: "italic",
                fontFamily: "var(--font-serif), serif",
                color: "#f4d9c6",
                background: "rgba(10,8,22,0.7)",
                padding: "8px 16px",
                borderRadius: 999,
                border: "1px solid rgba(201,182,255,0.3)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 0 30px rgba(201,182,255,0.25)",
                pointerEvents: "none",
              }}
            >
              {note}
            </div>
          </Html>
        )}
      </Billboard>
    </group>
  );
}

export default function StarsScene() {
  const world = getWorld("stars")!;
  const photos = useMemo(() => picksFor("stars", 12), []);
  const frags = fragmentsForWorld("stars");
  const has = useExperience((s) => s.hasCollected);
  const collect = useCollect();

  const stars = useMemo(() => {
    // arrange on a loose dome
    return photos.map((url, i) => {
      const a = (i / photos.length) * Math.PI * 2;
      const r = 4 + (i % 3);
      return {
        url,
        note: NOTES[i % NOTES.length],
        position: [
          Math.cos(a) * r,
          (Math.sin(i * 1.7) * 3) ,
          -3 - Math.sin(a) * r * 0.5,
        ] as [number, number, number],
      };
    });
  }, [photos]);

  const lines = useMemo(() => {
    const segs: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < stars.length - 1; i++) {
      segs.push([
        new THREE.Vector3(...stars[i].position),
        new THREE.Vector3(...stars[i + 1].position),
      ]);
    }
    return segs;
  }, [stars]);

  return (
    <>
      <color attach="background" args={["#05060f"]} />
      <fog attach="fog" args={["#05060f", 12, 32]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 6]} intensity={20} color={world.glow} distance={40} />

      {lines.map((seg, i) => (
        <Line
          key={i}
          points={[seg[0], seg[1]]}
          color={world.glow}
          lineWidth={0.6}
          transparent
          opacity={0.35}
        />
      ))}

      {stars.map((s, i) => (
        <StarPhoto key={i} {...s} />
      ))}

      {frags.map((f, i) => (
        <FragmentObject
          key={f.id}
          position={i === 0 ? [0, 3.4, -2] : [-5, -2.5, -4]}
          glow="#ffffff"
          found={has(f.id)}
          onCollect={() => collect(f.id)}
          hint="a star that isn't a star"
        />
      ))}

      <Particles count={scaled(900)} color="#decfff" size={0.03} spread={34} rise={0.02} opacity={0.8} />
      <Particles count={scaled(200)} color="#c9b6ff" size={0.05} spread={30} rise={0.0} opacity={0.6} />
    </>
  );
}

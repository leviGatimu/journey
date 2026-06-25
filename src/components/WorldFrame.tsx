"use client";

import { Suspense, useEffect, useState, ComponentType } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { World } from "@/lib/worlds";
import { fragmentsForWorld } from "@/lib/fragments";
import { useExperience } from "@/lib/store";
import { dprCap } from "@/lib/perf";

import ForestScene from "@/components/scenes/ForestScene";
import RiverScene from "@/components/scenes/RiverScene";
import AtticScene from "@/components/scenes/AtticScene";
import StarsScene from "@/components/scenes/StarsScene";
import MachineScene from "@/components/scenes/MachineScene";

const SCENES: Record<string, ComponentType> = {
  forest: ForestScene,
  river: RiverScene,
  attic: AtticScene,
  stars: StarsScene,
  machine: MachineScene,
};

export default function WorldFrame({
  world,
  onExit,
}: {
  world: World;
  onExit: () => void;
}) {
  const Scene = SCENES[world.id];
  const [showIntro, setShowIntro] = useState(true);
  const collected = useExperience((s) => s.collected);
  const visit = useExperience((s) => s.visit);

  const worldFrags = fragmentsForWorld(world.id);
  const foundHere = worldFrags.filter((f) => collected.includes(f.id)).length;
  const allHere = foundHere >= worldFrags.length;

  useEffect(() => {
    visit(world.id);
    const t = setTimeout(() => setShowIntro(false), 4000);
    return () => clearTimeout(t);
  }, [world.id, visit]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="relative h-[100dvh] w-full overflow-hidden"
    >
      <Canvas
        camera={{ position: [0, 0, 9], fov: 55 }}
        dpr={[1, dprCap()]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={4}
          maxDistance={16}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.5}
          minPolarAngle={Math.PI * 0.18}
          maxPolarAngle={Math.PI * 0.82}
          autoRotate={showIntro}
          autoRotateSpeed={0.3}
        />
      </Canvas>

      <div className="vignette pointer-events-none absolute inset-0 z-10" />

      {/* back button */}
      <button
        onClick={onExit}
        className="fixed left-5 top-5 z-40 flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2.5 text-[11px] uppercase tracking-cinematic text-bloom/70 backdrop-blur-md transition-colors hover:border-white/40 hover:text-bloom"
      >
        ← the worlds
      </button>

      {/* world progress */}
      <div className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 text-center">
        <div className="flex items-center gap-2">
          {worldFrags.map((f) => (
            <span
              key={f.id}
              className={`h-1.5 w-8 rounded-full transition-all duration-700 ${
                collected.includes(f.id)
                  ? "bg-rose shadow-[0_0_10px_2px_rgba(231,154,166,0.6)]"
                  : "bg-white/15"
              }`}
            />
          ))}
        </div>
        <p className="mt-2 text-[10px] uppercase tracking-cinematic text-bloom/40">
          {allHere
            ? "nothing left to find here"
            : `${foundHere} / ${worldFrags.length} pieces · look closer · drag to explore`}
        </p>
      </div>

      {/* intro title card */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 1 }}
            className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center text-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-[11px] uppercase tracking-cinematic text-bloom/50"
            >
              world {world.index}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.5, duration: 1.2 }}
              className="mt-2 font-serif text-4xl italic text-bloom sm:text-6xl"
              style={{ textShadow: `0 0 50px ${world.glow}66` }}
            >
              {world.name}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1.2 }}
              className="mt-3 font-serif text-base italic text-bloom/60"
            >
              {world.subtitle}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

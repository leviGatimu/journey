"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { WORLDS } from "@/lib/worlds";
import { fragmentsForWorld } from "@/lib/fragments";
import { useExperience } from "@/lib/store";
import { picksFor } from "@/lib/photoPick";
import { NAME } from "@/lib/config";

export default function Hub({
  onEnter,
}: {
  onEnter: (worldId: string) => void;
}) {
  const collected = useExperience((s) => s.collected);
  const total = useExperience((s) => s.total());
  const [hover, setHover] = useState<string | null>(null);

  const active = WORLDS.find((w) => w.id === hover);

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-ink">
      {/* ambient color wash reacting to hover */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        animate={{
          background: active
            ? `radial-gradient(60% 60% at 70% 40%, ${active.glow}22, transparent 70%)`
            : "radial-gradient(60% 60% at 50% 30%, #e79aa611, transparent 70%)",
        }}
        transition={{ duration: 1 }}
      />
      <div className="grain pointer-events-none absolute inset-0 z-0" />

      {/* hover photo montage */}
      {active && (
        <motion.div
          key={active.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.22 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none absolute inset-0 z-0"
        >
          {picksFor(active.id, 6).map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06, duration: 1 }}
              className="absolute overflow-hidden rounded-sm"
              style={{
                width: 180,
                height: 230,
                left: `${10 + ((i * 37) % 78)}%`,
                top: `${8 + ((i * 53) % 70)}%`,
                rotate: `${(i % 2 ? -1 : 1) * (3 + i)}deg`,
              }}
            >
              <Image src={src} alt="" fill sizes="180px" className="object-cover" />
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="relative z-10 mx-auto max-w-4xl px-6 pb-32 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="mb-16 text-center"
        >
          <p className="text-[11px] uppercase tracking-cinematic text-rose/70">
            the letter is in pieces
          </p>
          <h1 className="mt-3 font-serif text-3xl italic text-bloom sm:text-4xl">
            five places remember {NAME}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-bloom/50 text-balance">
            somewhere in each of them, a torn fragment is waiting. wander in.
            touch what glows. bring every piece home, and the letter will open
            itself.
          </p>
          <p className="mt-6 font-serif text-lg text-bloom/80">
            {collected.length}{" "}
            <span className="text-bloom/30">/ {total} fragments recovered</span>
          </p>
        </motion.div>

        <div className="flex flex-col">
          {WORLDS.map((w, i) => {
            const frags = fragmentsForWorld(w.id);
            const found = frags.filter((f) => collected.includes(f.id)).length;
            const done = found >= frags.length;
            return (
              <motion.button
                key={w.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.9 }}
                onMouseEnter={() => setHover(w.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => onEnter(w.id)}
                className="group relative flex items-baseline gap-5 border-b border-white/8 py-7 text-left transition-all hover:pl-4"
              >
                <span className="font-serif text-sm text-bloom/30">
                  0{w.index}
                </span>
                <span className="flex-1">
                  <span
                    className="block font-serif text-3xl italic text-bloom transition-all duration-500 group-hover:tracking-wide sm:text-5xl"
                    style={{
                      textShadow:
                        hover === w.id ? `0 0 40px ${w.glow}88` : "none",
                    }}
                  >
                    {w.name}
                  </span>
                  <span className="mt-1 block text-xs text-bloom/40">
                    {w.tagline}
                  </span>
                </span>
                <span className="flex items-center gap-2 pr-1">
                  {frags.map((f) => (
                    <span
                      key={f.id}
                      className={`h-1.5 w-1.5 rounded-full ${
                        collected.includes(f.id)
                          ? "bg-rose shadow-[0_0_8px_2px_rgba(231,154,166,0.7)]"
                          : "bg-white/20"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-[10px] uppercase tracking-cinematic text-bloom/40">
                    {done ? "complete" : "enter"}
                  </span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

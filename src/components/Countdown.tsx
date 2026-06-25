"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { timeUntilUnlock, NAME } from "@/lib/config";
import SoundToggle from "@/components/ui/SoundToggle";
import { useExperience } from "@/lib/store";

const WaitingRoomCanvas = dynamic(
  () => import("@/components/scenes/WaitingRoomCanvas"),
  { ssr: false }
);

function Unit({ value, label }: { value: number; label: string }) {
  const v = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="flex">
        {v.split("").map((d, i) => (
          <span
            key={i}
            className="relative inline-block w-[0.62em] text-center font-serif text-[clamp(3rem,11vw,8rem)] font-light leading-none text-bloom"
            style={{ textShadow: "0 0 40px rgba(231,154,166,0.35)" }}
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                key={d}
                initial={{ y: "0.4em", opacity: 0, filter: "blur(8px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: "-0.4em", opacity: 0, filter: "blur(8px)" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                {d}
              </motion.span>
            </AnimatePresence>
          </span>
        ))}
      </div>
      <span className="mt-2 text-[10px] uppercase tracking-cinematic text-bloom/40">
        {label}
      </span>
    </div>
  );
}

export default function Countdown({ onUnlock }: { onUnlock: () => void }) {
  const [t, setT] = useState(() => timeUntilUnlock());
  const setForceUnlocked = useExperience((s) => s.setForceUnlocked);

  useEffect(() => {
    const id = setInterval(() => {
      const next = timeUntilUnlock();
      setT(next);
      if (next.unlocked) {
        clearInterval(id);
        setTimeout(onUnlock, 400);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [onUnlock]);

  // Preview key for the gift-giver: Shift + U unlocks early.
  const forceOpen = useCallback(() => {
    setForceUnlocked(true);
    onUnlock();
  }, [onUnlock, setForceUnlocked]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === "u") forceOpen();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [forceOpen]);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden">
      <WaitingRoomCanvas />

      {/* soft top + bottom gradient framing */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-ink/70 via-transparent to-ink/90" />
      <div className="vignette pointer-events-none absolute inset-0 z-10" />

      <div className="absolute left-5 top-5 z-30">
        <SoundToggle />
      </div>

      <div className="relative z-20 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.3 }}
          className="mb-6 text-[11px] uppercase tracking-cinematic text-rose/70"
        >
          something is waiting for {NAME.toLowerCase()}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, delay: 0.5 }}
          className="flex items-end gap-3 sm:gap-6"
        >
          <Unit value={t.days} label="days" />
          <span className="pb-8 font-serif text-4xl text-bloom/20 sm:text-6xl">:</span>
          <Unit value={t.hours} label="hours" />
          <span className="pb-8 font-serif text-4xl text-bloom/20 sm:text-6xl">:</span>
          <Unit value={t.minutes} label="minutes" />
          <span className="pb-8 font-serif text-4xl text-bloom/20 sm:text-6xl">:</span>
          <Unit value={t.seconds} label="seconds" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.2 }}
          className="mt-10 max-w-md font-serif text-lg italic leading-relaxed text-bloom/70 text-balance"
        >
          at midnight, a letter that was lost will begin to find its way back.
          stay a while. let the memories drift.
        </motion.p>
      </div>
    </div>
  );
}

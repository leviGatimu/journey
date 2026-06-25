"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useExperience } from "@/lib/store";
import { ambient } from "@/lib/audio";

export default function SoundToggle({ className = "" }: { className?: string }) {
  const sound = useExperience((s) => s.sound);
  const toggle = useExperience((s) => s.toggleSound);

  useEffect(() => {
    if (sound === "on") ambient.start();
    else ambient.stop();
  }, [sound]);

  const on = sound === "on";

  return (
    <button
      onClick={toggle}
      aria-label={on ? "Mute ambient sound" : "Play ambient sound"}
      className={`group flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 py-2 backdrop-blur-md transition-colors hover:border-white/40 ${className}`}
    >
      <span className="flex h-3 items-end gap-[2px]">
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="w-[2px] rounded-full bg-bloom"
            animate={on ? { height: [4, 12, 6, 11][i] } : { height: 3 }}
            transition={
              on
                ? { duration: 0.7 + i * 0.12, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
                : { duration: 0.3 }
            }
            style={{ height: 4 }}
          />
        ))}
      </span>
      <span className="text-[10px] uppercase tracking-cinematic text-bloom/70">
        {on ? "sound" : "muted"}
      </span>
    </button>
  );
}

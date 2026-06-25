"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAME } from "@/lib/config";

const LINES = [
  "happy birthday, " + NAME.toLowerCase() + ".",
  "someone wrote you a letter.",
  "but it didn't survive the journey here.",
  "it tore apart — and the pieces fell into your memories.",
  "they're out there now. waiting in five worlds.",
  "find them all, and the letter will remember how to speak.",
];

export default function IntroSequence({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (i >= LINES.length) {
      const t = setTimeout(onDone, 1400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setI((v) => v + 1), i === 0 ? 2600 : 3000);
    return () => clearTimeout(t);
  }, [i, onDone]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink px-6 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_45%,rgba(231,154,166,0.12),transparent_70%)]" />
      <AnimatePresence mode="wait">
        {i < LINES.length && (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(12px)" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl font-serif text-2xl italic leading-relaxed text-bloom text-balance sm:text-3xl"
          >
            {LINES[i]}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        onClick={onDone}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-cinematic text-bloom/30 transition-colors hover:text-bloom/70"
      >
        skip →
      </button>
    </div>
  );
}

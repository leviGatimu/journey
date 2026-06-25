"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FRAGMENTS } from "@/lib/fragments";
import { LETTER_OPENING } from "@/lib/letter";
import { ambient } from "@/lib/audio";

type Phase = "gather" | "form" | "door";

export default function AssemblyCinematic() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("gather");
  const ordered = [...FRAGMENTS].sort((a, b) => a.order - b.order);

  useEffect(() => {
    router.prefetch("/letter");
    ambient.swell();
    const t1 = setTimeout(() => setPhase("form"), 2600);
    const t2 = setTimeout(() => setPhase("door"), 5200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [router]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-ink">
      {/* radial light blooming as it assembles */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{
          background:
            phase === "door"
              ? "radial-gradient(40% 60% at 50% 50%, rgba(244,217,198,0.5), transparent 70%)"
              : "radial-gradient(40% 60% at 50% 50%, rgba(231,154,166,0.18), transparent 70%)",
        }}
        transition={{ duration: 1.5 }}
      />

      {/* flying scraps */}
      <AnimatePresence>
        {phase === "gather" &&
          ordered.map((f, i) => {
            const angle = (i / ordered.length) * Math.PI * 2;
            const radius = 420;
            return (
              <motion.div
                key={f.id}
                initial={{
                  x: Math.cos(angle) * radius,
                  y: Math.sin(angle) * radius,
                  rotate: (i % 2 ? 1 : -1) * 40,
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{ x: 0, y: i * 2 - 10, rotate: 0, opacity: 1, scale: 1 }}
                transition={{
                  duration: 2,
                  delay: i * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute h-3 w-56 rounded-[1px] bg-bloom/80"
                style={{ boxShadow: "0 0 24px rgba(244,217,198,0.5)" }}
              />
            );
          })}
      </AnimatePresence>

      {/* formed page */}
      <AnimatePresence>
        {(phase === "form" || phase === "door") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
            animate={
              phase === "door"
                ? { opacity: 1, scale: 1.05, rotateX: 0 }
                : { opacity: 1, scale: 1, rotateX: 0 }
            }
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center justify-center"
            style={{
              width: phase === "door" ? 320 : 360,
              height: phase === "door" ? 520 : 480,
              background:
                "linear-gradient(160deg,#f7eede,#efe2cd 60%,#e7d6bd)",
              borderRadius: phase === "door" ? "180px 180px 8px 8px" : 4,
              boxShadow:
                phase === "door"
                  ? "0 0 120px 30px rgba(244,217,198,0.6), inset 0 0 60px rgba(255,255,255,0.5)"
                  : "0 40px 120px rgba(0,0,0,0.6)",
              transition: "border-radius 1.2s ease, box-shadow 1.2s ease",
            }}
          >
            <span
              className="font-serif text-3xl italic"
              style={{ color: "#2c2016" }}
            >
              {phase === "door" ? "" : LETTER_OPENING}
            </span>

            {phase === "door" && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                onClick={() => router.push("/letter")}
                className="group absolute inset-0 flex flex-col items-center justify-center gap-3"
              >
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                  className="font-serif text-xl italic text-[#2c2016]"
                >
                  step through
                </motion.span>
                <span className="text-[10px] uppercase tracking-cinematic text-[#2c2016]/60">
                  the letter is waiting
                </span>
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "gather" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-24 text-[11px] uppercase tracking-cinematic text-bloom/50"
          >
            every piece is coming home…
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

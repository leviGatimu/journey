"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { LETTER_CLOSE } from "@/lib/letter";

const PhotoMosaic = dynamic(() => import("./PhotoMosaic"), { ssr: false });

type Phase = "silence" | "close" | "mosaic" | "rest";

export default function Ending() {
  const [phase, setPhase] = useState<Phase>("silence");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("close"), 1600);
    const t2 = setTimeout(() => setPhase("mosaic"), 6200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="fixed inset-0 z-20 flex items-center justify-center bg-ink"
    >
      <AnimatePresence>
        {phase === "close" && (
          <motion.p
            key="close"
            initial={{ opacity: 0, filter: "blur(14px)", y: 16 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, filter: "blur(14px)" }}
            transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl px-8 text-center font-serif text-2xl font-light italic leading-relaxed text-bloom text-balance sm:text-4xl"
          >
            {LETTER_CLOSE}
          </motion.p>
        )}
      </AnimatePresence>

      {(phase === "mosaic" || phase === "rest") && (
        <>
          <PhotoMosaic onReady={() => setPhase("rest")} />
          <AnimatePresence>
            {phase === "rest" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
                className="pointer-events-none absolute bottom-12 left-1/2 z-20 -translate-x-1/2 text-center"
              >
                <p className="text-[11px] uppercase tracking-cinematic text-rose/70">
                  made from every memory · with love ❤
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
}

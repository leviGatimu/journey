"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { LETTER_CLOSE } from "@/lib/letter";

const PhotoMosaic = dynamic(() => import("./PhotoMosaic"), { ssr: false });
const PhotoTunnel = dynamic(() => import("./PhotoTunnel"), { ssr: false });

type Phase = "silence" | "close" | "tunnel" | "mosaic" | "rest";

export default function Ending() {
  const [phase, setPhase] = useState<Phase>("silence");
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("close"), 1300);
    const t2 = setTimeout(() => setPhase("tunnel"), 5200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const onTunnelDone = () => {
    setFlash(true); // white blooms over the dive
    setTimeout(() => setPhase("mosaic"), 600); // swap behind the white
    setTimeout(() => setFlash(false), 1400); // fade white away, revealing the name
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="fixed inset-0 z-20 flex items-center justify-center overflow-hidden bg-ink"
    >
      <AnimatePresence>
        {phase === "close" && (
          <motion.p
            key="close"
            initial={{ opacity: 0, filter: "blur(14px)", y: 16 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, filter: "blur(14px)" }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl px-8 text-center font-serif text-2xl font-light italic leading-relaxed text-bloom text-balance sm:text-4xl"
          >
            {LETTER_CLOSE}
          </motion.p>
        )}
      </AnimatePresence>

      {phase === "tunnel" && <PhotoTunnel duration={7} onDone={onTunnelDone} />}

      {(phase === "mosaic" || phase === "rest") && (
        <>
          <PhotoMosaic onReady={() => setPhase("rest")} />
          <AnimatePresence>
            {phase === "rest" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
                className="pointer-events-none absolute bottom-12 left-1/2 z-30 -translate-x-1/2 text-center"
              >
                <p className="text-[11px] uppercase tracking-cinematic text-rose/70">
                  made from every memory · with love ❤
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* white bloom that bridges the dive into the mosaic */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-40 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: flash ? 1 : 0 }}
        transition={{ duration: flash ? 0.5 : 0.9, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

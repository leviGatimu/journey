"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useExperience } from "@/lib/store";
import { bus } from "@/lib/events";
import { ambient } from "@/lib/audio";

export default function ProgressHUD({
  onOpenBook,
}: {
  onOpenBook: () => void;
}) {
  const count = useExperience((s) => s.collected.length);
  const total = useExperience((s) => s.total());
  const sound = useExperience((s) => s.sound);
  const [toast, setToast] = useState<string | null>(null);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;
    const off = bus.on("collect", ({ scrap }) => {
      setToast(scrap);
      setPulse((p) => p + 1);
      if (sound === "on") ambient.chime();
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => setToast(null), 3200);
    });
    return () => {
      off();
      clearTimeout(hideTimer);
    };
  }, [sound]);

  return (
    <>
      {/* book / progress button */}
      <button
        onClick={onOpenBook}
        className="group fixed right-5 top-5 z-40 flex items-center gap-3 rounded-full border border-white/15 bg-black/40 px-4 py-2.5 backdrop-blur-md transition-all hover:border-white/40"
      >
        <motion.span
          key={pulse}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.35, 1] }}
          transition={{ duration: 0.6 }}
          className="font-serif text-sm text-bloom"
        >
          {count}
          <span className="text-bloom/40"> / {total}</span>
        </motion.span>
        <span className="text-[10px] uppercase tracking-cinematic text-bloom/60 group-hover:text-bloom">
          the letter
        </span>
        <span className="h-2 w-2 rounded-full bg-rose shadow-[0_0_12px_4px_rgba(231,154,166,0.6)]" />
      </button>

      {/* collect toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none fixed left-1/2 top-24 z-40 -translate-x-1/2 text-center"
          >
            <div className="mb-1 text-[10px] uppercase tracking-cinematic text-rose/80">
              a fragment returns
            </div>
            <div className="max-w-md font-serif text-lg italic text-bloom text-balance">
              “{toast}”
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

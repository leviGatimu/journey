"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FRAGMENTS } from "@/lib/fragments";
import { getWorld } from "@/lib/worlds";
import { useExperience } from "@/lib/store";
import { LETTER_OPENING } from "@/lib/letter";

export default function CollectionBook({
  open,
  onClose,
  onComplete,
}: {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}) {
  const collected = useExperience((s) => s.collected);
  const isComplete = useExperience((s) => s.isComplete());
  const ordered = [...FRAGMENTS].sort((a, b) => a.order - b.order);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 30, rotateX: 8 }}
            animate={{ scale: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="grain relative mx-4 max-h-[86vh] w-full max-w-2xl overflow-y-auto rounded-sm p-8 sm:p-12"
            style={{
              background:
                "linear-gradient(160deg,#f7eede 0%,#efe2cd 60%,#e7d6bd 100%)",
              boxShadow:
                "0 40px 120px rgba(0,0,0,0.6), inset 0 0 60px rgba(120,90,50,0.12)",
              color: "#3a2c20",
            }}
          >
            <button
              onClick={onClose}
              className="absolute right-5 top-5 text-xs uppercase tracking-cinematic text-[#7a6650] hover:text-[#3a2c20]"
              aria-label="Close the book"
            >
              close ✕
            </button>

            <p className="mb-1 text-center text-[11px] uppercase tracking-cinematic text-[#9a8568]">
              the recovered letter
            </p>
            <h2
              className="mb-8 text-center font-serif text-3xl italic"
              style={{ color: "#2c2016" }}
            >
              {LETTER_OPENING}
            </h2>

            <div className="space-y-3">
              {ordered.map((f, i) => {
                const has = collected.includes(f.id);
                const world = getWorld(f.worldId);
                return (
                  <motion.div
                    key={f.id}
                    layout
                    initial={false}
                    animate={{
                      opacity: has ? 1 : 0.32,
                    }}
                    className="relative"
                  >
                    {has ? (
                      <motion.p
                        initial={{ y: 14, opacity: 0, filter: "blur(6px)" }}
                        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                        transition={{ duration: 0.7, delay: i * 0.03 }}
                        className="font-serif text-lg leading-relaxed"
                        style={{
                          textShadow: "0 1px 0 rgba(255,255,255,0.4)",
                        }}
                      >
                        {f.scrap}
                      </motion.p>
                    ) : (
                      <div
                        className="select-none rounded-[2px] border border-dashed border-[#b8a583] px-3 py-2 font-serif text-sm italic"
                        style={{ color: "#9a8568" }}
                      >
                        — a torn piece, still lost in {world?.name.toLowerCase()} —
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-10 border-t border-[#cdbb98] pt-6 text-center">
              {isComplete ? (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  onClick={onComplete}
                  className="group relative overflow-hidden rounded-full px-8 py-3 font-serif text-lg italic text-[#f7eede]"
                  style={{ background: "#2c2016" }}
                >
                  <span className="relative z-10">the letter is whole — open it</span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-rose/50 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                </motion.button>
              ) : (
                <p className="text-sm tracking-wide text-[#9a8568]">
                  {collected.length} of {FRAGMENTS.length} pieces found ·
                  keep exploring
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { timeUntilUnlock } from "@/lib/config";
import { useExperience } from "@/lib/store";
import { getWorld } from "@/lib/worlds";

import dynamic from "next/dynamic";
import Countdown from "@/components/Countdown";
import IntroSequence from "@/components/IntroSequence";
import Hub from "@/components/Hub";
import ProgressHUD from "@/components/ui/ProgressHUD";
import CollectionBook from "@/components/ui/CollectionBook";
import SoundToggle from "@/components/ui/SoundToggle";
import AssemblyCinematic from "@/components/AssemblyCinematic";
import DevPanel from "@/components/dev/DevPanel"; // DEV MODE — remove before gifting

// R3F worlds must load client-side only (no SSR/prerender of WebGL)
const WorldFrame = dynamic(() => import("@/components/WorldFrame"), {
  ssr: false,
});

type Phase = "boot" | "locked" | "intro" | "hub" | "world" | "assembly";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("boot");
  const [worldId, setWorldId] = useState<string | null>(null);
  const [bookOpen, setBookOpen] = useState(false);

  const forceUnlocked = useExperience((s) => s.forceUnlocked);
  const visited = useExperience((s) => s.visited);

  // decide initial phase after mount (avoids SSR/date/localStorage mismatch)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const previewUnlock = params.get("unlock") === "1";
    const previewWorld = params.get("world");
    const skipIntro = params.get("skip") === "1";

    const unlocked = timeUntilUnlock().unlocked || forceUnlocked || previewUnlock;

    if (previewWorld && getWorld(previewWorld)) {
      setWorldId(previewWorld);
      setPhase("world");
      return;
    }
    if (!unlocked) {
      setPhase("locked");
    } else {
      setPhase(visited.length > 0 || skipIntro ? "hub" : "intro");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const world = worldId ? getWorld(worldId) : null;
  const showHud = phase === "hub" || phase === "world";

  return (
    <main className="relative min-h-[100dvh] w-full bg-ink">
      {showHud && (
        <>
          <ProgressHUD onOpenBook={() => setBookOpen(true)} />
          <div className="fixed bottom-5 right-5 z-40">
            <SoundToggle />
          </div>
        </>
      )}

      <AnimatePresence mode="wait">
        {phase === "boot" && (
          <motion.div
            key="boot"
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-ink"
          >
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="font-serif text-sm italic tracking-wide text-bloom/50"
            >
              gathering the light…
            </motion.span>
          </motion.div>
        )}

        {phase === "locked" && (
          <motion.div key="locked" exit={{ opacity: 0 }}>
            <Countdown onUnlock={() => setPhase("intro")} />
          </motion.div>
        )}

        {phase === "intro" && (
          <IntroSequence key="intro" onDone={() => setPhase("hub")} />
        )}

        {phase === "hub" && (
          <motion.div
            key="hub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Hub
              onEnter={(id) => {
                setWorldId(id);
                setPhase("world");
              }}
            />
          </motion.div>
        )}

        {phase === "world" && world && (
          <WorldFrame
            key={world.id}
            world={world}
            onExit={() => setPhase("hub")}
          />
        )}

        {phase === "assembly" && <AssemblyCinematic key="assembly" />}
      </AnimatePresence>

      <CollectionBook
        open={bookOpen}
        onClose={() => setBookOpen(false)}
        onComplete={() => {
          setBookOpen(false);
          setPhase("assembly");
        }}
      />

      {/* DEV MODE — remove before gifting */}
      <DevPanel
        variant="main"
        onPhase={setPhase}
        onWorld={(id) => {
          setWorldId(id);
          setPhase("world");
        }}
        onOpenBook={() => setBookOpen(true)}
      />
    </main>
  );
}

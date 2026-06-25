"use client";

// ─────────────────────────────────────────────────────────────────────────
// 🛠️  DEV MODE — temporary. Remove before gifting.
// To remove: delete this file, the <DevPanel/> mounts in src/app/page.tsx and
// src/app/letter/page.tsx, and their imports. That's it.
// Toggle the panel with the ` (backtick) key, or the little ⚙ button.
// ─────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WORLDS } from "@/lib/worlds";
import { FRAGMENTS } from "@/lib/fragments";
import { useExperience } from "@/lib/store";

interface Props {
  variant: "main" | "letter";
  onPhase?: (phase: "locked" | "intro" | "hub" | "world" | "assembly") => void;
  onWorld?: (id: string) => void;
  onOpenBook?: () => void;
  onEndLetter?: () => void;
}

const ALL_IDS = FRAGMENTS.map((f) => f.id);

export default function DevPanel({
  variant,
  onPhase,
  onWorld,
  onOpenBook,
  onEndLetter,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const collected = useExperience((s) => s.collected);
  const total = useExperience((s) => s.total());
  const setForceUnlocked = useExperience((s) => s.setForceUnlocked);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "`" || e.key === "~") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const collectAll = () => useExperience.setState({ collected: ALL_IDS });
  const clearFrags = () => useExperience.setState({ collected: [] });
  const hardReset = () => {
    useExperience.setState({ collected: [], visited: [], assembled: false });
    setForceUnlocked(false);
    if (variant === "letter") router.push("/?unlock=1");
    else onPhase?.("locked");
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        title="Dev panel (`)"
        className="fixed bottom-3 left-3 z-[100] h-8 w-8 rounded-md border border-cyan-400/40 bg-black/70 font-mono text-cyan-300 backdrop-blur"
      >
        ⚙
      </button>
    );
  }

  return (
    <div className="fixed bottom-3 left-3 z-[100] w-60 select-none rounded-lg border border-cyan-400/30 bg-black/85 p-3 font-mono text-[11px] text-cyan-100 shadow-[0_0_30px_rgba(0,0,0,0.6)] backdrop-blur">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-bold tracking-wide text-cyan-300">DEV MODE</span>
        <button
          onClick={() => setOpen(false)}
          className="text-cyan-400/70 hover:text-cyan-200"
          title="Hide (`)"
        >
          ✕
        </button>
      </div>

      <div className="mb-2 rounded bg-cyan-400/10 px-2 py-1 text-cyan-200">
        fragments: {collected.length} / {total}
      </div>

      {variant === "main" && (
        <>
          <Section label="navigate">
            <Btn onClick={() => onPhase?.("locked")}>countdown</Btn>
            <Btn onClick={() => onPhase?.("intro")}>intro</Btn>
            <Btn
              onClick={() => {
                setForceUnlocked(true);
                onPhase?.("hub");
              }}
            >
              hub
            </Btn>
          </Section>

          <Section label="worlds">
            {WORLDS.map((w) => (
              <Btn key={w.id} onClick={() => onWorld?.(w.id)}>
                {w.index}. {w.name.replace(/^The /, "")}
              </Btn>
            ))}
          </Section>

          <Section label="letter">
            <Btn onClick={collectAll}>collect all</Btn>
            <Btn onClick={clearFrags}>clear</Btn>
            <Btn onClick={() => onOpenBook?.()}>open book</Btn>
            <Btn
              onClick={() => {
                collectAll();
                onPhase?.("assembly");
              }}
            >
              play assembly →
            </Btn>
            <Btn onClick={() => router.push("/letter")}>go to /letter</Btn>
          </Section>
        </>
      )}

      {variant === "letter" && (
        <Section label="letter">
          <Btn
            onClick={() =>
              (window as any).__lenis?.scrollTo(0, { immediate: true })
            }
          >
            scroll to top
          </Btn>
          <Btn
            onClick={() =>
              (window as any).__lenis?.scrollTo(99999, { immediate: true })
            }
          >
            scroll to end
          </Btn>
          <Btn onClick={() => onEndLetter?.()}>skip to ending →</Btn>
          <Btn onClick={() => router.push("/?unlock=1")}>← back to worlds</Btn>
        </Section>
      )}

      <div className="mt-2 border-t border-cyan-400/20 pt-2">
        <Btn onClick={hardReset} danger>
          reset everything
        </Btn>
      </div>
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2">
      <div className="mb-1 text-[9px] uppercase tracking-widest text-cyan-400/50">
        {label}
      </div>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function Btn({
  children,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded px-2 py-1 text-left transition-colors ${
        danger
          ? "border border-red-400/40 text-red-300 hover:bg-red-400/15"
          : "border border-cyan-400/20 text-cyan-100 hover:bg-cyan-400/15"
      }`}
    >
      {children}
    </button>
  );
}

"use client";

import { useEffect } from "react";
import SoundToggle from "./ui/SoundToggle";
import { useExperience } from "@/lib/store";
import { ambient } from "@/lib/audio";

// Mounted once in the root layout, so the SAME song plays continuously across
// the whole site (countdown → worlds → letter → ending) without restarting on
// navigation. Browsers block autoplay, so we start it on the very first
// interaction anywhere on the page.
export default function GlobalAudio() {
  const sound = useExperience((s) => s.sound);

  useEffect(() => {
    if (sound !== "on") return;
    let started = false;
    const events = ["pointerdown", "touchstart", "keydown", "click"];
    const go = () => {
      if (started) return;
      started = true;
      ambient.start();
      events.forEach((e) => window.removeEventListener(e, go));
    };
    events.forEach((e) => window.addEventListener(e, go, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, go));
  }, [sound]);

  return (
    <div className="fixed bottom-5 right-5 z-[70]">
      <SoundToggle />
    </div>
  );
}

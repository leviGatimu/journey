"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FRAGMENTS } from "./fragments";

export type SoundState = "off" | "on";

interface ExperienceState {
  /** ids of collected letter fragments */
  collected: string[];
  /** worlds the user has entered at least once */
  visited: string[];
  /** whether the cinematic assembly has been completed (door appeared) */
  assembled: boolean;
  sound: SoundState;


  collect: (id: string) => void;
  hasCollected: (id: string) => boolean;
  visit: (worldId: string) => void;
  setAssembled: (v: boolean) => void;
  toggleSound: () => void;

  reset: () => void;

  collectedCount: () => number;
  total: () => number;
  isComplete: () => boolean;
}

export const useExperience = create<ExperienceState>()(
  persist(
    (set, get) => ({
      collected: [],
      visited: [],
      assembled: false,
      sound: "on",


      collect: (id) =>
        set((s) =>
          s.collected.includes(id)
            ? s
            : { collected: [...s.collected, id] }
        ),
      hasCollected: (id) => get().collected.includes(id),
      visit: (worldId) =>
        set((s) =>
          s.visited.includes(worldId)
            ? s
            : { visited: [...s.visited, worldId] }
        ),
      setAssembled: (v) => set({ assembled: v }),
      toggleSound: () => set((s) => ({ sound: s.sound === "on" ? "off" : "on" })),

      reset: () =>
        set({ collected: [], visited: [], assembled: false }),

      collectedCount: () => get().collected.length,
      total: () => FRAGMENTS.length,
      isComplete: () => get().collected.length >= FRAGMENTS.length,
    }),
    {
      name: "caela-13-progress",
      partialize: (s) => ({
        collected: s.collected,
        visited: s.visited,
        assembled: s.assembled,
        sound: s.sound,
      }),
    }
  )
);

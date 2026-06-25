"use client";

import { useCallback } from "react";
import { useExperience } from "./store";
import { bus } from "./events";
import { getFragment } from "./fragments";

export function useCollect() {
  const collect = useExperience((s) => s.collect);
  return useCallback(
    (id: string) => {
      const frag = getFragment(id);
      if (!frag) return;
      collect(id);
      bus.emit("collect", { id, scrap: frag.scrap });
    },
    [collect]
  );
}

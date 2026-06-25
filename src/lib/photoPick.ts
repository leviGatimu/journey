import { PHOTOS } from "./photos";

// Deterministic, non-overlapping-ish photo selection per world so each
// world shows a different slice of Caela's photos.
const OFFSETS: Record<string, number> = {
  forest: 0,
  river: 11,
  attic: 23,
  stars: 35,
  machine: 47,
};

export function picksFor(worldId: string, n: number): string[] {
  const start = OFFSETS[worldId] ?? 0;
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    out.push(PHOTOS[(start + i) % PHOTOS.length]);
  }
  return out;
}

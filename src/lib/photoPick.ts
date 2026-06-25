import { PHOTOS } from "./photos";

// Every photo in the bank gets used. The five worlds split the 60 photos into
// five contiguous slices (12 each) so collectively they show ALL of them with
// no repeats between worlds. (The tunnel + finale mosaic also use the full set.)
const SLICE = Math.ceil(PHOTOS.length / 5); // 12

const ORDER = ["forest", "river", "attic", "stars", "machine"];

export function picksFor(worldId: string, n: number): string[] {
  const idx = ORDER.indexOf(worldId);
  const start = (idx < 0 ? 0 : idx) * SLICE;
  const slice: string[] = [];
  for (let i = 0; i < SLICE; i++) {
    slice.push(PHOTOS[(start + i) % PHOTOS.length]);
  }
  // return n photos from this world's slice, cycling only if more are requested
  const out: string[] = [];
  for (let i = 0; i < n; i++) out.push(slice[i % slice.length]);
  return out;
}

/** how many distinct photos a world's slice holds */
export const SLICE_SIZE = SLICE;

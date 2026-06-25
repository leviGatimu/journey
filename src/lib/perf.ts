"use client";

// Lightweight device quality detection so the experience stays smooth on
// phones / low-end laptops. Computed once on the client.

export type Tier = "low" | "mid" | "high";

let _tier: Tier | null = null;

export function tier(): Tier {
  if (_tier) return _tier;
  if (typeof window === "undefined") return "high";
  const cores = navigator.hardwareConcurrency || 4;
  const mem = (navigator as any).deviceMemory || 4;
  const mobile =
    /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    Math.min(window.innerWidth, window.innerHeight) < 768;

  if (mobile || cores <= 4 || mem <= 4) _tier = "low";
  else if (cores <= 8 || mem <= 8) _tier = "mid";
  else _tier = "high";
  return _tier;
}

export const isLow = () => tier() === "low";

/** max device-pixel-ratio for a Canvas */
export const dprCap = (): number =>
  tier() === "low" ? 1.25 : tier() === "mid" ? 1.5 : 1.75;

/** scale factor for particle / instance counts */
export const pscale = (): number =>
  tier() === "low" ? 0.35 : tier() === "mid" ? 0.7 : 1;

/** scale a base count by quality, min 1 */
export const scaled = (base: number): number =>
  Math.max(1, Math.round(base * pscale()));

/** MeshReflectorMaterial render resolution */
export const reflectorRes = (): number =>
  tier() === "low" ? 256 : tier() === "mid" ? 512 : 1024;

/** how many photos the finale mosaic should use */
export const mosaicMax = (): number =>
  tier() === "low" ? 150 : tier() === "mid" ? 240 : 320;

// The moment the experience unlocks: midnight, June 26.
// Stored as a local-time target. Change the year if you re-gift this. ♥
export const UNLOCK_DATE = new Date(2026, 5, 26, 0, 0, 0, 0); // month is 0-indexed → 5 = June

export const NAME = "Caela";

export function timeUntilUnlock(now = new Date()) {
  const diff = UNLOCK_DATE.getTime() - now.getTime();
  const clamped = Math.max(0, diff);
  const days = Math.floor(clamped / 86_400_000);
  const hours = Math.floor((clamped % 86_400_000) / 3_600_000);
  const minutes = Math.floor((clamped % 3_600_000) / 60_000);
  const seconds = Math.floor((clamped % 60_000) / 1000);
  const ms = clamped % 1000;
  return { diff: clamped, days, hours, minutes, seconds, ms, unlocked: diff <= 0 };
}

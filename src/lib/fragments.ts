// The torn letter, scattered as fragments across the five worlds.
// Each fragment carries a short phrase (what's legible on the scrap)
// and lives in exactly one world. Order = reading order of the rebuilt page.

export interface Fragment {
  id: string;
  worldId: string;
  /** the legible scrap of text on this torn piece */
  scrap: string;
  /** reading order within the rebuilt letter (lower = higher on page) */
  order: number;
}

export const FRAGMENTS: Fragment[] = [
  // — Forest —
  { id: "f1", worldId: "forest", order: 1, scrap: "Happyyyy birthhdayyy caellaaa 💞💞💞" },
  { id: "f2", worldId: "forest", order: 2, scrap: "you are turning flippin 13 yearss oldd mann" },
  // — River —
  { id: "f3", worldId: "river", order: 3, scrap: "i remember when we mett when you was 9 broo 😭" },
  { id: "f4", worldId: "river", order: 4, scrap: "i want to legit thank you BIG TIME for being there for me when no one was" },
  // — Attic —
  { id: "f5", worldId: "attic", order: 5, scrap: "standing up for me, being the shoulder i can cry on" },
  { id: "f6", worldId: "attic", order: 6, scrap: "From the deep bottom of my fufu hearttt i loveee you soo muchh twinn" },
  // — Stars —
  { id: "f7", worldId: "stars", order: 7, scrap: "honestllyy ur legit my 2nd half, like lwkk samee personn" },
  { id: "f8", worldId: "stars", order: 8, scrap: "you stil been strong though it all, believeing God he'll make a way" },
  // — Machine —
  { id: "f9", worldId: "machine", order: 9, scrap: "you have a crazy big HEART, and anyone near you can say the same" },
  { id: "f10", worldId: "machine", order: 10, scrap: "I LOVE YOUUU SOOO MUCHHH — HAPPYY BIRTHDAYY MY idiotic 13 yearr olddd 💞" },
];

export const fragmentsForWorld = (worldId: string) =>
  FRAGMENTS.filter((f) => f.worldId === worldId);

export const getFragment = (id: string) => FRAGMENTS.find((f) => f.id === id);

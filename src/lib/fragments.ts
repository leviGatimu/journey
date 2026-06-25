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
  { id: "f1", worldId: "forest", order: 1, scrap: "I hid this letter on purpose," },
  { id: "f2", worldId: "forest", order: 2, scrap: "tore it into pieces and scattered it across everything we made—" },
  // — River —
  { id: "f3", worldId: "river", order: 3, scrap: "you were never going to find a single page that held all of you." },
  { id: "f4", worldId: "river", order: 4, scrap: "Thirteen years of you growing braver than anyone warned me." },
  // — Attic —
  { id: "f5", worldId: "attic", order: 5, scrap: "I remember when you were small enough to fall asleep mid-sentence." },
  { id: "f6", worldId: "attic", order: 6, scrap: "Now you finish mine." },
  // — Stars —
  { id: "f7", worldId: "stars", order: 7, scrap: "You rearrange the light in every room you walk into." },
  { id: "f8", worldId: "stars", order: 8, scrap: "Not that you shine — that you kept choosing to." },
  // — Machine —
  { id: "f9", worldId: "machine", order: 9, scrap: "everything I could not say out loud without my voice breaking." },
  { id: "f10", worldId: "machine", order: 10, scrap: "Happy thirteenth, Caela. Go be impossible to forget." },
];

export const fragmentsForWorld = (worldId: string) =>
  FRAGMENTS.filter((f) => f.worldId === worldId);

export const getFragment = (id: string) => FRAGMENTS.find((f) => f.id === id);

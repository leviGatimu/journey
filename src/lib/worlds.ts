export interface World {
  id: string;
  index: number;
  name: string;
  subtitle: string;
  /** primary atmospheric color */
  color: string;
  glow: string;
  /** short line shown on the hub */
  tagline: string;
}

export const WORLDS: World[] = [
  {
    id: "forest",
    index: 1,
    name: "The Photo Forest",
    subtitle: "where memories hang from the branches",
    color: "#1f3b2c",
    glow: "#7fd6a0",
    tagline: "Brush the leaves. Some of them remember you.",
  },
  {
    id: "river",
    index: 2,
    name: "The Memory River",
    subtitle: "everything drifts downstream",
    color: "#10283f",
    glow: "#7fb6e6",
    tagline: "Watch the water. Catch what floats by.",
  },
  {
    id: "attic",
    index: 3,
    name: "The Floating Attic",
    subtitle: "a room where gravity forgot the rules",
    color: "#2a2233",
    glow: "#e8b06b",
    tagline: "Open what's closed. Nothing here falls.",
  },
  {
    id: "stars",
    index: 4,
    name: "The Star Room",
    subtitle: "constellations made of you",
    color: "#080a1a",
    glow: "#c9b6ff",
    tagline: "Touch the stars. Each one has something to say.",
  },
  {
    id: "machine",
    index: 5,
    name: "The Memory Machine",
    subtitle: "it runs on everything we kept",
    color: "#2b1d1a",
    glow: "#f0a05a",
    tagline: "Bring the pieces. Make it turn.",
  },
];

export const getWorld = (id: string) => WORLDS.find((w) => w.id === id);

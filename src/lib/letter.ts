// ─────────────────────────────────────────────────────────────
// THE LETTER
// This is the heart of the whole experience. Edit freely.
// Each entry is one "stanza" that scrolls into view on /letter.
// `photos` (indices into the PHOTOS array) optionally float in
// alongside that stanza. Keep lines short — they read like breath.
// ─────────────────────────────────────────────────────────────

export interface Stanza {
  text: string;
  photos?: number[];
}

export const LETTER_OPENING = "Caela,";

export const LETTER: Stanza[] = [
  { text: "I hid this letter on purpose.", photos: [0] },
  {
    text: "I tore it into pieces and scattered it across everything we made together — the woods, the water, the quiet rooms full of light.",
    photos: [3, 12],
  },
  {
    text: "Because the truth is, you were never going to find a single page that held all of you.",
  },
  {
    text: "Thirteen years.",
    photos: [21],
  },
  {
    text: "Thirteen years of you growing louder and braver and funnier than anyone warned me you would be.",
    photos: [8, 30],
  },
  {
    text: "I remember when you were small enough to fall asleep mid-sentence.",
    photos: [17],
  },
  {
    text: "Now you finish mine.",
  },
  {
    text: "You have this way of walking into a room and rearranging the light in it.",
    photos: [25, 41],
  },
  {
    text: "Not every day was soft. Some of them were hard, and you carried them anyway.",
  },
  {
    text: "That is the part I am most proud of — not that you shine, but that you kept choosing to.",
    photos: [9],
  },
  {
    text: "So here is everything I could not say out loud without my voice breaking.",
    photos: [33, 47],
  },
  {
    text: "I am so unbelievably lucky that the story I got to be in was also yours.",
  },
  {
    text: "Happy thirteenth, Caela.",
    photos: [50, 5, 19],
  },
  {
    text: "Go be impossible to forget.",
  },
];

// The single line that lands after the letter, before the photo finale.
export const LETTER_CLOSE = "thank you for being part of my story.";

// What the photo-mosaic finale spells out.
export const FINALE_TEXT = "HAPPY 13TH\nBIRTHDAY\nCAELA";

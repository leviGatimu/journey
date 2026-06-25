// ─────────────────────────────────────────────────────────────
// THE LETTER — Caela's real birthday letter, in her friend's words.
// Each entry is one line that scrolls to centre and reveals word by word.
// Spelling / emojis are intentional — left exactly as written. ♥
// ─────────────────────────────────────────────────────────────

export interface Stanza {
  text: string;
  photos?: number[];
}

export const LETTER_OPENING = "a letter for caella 💞";

export const LETTER: Stanza[] = [
  { text: "Happyyyy birthhdayyy caellaaa 💞💞💞", photos: [0] },
  { text: "I barely know where to start, but im sooo happyy forr youu mann" },
  { text: "you are turning flippin 13 yearss oldd mann", photos: [12] },
  { text: "i remember when we mett when you was 9 broo 😭", photos: [21] },
  { text: "wllhi we known each other for a crazy long timeee broo" },
  { text: "i want to wish you THE BESTT BIRTHDAYYYY everrrr", photos: [8, 30] },
  {
    text: "i want to legit thank you BIG TIME for being there for me when no one was",
  },
  { text: "standing up for me, being the shoulder i can cry on" },
  { text: "and also venting stuff that wasnt supposed to be vented to meee" },
  {
    text: "From the deep bottom of my fufu hearttt i loveee you soo muchh twinn",
    photos: [33, 47],
  },
  {
    text: "you are the most kindest, coolest, baddiest (clock that), tea-est (clock it again), girl",
    photos: [25],
  },
  { text: "even going through our stupid moments when we did stupid thingsss" },
  { text: "all the times we laughed together", photos: [41] },
  { text: "and legit being the most relatble nigga i knoww broo" },
  { text: "honestllyy ur legit my 2nd half, like lwkk samee personn", photos: [5] },
  {
    text: "and even though u is still gone through alot, you stil been strong though it all",
  },
  {
    text: "believeing in God that he'll make a way — and thats sum very special bout you",
    photos: [9],
  },
  { text: "You are also soo crazy caring, kind and awesome" },
  {
    text: "you have a crazy big HEART, and anyone near you can say the same",
    photos: [50, 19],
  },
  { text: "as i wrap up this funny letter with my funny writign skills" },
  { text: "i want to say I LOVE YOUUU SOOO MUCHHH one moree timee", photos: [3] },
  { text: "and HAPPYY BIRTHDAYY MY idiotic 13 yearr olddd 💞" },
];

// The quiet line that lands after the letter, before the photo journey.
export const LETTER_CLOSE = "now come see all of us 💞";

// What the photo-mosaic finale spells out.
export const FINALE_TEXT = "HAPPY 13TH\nBIRTHDAY\nCAELA";

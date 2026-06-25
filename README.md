# For Caela — an interactive birthday experience 🕯️

A cinematic, exploratory web experience built for one person. A birthday letter
has been torn apart and scattered across five dream-worlds built from her photos.
Explore, find the fragments, rebuild the letter, and step through the doorway into
the final message — ending in hundreds of photos assembling into
**HAPPY 13TH BIRTHDAY CAELA**.

Built with **Next.js 15 (App Router) · TypeScript · Tailwind · Framer Motion ·
GSAP · Three.js · React Three Fiber · drei · Lenis · Zustand**.

---

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

> Requires Node 18.18+ (Node 20/22 recommended).

## The flow

1. **Before midnight, June 26** → a cinematic countdown "waiting room" (drifting
   photos, ambient pad, glowing timer).
2. **At 00:00 June 26** → the timer hits zero and the experience unlocks.
3. **Intro** explains the lost letter, then opens the **hub** of five worlds:
   Photo Forest · Memory River · Floating Attic · Star Room · Memory Machine.
4. Each world hides **2 letter fragments** (10 total). Drag to explore, click what
   glows. Found pieces fly into the **collection book** (top-right) and the letter
   rebuilds.
5. When all 10 are found, open the book → **"open it"** triggers the assembly
   cinematic → a doorway → `/letter`.
6. `/letter` reveals the letter **word by word** as you scroll (current word glows,
   future words blurred, past words faded), with photos drifting in. After the last
   line: silence, one closing line, then the **photo-mosaic finale**.

## Preview without waiting for midnight

- Add `?unlock=1` to the URL to skip the countdown.
- `?skip=1&unlock=1` jumps straight to the world hub.
- `?world=forest&unlock=1` (or `river`/`attic`/`stars`/`machine`) opens one world.
- Press **Shift + U** on the countdown screen to unlock immediately.
- Progress is saved in `localStorage` (key `caela-13-progress`). Clear it to reset.

## Make it yours (the important part ♥)

| What | Where |
| --- | --- |
| **The letter text** (the climax) | `src/lib/letter.ts` |
| **Fragment scraps** (the torn pieces) | `src/lib/fragments.ts` |
| **Unlock date & name** | `src/lib/config.ts` |
| **World names / moods / colors** | `src/lib/worlds.ts` |
| **Star Room captions** | `NOTES` in `src/components/scenes/StarsScene.tsx` |
| **Photos** | drop images in `public/photos/`, then regenerate the manifest ↓ |

The closing line and the finale text live at the bottom of `src/lib/letter.ts`
(`LETTER_CLOSE`, `FINALE_TEXT`).

### Adding / changing photos

Photos live in `public/photos/`. After adding or removing files, regenerate
`src/lib/photos.ts`:

```bash
node -e "const fs=require('fs');const f=fs.readdirSync('public/photos').filter(x=>/\.(jpg|jpeg|png)$/i.test(x));fs.writeFileSync('src/lib/photos.ts','export const PHOTOS: string[] = [\n'+f.map(x=>'  \"/photos/'+x+'\"').join(',\n')+'\n];\n\nexport const PHOTO_COUNT = PHOTOS.length;\n')"
```

The photo-reaction indices in `src/lib/letter.ts` (the `photos: [...]` arrays) point
into this list — adjust them to pick which photos appear beside which lines.

## Deploy to Vercel

```bash
npm i -g vercel   # if needed
vercel            # follow prompts, framework auto-detected as Next.js
vercel --prod
```

No environment variables required. The whole thing is static + client-rendered.

## Notes

- Sound is a generated ambient pad (Web Audio) — no audio files needed. Toggle it
  from the speaker control; it starts muted (browsers block autoplay).
- Respects `prefers-reduced-motion`.
- Desktop-first, but responsive and touch/keyboard friendly.
- The WebGL scenes are dynamically imported (client-only) and lazy-loaded per route.

"use client";

// Audio engine:
//  • Music  → "song 1" (her favourite), looped, gently faded in/out.
//  • SFX    → generated with Web Audio (no extra files): hovers, clicks,
//             the collect arpeggio, drawer thunks, whooshes, star pings.
// Everything is gated behind `enabled`, which the sound toggle controls.

let enabled = false;

// ── music ────────────────────────────────────────────────────────────────
let music: HTMLAudioElement | null = null;
let fadeTimer: ReturnType<typeof setInterval> | null = null;
const MUSIC_VOL = 0.55;

function ensureMusic() {
  if (typeof window === "undefined") return null;
  if (!music) {
    music = new Audio("/audio/song1.m4a");
    music.loop = true;
    music.volume = 0;
    music.preload = "auto";
  }
  return music;
}

function fadeTo(target: number, ms: number, onDone?: () => void) {
  const el = ensureMusic();
  if (!el) return;
  if (fadeTimer) clearInterval(fadeTimer);
  const start = el.volume;
  const steps = Math.max(1, Math.round(ms / 50));
  let i = 0;
  fadeTimer = setInterval(() => {
    i++;
    el.volume = Math.min(1, Math.max(0, start + (target - start) * (i / steps)));
    if (i >= steps) {
      if (fadeTimer) clearInterval(fadeTimer);
      fadeTimer = null;
      onDone?.();
    }
  }, 50);
}

// ── sfx (Web Audio) ────────────────────────────────────────────────────────
let ctx: AudioContext | null = null;
function ensureCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(
  freq: number,
  dur: number,
  {
    type = "sine",
    gain = 0.12,
    delay = 0,
    sweep = 0,
  }: { type?: OscillatorType; gain?: number; delay?: number; sweep?: number } = {}
) {
  const c = ensureCtx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  const t = c.currentTime + delay;
  o.frequency.setValueAtTime(freq, t);
  if (sweep) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq + sweep), t + dur);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function noiseSweep(dur: number, gain = 0.08) {
  const c = ensureCtx();
  if (!c) return;
  const buffer = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1);
  const src = c.createBufferSource();
  src.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(400, c.currentTime);
  filter.frequency.exponentialRampToValueAtTime(3000, c.currentTime + dur);
  filter.Q.value = 0.8;
  const g = c.createGain();
  g.gain.setValueAtTime(0, c.currentTime);
  g.gain.linearRampToValueAtTime(gain, c.currentTime + dur * 0.3);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  src.connect(filter).connect(g).connect(c.destination);
  src.start();
  src.stop(c.currentTime + dur + 0.02);
}

// throttle hover ticks so rapid pointer moves don't machine-gun
let lastTick = 0;

export const ambient = {
  get enabled() {
    return enabled;
  },
  start() {
    enabled = true;
    const el = ensureMusic();
    ensureCtx();
    if (el) {
      el.play().catch(() => {});
      fadeTo(MUSIC_VOL, 1400);
    }
  },
  stop() {
    enabled = false;
    if (music) {
      fadeTo(0, 800, () => {
        try {
          music?.pause();
        } catch {}
      });
    }
  },

  // — interaction sound design —
  tick() {
    if (!enabled) return;
    const now = performance.now();
    if (now - lastTick < 70) return;
    lastTick = now;
    tone(880, 0.06, { type: "sine", gain: 0.04, sweep: 220 });
  },
  click() {
    if (!enabled) return;
    tone(523.25, 0.09, { type: "triangle", gain: 0.08 });
    tone(784, 0.12, { type: "sine", gain: 0.05, delay: 0.02 });
  },
  // collected a fragment — bright rising arpeggio
  chime() {
    if (!enabled) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
      tone(f, 0.9, { type: "sine", gain: 0.11, delay: i * 0.08 })
    );
  },
  thunk() {
    if (!enabled) return;
    tone(150, 0.18, { type: "triangle", gain: 0.14, sweep: -60 });
    tone(90, 0.22, { type: "sine", gain: 0.1 });
  },
  whoosh() {
    if (!enabled) return;
    noiseSweep(0.6, 0.07);
  },
  ping() {
    if (!enabled) return;
    const notes = [987.77, 1318.51];
    tone(notes[Math.floor(Math.random() * notes.length)], 1.2, {
      type: "sine",
      gain: 0.09,
    });
  },
  // big warm swell for the assembly / doorway moment
  swell() {
    if (!enabled) return;
    [261.63, 329.63, 392, 523.25].forEach((f, i) =>
      tone(f, 2.4, { type: "sine", gain: 0.07, delay: i * 0.12 })
    );
    noiseSweep(1.6, 0.05);
  },
};

"use client";

// A tiny generative ambient engine. No audio files — just a warm,
// slowly-evolving pad with occasional bell tones. Handcrafted calm.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let voices: OscillatorNode[] = [];
let bellTimer: ReturnType<typeof setTimeout> | null = null;
let running = false;

const CHORD = [220, 277.18, 329.63, 440, 554.37]; // A major-ish, airy

function ensureCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
  }
  return ctx;
}

function bell() {
  if (!ctx || !master || !running) return;
  const notes = [659.25, 783.99, 880, 987.77, 1174.66];
  const f = notes[Math.floor(Math.random() * notes.length)];
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "sine";
  o.frequency.value = f;
  const t = ctx.currentTime;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.08, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 4);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + 4.2);
  bellTimer = setTimeout(bell, 4000 + Math.random() * 9000);
}

export const ambient = {
  start() {
    const c = ensureCtx();
    if (!c || !master || running) return;
    if (c.state === "suspended") c.resume();
    running = true;

    voices = CHORD.map((freq, i) => {
      const o = c.createOscillator();
      const g = c.createGain();
      const lfo = c.createOscillator();
      const lfoGain = c.createGain();
      o.type = i % 2 === 0 ? "sine" : "triangle";
      o.frequency.value = freq / (i > 2 ? 2 : 1);
      g.gain.value = 0.04 / (i + 1);
      // slow detune shimmer
      lfo.frequency.value = 0.05 + i * 0.03;
      lfoGain.gain.value = 1.5;
      lfo.connect(lfoGain).connect(o.detune);
      o.connect(g).connect(master!);
      o.start();
      lfo.start();
      return o;
    });

    master.gain.cancelScheduledValues(c.currentTime);
    master.gain.setValueAtTime(master.gain.value, c.currentTime);
    master.gain.linearRampToValueAtTime(0.5, c.currentTime + 3);
    bell();
  },
  stop() {
    if (!ctx || !master) return;
    running = false;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
    if (bellTimer) clearTimeout(bellTimer);
    const toStop = voices;
    voices = [];
    setTimeout(() => toStop.forEach((o) => { try { o.stop(); } catch {} }), 1700);
  },
  // a short positive chime when collecting a fragment
  chime() {
    const c = ensureCtx();
    if (!c || !master) return;
    if (c.state === "suspended") c.resume();
    const seq = [523.25, 659.25, 783.99, 1046.5];
    seq.forEach((f, i) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = "sine";
      o.frequency.value = f;
      const t = c.currentTime + i * 0.08;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.12, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
      o.connect(g).connect(c.destination);
      o.start(t);
      o.stop(t + 1);
    });
  },
};

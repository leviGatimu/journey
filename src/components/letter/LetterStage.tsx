"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { LETTER, LETTER_OPENING } from "@/lib/letter";
import { PHOTOS } from "@/lib/photos";

interface Word {
  text: string;
  g: number; // global index
  si: number; // stanza index
}

const PER_WORD_PX = 36;
const GLOW = "0 0 24px rgba(231,154,166,0.9), 0 0 60px rgba(231,154,166,0.4)";

export default function LetterStage({ onFinish }: { onFinish: () => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [head, setHead] = useState(-2);
  const finished = useRef(false);

  const { words, stanzas, total } = useMemo(() => {
    const words: Word[] = [];
    const stanzas: { si: number; start: number; end: number; center: number }[] = [];
    let g = 0;
    LETTER.forEach((st, si) => {
      const start = g;
      st.text.split(/\s+/).forEach((t) => {
        words.push({ text: t, g, si });
        g++;
      });
      const end = g - 1;
      stanzas.push({ si, start, end, center: (start + end) / 2 });
    });
    return { words, stanzas, total: g };
  }, []);

  useEffect(() => {
    let raf = 0;
    let pending = false;
    const update = () => {
      pending = false;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrolled = -rect.top;
      const range = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, scrolled / Math.max(1, range)));
      setHead(p * (total + 4) - 2);
      if (p >= 0.999 && !finished.current) {
        finished.current = true;
        onFinish();
      }
    };
    const onScroll = () => {
      if (!pending) {
        pending = true;
        raf = requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [total, onFinish]);

  return (
    <div
      ref={sectionRef}
      style={{ height: `${total * PER_WORD_PX + 1200}px` }}
      className="relative w-full"
    >
      <div className="sticky top-0 flex h-[100dvh] items-center justify-center overflow-hidden">
        {/* opening name, fades as you begin */}
        <div
          className="pointer-events-none absolute left-1/2 top-[18%] -translate-x-1/2 font-serif text-2xl italic text-bloom"
          style={{ opacity: Math.max(0, 1 - Math.max(0, head + 2) / 3) }}
        >
          {LETTER_OPENING}
        </div>

        {stanzas.map((s) => {
          const span = (s.end - s.start) / 2 + 3;
          const d = head - s.center;
          const ad = Math.abs(d);
          const stanzaOpacity = Math.max(0, 1 - Math.max(0, ad - span) / 7);
          if (stanzaOpacity <= 0.01) return null;
          const translateY = (s.center - head) * 30;
          const stanzaBlur = Math.max(0, ad - span) * 1.1;
          const stanza = LETTER[s.si];

          return (
            <div
              key={s.si}
              className="absolute px-8 sm:px-16"
              style={{
                transform: `translateY(${translateY}px)`,
                opacity: stanzaOpacity,
                filter: `blur(${stanzaBlur}px)`,
                maxWidth: "min(900px, 92vw)",
                willChange: "transform, opacity, filter",
              }}
            >
              {/* floating photo reactions for this stanza */}
              {stanza.photos?.map((pi, k) => (
                <div
                  key={k}
                  className="pointer-events-none absolute overflow-hidden rounded-sm"
                  style={{
                    width: 140,
                    height: 180,
                    opacity: stanzaOpacity * 0.85,
                    ...(k % 2 === 0 ? { left: -180 } : { right: -180 }),
                    top: `${-40 + k * 120}px`,
                    transform: `translateY(${(head - s.center) * (8 + k * 4)}px) rotate(${
                      k % 2 ? 4 : -4
                    }deg)`,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                  }}
                >
                  <Image
                    src={PHOTOS[pi % PHOTOS.length]}
                    alt=""
                    fill
                    sizes="140px"
                    className="object-cover"
                  />
                </div>
              ))}

              <p className="text-center font-serif text-[clamp(1.6rem,4.2vw,3.2rem)] font-light leading-[1.35]">
                {words
                  .filter((w) => w.si === s.si)
                  .map((w) => {
                    const rel = head - w.g;
                    let opacity: number;
                    let blur = 0;
                    let glow = false;
                    let ty = 0;
                    let scale = 1;
                    if (rel < -1.6) {
                      opacity = 0;
                      blur = 9;
                      ty = 10;
                    } else if (rel < 0) {
                      const t = (rel + 1.6) / 1.6; // 0..1
                      opacity = t * 0.5;
                      blur = (1 - t) * 9;
                      ty = (1 - t) * 10;
                    } else if (rel < 1) {
                      opacity = 1;
                      glow = true;
                      scale = 1.05;
                    } else {
                      opacity = Math.max(0.3, 1 - (rel - 1) / 16);
                    }
                    return (
                      <span
                        key={w.g}
                        className="mx-[0.18em] inline-block"
                        style={{
                          opacity,
                          filter: blur ? `blur(${blur}px)` : undefined,
                          transform: `translateY(${ty}px) scale(${scale})`,
                          textShadow: glow ? GLOW : undefined,
                          color: glow ? "#fff" : "#f4d9c6",
                          transition: "color 0.2s linear",
                          willChange: "opacity, filter, transform",
                        }}
                      >
                        {w.text}
                      </span>
                    );
                  })}
              </p>
            </div>
          );
        })}

        {/* gentle scroll hint at the very start */}
        <div
          className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-cinematic text-bloom/40"
          style={{ opacity: Math.max(0, 1 - Math.max(0, head + 2) / 2) }}
        >
          scroll slowly ↓
        </div>
      </div>
    </div>
  );
}

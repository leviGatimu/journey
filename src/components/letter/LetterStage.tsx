"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { LETTER, LETTER_OPENING } from "@/lib/letter";
import { PHOTOS } from "@/lib/photos";

const GLOW = "0 0 24px rgba(231,154,166,0.9), 0 0 60px rgba(231,154,166,0.4)";
// vertical travel (px) for a stanza sliding in from below / out to the top
const TRAVEL = 90;

export default function LetterStage({ onFinish }: { onFinish: () => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(-0.6); // continuous stanza position
  const finished = useRef(false);
  const N = LETTER.length;

  useEffect(() => {
    let raf = 0;
    let last = -999;
    const loop = () => {
      const el = sectionRef.current;
      if (el) {
        const range = el.offsetHeight - window.innerHeight;
        const scrolled = -el.getBoundingClientRect().top;
        const p = Math.min(1, Math.max(0, scrolled / Math.max(1, range)));
        // map scroll → stanza position, with a short lead-in for the opening
        const next = p * (N + 1) - 0.6;
        if (Math.abs(next - last) > 0.0015) {
          last = next;
          setPos(next);
        }
        if (p >= 0.998 && !finished.current) {
          finished.current = true;
          onFinish();
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [N, onFinish]);

  const stanzaWords = useMemo(
    () => LETTER.map((s) => s.text.split(/\s+/)),
    []
  );

  return (
    <div
      ref={sectionRef}
      style={{ height: `${(N + 1) * 62}vh` }}
      className="relative w-full"
    >
      {/* fixed, always-centred reading stage */}
      <div className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center overflow-hidden">
        {/* opening name */}
        <div
          className="absolute font-serif text-3xl italic text-bloom sm:text-4xl"
          style={{
            opacity: Math.max(0, Math.min(1, 1 - (pos + 0.6) / 0.5)),
            textShadow: "0 0 40px rgba(231,154,166,0.4)",
          }}
        >
          {LETTER_OPENING}
        </div>

        {LETTER.map((stanza, i) => {
          const d = pos - i;
          if (d <= -1 || d >= 2) return null;

          // vertical offset: slide in from below → pinned at centre → slide up
          let offset = 0;
          let opacity = 1;
          let stanzaBlur = 0;
          if (d < 0) {
            offset = -d * TRAVEL; // below centre, easing up
            opacity = d + 1; // 0 → 1
            stanzaBlur = -d * 6;
          } else if (d <= 1) {
            offset = 0; // PINNED while its words reveal
            opacity = 1;
          } else {
            offset = -(d - 1) * TRAVEL; // leaving upward
            opacity = 1 - (d - 1);
            stanzaBlur = (d - 1) * 5;
          }

          const words = stanzaWords[i];
          const headLocal = d * (words.length + 1);

          return (
            <div
              key={i}
              className="absolute w-full px-8 sm:px-16"
              style={{
                transform: `translateY(${offset}px)`,
                opacity,
                filter: stanzaBlur ? `blur(${stanzaBlur}px)` : undefined,
                maxWidth: "min(940px, 92vw)",
                willChange: "transform, opacity, filter",
              }}
            >
              {/* photo reactions for this stanza */}
              {opacity > 0.15 &&
                stanza.photos?.map((pi, k) => (
                  <div
                    key={k}
                    className="absolute overflow-hidden rounded-sm"
                    style={{
                      width: 132,
                      height: 168,
                      opacity: opacity * 0.8,
                      ...(k % 2 === 0 ? { left: -150 } : { right: -150 }),
                      top: `${-30 + k * 110}px`,
                      transform: `translateY(${d * (10 + k * 5)}px) rotate(${
                        k % 2 ? 4 : -4
                      }deg)`,
                      boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                    }}
                  >
                    <Image
                      src={PHOTOS[pi % PHOTOS.length]}
                      alt=""
                      fill
                      sizes="132px"
                      className="object-cover"
                    />
                  </div>
                ))}

              <p className="text-center font-serif text-[clamp(1.6rem,4.4vw,3.3rem)] font-light leading-[1.4]">
                {words.map((w, k) => {
                  const rel = headLocal - k;
                  let o: number;
                  let blur = 0;
                  let glow = false;
                  let ty = 0;
                  let scale = 1;
                  if (rel < -1.6) {
                    o = 0;
                    blur = 9;
                    ty = 10;
                  } else if (rel < 0) {
                    const t = (rel + 1.6) / 1.6;
                    o = t * 0.5;
                    blur = (1 - t) * 9;
                    ty = (1 - t) * 10;
                  } else if (rel < 1) {
                    o = 1;
                    glow = true;
                    scale = 1.06;
                  } else {
                    o = Math.max(0.34, 1 - (rel - 1) / 16);
                  }
                  return (
                    <span
                      key={k}
                      className="mx-[0.16em] inline-block"
                      style={{
                        opacity: o,
                        filter: blur ? `blur(${blur}px)` : undefined,
                        transform: `translateY(${ty}px) scale(${scale})`,
                        textShadow: glow ? GLOW : undefined,
                        color: glow ? "#fff" : "#f4d9c6",
                        willChange: "opacity, filter, transform",
                      }}
                    >
                      {w}
                    </span>
                  );
                })}
              </p>
            </div>
          );
        })}

        {/* scroll hint */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-cinematic text-bloom/40"
          style={{ opacity: Math.max(0, 1 - (pos + 0.6) / 0.4) }}
        >
          scroll slowly ↓
        </div>
      </div>
    </div>
  );
}

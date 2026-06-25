"use client";

import { useEffect, useRef, useState } from "react";
import { PHOTOS } from "@/lib/photos";
import { FINALE_TEXT } from "@/lib/letter";

interface Cell {
  x: number;
  y: number;
  sx: number; // scattered start
  sy: number;
  photo: string;
  size: number;
  delay: number;
}

const MAX = 320;

export default function PhotoMosaic({ onReady }: { onReady?: () => void }) {
  const [cells, setCells] = useState<Cell[]>([]);
  const [assembled, setAssembled] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const cv = document.createElement("canvas");
    cv.width = W;
    cv.height = H;
    const ctx = cv.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const lines = FINALE_TEXT.split("\n");
    // fit font so the widest line spans ~84% of viewport width
    let fontSize = Math.min(H / (lines.length * 1.5), W / 7);
    const setFont = (s: number) =>
      (ctx.font = `800 ${s}px Inter, system-ui, sans-serif`);
    setFont(fontSize);
    let maxW = Math.max(...lines.map((l) => ctx.measureText(l).width));
    if (maxW > W * 0.86) {
      fontSize *= (W * 0.86) / maxW;
      setFont(fontSize);
    }
    const lineH = fontSize * 1.15;
    const startY = H / 2 - ((lines.length - 1) * lineH) / 2;
    lines.forEach((l, i) => ctx.fillText(l, W / 2, startY + i * lineH));

    const data = ctx.getImageData(0, 0, W, H).data;
    const step = Math.max(10, Math.round(fontSize / 7));
    const targets: { x: number; y: number }[] = [];
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        const alpha = data[(y * W + x) * 4 + 3];
        if (alpha > 128) targets.push({ x, y });
      }
    }
    // even downsample to MAX
    const stride = Math.max(1, Math.ceil(targets.length / MAX));
    const picked = targets.filter((_, i) => i % stride === 0).slice(0, MAX);

    const built: Cell[] = picked.map((t, i) => {
      const edge = Math.floor(Math.random() * 4);
      let sx = t.x;
      let sy = t.y;
      const m = 200;
      if (edge === 0) sy = -m;
      else if (edge === 1) sy = H + m;
      else if (edge === 2) sx = -m;
      else sx = W + m;
      if (edge < 2) sx = Math.random() * W;
      else sy = Math.random() * H;
      return {
        x: t.x,
        y: t.y,
        sx,
        sy,
        photo: PHOTOS[i % PHOTOS.length],
        size: step + 4,
        delay: Math.random() * 0.9,
      };
    });

    setCells(built);
    const t1 = setTimeout(() => setAssembled(true), 400);
    const t2 = setTimeout(() => onReady?.(), 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onReady]);

  return (
    <div ref={wrapRef} className="pointer-events-none fixed inset-0 z-10">
      {cells.map((c, i) => (
        <img
          key={i}
          src={c.photo}
          alt=""
          aria-hidden
          style={{
            position: "absolute",
            width: c.size,
            height: c.size,
            objectFit: "cover",
            borderRadius: 2,
            left: 0,
            top: 0,
            transform: assembled
              ? `translate(${c.x - c.size / 2}px, ${c.y - c.size / 2}px) scale(1)`
              : `translate(${c.sx}px, ${c.sy}px) scale(0.4)`,
            opacity: assembled ? 1 : 0,
            transition: `transform 1.6s cubic-bezier(0.16,1,0.3,1) ${c.delay}s, opacity 1s ${c.delay}s`,
            boxShadow: "0 0 0 1px rgba(0,0,0,0.4)",
          }}
        />
      ))}
    </div>
  );
}

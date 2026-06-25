"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import SmoothScroll from "@/components/SmoothScroll";
import LetterStage from "@/components/letter/LetterStage";
import Ending from "@/components/letter/Ending";

const LetterBackdrop = dynamic(
  () => import("@/components/letter/LetterBackdrop"),
  { ssr: false }
);

export default function LetterPage() {
  const [ended, setEnded] = useState(false);

  return (
    <SmoothScroll>
      <main className="relative w-full bg-[#050409]">
        <LetterBackdrop />

        {!ended && <LetterStage onFinish={() => setEnded(true)} />}

        {ended && <Ending />}

      </main>
    </SmoothScroll>
  );
}

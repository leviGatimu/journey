"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import SmoothScroll from "@/components/SmoothScroll";
import LetterStage from "@/components/letter/LetterStage";
import Ending from "@/components/letter/Ending";
import SoundToggle from "@/components/ui/SoundToggle";
import DevPanel from "@/components/dev/DevPanel"; // DEV MODE — remove before gifting

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

        <div className="fixed left-5 top-5 z-30">
          <SoundToggle />
        </div>

        {!ended && <LetterStage onFinish={() => setEnded(true)} />}

        {ended && <Ending />}

        {/* DEV MODE — remove before gifting */}
        <DevPanel variant="letter" onEndLetter={() => setEnded(true)} />
      </main>
    </SmoothScroll>
  );
}

"use client";

import { useState } from "react";

type FlipCardProps = {
  icon: string;
  title: string;
  previewDescription: string;
  largeDescription: string;
};

export default function FlipCard({
  icon,
  title,
  previewDescription,
  largeDescription,
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={isFlipped}
      onClick={() => setIsFlipped((flipped) => !flipped)}
      className="flip-card group min-h-48 w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#200b38]"
    >
      <span
        className={`flip-card-inner ${isFlipped ? "is-flipped" : ""}`}
      >
        <span className="flip-card-face flip-card-front">
          <span className="text-4xl" aria-hidden="true">{icon}</span>
          <span className="text-xl font-semibold">{title}</span>
          <span className="mt-2 text-sm">{previewDescription}</span>
        </span>
        <span className="flip-card-face flip-card-back bg-[#200b38] text-white">
          <span className="text-4xl" aria-hidden="true">{icon}</span>
          <span className="text-xl font-semibold">{title}</span>
          <span className="mt-2 text-sm">{largeDescription}</span>
        </span>
      </span>
    </button>
  );
}
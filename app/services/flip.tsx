"use client";

import { useState } from "react";

/* NOTES FOR TODO: ADD IMAGE TO TYPE */

type FlipCardProps = {
  /* image: string; */
  title: string;
  previewDescription: string;
  largeDescription: string;
};

export default function FlipCard({title, previewDescription, largeDescription}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={isFlipped}
      onClick={() => setIsFlipped((flipped) => !flipped)}
      className="flip-card group h-48 w-full text-left"
    >
      <span
        className={`flip-card-inner ${isFlipped ? "is-flipped" : ""}`}
      >
        <span className="flip-card-face flip-card-front filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06));">
          <span className="text-xl font-semibold">{title}</span>
          <span className="mt-2 text-sm">{previewDescription}</span>
        </span>
        <span className="flip-card-face flip-card-back bg-[#200b38] text-white">
          <span className="text-xl font-semibold">{title}</span>
          <span className="mt-2 text-sm">{largeDescription}</span>
        </span>
      </span>
    </button>
  );
}
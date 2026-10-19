"use client";

import Link from "next/link";

type FlipCardProps = {
  slug: string;
  icon: string;
  title: string;
  previewDescription: string;
  largeDescription: string;
};

export default function FlipCard({
  slug,
  icon,
  title,
  previewDescription,
  largeDescription,
}: FlipCardProps) {
  return (
    <Link
      href={`/services/${slug}`}
      className="flip-card group min-h-56 w-full text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#efb52b]/40 focus-visible:ring-offset-2">
      <span className="flip-card-inner">
        {/*Front of Flip Card */}
        <span className="flip-card-face flip-card-front min-h-56 rounded-2xl border-[#6c3fb8]/20 bg-white p-6 text-[#200b38]">
          <span className="mb-4 rounded-2xl bg-[#efb52b]/15 p-3 text-4xl leading-none" aria-hidden="true">{icon}</span>
          <span className="text-center text-xl font-semibold leading-tight">{title}</span>
          <span className="mt-3 text-center text-sm leading-6 text-gray-600">{previewDescription}</span>
        </span>
        {/*Back of Flip Card */}
        <span className="flip-card-face flip-card-back min-h-56 rounded-2xl border-[#6c3fb8] bg-[#200b38] p-6 text-white shadow-lg shadow-[#200b38]/20">
          <span className="mb-4 rounded-2xl bg-[#efb52b] p-3 text-4xl leading-none" aria-hidden="true">{icon}</span>
          <span className="text-center text-xl font-semibold leading-tight">{title}</span>
          <span className="mt-3 text-center text-sm leading-6 text-white/80">{largeDescription}</span>
        </span>
      </span>
    </Link>
  );
}
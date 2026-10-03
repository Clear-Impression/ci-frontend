"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import type { NavigationItem } from "@/data/company";

type MobileMenuProps = {
  items: readonly NavigationItem[];
  phoneHref: string;
  website: string;
};

export default function MobileMenu({
  items,
  phoneHref,
  website,
}: MobileMenuProps) {
  // Start with the menu closed so it does not cover the page.
  const [open, setOpen] = useState(false);
  // Connect the button to its menu without reusing an ID.
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  return (
    <div
      className="lg:hidden"
      onKeyDown={(event) => {
        // Close the menu on Escape and put focus back on the button.
        if (event.key === "Escape" && open) {
          setOpen(false);
          toggleRef.current?.focus();
        }
      }}
    >
      {/* Let keyboard and screen-reader users open and close the menu. */}
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setOpen(!open)}
        className="flex min-h-11 items-center gap-2 rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#efb52b]"
      >
        {/* Switch between the menu and close icons without adding extra text. */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          {open ? (
            <path d="m6 6 12 12M6 18 18 6" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
        {open ? "Close" : "Menu"}
      </button>
      {/* Hide closed menu links from keyboard navigation too. */}
      <nav
        id={menuId}
        aria-label="Mobile navigation"
        hidden={!open}
        className="absolute inset-x-0 top-full border-t border-white/15 bg-[#200b38] px-6 py-6 shadow-lg"
      >
        <ul className="mx-auto grid max-w-7xl gap-1">
          {/* Use the same navigation list as the desktop header. */}
          {items.map((item) => (
            <li key={item.href}>
              {/* Ready pages get links that close the menu when selected. */}
              {item.available ? (
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 font-medium text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#efb52b]"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className="flex items-center justify-between px-3 py-3 text-white/60"
                >
                  {item.label}
                  <span className="text-xs">Coming soon</span>
                </span>
              )}
            </li>
          ))}
          {/* Keep the quote call easy to reach on a phone. */}
          <li className="mt-3">
            <a
              href={phoneHref}
              className="block rounded-lg bg-[#efb52b] px-4 py-3 text-center font-semibold text-[#200b38] hover:bg-[#f6c95b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Call for a quote
            </a>
          </li>
          {/* Keep the existing website available while this one is being built. */}
          <li>
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg px-3 py-3 text-center text-sm text-white underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[#efb52b]"
            >
              Visit our live website
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

---
name: Clear Impression Services
description: A clear, practical website for a Phoenix metro cleaning company.
colors:
  ink: "#200b38"
  gold: "#efb52b"
  violet: "#6c3fb8"
  lavender: "#f7f4fb"
  paper: "#ffffff"
  muted-text: "#686170"
typography:
  body:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.5
rounded:
  control: "0.5rem"
  panel: "1rem"
spacing:
  gutter: "1.5rem"
  wide-gutter: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0.75rem 1.25rem"
  button-submit:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0.75rem 1rem"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
---

## Overview

The public site uses a dark purple header and footer, light reading surfaces, and gold quote actions. Use the existing pages as the reference when extending the site.

## Colors

Use deep purple for strong backgrounds and headings, gold for the main navigation action, and violet for focus and selected states. Use white and light lavender to separate sections.

## Typography

Use the existing Geist family. Keep headings bold and compact, and use comfortable line spacing for descriptions and terms.

## Layout

Follow the shared `max-w-7xl` container and existing mobile and desktop gutters. Stack content on narrow screens and add columns where they improve scanning. Use the current header, footer, and mobile menu.

## Elevation & Depth

Use subtle borders and restrained shadows on white panels. Use background color and spacing to separate most sections.

## Shapes

Keep rounded controls and rounded content panels consistent with existing Tailwind classes. Keep important controls easy to tap.

## Components

Use the gold quote action in the header and the dark purple primary action inside forms. Keep form labels visible and show keyboard focus. Use existing cards and content patterns before introducing a new variant.

## Do's and Don'ts

- Preserve the established purple and gold palette and shared page layout.
- Keep motion purposeful and honor reduced-motion preferences.
- Avoid adding decorative effects or new component variants that do not improve the page.

# Clear Impression Services Frontend

Public-facing website built with Next.js App Router, React, TypeScript, and Tailwind CSS.

## Local setup

Install Node.js with npm, then run these commands from this repository:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Sanity content

The FAQ page reads published content from Sanity project `vpeebhw5`, dataset
`production`. These public identifiers are shared defaults in `sanity/client.ts`,
so teammates do not need an environment file or API token to read the published
FAQs. Internet access is required.

To use a different project or dataset, optionally set
`NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` in `.env.local`.
Keep private tokens out of Git and out of `NEXT_PUBLIC_` variables.

The website fetches published FAQs without caching so updates appear on
the next page request. Running Studio is optional for viewing the website.

Sanity Studio lives in `studio/` in this repository. To run the editing
interface, open a second terminal from the repository root:

```bash
cd studio
npm ci
npm run dev
```

Open the URL printed by Studio and sign in with a Sanity account that has
access to the project. Keep the website running in its own terminal.
## Commands

- `npm run dev`: start the development server.
- `npm run lint`: run ESLint.
- `npm run build`: create a production build.
- `npm start`: serve an existing production build.

## Current state and scope

The public frontend includes shared layout components and business pages. The
FAQ page is connected to Sanity; other content may still use local data files.
Google review API integration and real form submission are not implemented.

Vercel is the planned deployment target. The existing Hostinger website remains live and unchanged.

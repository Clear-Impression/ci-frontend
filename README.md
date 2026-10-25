# Clear Impression Services Frontend

Public-facing website built with Next.js App Router, React, TypeScript, and Tailwind CSS.

## Local setup

Install Node.js with npm, then run these commands from this repository:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## FAQ API and Sanity content

The FAQ page fetches published FAQs through the separate FastAPI application in
`../ci-backend`. Run that application on port 8000 alongside this frontend.
See its README for Python setup and startup instructions.

The default API address is `http://127.0.0.1:8000`. To change it, copy
`.env.example` to `.env.local` and set `API_BASE_URL`. This is a server-side
variable; it does not need a `NEXT_PUBLIC_` prefix. Set a reachable backend URL
in the hosting environment when deploying. Keep private tokens out of Git.

FastAPI owns the Sanity configuration and query. The FAQ page fetches without
caching, so published updates appear on the next request. If the API is
unavailable, the page displays an unavailable message. An empty published list
has a separate empty state. Internet access is required by the backend.

Sanity Studio lives in `studio/` in this repository. To run the editing
interface, open a second terminal from the repository root:

```bash
cd studio
npm ci
npm run dev
```

Open the URL printed by Studio and sign in with a Sanity account that has
access to the project. Keep the website and backend running in their own
terminals. Studio is optional for viewing published content. The owner page
links to `http://localhost:3333` by default; override it with
`NEXT_PUBLIC_SANITY_STUDIO_URL` if needed.
## Commands

- `npm run dev`: start the development server.
- `npm run lint`: run ESLint.
- `npm run build`: create a production build.
- `npm start`: serve an existing production build.

## Current state and scope

The public frontend includes shared layout components and business pages. The
FAQ page reads Sanity content through FastAPI; other content uses local data files.
Google review API integration and real form submission are not implemented.

Vercel is the planned deployment target. The existing Hostinger website remains live and unchanged.

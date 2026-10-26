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
## Owner login in local development

The API lives in the separate
[ci-backend repository](https://github.com/Clear-Impression/ci-backend). Clone it
beside `ci-frontend`, then follow its README to install Python dependencies, start
PostgreSQL, apply migrations, and create an owner account.

Start FastAPI from `ci-backend` in a separate terminal:

```bash
cd ../ci-backend
source .venv/bin/activate
python -m uvicorn app.main:app --reload
```

Start Next.js with `npm run dev` from the repository root, then open
[http://localhost:3000/owner/login](http://localhost:3000/owner/login).
Use the email and password entered when creating the owner account.

Next.js forwards login requests to `http://127.0.0.1:8000` by default. Set
`OWNER_API_URL` in the frontend `.env.local` if the backend uses another address.
This variable is server-only; it does not need a `NEXT_PUBLIC_` prefix.

For local HTTP, set `OWNER_COOKIE_SECURE=false` in `ci-backend/.env`. Production
requires HTTPS, `OWNER_COOKIE_SECURE=true`, and the website's origin in
`OWNER_ALLOWED_ORIGINS` (a JSON array in `ci-backend/.env`). Restart the servers after
changing environment settings.

Login saves an eight-hour session in an HttpOnly cookie and opens the dashboard.
The dashboard verifies that session with FastAPI before rendering. Missing,
invalid, expired, or inactive-owner sessions redirect to sign-in. If verification
is unavailable, dashboard content stays hidden and a retry message is shown.
Logout and login attempt limits are still pending. Future customer-data endpoints
must also use the `require_owner` dependency from `ci-backend/app/api/auth.py`.

Open `clear-impression.code-workspace` to work with both repositories in VS Code.
They have separate Git histories, branches, and commits.

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

# Clear Impression Services Frontend

Public-facing website built with Next.js App Router, React, TypeScript, and Tailwind CSS.

## Local setup

Install Node.js with npm, then run these commands from this repository:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## FAQ and service content

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

Sanity Studio lives in `studio/` in this repository. It now contains FAQ and
Service document types. To run the editing interface, open a second terminal
from the repository root:

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

The public services pages read published Service documents through
`next-sanity`. Set these values in `.env.local` when using a different Sanity
project or dataset:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=vpeebhw5
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_STUDIO_URL=http://localhost:3333
```

### Adding services to Sanity

The existing service catalog in `data/services.ts` remains as a safe fallback
until the records are added to Sanity. In Studio, create one Service document
for each service and set:

1. **Title** and **URL slug** — preserve the existing slug so current links keep working.
2. **Category** — Cleaning method, Core service, or Specialized service.
3. **Preview description**, **Large description**, and **Detail paragraphs**.
4. **Display order** — lower numbers appear first within the service page.
5. **Show on website** — publish the document when it is ready.

After the first published Service document exists, the website uses the
published Sanity catalog instead of the local fallback. Owners can open
**Owner dashboard → Edit services** to launch Studio, edit a service, and
publish it. Published changes appear after the website's 60-second cache
expires; a new service also becomes available at its slug without requiring a
code change.

## Page headers in Sanity

Open a page in Studio and choose Page header to edit its title and subtitle.
Under FAQ, Questions still holds the individual questions and answers. Locations
has a header for each city. Service pages use their existing service records.

Headers start with the current text. Publish your edits to show them on the
website after about a minute. Until then, the website keeps its current wording.

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

Owner login and dashboard verification use `API_BASE_URL`, the same server-side
backend address as the FAQ and feedback pages. Set `OWNER_API_URL` in the frontend
`.env.local` only if owner authentication uses a different backend. Neither
variable needs a `NEXT_PUBLIC_` prefix.

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
FAQ page reads Sanity content through FastAPI; other content uses local data files.
Google review API integration and real form submission are not implemented.

Vercel is the planned deployment target. The existing Hostinger website remains live and unchanged.

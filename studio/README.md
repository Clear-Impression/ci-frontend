# Clear Impression content editor

Live editor: https://clear-impression-services.sanity.studio/

Studio edits project `vpeebhw5`, dataset `production`, which the live website
reads. Sign in with a Sanity account that has access to this project. Sanity
hosts the editor separately from the FastAPI backend on Render.

## Connect the owner dashboard

In the `ci-frontend` Vercel project's Production environment, set:

```dotenv
NEXT_PUBLIC_SANITY_STUDIO_URL=https://clear-impression-services.sanity.studio
```

Redeploy the frontend after saving. The owner dashboard's content links then
open the hosted editor instead of `localhost:3333`. The website's owner login
and Sanity's login are separate.

## Develop and deploy

From this directory:

```bash
npm ci
npm run dev
```

Local Studio also edits production content. Publishing changes can affect the
live site; drafts stay unpublished until an editor chooses Publish.

To update the hosted editor:

```bash
npx sanity login
npm run deploy
```

The deployment ID and hostname in `sanity.cli.ts` select the existing Studio.
Studio supports FAQs, services, locations, blog, and page headers. Only content
wired to Sanity is editable; deploying Studio does not move local components
or data into the CMS. Most CMS pages refresh after their 60-second cache
expires; FAQs load through FastAPI without caching.

Project members are managed at
https://www.sanity.io/manage/project/vpeebhw5.

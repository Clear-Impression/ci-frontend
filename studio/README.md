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

## Instant customer prices

Open **Instant customer prices**, then select Windows by home size, Commercial
by building, Solar, Gutters, or Screens & tracks. Each service has subsections
for the factors it uses: size, height, sides, condition, frequency, and add-ons.
The size section holds the base rate and minimum; Price range controls the
percentage spread and rounding increment. Hard water remains a photo quote.

The current calculator values prefill new documents. To persist any missing
sections as drafts, without changing existing drafts or published pricing:

```bash
npm run seed:instant-prices
```

The existing values in `data/estimate.ts` were marked as placeholder prices;
prefilling copies those values exactly, without treating them as confirmed rates.
Review and publish each service's pricing to activate it. Publishing updates
the calculator, summary/PDF, and floating estimate bar after roughly 60 seconds
once the pricing integration is deployed to Vercel. Draft edits have no public
effect. Missing or invalid fields and Sanity outages use the code defaults.

Multipliers apply to the base price (quantity × rate), followed by flat
adjustments and selected add-ons. A per-unit add-on is multiplied by quantity.
The minimum is then applied, and the displayed range is rounded. A negative
flat adjustment is a discount; 1 is a neutral multiplier and 0 is a valid value.

Run `npm run test:pricing` from the frontend root to verify pricing behavior.

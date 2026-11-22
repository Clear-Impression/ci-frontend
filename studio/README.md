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

## Customer quote steps

The package-based `EstimateFlow` is parked for future approval. The active
`/estimate` route renders `PriceCalculator` and uses `submitInstantQuote`.
Keep both server-action exports while retaining the inactive package files,
so those files still type-check without replacing the active submission path.

The website now starts with service selection for a home / single building.
The Business toggle is removed; Commercial by building is retained in Studio
for future use.
Only selected services appear in the customer's step navigation. Summary comes
after those services, and Complete quote unlocks the final contact/location
section. City choices still come from Sanity's Locations content.

Window cleaning uses the Windows size, height, sides, and condition prices.
Screens/tracks are priced only in their dedicated service step, so legacy
window add-on fields are hidden and no longer charged by the new flow. Their
stored values are preserved for compatibility with older deployments.
Window and gutter size answers stay linked. Height is linked across windows,
gutters, and solar, but each service keeps its own Sanity rate and multiplier.
Solar panel count remains independent from building size.

Hard-water photos use the existing text/email links. The customer's Photos
sent checkbox is an acknowledgement, not an upload or delivery receipt.
Hard water remains a separate photo quote and is excluded from priced totals.
The acknowledgement, contact details, selected steps, and answers survive a
refresh in the same browser tab and appear in the PDF where applicable.

## Send an instant quote request

Finalize requires email, phone (7–15 digits), and city. Name and street address
are optional. Both Send quote and Send request and download PDF use the existing
`submitQuote` action and `/api/v1/quotes` endpoint, including its email notification
flow. PDF generation happens only after the API confirms receipt. The PDF includes
the customer's email/phone and the returned quote reference.

The backend contract is unchanged. Missing address is sent as
`Not provided (instant quote)` and ZIP is `00000`; these placeholders are clearly
identified in the request notes. Optional names use an explicit Not provided
marker when needed. Gutter and hard-water selections use the existing
`window-cleaning` category for API compatibility, while the actual services,
answers, photo status, individual prices, and total are listed in the email notes.

The server recalculates request notes using published Sanity prices rather than
trusting browser totals. If the displayed pricing version is stale, it returns
the refreshed pricing for review without submitting. Retries and the subsequent
PDF action reuse the same submission key for unchanged details, including after
a browser-tab refresh. Editing the contact details, answers, or prices creates
a new submission key. A saved request indicates receipt; email delivery follows
the same configuration and retry behavior as the detailed quote form.

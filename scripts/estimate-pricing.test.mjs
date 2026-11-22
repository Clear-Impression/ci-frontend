import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { after, test } from 'node:test';

// Compile the pure pricing modules with the project's installed TypeScript.
// No network, framework runtime, or production writes are involved.
const output = mkdtempSync(path.join(tmpdir(), 'ci-estimate-pricing-'));
after(() => rmSync(output, { recursive: true, force: true }));
execFileSync(process.execPath, ['node_modules/typescript/bin/tsc',
  'data/estimate.ts', 'data/estimate-pricing.ts', 'data/estimate-flow.ts', 'data/estimate-request.ts', '--module', 'commonjs',
  '--target', 'ES2021', '--skipLibCheck', '--outDir', output]);
const require = createRequire(import.meta.url);
const { estimateTabs, startingValues, rangeFor, linesFor, totalRange } = require(path.join(output, 'estimate.js'));
const { applyEstimatePricing, initialPricing, pricingSections } = require(path.join(output, 'estimate-pricing.js'));
const { buildInstantQuoteRequest, contactError } = require(path.join(output, 'estimate-request.js'));
const { WINDOW_SERVICE, GUTTER_SERVICE, SOLAR_SERVICE, PHOTO_SERVICE, quoteServices, quoteTabs, quoteSteps,
  restoreQuoteFlow, updateQuoteAnswer, selectQuoteService, canFinalizeQuote, quoteLines } = require(path.join(output, 'estimate-flow.js'));
const section = (slug) => pricingSections.find((entry) => entry.tab.slug === slug);
const document = (slug, overrides = {}) => ({ _id: section(slug).documentId, ...overrides });
const residential = 'residential-window-washing';

test('seeded current prices preserve every existing service and choice combination', () => {
  const documents = pricingSections.map((entry) => document(entry.tab.slug, initialPricing(entry.tab)));
  const edited = applyEstimatePricing(documents);
  for (const original of estimateTabs) {
    let answers = [startingValues(original)];
    for (const question of original.questions) {
      if (question.kind === 'choice') {
        answers = answers.flatMap((values) => question.options.map((option) => ({ ...values, [question.id]: option.id })));
      } else if (question.kind === 'addons') {
        const combinations = question.options.reduce((sets, option) => [...sets, ...sets.map((set) => [...set, option.id])], [[]]);
        answers = answers.flatMap((values) => combinations.map((picked) => ({ ...values, [question.id]: picked })));
      }
    }
    const next = edited.find((tab) => tab.slug === original.slug);
    for (const values of answers) assert.deepEqual(rangeFor(next, values), rangeFor(original, values), JSON.stringify({ slug: original.slug, values }));
  }
});

test('published size rates, height, sides, condition, and add-ons affect the same calculated range', () => {
  const tabs = applyEstimatePricing([document(residential, {
    rate: 0.2, minimum: 100, rangePercent: 10, roundingIncrement: 1,
    height: { two: { multiply: 1.5 } }, sides: { outside: { multiply: 0.5 } },
    dirt: { rough: { add: 80 } }, extras: { screens: { add: 0, perUnit: 0.2 } },
  })]);
  const values = { size: 2000, height: 'two', sides: 'outside', dirt: 'rough', extras: ['screens'] };
  const range = { low: 702, high: 858 };
  assert.deepEqual(rangeFor(tabs[0], values), range);
  assert.deepEqual(linesFor([residential], { [residential]: values }, tabs)[0].range, range);
  assert.deepEqual(totalRange(linesFor([residential], { [residential]: values }, tabs)), range);
});

test('commercial frequency and building height use edited multipliers', () => {
  const slug = 'commercial-office-glass';
  const tab = applyEstimatePricing([document(slug, {
    rate: 0.1, minimum: 0, rangePercent: 0, roundingIncrement: 1,
    frequency: { monthly: { multiply: 0.8 } }, height: { upper: { multiply: 1.5 } },
  })]).find((entry) => entry.slug === slug);
  assert.deepEqual(rangeFor(tab, { size: 3000, frequency: 'monthly', height: 'upper' }), { low: 360, high: 360 });
});

test('invalid numbers, unknown records, and draft IDs cannot replace default prices', () => {
  const tabs = applyEstimatePricing([
    document(residential, { rate: -1, minimum: '100', rangePercent: 100, roundingIncrement: 0,
      height: { two: { multiply: Infinity } }, dirt: { light: { add: NaN } } }),
    { _id: 'drafts.' + section('solar-panel-cleaning').documentId, rate: 100 },
    { _id: 'unknown', rate: 100 },
  ]);
  for (const tab of estimateTabs) {
    assert.deepEqual(rangeFor(tabs.find((entry) => entry.slug === tab.slug), startingValues(tab)), rangeFor(tab, startingValues(tab)));
  }
  assert.equal(tabs[0].questions.find((question) => question.id === 'height').options[1].multiply, 1.2);
  assert.equal(applyEstimatePricing(null), estimateTabs);
});

test('zero adjustments are respected and rounded ranges never fall below the minimum', () => {
  const tab = applyEstimatePricing([document(residential, {
    rate: 0, minimum: 149, rangePercent: 0, roundingIncrement: 100,
    height: { two: { multiply: 0 } }, dirt: { light: { add: 0 } },
  })])[0];
  assert.deepEqual(rangeFor(tab, { size: 2000, height: 'two', dirt: 'light' }), { low: 149, high: 149 });
  const screens = estimateTabs.find((entry) => entry.slug === 'screen-deep-cleaning');
  assert.equal(rangeFor(screens, { size: 12, parts: [] }), null);
  assert.equal(rangeFor(estimateTabs.find((entry) => entry.mode === 'photo'), {}), null);
});

test('the carousel contains only selected services in order, with finalize unlocked at the end', () => {
  const tabs = quoteTabs(estimateTabs);
  let flow = restoreQuoteFlow(tabs);
  assert.deepEqual(quoteSteps(flow), ['select-services', 'summary']);
  assert.equal(canFinalizeQuote(flow, tabs), false);
  flow = selectQuoteService(flow, 'solar-panel-cleaning', true);
  flow = selectQuoteService(flow, WINDOW_SERVICE, true);
  assert.deepEqual(quoteSteps(flow), ['select-services', WINDOW_SERVICE, 'solar-panel-cleaning', 'summary']);
  assert.equal(canFinalizeQuote(flow, tabs), true);
  flow = selectQuoteService({ ...flow, step: 'summary' }, GUTTER_SERVICE, true, true);
  assert.equal(flow.step, GUTTER_SERVICE);
  assert.deepEqual(quoteSteps({ ...flow, finalizeUnlocked: true }).at(-1), 'finalize');
  flow = selectQuoteService(flow, GUTTER_SERVICE, false);
  assert.equal(flow.step, 'select-services');
  assert(!quoteSteps(flow).includes(GUTTER_SERVICE));
});

test('legacy business selections restore as the single-building flow with Sanity pricing', () => {
  const tabs = quoteTabs(applyEstimatePricing([document(residential, { rate: 0.3 })]));
  assert.deepEqual(tabs.map((tab) => tab.slug), quoteServices.map((service) => service.slug));
  const home = restoreQuoteFlow(tabs, { added: [WINDOW_SERVICE], propertyType: 'home' });
  const business = restoreQuoteFlow(tabs, { added: [WINDOW_SERVICE], propertyType: 'business' });
  assert.equal(business.propertyType, 'home');
  assert.deepEqual(quoteLines(home, tabs), quoteLines(business, tabs));
  assert.equal(tabs[0].rate, 0.3);
});

test('window and gutter size and height stay linked in both directions and after restore', () => {
  const tabs = quoteTabs(estimateTabs);
  let flow = restoreQuoteFlow(tabs, { added: [WINDOW_SERVICE, GUTTER_SERVICE] });
  flow = updateQuoteAnswer(flow, WINDOW_SERVICE, 'size', 3200);
  flow = updateQuoteAnswer(flow, WINDOW_SERVICE, 'height', 'two');
  assert.equal(flow.values[GUTTER_SERVICE].size, 3200);
  assert.equal(flow.values[GUTTER_SERVICE].height, 'two');
  flow = updateQuoteAnswer(flow, GUTTER_SERVICE, 'size', 4000);
  flow = updateQuoteAnswer(flow, GUTTER_SERVICE, 'height', 'one');
  assert.equal(flow.values[WINDOW_SERVICE].size, 4000);
  assert.equal(flow.values[WINDOW_SERVICE].height, 'one');
  const restored = restoreQuoteFlow(tabs, { values: flow.values, added: flow.selected });
  assert.deepEqual(restored.values[WINDOW_SERVICE], flow.values[WINDOW_SERVICE]);
  assert.deepEqual(restored.values[GUTTER_SERVICE], flow.values[GUTTER_SERVICE]);
  const guttersOnly = restoreQuoteFlow(tabs, { values: { [GUTTER_SERVICE]: { size: 3300, height: 'two' } } });
  assert.equal(guttersOnly.values[WINDOW_SERVICE].size, 3300);
});

test('old window extras never add screen or track charges to the new window step', () => {
  const tabs = quoteTabs(estimateTabs);
  assert(!tabs[0].questions.some((question) => question.id === 'extras'));
  const values = { ...startingValues(tabs[0]), extras: ['tracks', 'screens'] };
  assert.deepEqual(rangeFor(tabs[0], values), rangeFor(tabs[0], startingValues(tabs[0])));
  const screens = tabs.find((tab) => tab.slug === 'screen-deep-cleaning');
  assert.deepEqual(screens.questions.map((question) => question.id), ['size', 'parts']);
});

test('solar height is linked in all directions, survives restore, and leaves panel count independent', () => {
  const tabs = quoteTabs(estimateTabs);
  let flow = restoreQuoteFlow(tabs, { added: [WINDOW_SERVICE, GUTTER_SERVICE, SOLAR_SERVICE] });
  for (const source of [WINDOW_SERVICE, GUTTER_SERVICE, SOLAR_SERVICE]) {
    for (const height of ['two', 'one']) {
      flow = updateQuoteAnswer(flow, source, 'height', height);
      for (const slug of [WINDOW_SERVICE, GUTTER_SERVICE, SOLAR_SERVICE]) assert.equal(flow.values[slug].height, height);
    }
  }
  flow = updateQuoteAnswer(flow, SOLAR_SERVICE, 'size', 35);
  flow = updateQuoteAnswer(flow, WINDOW_SERVICE, 'size', 3000);
  assert.equal(flow.values[GUTTER_SERVICE].size, 3000);
  assert.equal(flow.values[SOLAR_SERVICE].size, 35);
  const restored = restoreQuoteFlow(tabs, { added: [SOLAR_SERVICE], values: {
    ...flow.values, [SOLAR_SERVICE]: { size: 35, height: 'two' },
  } });
  for (const slug of [WINDOW_SERVICE, GUTTER_SERVICE, SOLAR_SERVICE]) assert.equal(restored.values[slug].height, 'two');
  assert.equal(restored.values[SOLAR_SERVICE].size, 35);
});

test('screen options are required before finalize and invalid saved steps are repaired', () => {
  const tabs = quoteTabs(estimateTabs);
  const slug = 'screen-deep-cleaning';
  let flow = restoreQuoteFlow(tabs, { added: [slug], values: { [slug]: { size: 12, parts: [] } }, step: 'finalize', finalizeUnlocked: true });
  assert.equal(canFinalizeQuote(flow, tabs), false);
  assert.equal(flow.finalizeUnlocked, false);
  assert.equal(flow.step, 'select-services');
  flow = updateQuoteAnswer(flow, slug, 'parts', ['tracks']);
  assert.equal(canFinalizeQuote(flow, tabs), true);
  assert.equal(restoreQuoteFlow(tabs, { added: [], step: 'summary' }).step, 'select-services');
});

test('hard-water photo confirmation persists without inventing a price or inflating the total', () => {
  const tabs = quoteTabs(estimateTabs);
  const pending = restoreQuoteFlow(tabs, { added: [PHOTO_SERVICE] });
  assert.equal(canFinalizeQuote(pending, tabs), true);
  assert.match(quoteLines(pending, tabs)[0].details, /Photos still needed/);
  assert.equal(quoteLines(pending, tabs)[0].range, null);
  const sent = restoreQuoteFlow(tabs, { added: [WINDOW_SERVICE, PHOTO_SERVICE], photoSent: true, step: 'finalize', finalizeUnlocked: true });
  assert.equal(sent.step, 'finalize');
  assert.match(quoteLines(sent, tabs)[1].details, /Photos sent/);
  assert.deepEqual(totalRange(quoteLines(sent, tabs)), rangeFor(tabs[0], startingValues(tabs[0])));
});

test('service deep links still open the relevant step and legacy commercial links use the home flow', () => {
  const tabs = quoteTabs(estimateTabs);
  const solar = restoreQuoteFlow(tabs, undefined, 'solar-panel-cleaning');
  assert.equal(solar.step, 'solar-panel-cleaning');
  assert.deepEqual(solar.selected, ['solar-panel-cleaning']);
  const business = restoreQuoteFlow(tabs, undefined, 'commercial-office-glass');
  assert.equal(business.propertyType, 'home');
  assert.equal(business.step, WINDOW_SERVICE);
});

const contact = { name: '', email: 'customer@example.com', phone: '(480) 555-0100', address: '', city: 'Mesa' };
test('email and phone are both required; name and address remain optional', () => {
  assert.equal(contactError(contact), null);
  assert.equal(contactError({ ...contact, email: '' }).field, 'email');
  assert.equal(contactError({ ...contact, phone: '' }).field, 'phone');
  assert.equal(contactError({ ...contact, phone: '123' }).field, 'phone');
  assert.equal(contactError({ ...contact, email: 'not-an-email' }).field, 'email');
  const tabs = quoteTabs(estimateTabs);
  const flow = restoreQuoteFlow(tabs, { added: [WINDOW_SERVICE] });
  const request = buildInstantQuoteRequest(contact, flow.selected, flow.values, false, tabs);
  assert.equal(request.postalCode, '00000');
  assert.equal(request.address, 'Not provided (instant quote)');
  assert.equal(`${request.firstName} ${request.lastName}`, 'Name not provided');
  assert.match(request.details, /Customer name: Not provided/);
});

test('all Sanity-priced services agree across quote lines, total, and outgoing email details', () => {
  const documents = [
    document(WINDOW_SERVICE, { rate: 0.2, minimum: 0, rangePercent: 10, roundingIncrement: 1, height: { two: { multiply: 1.5 } }, dirt: { light: { add: -10 } } }),
    document('screen-deep-cleaning', { minimum: 0, rangePercent: 10, roundingIncrement: 1, parts: { screens: { perUnit: 8 }, tracks: { perUnit: 4 } } }),
    document(GUTTER_SERVICE, { rate: 0.1, minimum: 0, rangePercent: 10, roundingIncrement: 1, height: { two: { multiply: 2 } }, fill: { packed: { add: 30 } } }),
    document(SOLAR_SERVICE, { rate: 9, minimum: 0, rangePercent: 10, roundingIncrement: 1, height: { two: { multiply: 1.25 } } }),
  ];
  const tabs = quoteTabs(applyEstimatePricing(documents));
  const flow = restoreQuoteFlow(tabs, { added: quoteServices.map((service) => service.slug), values: {
    [WINDOW_SERVICE]: { size: 2000, height: 'two', sides: 'both', dirt: 'light', extras: ['tracks', 'screens'] },
    ['screen-deep-cleaning']: { size: 10, parts: ['screens', 'tracks'] },
    [GUTTER_SERVICE]: { fill: 'packed' }, [SOLAR_SERVICE]: { size: 20 },
  }, photoSent: true });
  const lines = quoteLines(flow, tabs);
  assert.deepEqual(lines.map((line) => line.range), [
    { low: 531, high: 649 }, { low: 108, high: 132 }, null,
    { low: 387, high: 473 }, { low: 203, high: 248 },
  ]);
  assert.deepEqual(totalRange(lines), { low: 1229, high: 1502 });
  const request = buildInstantQuoteRequest(contact, flow.selected, flow.values, true, tabs);
  assert.deepEqual(request.services, ['screen-cleaning', 'solar-panel-cleaning', 'window-cleaning']);
  assert.match(request.details, /compatibility/);
  assert.match(request.details, /Photos sent/);
  assert.match(request.details, /\$1,229 – \$1,502/);
  assert.match(request.details, /\$531 – \$649/);
  assert.match(request.details, /\$108 – \$132/);
  assert.match(request.details, /\$387 – \$473/);
  assert.match(request.details, /\$203 – \$248/);
  assert(request.details.length < 2000);
  const gutterOnly = buildInstantQuoteRequest(contact, [GUTTER_SERVICE], flow.values, false, tabs);
  assert.deepEqual(gutterOnly.services, ['window-cleaning']);
  assert.match(gutterOnly.details, /Gutter & Roof Care/);
});

// Execute the real route/action modules with only their external dependencies
// mocked, so a merge cannot silently disconnect the calculator or its submit action.
function loadServerModule(filename, dependencies) {
  const ts = require('typescript');
  const compiled = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2021, esModuleInterop: true },
  }).outputText;
  const exports = {};
  new Function('require', 'exports', compiled)((id) => {
    if (id in dependencies) return dependencies[id];
    if (id === 'react/jsx-runtime') return require(id);
    throw new Error(`Unexpected dependency in ${filename}: ${id}`);
  }, exports);
  return exports;
}

test('the estimate route renders the service calculator with Sanity prices, headers, and cities', async () => {
  const React = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const prices = applyEstimatePricing([document(WINDOW_SERVICE, { rate: 0.23 })]);
  let calculatorProps;
  const route = loadServerModule('app/estimate/page.tsx', {
    '@/lib/seo': { createPageMetadata: () => ({}) },
    '@/components/estimate/PriceCalculator': { __esModule: true, default: (props) => {
      calculatorProps = props;
      return React.createElement('div', { 'data-calculator': 'service-quote' });
    } },
    '@/lib/locations': { getLocations: async () => ({ cities: [{ name: 'Mesa' }, { name: 'Phoenix' }] }) },
    '@/lib/page-headers': { getPageHeader: async () => ({ title: 'Sanity quote heading', subtitle: 'Sanity quote subtitle' }) },
    '@/lib/estimate-pricing': { getEstimatePricing: async () => prices },
  });
  const html = renderToStaticMarkup(await route.default());
  assert.match(html, /data-calculator="service-quote"/);
  assert.match(html, /Sanity quote heading/);
  assert.match(html, /Sanity quote subtitle/);
  assert.match(html, /id="estimate"/);
  assert.doesNotMatch(html, /Bronze|Silver|Gold|package|request a day/i);
  assert.equal(calculatorProps.tabs, prices);
  assert.equal(calculatorProps.tabs[0].rate, 0.23);
  assert.deepEqual(calculatorProps.cities, ['Mesa', 'Phoenix']);
});

test('the merged submit action validates contacts and pricing before using the existing quote email pipeline', async () => {
  const prices = applyEstimatePricing([document(WINDOW_SERVICE, { rate: 0.2 })]);
  const tabs = quoteTabs(prices);
  const sent = [];
  const actions = loadServerModule('app/estimate/actions.ts', {
    '@/data/packages': {}, // The parked package action is not part of this flow.
    '@/app/quote/actions': { submitQuote: async (data) => {
      sent.push(data);
      return { status: 'saved', id: '00000000-0000-4000-8000-000000000099' };
    } },
    '@/lib/estimate-pricing': { getEstimatePricing: async () => prices },
    '@/data/estimate-flow': { quoteTabs },
    '@/data/estimate-request': { buildInstantQuoteRequest, contactError },
  });
  const data = new FormData();
  Object.entries({ ...contact, submissionKey: '00000000-0000-4000-8000-000000000003',
    values: JSON.stringify(restoreQuoteFlow(tabs).values), pricingVersion: JSON.stringify(tabs), photoSent: 'true',
  }).forEach(([key, value]) => data.set(key, value));
  [WINDOW_SERVICE, GUTTER_SERVICE, PHOTO_SERVICE].forEach((slug) => data.append('services', slug));
  data.set('email', '');
  assert.equal((await actions.submitInstantQuote(data)).status, 'invalid');
  assert.equal(sent.length, 0);
  data.set('email', contact.email);
  data.set('pricingVersion', 'stale-prices');
  const refresh = await actions.submitInstantQuote(data);
  assert.equal(refresh.status, 'pricing_changed');
  assert.equal(refresh.tabs[0].rate, 0.2);
  assert.equal(sent.length, 0);
  data.set('pricingVersion', JSON.stringify(tabs));
  data.set('total', '0'); // Browser-provided totals must not be used.
  const result = await actions.submitInstantQuote(data);
  assert.equal(result.status, 'saved');
  assert.equal(sent.length, 1);
  assert.equal(sent[0].get('email'), contact.email);
  assert.equal(sent[0].get('phone'), contact.phone);
  assert.equal(sent[0].get('postalCode'), '00000');
  assert.deepEqual(sent[0].getAll('services'), ['window-cleaning']);
  assert.match(sent[0].get('details'), /\$350 – \$450/);
  assert.match(sent[0].get('details'), /Photos sent/);
  assert.match(sent[0].get('details'), /Gutter & Roof Care/);
  assert.equal(sent[0].get('total'), null);
  await actions.submitInstantQuote(data);
  assert.equal(sent[1].get('submissionKey'), sent[0].get('submissionKey'));
});

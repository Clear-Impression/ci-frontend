import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { after, test } from 'node:test';

// Compile the pure pricing modules with the project's installed TypeScript.
// No network, framework runtime, or production writes are involved.
const output = mkdtempSync(path.join(tmpdir(), 'ci-estimate-pricing-'));
after(() => rmSync(output, { recursive: true, force: true }));
execFileSync(process.execPath, ['node_modules/typescript/bin/tsc',
  'data/estimate.ts', 'data/estimate-pricing.ts', '--module', 'commonjs',
  '--target', 'ES2021', '--skipLibCheck', '--outDir', output]);
const require = createRequire(import.meta.url);
const { estimateTabs, startingValues, rangeFor, linesFor, totalRange } = require(path.join(output, 'estimate.js'));
const { applyEstimatePricing, initialPricing, pricingSections } = require(path.join(output, 'estimate-pricing.js'));
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

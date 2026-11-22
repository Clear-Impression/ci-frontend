'use client';

import { useRef, useState } from 'react';
import { faqTopics, featuredQuestions } from '@/data/faq-browse';
import type { FAQItem } from '@/types/faq';
import FAQAccordion from './faqAccordion';

const batchSize = 5;
const normalize = (text: string) => text.trim().toLowerCase();
const topicByQuestion = new Map<string, string>(
  faqTopics.flatMap(({ label, questions }) =>
    questions.map((question): [string, string] => [normalize(question), label]),
  ),
);
const featuredRank = new Map<string, number>(
  featuredQuestions.map((question, index) => [normalize(question), index]),
);

export default function FAQBrowser({ items, openId }: {
  items: FAQItem[];
  openId?: string;
}) {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('All');
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const resultsRef = useRef<HTMLDivElement>(null);
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const browsingAll = !terms.length && topic === 'All';

  const matches = items.filter((item) => {
    const itemTopic = topicByQuestion.get(normalize(item.question));
    if (topic !== 'All' && itemTopic !== topic) return false;
    const searchable = normalize([item.question, item.answer, ...(item.bullets ?? [])].join(' '));
    return terms.every((term) => searchable.includes(term));
  });

  if (browsingAll) {
    // Keep links from the site search visible even when the answer is outside the first five.
    const rank = (item: FAQItem) => item.id === openId
      ? -1
      : featuredRank.get(normalize(item.question)) ?? featuredQuestions.length;
    matches.sort((a, b) => rank(a) - rank(b));
  }

  const visible = matches.slice(0, visibleCount);
  const remaining = matches.length - visible.length;
  const nextBatch = Math.min(batchSize, remaining);
  const heading = terms.length ? 'Search results' : browsingAll ? 'Common questions' : topic;

  function showMore() {
    const firstNewIndex = visible.length;
    setVisibleCount((count) => count + batchSize);
    // Put keyboard focus on the first new question so it can be opened right away.
    requestAnimationFrame(() => {
      resultsRef.current?.querySelectorAll('summary')[firstNewIndex]?.focus();
    });
  }

  return (
    <div className="mx-auto max-w-3xl">
      <label htmlFor="faq-search" className="block text-sm font-semibold">
        Search FAQs
      </label>
      <input
        id="faq-search"
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setVisibleCount(batchSize);
        }}
        placeholder="Try cost, rain, or screens"
        className="mt-2 min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-base shadow-sm outline-none transition hover:border-gray-400 placeholder:text-[#686170] focus:border-[#6c3fb8] focus:ring-4 focus:ring-[#6c3fb8]/15"
      />

      <div role="group" aria-label="Filter by topic" className="mt-4 flex flex-wrap gap-2">
        {['All', ...faqTopics.map(({ label }) => label)].map((label) => (
          <button
            key={label}
            type="button"
            aria-pressed={topic === label}
            onClick={() => {
              setTopic(label);
              setVisibleCount(batchSize);
            }}
            className="min-h-11 rounded-full border border-[#200b38]/15 bg-white px-4 text-sm font-semibold transition-colors hover:border-[#6c3fb8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6c3fb8] aria-pressed:border-[#6c3fb8] aria-pressed:bg-[#f0e9f9]"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mb-4 mt-8 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{heading}</h2>
        <p role="status" className="text-sm text-[#686170]">
          {matches.length ? `Showing ${visible.length} of ${matches.length}` : 'No matching questions'}
        </p>
      </div>
      <div ref={resultsRef}>
        {visible.length ? (
          <FAQAccordion items={visible} openId={openId} />
        ) : (
          <p className="rounded-xl border border-[#200b38]/10 bg-white p-5 text-[#686170]">
            Try a different search or choose All to search across every topic.
          </p>
        )}
      </div>
      {remaining > 0 && (
        <button
          type="button"
          onClick={showMore}
          className="mt-6 min-h-11 rounded-xl bg-[#200b38] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#33195a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8]"
        >
          Show {nextBatch} more {nextBatch === 1 ? 'question' : 'questions'}
        </button>
      )}
    </div>
  );
}

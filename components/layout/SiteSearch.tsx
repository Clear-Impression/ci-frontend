'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { company } from '@/data/company';
import { createSearch, groupResults, highlight, type SearchEntry } from '@/lib/search';

type SiteSearchProps = {
  // The main menu. The search button sits right after it.
  children: React.ReactNode;
};

// Small pictures that show what kind of page each result is.
const icons = {
  service: <path d='M12 3.5c3.5 4.2 6 7.4 6 10.5a6 6 0 0 1-12 0c0-3.1 2.5-6.3 6-10.5z' />,
  location: (
    <>
      <path d='M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z' />
      <circle cx='12' cy='9.5' r='2.5' />
    </>
  ),
  faq: (
    <>
      <circle cx='12' cy='12' r='9' />
      <path d='M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7M12 17h.01' />
    </>
  ),
  page: <path d='M7 3h7l5 5v13H7zM14 3v5h5' />,
  quote: <path d='M4 6h16v12H4zM4 7l8 6 8-6' />,
};

function SearchIcon({ className }: { className: string }) {
  return (
    <svg
      aria-hidden='true'
      viewBox='0 0 24 24'
      className={className}
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'>
      <circle cx='11' cy='11' r='7' />
      <path d='m20 20-3.5-3.5' />
    </svg>
  );
}

// A search icon at the end of the main menu. It opens a search box in the header
// that finds services, cities, pages, and FAQ questions as you type.
export default function SiteSearch({ children }: SiteSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Closing plays a short animation first. Once it's gone, the menu fades back in.
  const [closing, setClosing] = useState(false);
  const [justClosed, setJustClosed] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  // What search looks through. Loaded the first time it's needed.
  const [siteEntries, setSiteEntries] = useState<SearchEntry[]>([]);
  const [popular, setPopular] = useState<SearchEntry[]>([]);
  const [faqEntries, setFaqEntries] = useState<SearchEntry[]>([]);
  const loadStarted = useRef(false);
  // Set when closing should put focus back on the search button.
  const refocus = useRef(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // Set when the arrow keys move the highlight, so it can be scrolled into view.
  const keyboardMove = useRef(false);
  const listId = useId();
  const optionId = (index: number) => `${listId}-${index}`;

  // Close the search box when the visitor goes to another page.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
    setClosing(false);
  }

  // The site's pages come with the site. FAQ questions come from the backend,
  // and search still works without them.
  const load = () => {
    if (loadStarted.current) return;
    loadStarted.current = true;
    import('@/data/search')
      .then(({ siteSearchEntries, popularSearches }) => {
        setSiteEntries(siteSearchEntries);
        setPopular(popularSearches);
      })
      .catch(() => {
        // Try again next time if the file could not load.
        loadStarted.current = false;
      });
    fetch('/api/search/faqs')
      .then((response) => (response.ok ? response.json() : []))
      .then((entries: SearchEntry[]) => setFaqEntries(entries))
      .catch(() => {});
  };

  const openSearch = () => {
    load();
    clearTimeout(closeTimer.current);
    // Show the box and focus it in the same tap, so phones bring up the keyboard.
    flushSync(() => {
      setQuery('');
      setActive(0);
      setClosing(false);
      setJustClosed(false);
      setOpen(true);
    });
    inputRef.current?.focus();
  };

  // The box sweeps closed before it goes away. Picking a result skips that,
  // since the page is already changing, and so does turning motion off.
  const close = useCallback((returnFocus: boolean, animate = true) => {
    refocus.current = returnFocus;
    clearTimeout(closeTimer.current);
    const finish = () => {
      setClosing(false);
      setOpen(false);
      setJustClosed(true);
    };
    if (!animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return;
    }
    setClosing(true);
    closeTimer.current = setTimeout(finish, 160);
  }, []);

  const go = (entry: SearchEntry) => {
    close(false, false);
    if (entry.external) window.location.assign(entry.href);
    else router.push(entry.href);
  };

  const search = useMemo(() => createSearch([...siteEntries, ...faqEntries]), [siteEntries, faqEntries]);
  const trimmed = query.trim();

  // Before typing, show popular pages. After, show matches under headings.
  // Options are numbered across all headings for the arrow keys.
  const { groups, shown } = useMemo(() => {
    const list = trimmed ? groupResults(search(trimmed)) : popular.length > 0 ? [{ label: 'Popular', entries: popular }] : [];
    const numbered = list.map((group, index) => ({
      ...group,
      start: list.slice(0, index).reduce((total, previous) => total + previous.entries.length, 0),
    }));
    return { groups: numbered, shown: list.flatMap((group) => group.entries) };
  }, [search, trimmed, popular]);
  const current = Math.min(active, shown.length - 1);
  const activeId = current >= 0 ? optionId(current) : undefined;
  const loading = siteEntries.length === 0;

  // Put focus back on the search button after Escape or the close button.
  useEffect(() => {
    if (!open && refocus.current) {
      refocus.current = false;
      buttonRef.current?.focus();
    }
  }, [open]);

  // Keep the highlighted option in view while moving with the arrow keys.
  useEffect(() => {
    if (!keyboardMove.current || !activeId) return;
    keyboardMove.current = false;
    document.getElementById(activeId)?.scrollIntoView({ block: 'nearest' });
  }, [activeId]);

  // Ctrl K or ⌘K opens search from anywhere. So does / when not typing in a field.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const typing = event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable]');
      // Browser autofill sends key events with no key, so check it exists first.
      if (typeof event.key !== 'string') return;
      const shortcut = event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey);
      if (!shortcut && (event.key !== '/' || typing)) return;
      event.preventDefault();
      if (inputRef.current) inputRef.current.select();
      else buttonRef.current?.click();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // Clicking anywhere outside the search box closes it.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) close(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, close]);

  return (
    <div
      ref={boxRef}
      data-open={open ? '' : undefined}
      data-closing={closing ? '' : undefined}
      data-closed={justClosed ? '' : undefined}
      className={`site-search flex items-center gap-5 max-lg:-mr-3 max-lg:ml-auto xl:gap-6 ${open ? 'lg:flex-1' : ''}`}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.preventDefault();
          close(true);
        }
      }}
      onBlur={(event) => {
        // Close once keyboard focus moves on to something outside the search box.
        if (open && event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) close(false);
      }}>
      {/* The menu steps aside while the search box is open in its place. */}
      <div className={open ? 'hidden' : 'contents'}>{children}</div>
      {/* Looks like a menu item on wide screens and sits next to Menu on phones. */}
      <button
        ref={buttonRef}
        type='button'
        aria-label='Search the site'
        aria-keyshortcuts='Control+K Meta+K /'
        title='Search'
        onClick={openSearch}
        onPointerEnter={load}
        onFocus={load}
        className={`${open ? 'hidden' : 'flex'} min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/30 text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#efb52b] lg:min-h-0 lg:min-w-0 lg:rounded-sm lg:border-0 lg:px-0.5 lg:py-3 lg:hover:bg-transparent lg:hover:text-[#efb52b]`}>
        <SearchIcon className='size-5' />
      </button>
      {open && (
        // On phones the box covers the whole header row. On wide screens it sits
        // between the logo and the quote button.
        <div className='absolute inset-x-6 inset-y-0 z-10 flex items-center sm:inset-x-8 lg:static lg:mx-auto lg:w-full lg:max-w-150'>
          <div className='relative w-full'>
            <div className='search-field flex h-11.5 items-center gap-2 rounded-xl bg-white pl-3.5 pr-1.5 text-[#200b38] ring-3 ring-[#efb52b]/55'>
              <SearchIcon className='size-4.75 shrink-0 text-[#6c3fb8]' />
              <input
                ref={inputRef}
                type='text'
                inputMode='search'
                enterKeyHint='search'
                role='combobox'
                aria-label='Search the site'
                aria-expanded='true'
                aria-controls={listId}
                aria-autocomplete='list'
                aria-activedescendant={activeId}
                autoComplete='off'
                spellCheck={false}
                placeholder='Search services and cities'
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                  panelRef.current?.scrollTo({ top: 0 });
                }}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown' && shown.length > 0) {
                    event.preventDefault();
                    keyboardMove.current = true;
                    setActive((current + 1) % shown.length);
                  } else if (event.key === 'ArrowUp' && shown.length > 0) {
                    event.preventDefault();
                    keyboardMove.current = true;
                    setActive((current - 1 + shown.length) % shown.length);
                  } else if (event.key === 'Enter' && shown[current]) {
                    event.preventDefault();
                    go(shown[current]);
                  }
                }}
                className='h-full min-w-0 flex-1 bg-transparent text-base text-[#200b38] outline-none placeholder:text-[#8a8394]'
              />
              <button
                type='button'
                aria-label='Close search'
                onClick={() => close(true)}
                className='grid size-9 shrink-0 place-items-center rounded-lg text-gray-600 hover:bg-[#f7f4fb] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#6c3fb8]'>
                <svg
                  aria-hidden='true'
                  viewBox='0 0 24 24'
                  className='size-4.5'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'>
                  <path d='M6 6l12 12M18 6 6 18' />
                </svg>
              </button>
            </div>
            {/* Clicking inside the results keeps the cursor in the box. */}
            <div
              ref={panelRef}
              onMouseDown={(event) => event.preventDefault()}
              className='search-results absolute inset-x-0 top-[calc(100%+0.625rem)] max-h-[70vh] overflow-y-auto overscroll-contain rounded-2xl bg-white p-1.5 pb-2.5 text-[#200b38] shadow-2xl shadow-[#200b38]/25 ring-1 ring-[#200b38]/10 lg:max-h-[min(460px,62vh)]'>
              <div
                id={listId}
                role='listbox'
                aria-label='Search results'>
                {groups.map((group) => (
                  <div
                    key={group.label}
                    role='group'
                    aria-labelledby={`${listId}-${group.label}`}>
                    <p
                      id={`${listId}-${group.label}`}
                      className='px-3 pb-1.5 pt-2.5 text-xs font-semibold uppercase tracking-widest text-gray-600'>
                      {group.label}
                    </p>
                    {group.entries.map((entry, offset) => {
                      const index = group.start + offset;
                      const selected = index === current;
                      const content = (
                        <>
                          <span className='grid size-9 place-items-center rounded-lg bg-[#6c3fb8]/10 text-[#6c3fb8]'>
                            <svg
                              aria-hidden='true'
                              viewBox='0 0 24 24'
                              className='size-4.5'
                              fill='none'
                              stroke='currentColor'
                              strokeWidth='1.8'
                              strokeLinecap='round'
                              strokeLinejoin='round'>
                              {entry.external ? icons.quote : icons[entry.type]}
                            </svg>
                          </span>
                          <span className='min-w-0'>
                            <span className='block font-semibold leading-snug'>
                              {highlight(entry.title, trimmed).map((part, partIndex) =>
                                part.marked ? (
                                  <mark
                                    key={partIndex}
                                    className='rounded-sm bg-[#efb52b]/35 px-px text-inherit'>
                                    {part.text}
                                  </mark>
                                ) : (
                                  part.text
                                ),
                              )}
                            </span>
                            <span className='mt-0.5 block truncate text-sm text-gray-600'>{entry.short ?? entry.description}</span>
                          </span>
                          <span
                            aria-hidden='true'
                            className={selected ? 'text-[#6c3fb8]' : 'text-[#a49cb0]'}>
                            {entry.external ? '↗' : '→'}
                          </span>
                        </>
                      );
                      const linkClass = `grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-3 rounded-[10px] px-3 py-2.5 ${selected ? 'bg-[#f7f4fb] shadow-[inset_3px_0_0_#6c3fb8]' : ''}`;
                      return (
                        <div
                          key={entry.href}
                          id={optionId(index)}
                          role='option'
                          aria-selected={selected}
                          onMouseMove={() => setActive(index)}>
                          {/* Real links, so they can still open in a new tab. Arrow keys
                              move through them instead of Tab. */}
                          {entry.external ? (
                            <a
                              href={entry.href}
                              tabIndex={-1}
                              onClick={() => close(false, false)}
                              className={linkClass}>
                              {content}
                            </a>
                          ) : (
                            <Link
                              href={entry.href}
                              tabIndex={-1}
                              onClick={() => close(false, false)}
                              className={linkClass}>
                              {content}
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              {loading ? (
                <p className='px-3 py-4 text-sm text-gray-600'>Loading…</p>
              ) : (
                trimmed &&
                shown.length === 0 && (
                  // Nothing matched. Offer a call or the quote form instead.
                  <div className='px-3.5 pb-4 pt-6 text-center text-gray-600'>
                    <p>
                      No results for <b className='font-semibold text-[#200b38]'>“{trimmed}”</b>.
                    </p>
                    <p>Try another word, or reach us directly.</p>
                    <div className='mt-3.5 flex flex-wrap justify-center gap-2'>
                      <a
                        href={company.phoneHref}
                        className='inline-flex min-h-11 items-center rounded-lg border border-[#200b38]/20 px-4 text-sm font-semibold text-[#200b38] hover:bg-[#f7f4fb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6c3fb8]'>
                        Call {company.phone}
                      </a>
                      <a
                        href={company.quoteFormUrl}
                        className='inline-flex min-h-11 items-center rounded-lg bg-[#efb52b] px-4 text-sm font-semibold text-[#200b38] hover:bg-[#f6c95b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6c3fb8]'>
                        Get a free quote
                      </a>
                    </div>
                  </div>
                )
              )}
            </div>
            {/* Tells screen readers how many results there are. */}
            <p
              aria-live='polite'
              className='sr-only'>
              {trimmed && !loading ? (shown.length > 0 ? `${shown.length} result${shown.length === 1 ? '' : 's'}` : 'No results') : ''}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

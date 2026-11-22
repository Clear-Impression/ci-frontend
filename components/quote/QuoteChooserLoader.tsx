'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, type ComponentType } from 'react';
import { openQuoteChooserEvent } from './QuoteButton';

export default function QuoteChooserLoader() {
  const router = useRouter();
  const [Chooser, setChooser] = useState<ComponentType | null>(null);

  useEffect(() => {
    if (Chooser) return;

    let loading = false;
    let active = true;

    async function loadChooser() {
      if (loading) return;
      loading = true;

      try {
        const { default: LoadedChooser } = await import('./QuoteChooser');
        if (active) setChooser(() => LoadedChooser);
      } catch {
        if (active) router.push('/estimate');
      }
    }

    window.addEventListener(openQuoteChooserEvent, loadChooser);
    return () => {
      active = false;
      window.removeEventListener(openQuoteChooserEvent, loadChooser);
    };
  }, [Chooser, router]);

  return Chooser ? <Chooser /> : null;
}

'use client';

export const openQuoteChooserEvent = 'ci:open-quote-chooser';

type QuoteButtonProps = {
  className?: string;
  children: React.ReactNode;
  // Runs first, for example to close the mobile menu.
  onOpen?: () => void;
};

// Opens the quote chooser popup. Without JavaScript it still goes to the estimate page.
export default function QuoteButton({ className, children, onOpen }: QuoteButtonProps) {
  return (
    <a
      href='/estimate'
      aria-haspopup='dialog'
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        onOpen?.();
        window.dispatchEvent(new Event(openQuoteChooserEvent));
      }}
      className={className}>
      {children}
    </a>
  );
}

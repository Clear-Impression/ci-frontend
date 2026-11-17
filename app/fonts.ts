import { Plus_Jakarta_Sans } from 'next/font/google';

// Plus Jakarta Sans for the homepage: clean and modern, used at light and
// medium weights so the big headings don't feel heavy.
export const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

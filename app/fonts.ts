import { Manrope } from 'next/font/google';

// Manrope for the homepage: bold, modern headings that stay easy to read.
export const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

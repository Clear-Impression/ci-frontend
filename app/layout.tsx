import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

// Load the font here so every page uses the same one.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Use these defaults until each page has its own metadata.
export const metadata: Metadata = {
  title: "Clear Impression Services",
  description:
    "Residential and commercial window cleaning in the Phoenix metro area.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {/* Keep the header and footer shared across all pages. */}
        <Navbar />
        {/* Each route adds its own page content here. */}
        {children}
        <Footer />
      </body>
    </html>
  );
}

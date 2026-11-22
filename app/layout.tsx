import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { company } from "@/data/company";
import EstimateBar from "@/components/layout/EstimateBar";
import ChatButton from "@/components/layout/ChatButton";
import "./globals.css";

// Load the font here so every page uses the same one.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Resolve relative canonical and social image URLs against the production domain.
export const metadata: Metadata = {
  metadataBase: new URL(company.website),
  title: company.name,
  description:
    "Residential and commercial window cleaning in the Phoenix metro area.",
};

// Display site title on search engine as "Clear Impression" and not clearimpressionservices.com
const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: company.name,
  alternateName: "Clear Impression",
  url: company.website,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
        {/* Keep the header and footer shared across all pages. */}
        <Navbar />
        {/* Each route adds its own page content here. */}
        {children}
        <Footer />
        {/* The instant estimate total, floating at the bottom of every page. */}
        <EstimateBar />
        {/* The "Ask a question" button in the corner. The chat is coming soon. */}
        <ChatButton />
      </body>
    </html>
  );
}

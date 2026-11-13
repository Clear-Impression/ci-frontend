import type { NextConfig } from "next";

const legacyRoutes = [
  ["/window-cleaning-services", "/services"],
  ["/about-us-window-cleaning-mesa-az", "/about"],
  ["/faqs-learn-here", "/faq"],
  ["/get-a-quote", "/quote"],
  // Older service URLs, whose CMS slugs are normalized in lib/services.ts.
  ["/services/commercial-and-office-glass", "/services/commercial-office-glass"],
  ["/services/gutter-and-roof-care", "/services/gutter-roof-care"],
  ["/services/french-and-storm-windows", "/services/french-storm-windows"],
  ["/services/glass-door-and-mirror-polishing", "/services/glass-door-mirror-polishing"],
  ["/services/awning-and-sunroom-cleaning", "/services/awning-sunroom-cleaning"],
  ["/services/skylight-and-rooftop-glass", "/services/skylight-rooftop-glass"],
] as const;

const nextConfig: NextConfig = {
  async redirects() {
    return legacyRoutes.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
  agentRules: false,
  // Photos uploaded in Sanity Studio are served from Sanity's image CDN.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
      // Free Unsplash photos (unsplash.com/license) used on the homepage.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;

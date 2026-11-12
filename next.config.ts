import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

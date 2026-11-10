import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  // Photos uploaded in Sanity Studio are served from Sanity's image CDN.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Enable static export
  output: 'export',

  // 2. Disable image optimization (GitHub Pages doesn't support the default Next.js server-side optimization)
  images: {
    unoptimized: true,
  },

  // 3. Optional: If your assets (images/styles) don't load, 
  // you might need to add trailingSlash: true
  trailingSlash: true,
};

export default nextConfig;

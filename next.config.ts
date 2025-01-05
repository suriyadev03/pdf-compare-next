import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  webpack(config, { isServer }) {
    // Disable Turbopack
    if (!isServer) {
      config.cache = false;  // Disable caching if needed
    }
    return config;
  },
};

export default nextConfig;

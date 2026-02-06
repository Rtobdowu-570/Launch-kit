import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopack: {
      resolveAlias: {
        "@": "./src",
      },
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude large files from server-side builds
      config.externals.push({
        "node_modules": "node_modules",
      });
    }
    return config;
  },
};

export default nextConfig;

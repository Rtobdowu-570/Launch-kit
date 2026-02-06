import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopack: {
      resolveAlias: {
        "@": "./src",
      },
      resolveExtensions: [".ts", ".tsx", ".js", ".jsx", ".mjs", ".json"],
      /* Disable symlink following to avoid issues */
      resolveSymlinks: false,
    },
  },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.symlinks = false;
    return config;
  },
  /* Optimize bundle to avoid symlink issues */
  productionBrowserSourceMaps: false,
};

export default nextConfig;

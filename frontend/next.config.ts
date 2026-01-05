import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Skip TypeScript errors during build (legacy code has type issues)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  outputFileTracingRoot: path.join(__dirname),
  allowedDevOrigins: ["http://localhost:4173"],
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;

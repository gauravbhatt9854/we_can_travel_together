import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [/^https:\/\/.*\.golu\.codes$/], // ✅ Move it to top-level
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emits .next/standalone with a self-contained server.js, so the runtime
  // image carries only the traced dependencies instead of the whole
  // node_modules tree. public/ and .next/static are NOT part of the standalone
  // output and are copied in explicitly by the Dockerfile.
  output: "standalone",
};

export default nextConfig;

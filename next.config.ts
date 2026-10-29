import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emits .next/standalone with a self-contained server.js, so the runtime
  // image carries only the traced dependencies instead of the whole
  // node_modules tree. public/ and .next/static are NOT part of the standalone
  // output and are copied in explicitly by the Dockerfile.
  output: "standalone",
  // The landing page shows real YouTube thumbnails; letting next/image proxy
  // them means phones get small WebP copies instead of full JPEGs.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" }],
  },
};

export default nextConfig;

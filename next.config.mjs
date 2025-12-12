import { withPayload } from "@payloadcms/next/withPayload";
import createNextIntlPlugin from "next-intl/plugin";
import { withPlausibleProxy } from "next-plausible";

import redirects from "./redirects.js";

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item);

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(":", ""),
        };
      }),
    ],
  },
  reactStrictMode: true,
  redirects,
  transpilePackages: ['date-fns'],
  experimental: {
    reactCompiler: true,
    viewTransition: false,
    optimizePackageImports: ['react-icons'],
  },
  // Enable SWC minification for faster builds
  swcMinify: true,
  // Optimize runtime performance
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withNextIntl(withPayload(nextConfig));

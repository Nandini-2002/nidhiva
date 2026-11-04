import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Client-auth Firebase app — keep classic rendering to avoid
  // instant-nav segment drops and Suspense bailouts in the shell.
  experimental: {
    agentFeedback: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

import { randomUUID } from "node:crypto";
import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";
import { CATEGORIES } from "./data/words";

// Every build gets a new revision so precached HTML pages are refreshed.
const revision = process.env.VERCEL_GIT_COMMIT_SHA ?? randomUUID();

const pages = ["/", "/words", "/mistakes", "/about", ...CATEGORIES.map((c) => `/practice/${c.slug}`)];

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  // Registered manually in components/ServiceWorker.tsx so we can show an update toast.
  register: false,
  disable: process.env.NODE_ENV === "development",
  additionalPrecacheEntries: pages.map((url) => ({ url, revision })),
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // `next dev` uses Turbopack (Serwist is disabled there); `next build` uses webpack for Serwist.
  // Setting the root also stops Next from picking up a stray lockfile in a parent directory.
  turbopack: { root: process.cwd() },
};

export default withSerwist(nextConfig);

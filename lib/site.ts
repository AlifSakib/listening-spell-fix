import type { Metadata } from "next";
import { CATEGORIES, WORDS, type CategorySlug } from "@/data/words";

// Canonical origin. Falls back to Vercel's production URL so a missing env var can't
// publish localhost canonicals; localhost is only used in local development.
const ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const SITE_URL = ORIGIN.replace(/\/$/, "");
export const SITE_NAME = "IELTS Spelling Practice";
export const SITE_DESCRIPTION =
  "Free IELTS listening spelling practice online. Hear a word in a UK, US or Australian accent, type it, and get instant letter-by-letter feedback on commonly misspelled IELTS words.";

export const KEYWORDS = [
  "IELTS listening spelling practice",
  "IELTS spelling test",
  "IELTS commonly misspelled words",
  "IELTS listening practice online",
];

/**
 * Per-page metadata. Child pages that set `openGraph` replace the root object
 * entirely, so the shared fields and the OG image are repeated here.
 */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const images = [{ url: "/opengraph-image", width: 1200, height: 630, alt: SITE_NAME }];
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: SITE_NAME, locale: "en_GB", url: path, title, description, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function wordsIn(slug: CategorySlug) {
  return WORDS.filter((w) => w.category === slug);
}

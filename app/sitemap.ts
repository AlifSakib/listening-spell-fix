import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/data/words";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/topics`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/words`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    ...CATEGORIES.map((c) => ({
      url: `${SITE_URL}/practice/${c.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${SITE_URL}/about`, lastModified, changeFrequency: "monthly", priority: 0.5 },
  ];
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { CATEGORIES } from "@/data/words";
import { pageMetadata, SITE_URL, wordsIn } from "@/lib/site";

const TITLE = "IELTS Listening Spelling Topics: Practise by Word Group";
const DESCRIPTION =
  "Browse IELTS Listening spelling practice by topic, from days and months to accommodation, health and the environment, and practise the words that appear most often in the test.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: "/topics" });

export default function TopicsPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: TITLE,
          description: DESCRIPTION,
          url: `${SITE_URL}/topics`,
          inLanguage: "en",
          mainEntity: {
            "@type": "ItemList",
            itemListElement: CATEGORIES.map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: `${c.label} spelling practice`,
              url: `${SITE_URL}/practice/${c.slug}`,
            })),
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Practice", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Topics", item: `${SITE_URL}/topics` },
          ],
        }}
      />

      <div className="mx-auto max-w-3xl px-4 pt-8 pb-12 sm:px-6 sm:pt-10">
        <nav aria-label="Breadcrumb" className="mb-3 text-sm text-muted">
          <Link href="/" className="hover:text-text">
            Practice
          </Link>
          <span aria-hidden> / </span>
          <span>Topics</span>
        </nav>

        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            IELTS Listening spelling topics
          </h1>
          <p className="mt-2 text-sm text-muted text-pretty">
            The words in the Listening test repeat across a small set of topics. Pick one to practise just those words, or{" "}
            <Link href="/words" className="text-primary underline underline-offset-4">
              browse the full word list
            </Link>
            .
          </p>
        </header>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/practice/${c.slug}`}
                className="group flex h-full flex-col rounded-card border border-border bg-surface p-4 transition-colors duration-200 hover:border-primary"
              >
                <span className="flex items-baseline justify-between gap-3 font-semibold">
                  {c.label}
                  <span className="text-xs font-normal text-muted tabular-nums">{wordsIn(c.slug).length} words</span>
                </span>
                <span className="mt-1 text-sm text-muted text-pretty">{c.description}</span>
                <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Practise <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

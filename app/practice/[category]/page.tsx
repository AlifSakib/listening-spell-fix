import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryLinks } from "@/components/CategoryLinks";
import { JsonLd } from "@/components/JsonLd";
import { PracticeCard } from "@/components/PracticeCard";
import { CATEGORIES } from "@/data/words";
import { getCategory, pageMetadata, SITE_URL, wordsIn } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/practice/[category]">): Promise<Metadata> {
  const category = getCategory((await params).category);
  if (!category) return {};
  const title = `${category.label} Spelling Practice for IELTS Listening`;
  const description = `${category.description} Practise ${wordsIn(category.slug).length} IELTS ${category.label.toLowerCase()} words with audio in UK, US and Australian accents.`;
  return pageMetadata({ title, description, path: `/practice/${category.slug}` });
}

export default async function CategoryPage({ params }: PageProps<"/practice/[category]">) {
  const category = getCategory((await params).category);
  if (!category) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Practice", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Topics", item: `${SITE_URL}/topics` },
            {
              "@type": "ListItem",
              position: 3,
              name: category.label,
              item: `${SITE_URL}/practice/${category.slug}`,
            },
          ],
        }}
      />

      <div className="mx-auto max-w-5xl px-4 pt-6 pb-12 sm:px-6 sm:pt-8">
        <nav aria-label="Breadcrumb" className="mb-3 text-center text-sm text-muted">
          <Link href="/" className="hover:text-text">
            Practice
          </Link>
          <span aria-hidden> / </span>
          <Link href="/topics" className="hover:text-text">
            Topics
          </Link>
          <span aria-hidden> / </span>
          <span>{category.label}</span>
        </nav>

        <header className="mx-auto mb-6 max-w-[520px] text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            {category.label} spelling practice
          </h1>
          <p className="mt-2 text-sm text-muted text-pretty">{category.description}</p>
        </header>

        <PracticeCard category={category.slug} />

        <section className="mx-auto mt-10 max-w-2xl">
          <h2 className="mb-4 text-lg font-semibold">More IELTS Listening topics</h2>
          <CategoryLinks current={category.slug} />
          <p className="mt-4 text-sm text-muted">
            <Link href="/topics" className="hover:text-text">
              See all {CATEGORIES.length} topics
            </Link>
          </p>
        </section>
      </div>
    </>
  );
}

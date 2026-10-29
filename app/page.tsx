import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PracticeCard } from "@/components/PracticeCard";
import { WORDS } from "@/data/words";
import { pageMetadata, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const TITLE = "Free IELTS Listening Spelling Practice Test";
const DESCRIPTION =
  "Free IELTS Listening spelling practice. Hear a commonly misspelled word in a UK, US or Australian accent, type it, and get instant letter-by-letter feedback.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: "/" });

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": ["WebApplication", "EducationalApplication"],
          name: SITE_NAME,
          url: SITE_URL,
          description: SITE_DESCRIPTION,
          applicationCategory: "EducationalApplication",
          operatingSystem: "Any",
          browserRequirements: "Requires JavaScript and the Web Speech API",
          inLanguage: "en",
          educationalLevel: "IELTS",
          teaches: "English spelling for the IELTS Listening test",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-3 sm:px-6 sm:py-6">
        <section className="mx-auto mb-5 max-w-[520px] text-center sm:mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-balance sm:text-3xl">
            IELTS Listening spelling practice
          </h1>
          <p className="mt-2 text-sm text-muted text-pretty sm:text-base">
            Hear a word, type it, and see exactly which letters you missed.
          </p>
        </section>

        <PracticeCard />

        <p className="mt-4 text-center text-sm text-muted">
          <Link href="/words" className="inline-flex min-h-12 items-center hover:text-text">
            Browse all {WORDS.length} words by topic
          </Link>
        </p>
      </div>
    </>
  );
}

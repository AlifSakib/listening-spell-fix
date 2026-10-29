import type { Metadata } from "next";
import Link from "next/link";
import { WordBrowser } from "@/components/WordBrowser";
import { WORDS } from "@/data/words";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "IELTS Listening Word List by Topic",
  description: `Browse all ${WORDS.length} commonly misspelled IELTS Listening words by topic, hear each one in a UK, US or Australian accent, and review the words you got wrong.`,
  path: "/words",
});

export default function WordsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-8 pb-12 sm:px-6 sm:pt-10">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">IELTS Listening word list</h1>
        <p className="mt-2 text-sm text-muted text-pretty">
          Every word in the app, grouped by topic. British spelling comes first; the American form is also accepted.{" "}
          <Link href="/topics" className="text-primary underline underline-offset-4">
            Browse topics
          </Link>
        </p>
      </header>
      <WordBrowser />
    </div>
  );
}

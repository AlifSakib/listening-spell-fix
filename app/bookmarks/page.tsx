import type { Metadata } from "next";
import { BookmarkList } from "@/components/BookmarkList";
import { PracticeCard } from "@/components/PracticeCard";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Bookmarked Words | IELTS Spelling Practice",
    description: "Practise words you saved while studying IELTS Listening spelling.",
    path: "/bookmarks",
  }),
  // Personal, device-specific content.
  robots: { index: false, follow: true },
};

export default function BookmarksPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-8 pb-12 sm:px-6 sm:pt-12">
      <header className="mx-auto mb-6 max-w-[520px] text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Bookmarked words</h1>
        <p className="mt-2 text-sm text-muted text-pretty">
          Practise words you saved during your study sessions.
        </p>
      </header>
      <PracticeCard bookmarks />
      <details className="group mx-auto mt-6 max-w-[520px] rounded-card border border-border bg-surface">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-5 font-medium [&::-webkit-details-marker]:hidden">
          Show my bookmarked words
          <span aria-hidden className="text-xl text-muted transition-transform duration-200 group-open:rotate-45">
            +
          </span>
        </summary>
        <div className="border-t border-border px-4">
          <BookmarkList />
        </div>
      </details>
    </div>
  );
}

import type { Metadata } from "next";
import { MistakeList } from "@/components/MistakeList";
import { PracticeCard } from "@/components/PracticeCard";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Review Your Misspelled Words | IELTS Spelling Practice",
    description: "Practise only the IELTS Listening words you misspelled. Spell a word correctly twice in a row to clear it.",
    path: "/mistakes",
  }),
  // Personal, device-specific content.
  robots: { index: false, follow: true },
};

export default function MistakesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-8 pb-12 sm:px-6 sm:pt-12">
      <header className="mx-auto mb-6 max-w-[520px] text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Review mistakes</h1>
        <p className="mt-2 text-sm text-muted text-pretty">
          Spell a word correctly twice in a row (without a hint) and it leaves this list.
        </p>
      </header>
      <PracticeCard mistakes />
      <details className="group mx-auto mt-6 max-w-[520px] rounded-card border border-border bg-surface">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-5 font-medium [&::-webkit-details-marker]:hidden">
          Show my mistake words
          <span aria-hidden className="text-xl text-muted transition-transform duration-200 group-open:rotate-45">
            +
          </span>
        </summary>
        <div className="border-t border-border px-4">
          <MistakeList />
        </div>
      </details>
    </div>
  );
}

"use client";

import { Volume2 } from "lucide-react";
import { CATEGORIES } from "@/data/words";
import { useHydrated, useStored } from "@/lib/storage";
import { useSpeech } from "@/lib/useSpeech";

/** The student's misspelled words, with progress toward clearing each one. */
export function MistakeList() {
  const hydrated = useHydrated();
  const mistakes = useStored("mistakes");
  const { say } = useSpeech();

  if (!hydrated) return null;

  if (mistakes.length === 0) {
    return <p className="py-6 text-center text-sm text-muted">No mistakes yet. Words you misspell will appear here.</p>;
  }

  return (
    <ul className="divide-y divide-border">
      {mistakes.map((m) => (
        <li key={m.word} className="flex items-center gap-3 py-2">
          <button
            type="button"
            onClick={() => say(m.word)}
            aria-label={`Hear ${m.word}`}
            className="grid size-12 shrink-0 place-items-center rounded-ctl text-muted transition-colors duration-200 hover:bg-background hover:text-text"
          >
            <Volume2 className="size-5" aria-hidden />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">
              {m.word}
              {m.alt && <span className="font-normal text-muted"> / {m.alt}</span>}
            </p>
            <p className="text-xs text-muted">{CATEGORIES.find((c) => c.slug === m.category)?.label}</p>
          </div>
          <div
            className="flex shrink-0 items-center gap-1"
            role="img"
            aria-label={`${m.correctInARow} of 2 correct in a row`}
          >
            {[0, 1].map((i) => (
              <span
                key={i}
                className={`size-2.5 rounded-full ${i < m.correctInARow ? "bg-success" : "bg-border"}`}
              />
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}

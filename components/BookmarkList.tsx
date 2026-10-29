"use client";

import { Trash2, Volume2 } from "lucide-react";
import { CATEGORIES } from "@/data/words";
import { removeBookmark } from "@/lib/bookmarks";
import { useHydrated, useStored } from "@/lib/storage";
import { useSpeech } from "@/lib/useSpeech";

/** The student's bookmarked words, with audio preview and removal. */
export function BookmarkList() {
  const hydrated = useHydrated();
  const bookmarks = useStored("bookmarks");
  const { say } = useSpeech();

  if (!hydrated) return null;

  if (bookmarks.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted">
        No bookmarked words yet. Bookmark words during practice to review them here.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {bookmarks.map((b) => (
        <li key={b.word} className="flex items-center gap-3 py-2">
          <button
            type="button"
            onClick={() => say(b.word)}
            aria-label={`Hear ${b.word}`}
            className="grid size-12 shrink-0 place-items-center rounded-ctl text-muted transition-colors duration-200 hover:bg-background hover:text-text"
          >
            <Volume2 className="size-5" aria-hidden />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">
              {b.word}
              {b.alt && <span className="font-normal text-muted"> / {b.alt}</span>}
            </p>
            <p className="text-xs text-muted">{CATEGORIES.find((c) => c.slug === b.category)?.label}</p>
          </div>
          <button
            type="button"
            onClick={() => removeBookmark(b.word)}
            aria-label={`Remove bookmark for ${b.word}`}
            className="grid size-12 shrink-0 place-items-center rounded-ctl text-muted transition-colors duration-200 hover:bg-background hover:text-error"
          >
            <Trash2 className="size-4" aria-hidden />
          </button>
        </li>
      ))}
    </ul>
  );
}

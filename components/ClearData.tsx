"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { clearAll, useStored } from "@/lib/storage";

/**
 * Danger zone: wipes everything this app saved in the browser.
 * `inline` renders a subdued text button (used in the footer) instead of a
 * bordered button (used on the About page).
 */
export function ClearData({ inline = false }: { inline?: boolean }) {
  const [asking, setAsking] = useState(false);
  const [cleared, setCleared] = useState(false);
  const mistakes = useStored("mistakes");
  const bookmarks = useStored("bookmarks");
  const goal = useStored("dailyGoal");

  // The control comes back after the confirmation has been read.
  useEffect(() => {
    if (!cleared) return;
    const timer = setTimeout(() => setCleared(false), 5000);
    return () => clearTimeout(timer);
  }, [cleared]);

  if (cleared) {
    return (
      <p role="status" className="text-sm text-success-text">
        All saved data cleared. Your progress starts from zero.
      </p>
    );
  }

  if (asking) {
    return (
      <div
        className={`rounded-ctl border border-error/40 bg-error/5 p-4 text-left ${inline ? "mt-2" : "mt-6"}`}
      >
        <p className="text-sm font-medium">Clear all saved data?</p>
        <p className="mt-1 text-sm text-muted">
          Everything stored on this device will be deleted: streak, today&apos;s count, daily goal ({goal}),
          mistakes{mistakes.length > 0 ? ` (${mistakes.length})` : ""}, bookmarks
          {bookmarks.length > 0 ? ` (${bookmarks.length})` : ""}, accent, theme and cookie choice. This cannot be undone.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              clearAll();
              setAsking(false);
              setCleared(true);
            }}
            className="flex min-h-12 items-center gap-2 rounded-ctl bg-error px-5 text-sm font-medium text-white transition-opacity duration-200 hover:opacity-90"
          >
            <Trash2 className="size-4" aria-hidden />
            Clear everything
          </button>
          <button
            type="button"
            onClick={() => setAsking(false)}
            className="flex min-h-12 items-center rounded-ctl border border-border px-5 text-sm font-medium transition-colors duration-200 hover:border-primary"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setAsking(true)}
      className={
        inline
          ? "inline-flex min-h-12 items-center gap-1.5 rounded-ctl text-sm text-muted transition-colors duration-200 hover:text-error-text"
          : "mt-6 flex min-h-12 items-center gap-2 rounded-ctl border border-border px-5 text-sm font-medium text-error-text transition-colors duration-200 hover:border-error"
      }
    >
      <Trash2 className="size-4" aria-hidden />
      Clear saved data
    </button>
  );
}

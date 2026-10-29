"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import { useStored } from "@/lib/storage";

export function BookmarksBadge() {
  const count = useStored("bookmarks").length;

  return (
    <Link
      href="/bookmarks"
      aria-label={`Bookmarked words (${count})`}
      className="flex min-h-12 min-w-12 items-center justify-center gap-1.5 rounded-ctl px-2 text-sm font-medium transition-colors duration-200 hover:bg-surface"
    >
      <Bookmark
        className={`size-5 sm:hidden ${count > 0 ? "fill-primary/20 text-primary" : "text-muted"}`}
        aria-hidden
      />
      <span className="hidden sm:inline" aria-hidden>
        Bookmarks
      </span>
      <span
        aria-hidden
        className={`min-w-6 rounded-full px-1.5 text-center text-xs leading-6 tabular-nums ${
          count > 0 ? "bg-primary text-on-primary" : "bg-border text-muted"
        }`}
      >
        {count}
      </span>
    </Link>
  );
}

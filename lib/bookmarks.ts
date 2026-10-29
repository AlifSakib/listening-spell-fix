"use client";

import type { Word, CategorySlug } from "@/data/words";
import { wordKey } from "./progress";
import { getItem, setItem, updateItem, type BookmarkEntry } from "./storage";

export function isBookmarked(word: Pick<Word, "word">, list?: BookmarkEntry[]): boolean {
  const bookmarks = list ?? getItem("bookmarks");
  const key = wordKey(word);
  return bookmarks.some((b) => b.word.toLowerCase() === key);
}

/**
 * Toggles bookmark status for a word.
 * Returns true if the word is now bookmarked, false if it was removed.
 */
export function toggleBookmark(word: Word): boolean {
  const key = wordKey(word);
  const bookmarks = getItem("bookmarks");
  const exists = bookmarks.some((b) => b.word.toLowerCase() === key);

  if (exists) {
    setItem(
      "bookmarks",
      bookmarks.filter((b) => b.word.toLowerCase() !== key),
    );
    return false;
  }

  const entry: BookmarkEntry = {
    word: word.word,
    alt: word.alt,
    category: word.category,
    bookmarkedAt: Date.now(),
  };

  setItem("bookmarks", [entry, ...bookmarks]);
  return true;
}

export function removeBookmark(word: string): void {
  const key = word.toLowerCase();
  updateItem("bookmarks", (list) => list.filter((b) => b.word.toLowerCase() !== key));
}

export function bookmarkWords(): Word[] {
  return getItem("bookmarks").map((b) => ({
    word: b.word,
    alt: b.alt,
    category: b.category as CategorySlug,
  }));
}

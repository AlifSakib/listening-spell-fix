"use client";

import type { Word } from "@/data/words";
import { wordKey } from "./progress";
import { getItem, updateItem } from "./storage";

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Returns the next word of a practice set. Words are shuffled and no word
 * repeats until the whole set has been seen. Progress through the set is
 * persisted, so a reload continues where the student left off.
 */
export function nextWord(setId: string, words: Word[], previous?: Word): Word | undefined {
  if (words.length === 0) return undefined;
  const byKey = new Map(words.map((w) => [wordKey(w), w]));

  let remaining = (getItem("queues")[setId] ?? []).filter((k) => byKey.has(k));
  if (remaining.length === 0) {
    remaining = shuffle([...byKey.keys()]);
    // Don't start a new round with the word that just ended the previous one.
    if (previous && remaining.length > 1 && remaining[0] === wordKey(previous)) {
      remaining.push(remaining.shift()!);
    }
  }

  const [key, ...rest] = remaining;
  updateItem("queues", (q) => ({ ...q, [setId]: rest }));
  return byKey.get(key);
}

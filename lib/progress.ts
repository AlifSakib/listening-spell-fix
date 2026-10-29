"use client";

import type { Word } from "@/data/words";
import { getItem, setItem, updateItem, type StorageSchema } from "./storage";

/** Local calendar date as YYYY-MM-DD. */
export function today(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return today(d);
}

export function todayCount(daily: StorageSchema["daily"]): number {
  return daily.date === today() ? daily.count : 0;
}

/** The streak is only alive if the last practice day was today or yesterday. */
export function currentStreak(streak: StorageSchema["streak"]): number {
  return streak.lastDate === today() || streak.lastDate === yesterday() ? streak.count : 0;
}

export function wordKey(word: Pick<Word, "word">): string {
  return word.word.toLowerCase();
}

export interface AnswerResult {
  word: Word;
  correct: boolean;
  usedHint: boolean;
}

/** Records one checked word: daily goal, streak and the mistakes list. */
export function recordAnswer({ word, correct, usedHint }: AnswerResult): void {
  const date = today();

  updateItem("daily", (d) => ({ date, count: (d.date === date ? d.count : 0) + 1 }));

  // A word answered with a hint doesn't count toward the streak.
  if (correct && !usedHint) {
    updateItem("streak", (s) => {
      if (s.lastDate === date) return s;
      return { count: s.lastDate === yesterday() ? s.count + 1 : 1, lastDate: date };
    });
  }

  const key = wordKey(word);
  const mistakes = getItem("mistakes");
  const existing = mistakes.find((m) => m.word.toLowerCase() === key);

  if (!correct) {
    const entry = { word: word.word, alt: word.alt, category: word.category, correctInARow: 0 };
    setItem("mistakes", existing ? mistakes.map((m) => (m === existing ? entry : m)) : [...mistakes, entry]);
  } else if (existing && !usedHint) {
    const correctInARow = existing.correctInARow + 1;
    setItem(
      "mistakes",
      correctInARow >= 2
        ? mistakes.filter((m) => m !== existing)
        : mistakes.map((m) => (m === existing ? { ...m, correctInARow } : m)),
    );
  }
}

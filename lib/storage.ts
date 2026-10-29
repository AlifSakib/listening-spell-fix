"use client";

import { useMemo, useSyncExternalStore } from "react";

export type Accent = "en-GB" | "en-US" | "en-AU";
export type Theme = "light" | "dark";
export type Consent = "granted" | "denied";

export interface MistakeEntry {
  word: string;
  alt?: string;
  category: string;
  /** Consecutive correct answers since the last mistake. Removed at 2. */
  correctInARow: number;
}

/** Everything the app persists, keyed by storage key. */
export interface StorageSchema {
  accent: Accent;
  muted: boolean;
  theme: Theme | null;
  dailyGoal: number;
  daily: { date: string; count: number };
  streak: { count: number; lastDate: string | null };
  mistakes: MistakeEntry[];
  consent: Consent | null;
  iosTipDismissed: boolean;
  /** Remaining (not yet seen) words per practice set. */
  queues: Record<string, string[]>;
}

export const STORAGE_DEFAULTS: StorageSchema = {
  accent: "en-GB",
  muted: false,
  theme: null,
  dailyGoal: 20,
  daily: { date: "", count: 0 },
  streak: { count: 0, lastDate: null },
  mistakes: [],
  consent: null,
  iosTipDismissed: false,
  queues: {},
};

type Key = keyof StorageSchema;

const PREFIX = "ielts:";
const CHANGE_EVENT = "ielts-storage";

function readRaw(key: Key): string | null {
  try {
    return window.localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

function parse<K extends Key>(key: K, raw: string | null): StorageSchema[K] {
  if (raw === null) return STORAGE_DEFAULTS[key];
  try {
    return JSON.parse(raw) as StorageSchema[K];
  } catch {
    return STORAGE_DEFAULTS[key];
  }
}

export function getItem<K extends Key>(key: K): StorageSchema[K] {
  if (typeof window === "undefined") return STORAGE_DEFAULTS[key];
  return parse(key, readRaw(key));
}

export function setItem<K extends Key>(key: K, value: StorageSchema[K]): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or blocked (private mode). The app keeps working without persistence.
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: key }));
}

export function updateItem<K extends Key>(
  key: K,
  fn: (prev: StorageSchema[K]) => StorageSchema[K],
): StorageSchema[K] {
  const next = fn(getItem(key));
  setItem(key, next);
  return next;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

/**
 * Reactive read of a stored value. Renders the default on the server and during
 * hydration, then switches to the stored value, so there is no hydration mismatch.
 */
export function useStored<K extends Key>(key: K): StorageSchema[K] {
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null,
  );
  return useMemo(() => parse(key, raw), [key, raw]);
}

/** True once the component has hydrated on the client. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

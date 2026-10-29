"use client";

type EventParams = Record<string, string | number | boolean>;

export type AnalyticsEvent =
  | "practice_start"
  | "word_checked"
  | "hint_used"
  | "accent_changed"
  | "session_completed"
  | "share_clicked"
  | "bookmark_added"
  | "bookmark_removed"
  | "pwa_installed";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-KPVL4M50B6";

/** Sends a GA4 event. A no-op when GA isn't configured or hasn't loaded. */
export function track(event: AnalyticsEvent, params: EventParams = {}): void {
  if (typeof window === "undefined" || !GA_ID) return;
  window.gtag?.("event", event, params);
}

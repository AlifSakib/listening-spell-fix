"use client";

type EventParams = Record<string, string | number | boolean>;

export type AnalyticsEvent =
  | "practice_start"
  | "word_checked"
  | "hint_used"
  | "accent_changed"
  | "session_completed"
  | "share_clicked"
  | "pwa_installed";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Sends a GA4 event. A no-op when GA isn't configured or hasn't loaded. */
export function track(event: AnalyticsEvent, params: EventParams = {}): void {
  if (typeof window === "undefined" || !process.env.NEXT_PUBLIC_GA_ID) return;
  window.gtag?.("event", event, params);
}

"use client";

import { setItem, useHydrated, useStored, type Consent } from "@/lib/storage";

export function ConsentBanner() {
  const hydrated = useHydrated();
  const consent = useStored("consent");

  if (!hydrated || consent) return null;

  const choose = (value: Consent) => {
    setItem("consent", value);
    window.gtag?.("consent", "update", { analytics_storage: value });
    if (value === "granted") {
      // Consent Mode drops the page_view that ran while storage was denied, so
      // send the current page again now that this visit can be recorded.
      window.gtag?.("event", "page_view", {
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  };

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:px-6">
        <p className="text-sm text-muted sm:mr-auto">
          Can we use analytics cookies to see which features help students? We never show ads.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="min-h-12 flex-1 rounded-ctl border border-border px-4 text-sm font-medium transition-colors duration-200 hover:bg-background"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="min-h-12 flex-1 rounded-ctl bg-primary px-4 text-sm font-medium text-on-primary transition-colors duration-200 hover:bg-primary-hover"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

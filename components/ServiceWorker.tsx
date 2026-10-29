"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import type { Serwist } from "@serwist/window";

/** Registers the service worker and offers a refresh when a new version is waiting. */
export function ServiceWorker() {
  const serwist = useRef<Serwist | null>(null);
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    let cancelled = false;

    void import("@serwist/window").then(({ Serwist }) => {
      if (cancelled) return;
      const sw = new Serwist("/sw.js", { scope: "/", type: "classic" });
      sw.addEventListener("waiting", () => setUpdateReady(true));
      sw.addEventListener("controlling", (e) => {
        if (e.isUpdate) window.location.reload();
      });
      void sw.register();
      serwist.current = sw;
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!updateReady) return null;

  return (
    <div className="fixed inset-x-0 top-20 z-50 flex justify-center px-4" role="status">
      <div className="flex animate-fade-up items-center gap-3 rounded-full border border-border bg-surface py-1 pr-1 pl-5 text-sm shadow-lg">
        <span>A new version is available.</span>
        <button
          type="button"
          onClick={() => serwist.current?.messageSkipWaiting()}
          className="flex min-h-12 items-center gap-2 rounded-full bg-primary px-4 font-medium text-on-primary transition-colors duration-200 hover:bg-primary-hover"
        >
          <RefreshCw className="size-4" aria-hidden />
          Refresh
        </button>
      </div>
    </div>
  );
}

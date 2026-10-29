"use client";

import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";
import { track } from "@/lib/analytics";
import { setItem, useStored } from "@/lib/storage";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * iOS and iPadOS never fire beforeinstallprompt, in any browser (all of them use
 * WebKit): Safari, Chrome, Firefox and Edge all need the manual Share > Add to
 * Home Screen route. So the tip is shown for every iOS browser, not just Safari.
 */
function needsIosInstallTip() {
  const ua = navigator.userAgent;
  const ipad = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  const ios = /iphone|ipad|ipod/i.test(ua) || ipad;
  const standalone =
    (navigator as Navigator & { standalone?: boolean }).standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches;
  return ios && !standalone;
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [ios, setIos] = useState(false);
  const iosTipDismissed = useStored("iosTipDismissed");

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setDeferred(null);
      track("pwa_installed");
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- user agent is only known on the client
    setIos(needsIosInstallTip());
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (deferred) {
    return (
      <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto flex animate-fade-up items-center gap-1 rounded-full border border-border bg-surface p-1 shadow-lg">
          <button
            type="button"
            onClick={async () => {
              await deferred.prompt();
              await deferred.userChoice;
              setDeferred(null);
            }}
            className="flex min-h-12 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-on-primary transition-colors duration-200 hover:bg-primary-hover"
          >
            <Download className="size-4" aria-hidden />
            Install app
          </button>
          <button
            type="button"
            onClick={() => setDeferred(null)}
            aria-label="Not now"
            className="grid size-12 place-items-center rounded-full text-muted hover:text-text"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    );
  }

  if (ios && !iosTipDismissed) {
    return (
      <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4" role="status">
        <div className="flex max-w-sm animate-fade-up items-center gap-3 rounded-card border border-border bg-surface py-2 pr-1 pl-4 text-sm shadow-lg">
          <Share className="size-4 shrink-0 text-primary" aria-hidden />
          <p>
            Install the app: tap the <strong className="font-medium">Share</strong> icon, then{" "}
            <strong className="font-medium">Add to Home Screen</strong>.
          </p>
          <button
            type="button"
            onClick={() => setItem("iosTipDismissed", true)}
            aria-label="Dismiss tip"
            className="grid size-12 shrink-0 place-items-center rounded-full text-muted hover:text-text"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    );
  }

  return null;
}

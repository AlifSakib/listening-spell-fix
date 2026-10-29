"use client";

import { useEffect, useRef } from "react";
import { CircleHelp, X } from "lucide-react";

const SHORTCUTS = [
  ["Space", "Replay the word (when the box is empty)"],
  ["Shift + Space", "Slow replay"],
  ["Enter", "Check, or go to the next word"],
  ["Ctrl / ⌘ + H", "Show a hint"],
  ["Ctrl / ⌘ + B", "Bookmark or unbookmark the word"],
] as const;

export function ShortcutsHelp({ onClose }: { onClose?: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !onClose) return;
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, [onClose]);

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        aria-label="Keyboard shortcuts"
        className="grid size-12 place-items-center rounded-ctl text-muted transition-colors duration-200 hover:bg-background hover:text-text"
      >
        <CircleHelp className="size-5" aria-hidden />
      </button>
      <dialog
        ref={ref}
        aria-labelledby="shortcuts-title"
        onClick={(e) => e.target === ref.current && ref.current.close()}
        className="m-auto w-[min(26rem,calc(100%-2rem))] rounded-card border border-border bg-surface p-0 text-text backdrop:bg-black/40"
      >
        <div className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="shortcuts-title" className="font-semibold">
              Keyboard shortcuts
            </h2>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Close"
              className="-mr-2 grid size-12 place-items-center rounded-ctl text-muted hover:text-text"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <dl className="space-y-3 text-sm">
            {SHORTCUTS.map(([keys, desc]) => (
              <div key={keys} className="flex items-center justify-between gap-4">
                <dt>
                  <kbd className="rounded-lg border border-border bg-background px-2 py-1 font-mono text-xs">{keys}</kbd>
                </dt>
                <dd className="text-right text-muted">{desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </dialog>
    </>
  );
}

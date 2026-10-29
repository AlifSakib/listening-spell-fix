"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { CATEGORIES, WORDS } from "@/data/words";
import { wordKey } from "@/lib/progress";
import { normalize } from "@/lib/spelling";
import { useHydrated, useStored } from "@/lib/storage";
import { useSpeech } from "@/lib/useSpeech";
import { AccentSelector } from "./AccentSelector";
import { MistakeList } from "./MistakeList";

type View = "all" | "mistakes";

export function WordBrowser() {
  const hydrated = useHydrated();
  const mistakes = useStored("mistakes");
  const { accent, say } = useSpeech();
  const [view, setView] = useState<View>("all");
  const [query, setQuery] = useState("");
  const q = normalize(useDeferredValue(query));

  // Allow linking straight to the mistakes view with /words?view=mistakes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL is only read on the client
    if (new URLSearchParams(window.location.search).get("view") === "mistakes") setView("mistakes");
  }, []);

  const mistakeKeys = useMemo(() => new Set(mistakes.map((m) => m.word.toLowerCase())), [mistakes]);

  const groups = useMemo(
    () =>
      CATEGORIES.map((c) => ({
        ...c,
        words: WORDS.filter(
          (w) =>
            w.category === c.slug &&
            (!q || w.word.toLowerCase().includes(q) || !!w.alt?.toLowerCase().includes(q)),
        ),
      })).filter((g) => g.words.length > 0),
    [q],
  );
  const matchCount = groups.reduce((n, g) => n + g.words.length, 0);

  const tabs: { value: View; label: string; count: number }[] = [
    { value: "all", label: "All words", count: WORDS.length },
    { value: "mistakes", label: "My mistakes", count: hydrated ? mistakes.length : 0 },
  ];

  return (
    <div>
      <div className="sticky top-16 z-20 -mx-4 border-b border-border bg-background/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div role="tablist" aria-label="Word list" className="flex rounded-ctl border border-border bg-surface p-1">
          {tabs.map((t) => (
            <button
              key={t.value}
              type="button"
              role="tab"
              aria-selected={view === t.value}
              aria-controls="word-panel"
              onClick={() => setView(t.value)}
              className={`flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-medium transition-colors duration-200 ${
                view === t.value ? "bg-primary text-on-primary" : "text-muted hover:text-text"
              }`}
            >
              {t.label}
              <span className="text-xs tabular-nums opacity-80">{t.count}</span>
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          {view === "all" && (
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted" aria-hidden />
              <label htmlFor="word-search" className="sr-only">
                Search words
              </label>
              <input
                id="word-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                className="h-12 w-full rounded-ctl border border-border bg-surface pr-3 pl-10 text-base transition-colors duration-200 outline-none placeholder:text-muted focus:border-primary"
              />
            </div>
          )}
          <div className="ml-auto shrink-0">
            <AccentSelector accent={accent} />
          </div>
        </div>
      </div>

      <div id="word-panel" role="tabpanel" className="pt-6">
        {view === "mistakes" ? (
          <div className="rounded-card border border-border bg-surface px-4">
            <MistakeList />
            {hydrated && mistakes.length > 0 && (
              <div className="border-t border-border py-4">
                <Link
                  href="/mistakes"
                  className="flex min-h-12 items-center justify-center gap-2 rounded-ctl bg-primary font-medium text-on-primary transition-colors duration-200 hover:bg-primary-hover"
                >
                  Practise these words <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            )}
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted" aria-live="polite">
              {q ? `${matchCount} matching words` : "Tap a word to hear it."}
              {hydrated && mistakes.length > 0 && (
                <span className="ml-2 inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-error" aria-hidden /> in your mistakes
                </span>
              )}
            </p>
            {groups.length === 0 && <p className="py-10 text-center text-muted">No words match “{query}”.</p>}
            <div className="space-y-8">
              {groups.map((g) => (
                <section key={g.slug} aria-labelledby={`cat-${g.slug}`}>
                  <div className="mb-3 flex items-baseline justify-between gap-4">
                    <h2 id={`cat-${g.slug}`} className="font-semibold">
                      {g.label} <span className="text-sm font-normal text-muted tabular-nums">{g.words.length}</span>
                    </h2>
                    <Link
                      href={`/practice/${g.slug}`}
                      className="inline-flex min-h-12 shrink-0 items-center gap-1 text-sm font-medium text-primary"
                    >
                      Practise <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {g.words.map((w) => {
                      const missed = hydrated && mistakeKeys.has(wordKey(w));
                      return (
                        <li key={w.word}>
                          <button
                            type="button"
                            onClick={() => say(w.word)}
                            aria-label={`Hear ${w.word}${w.alt ? `, also spelled ${w.alt}` : ""}${missed ? ", in your mistakes" : ""}`}
                            className={`inline-flex min-h-12 items-center gap-2 rounded-full border px-4 text-sm transition-colors duration-200 hover:border-primary ${
                              missed ? "border-error/40 bg-error/5 text-error-text" : "border-border bg-surface"
                            }`}
                          >
                            {missed && <span className="size-2 rounded-full bg-error" aria-hidden />}
                            {w.word}
                            {w.alt && <span className="text-muted">/ {w.alt}</span>}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

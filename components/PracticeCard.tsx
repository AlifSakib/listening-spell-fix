"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bookmark, Check, Lightbulb, Snail, Volume2, VolumeX, X } from "lucide-react";
import { CATEGORIES, WORDS, type CategorySlug, type Word } from "@/data/words";
import { track } from "@/lib/analytics";
import { bookmarkWords, isBookmarked, toggleBookmark } from "@/lib/bookmarks";
import { recordAnswer, wordKey } from "@/lib/progress";
import { nextWord } from "@/lib/queue";
import { playFeedback } from "@/lib/sounds";
import { speechSupported } from "@/lib/speech";
import { closestTarget, diffSpelling, hintFor, isCorrect, letterCount } from "@/lib/spelling";
import { getItem, setItem, useHydrated, useStored } from "@/lib/storage";
import { useSpeech } from "@/lib/useSpeech";
import { AccentSelector } from "./AccentSelector";
import { SessionSummary } from "./SessionSummary";
import { ShortcutsHelp } from "./ShortcutsHelp";
import { SpellingDiff } from "./SpellingDiff";

const SESSION_LENGTH = 10;
const AUTO_ADVANCE_MS = 1000;

type Status = "answering" | "correct" | "wrong";

interface Props {
  /** Practise one category. Omit for all words. */
  category?: CategorySlug;
  /** Practise only the words in the mistakes list. */
  mistakes?: boolean;
  /** Practise only bookmarked words. */
  bookmarks?: boolean;
}

const ACCENT_NAMES = { "en-GB": "British", "en-US": "American", "en-AU": "Australian" } as const;

/** All words, with duplicates across categories removed. */
const ALL_WORDS = [...new Map(WORDS.map((w) => [wordKey(w), w])).values()];

function mistakeWords(): Word[] {
  return getItem("mistakes").map((m) => ({ word: m.word, alt: m.alt, category: m.category as CategorySlug }));
}

export function PracticeCard({ category, mistakes = false, bookmarks = false }: Props) {
  const setId = bookmarks ? "bookmarks" : mistakes ? "mistakes" : (category ?? "all");
  const wordsForSet = useCallback(
    () =>
      bookmarks
        ? bookmarkWords()
        : mistakes
          ? mistakeWords()
          : category
            ? WORDS.filter((w) => w.category === category)
            : ALL_WORDS,
    [category, mistakes, bookmarks],
  );

  const hydrated = useHydrated();
  const muted = useStored("muted");
  const mistakeCount = useStored("mistakes").length;
  const bookmarkList = useStored("bookmarks");
  const bookmarkCount = bookmarkList.length;
  const { accent, say, fallback, voiceName } = useSpeech();

  const [word, setWord] = useState<Word>();
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("answering");
  const [hintShown, setHintShown] = useState(false);
  const [results, setResults] = useState<{ word: string; correct: boolean }[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const started = useRef(false);
  const autoplay = useRef(false);

  const markStarted = useCallback(() => {
    if (started.current) return;
    started.current = true;
    track("practice_start", { category: setId });
  }, [setId]);

  const loadNext = useCallback(
    (previous?: Word) => {
      clearTimeout(advanceTimer.current);
      const next = nextWord(setId, wordsForSet(), previous);
      setWord(next);
      setInput("");
      setStatus("answering");
      setHintShown(false);
      setAnnouncement("");
      inputRef.current?.focus();
    },
    [setId, wordsForSet],
  );

  // Pick the first word on the client (the queue lives in localStorage).
  useEffect(() => {
    // Browsers only allow speech after a user gesture, e.g. arriving here via a link.
    autoplay.current = navigator.userActivation?.hasBeenActive ?? false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading localStorage after hydration
    loadNext();
    return () => clearTimeout(advanceTimer.current);
  }, [loadNext]);

  // Speak each new word once audio is allowed.
  useEffect(() => {
    if (word && autoplay.current) say(word.word);
    // Only when the word changes, not when the voice list updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word]);

  const play = useCallback(
    (slow = false) => {
      if (!word) return;
      markStarted();
      autoplay.current = true;
      say(word.word, slow);
      inputRef.current?.focus();
    },
    [word, say, markStarted],
  );

  const advance = useCallback(() => {
    if (results.length > 0 && results.length % SESSION_LENGTH === 0) {
      clearTimeout(advanceTimer.current);
      setShowSummary(true);
      track("session_completed", { score: results.filter((r) => r.correct).length });
      return;
    }
    loadNext(word);
  }, [results, loadNext, word]);

  // Keep the latest `advance` for the auto-advance timer.
  const advanceRef = useRef(advance);
  useEffect(() => {
    advanceRef.current = advance;
  }, [advance]);

  const check = () => {
    if (!word || status !== "answering" || !input.trim()) return;
    markStarted();
    const correct = isCorrect(input, word);
    setStatus(correct ? "correct" : "wrong");
    setResults((r) => [...r, { word: word.word, correct }]);
    recordAnswer({ word, correct, usedHint: hintShown });
    track("word_checked", { correct, accent, category: word.category });
    if (!muted) playFeedback(correct ? "success" : "error");
    setAnnouncement(
      correct ? `Correct: ${word.word}.` : `Incorrect. The correct spelling is ${word.word.split("").join(" ")}.`,
    );
    if (correct) advanceTimer.current = setTimeout(() => advanceRef.current(), AUTO_ADVANCE_MS);
  };

  const showHint = useCallback(() => {
    if (!word || status !== "answering" || hintShown) return;
    setHintShown(true);
    track("hint_used", { category: word.category });
    inputRef.current?.focus();
  }, [word, status, hintShown]);

  const bookmarked = word ? isBookmarked(word, bookmarkList) : false;

  const handleToggleBookmark = useCallback(() => {
    if (!word) return;
    const nowBookmarked = toggleBookmark(word);
    track(nowBookmarked ? "bookmark_added" : "bookmark_removed", { word: word.word, category: word.category });
    setAnnouncement(nowBookmarked ? `Bookmarked ${word.word}` : `Removed bookmark for ${word.word}`);
    inputRef.current?.focus();
  }, [word]);

  // Ctrl/Cmd+H for hint, Ctrl/Cmd+B for bookmark.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "h") {
        e.preventDefault();
        showHint();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        handleToggleBookmark();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showHint, handleToggleBookmark]);

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " && (e.shiftKey || input === "")) {
      e.preventDefault();
      play(e.shiftKey);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (status === "answering") check();
      else advance();
    }
  };

  const continueAfterSummary = () => {
    setShowSummary(false);
    setResults([]);
    loadNext(word);
  };

  const diff = useMemo(
    () => (word && status === "wrong" ? diffSpelling(input, closestTarget(input, word)) : []),
    [word, status, input],
  );

  const sessionPosition = (results.length % SESSION_LENGTH) + (status === "answering" ? 1 : 0) || SESSION_LENGTH;
  const label = bookmarks
    ? "Bookmarks"
    : mistakes
      ? "Mistakes"
      : category
        ? CATEGORIES.find((c) => c.slug === category)?.label
        : "All words";

  if (bookmarks && hydrated && bookmarkCount === 0 && !word && !showSummary) {
    return (
      <Card>
        <div className="py-6 text-center">
          <Bookmark className="mx-auto size-10 text-muted" aria-hidden />
          <h2 className="mt-3 text-lg font-semibold">No bookmarked words</h2>
          <p className="mt-1 text-sm text-muted">
            Bookmark tricky words while practicing to review them here anytime.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-ctl bg-primary px-6 font-medium text-on-primary transition-colors duration-200 hover:bg-primary-hover"
          >
            Practise all words <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </Card>
    );
  }

  if (mistakes && hydrated && mistakeCount === 0 && !word && !showSummary) {
    return (
      <Card>
        <div className="py-6 text-center">
          <Check className="mx-auto size-10 text-success" aria-hidden />
          <h2 className="mt-3 text-lg font-semibold">No mistakes to review</h2>
          <p className="mt-1 text-sm text-muted">
            Words you misspell are saved here. Spell one correctly twice in a row and it leaves the list.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-ctl bg-primary px-6 font-medium text-on-primary transition-colors duration-200 hover:bg-primary-hover"
          >
            Practise all words <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <p className="sr-only" aria-live="polite" role="status">
        {announcement}
      </p>

      {showSummary ? (
        <SessionSummary results={results} onContinue={continueAfterSummary} />
      ) : (
        <>
          <div className="flex items-center justify-between gap-2">
            <AccentSelector accent={accent} />
            <div className="flex">
              <button
                type="button"
                onClick={handleToggleBookmark}
                disabled={!word}
                aria-label={bookmarked ? "Remove bookmark" : "Bookmark this word"}
                aria-pressed={bookmarked}
                title={bookmarked ? "Bookmarked (Ctrl+B)" : "Bookmark word (Ctrl+B)"}
                className={`grid size-12 place-items-center rounded-ctl transition-colors duration-200 hover:bg-background ${
                  bookmarked ? "text-primary hover:text-primary-hover" : "text-muted hover:text-text"
                } disabled:opacity-40`}
              >
                <Bookmark className="size-5" fill={bookmarked ? "currentColor" : "none"} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setItem("muted", !muted)}
                aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
                aria-pressed={muted}
                className="grid size-12 place-items-center rounded-ctl text-muted transition-colors duration-200 hover:bg-background hover:text-text"
              >
                {muted ? <VolumeX className="size-5" aria-hidden /> : <Volume2 className="size-5" aria-hidden />}
              </button>
              <ShortcutsHelp onClose={() => inputRef.current?.focus()} />
            </div>
          </div>

          {hydrated && !speechSupported() ? (
            <p className="mt-2 text-xs text-muted">This browser can&apos;t read words aloud. Try Chrome, Edge or Safari.</p>
          ) : (
            fallback && (
              <p className="mt-2 text-xs text-muted">
                No {ACCENT_NAMES[accent]} voice on this device{voiceName ? `, using ${voiceName}` : ""}.
              </p>
            )
          )}

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => play()}
              disabled={!word}
              aria-label="Play word"
              className="flex h-16 min-w-36 items-center justify-center gap-2 rounded-card bg-primary px-6 text-lg font-semibold text-on-primary transition-[background-color,transform] duration-200 hover:bg-primary-hover active:scale-[0.98] disabled:opacity-60"
            >
              <Volume2 className="size-6" aria-hidden />
              Play
            </button>
            <button
              type="button"
              onClick={() => play(true)}
              disabled={!word}
              aria-label="Play word slowly"
              className="flex h-16 items-center gap-2 rounded-card border border-border px-5 font-medium transition-colors duration-200 hover:bg-background disabled:opacity-60"
            >
              <Snail className="size-5" aria-hidden />
              Slow
            </button>
          </div>

          <form
            className="mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (status === "answering") check();
              else advance();
            }}
          >
            <label htmlFor="answer" className="sr-only">
              Type the word you hear
            </label>
            <input
              ref={inputRef}
              id="answer"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onInputKeyDown}
              readOnly={status !== "answering"}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              enterKeyHint={status === "answering" ? "done" : "next"}
              placeholder="Type what you hear"
              aria-invalid={status === "wrong"}
              aria-describedby="answer-hint"
              className={`h-16 w-full rounded-card border-2 bg-background px-5 text-center text-xl font-medium tracking-wide transition-colors duration-200 outline-none placeholder:text-base placeholder:font-normal placeholder:tracking-normal placeholder:text-muted focus-visible:outline-none ${
                status === "correct"
                  ? "animate-pop border-success text-success-text"
                  : status === "wrong"
                    ? "animate-shake border-error text-error-text line-through decoration-1"
                    : "border-border focus:border-primary"
              }`}
            />

            <div
              id="answer-hint"
              className={`flex items-center justify-center ${status === "answering" ? "min-h-12" : "min-h-3"}`}
              aria-live="polite"
            >
              {hintShown && word ? (
                <p className="font-mono text-base tracking-wider text-muted">
                  <span className="sr-only">Hint: starts with {word.word[0]}, </span>
                  <span aria-hidden>{hintFor(word.word)}</span>
                  <span className="ml-2 font-sans text-xs tracking-normal">({letterCount(word.word)} letters)</span>
                </p>
              ) : (
                status === "answering" && (
                  <button
                    type="button"
                    onClick={showHint}
                    disabled={!word}
                    className="inline-flex min-h-12 items-center gap-1.5 rounded-ctl px-3 text-sm text-muted transition-colors duration-200 hover:text-text"
                  >
                    <Lightbulb className="size-4" aria-hidden />
                    Hint
                  </button>
                )
              )}
            </div>

            {status === "answering" && (
              <button
                type="submit"
                disabled={!input.trim()}
                className="min-h-14 w-full rounded-card bg-text font-semibold text-background transition-opacity duration-200 disabled:opacity-40"
              >
                Check
              </button>
            )}

            {status === "correct" && word && (
              <div className="flex min-h-14 animate-fade-up items-center justify-center gap-2 rounded-card bg-success/10 font-semibold text-success-text">
                <Check className="size-5" aria-hidden />
                Correct!
                {hintShown && <span className="text-sm font-normal">(with hint)</span>}
              </div>
            )}

            {status === "wrong" && word && (
              <div className="animate-fade-up">
                <div className="rounded-card bg-error/5 p-4 ring-1 ring-error/20">
                  <p className="mb-3 flex items-center justify-center gap-1.5 text-sm font-medium text-error-text">
                    <X className="size-4" aria-hidden /> Not quite. The correct spelling is:
                  </p>
                  <SpellingDiff parts={diff} />
                  {word.alt && (
                    <p className="mt-3 text-center text-xs text-muted">
                      Accepted: {word.word} (UK) or {word.alt} (US)
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="mt-3 flex min-h-14 w-full items-center justify-center gap-2 rounded-card bg-primary font-semibold text-on-primary transition-colors duration-200 hover:bg-primary-hover"
                >
                  Next <ArrowRight className="size-5" aria-hidden />
                </button>
              </div>
            )}
          </form>

          <div className="mt-5 flex items-center justify-between text-xs text-muted">
            <span>{label}</span>
            <span className="tabular-nums" aria-label={`Word ${sessionPosition} of ${SESSION_LENGTH} in this round`}>
              {sessionPosition} / {SESSION_LENGTH}
            </span>
          </div>
        </>
      )}
    </Card>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section
      aria-label="Spelling practice"
      className="mx-auto w-full max-w-[520px] rounded-card border border-border bg-surface p-4 shadow-sm sm:p-6"
    >
      {children}
    </section>
  );
}

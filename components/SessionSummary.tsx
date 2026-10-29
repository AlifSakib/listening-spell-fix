"use client";

import { useState } from "react";
import { Check, Share2, Trophy } from "lucide-react";
import { track } from "@/lib/analytics";
import { SITE_URL } from "@/lib/site";

interface Props {
  results: { word: string; correct: boolean }[];
  onContinue: () => void;
}

export function SessionSummary({ results, onContinue }: Props) {
  const [copied, setCopied] = useState(false);
  const score = results.filter((r) => r.correct).length;
  const accuracy = Math.round((score / results.length) * 100);
  const missed = results.filter((r) => !r.correct).map((r) => r.word);

  const share = async () => {
    track("share_clicked", { score });
    const text = `I scored ${score}/${results.length} (${accuracy}%) on IELTS Spelling Practice. Can you beat it?`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "IELTS Spelling Practice", text, url: SITE_URL });
        return;
      } catch (e) {
        if ((e as DOMException).name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${SITE_URL}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: nothing else to fall back to.
    }
  };

  return (
    <div className="animate-fade-up text-center">
      <Trophy className="mx-auto size-10 text-warning" aria-hidden />
      <h2 className="mt-2 text-xl font-semibold">Session complete</h2>
      <dl className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-ctl border border-border p-3">
          <dt className="text-xs text-muted">Score</dt>
          <dd className="text-2xl font-semibold tabular-nums">
            {score}/{results.length}
          </dd>
        </div>
        <div className="rounded-ctl border border-border p-3">
          <dt className="text-xs text-muted">Accuracy</dt>
          <dd className="text-2xl font-semibold tabular-nums">{accuracy}%</dd>
        </div>
      </dl>
      {missed.length > 0 ? (
        <div className="mt-4 text-left">
          <h3 className="text-sm font-medium text-muted">Words to review</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {missed.map((w) => (
              <li key={w} className="rounded-full bg-error/10 px-3 py-1 text-sm text-error-text">
                {w}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 text-sm text-success-text">A perfect round. Well done!</p>
      )}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={share}
          className="flex min-h-12 items-center justify-center gap-2 rounded-ctl border border-border font-medium transition-colors duration-200 hover:bg-background"
        >
          {copied ? <Check className="size-4" aria-hidden /> : <Share2 className="size-4" aria-hidden />}
          {copied ? "Copied" : "Share result"}
        </button>
        <button
          type="button"
          onClick={onContinue}
          autoFocus
          className="min-h-12 rounded-ctl bg-primary font-medium text-on-primary transition-colors duration-200 hover:bg-primary-hover"
        >
          Keep going
        </button>
      </div>
    </div>
  );
}

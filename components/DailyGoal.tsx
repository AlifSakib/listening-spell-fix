"use client";

import { useEffect, useRef, useState } from "react";
import { todayCount } from "@/lib/progress";
import { setItem, useStored } from "@/lib/storage";

const PRESETS = [10, 20, 30, 50];
const R = 15;
const CIRCUMFERENCE = 2 * Math.PI * R;

export function DailyGoal() {
  const goal = useStored("dailyGoal");
  const done = todayCount(useStored("daily"));
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const progress = Math.min(done / goal, 1);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`Daily goal: ${done} of ${goal} words practised today. Change goal`}
        className="flex min-h-12 items-center gap-1.5 rounded-ctl px-1.5 transition-colors duration-200 hover:bg-surface"
      >
        <svg viewBox="0 0 36 36" className="size-9 -rotate-90" aria-hidden>
          <circle cx="18" cy="18" r={R} fill="none" stroke="var(--border)" strokeWidth="4" />
          <circle
            cx="18"
            cy="18"
            r={R}
            fill="none"
            stroke={progress >= 1 ? "var(--success)" : "var(--primary)"}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
            className="transition-[stroke-dashoffset] duration-250"
          />
        </svg>
        <span className="text-sm font-medium tabular-nums" aria-hidden>
          {done}
          <span className="text-muted">/{goal}</span>
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 animate-fade-up rounded-card border border-border bg-surface p-4 shadow-lg">
          <p className="text-sm font-medium">Daily goal</p>
          <p className="mb-3 text-xs text-muted">Words to practise each day</p>
          <div className="grid grid-cols-4 gap-1.5">
            {PRESETS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  setItem("dailyGoal", n);
                  setOpen(false);
                }}
                aria-pressed={goal === n}
                className="min-h-12 rounded-xl border border-border text-sm font-medium transition-colors duration-200 hover:border-primary aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-on-primary"
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { Flame } from "lucide-react";
import { currentStreak } from "@/lib/progress";
import { useStored } from "@/lib/storage";

export function StreakBadge() {
  const streak = currentStreak(useStored("streak"));
  const label = `${streak}-day practice streak`;

  return (
    <div
      className="flex min-h-12 items-center gap-1 rounded-ctl px-1.5 text-sm font-medium tabular-nums"
      title={label}
      role="img"
      aria-label={label}
    >
      <Flame
        className={`size-5 ${streak > 0 ? "fill-warning/30 text-warning" : "text-muted"}`}
        aria-hidden
      />
      {streak}
    </div>
  );
}

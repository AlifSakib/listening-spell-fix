"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { useStored } from "@/lib/storage";

export function MistakesBadge() {
  const count = useStored("mistakes").length;

  return (
    <Link
      href="/mistakes"
      aria-label={`Review mistakes (${count})`}
      className="flex min-h-12 min-w-12 items-center justify-center gap-1.5 rounded-ctl px-2 text-sm font-medium transition-colors duration-200 hover:bg-surface"
    >
      <RotateCcw className="size-5 text-muted sm:hidden" aria-hidden />
      <span className="hidden sm:inline" aria-hidden>
        Review mistakes
      </span>
      <span
        aria-hidden
        className={`min-w-6 rounded-full px-1.5 text-center text-xs leading-6 tabular-nums ${
          count > 0 ? "bg-error text-white" : "bg-border text-muted"
        }`}
      >
        {count}
      </span>
    </Link>
  );
}

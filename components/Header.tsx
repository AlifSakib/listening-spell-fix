import Link from "next/link";
import { BookOpenCheck } from "lucide-react";
import { BookmarksBadge } from "./BookmarksBadge";
import { DailyGoal } from "./DailyGoal";
import { MistakesBadge } from "./MistakesBadge";
import { StreakBadge } from "./StreakBadge";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-1 px-3 sm:gap-2 sm:px-6">
        <Link
          href="/"
          className="mr-auto flex min-h-12 items-center gap-2 rounded-ctl pr-2 font-semibold"
          aria-label="IELTS Spelling Practice, home"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-on-primary">
            <BookOpenCheck className="size-5" aria-hidden />
          </span>
          <span className="hidden sm:inline">IELTS Spelling</span>
        </Link>
        <Link
          href="/words"
          className="hidden min-h-12 items-center rounded-ctl px-3 text-sm font-medium text-muted transition-colors duration-200 hover:text-text md:flex"
        >
          Word list
        </Link>
        <Link
          href="/about"
          className="hidden min-h-12 items-center rounded-ctl px-3 text-sm font-medium text-muted transition-colors duration-200 hover:text-text md:flex"
        >
          How it works
        </Link>
        <DailyGoal />
        <StreakBadge />
        <BookmarksBadge />
        <MistakesBadge />
        <ThemeToggle />
      </div>
    </header>
  );
}

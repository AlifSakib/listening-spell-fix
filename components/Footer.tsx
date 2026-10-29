import Link from "next/link";
import { ClearData } from "./ClearData";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <nav
        aria-label="Footer"
        className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-1 px-4 py-6 text-sm text-muted sm:px-6"
      >
        <Link href="/" className="inline-flex min-h-12 items-center hover:text-text">
          Practice
        </Link>
        <Link href="/words" className="inline-flex min-h-12 items-center hover:text-text">
          Word list
        </Link>
        <Link href="/topics" className="inline-flex min-h-12 items-center hover:text-text">
          Topics
        </Link>
        <Link href="/mistakes" className="inline-flex min-h-12 items-center hover:text-text">
          My mistakes
        </Link>
        <Link href="/bookmarks" className="inline-flex min-h-12 items-center hover:text-text">
          Bookmarks
        </Link>
        <Link href="/about" className="inline-flex min-h-12 items-center hover:text-text">
          About
        </Link>
        <p className="w-full sm:ml-auto sm:w-auto">Your progress is saved only on this device.</p>
        <div className="w-full" data-clear-data>
          <ClearData inline />
        </div>
      </nav>
    </footer>
  );
}

import Link from "next/link";
import { CATEGORIES, type CategorySlug } from "@/data/words";
import { wordsIn } from "@/lib/site";

export function CategoryLinks({ current }: { current?: CategorySlug }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {CATEGORIES.map((c) => (
        <li key={c.slug}>
          <Link
            href={`/practice/${c.slug}`}
            aria-current={c.slug === current ? "page" : undefined}
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm transition-colors duration-200 hover:border-primary aria-[current=page]:border-primary aria-[current=page]:text-primary"
          >
            {c.label}
            <span className="text-xs text-muted tabular-nums">{wordsIn(c.slug).length}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

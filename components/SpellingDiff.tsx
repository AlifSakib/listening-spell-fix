import type { DiffPart } from "@/lib/spelling";

const STYLES = {
  match: "text-text",
  wrong: "bg-error/15 text-error-text underline decoration-2 underline-offset-4",
  missing: "bg-warning/20 text-warning-text underline decoration-dashed decoration-2 underline-offset-4",
  extra: "text-error-text line-through decoration-2 opacity-80",
} as const;

/** Letter-by-letter view of the attempt against the correct spelling. */
export function SpellingDiff({ parts }: { parts: DiffPart[] }) {
  return (
    <div>
      <p className="flex flex-wrap justify-center text-2xl font-medium tracking-[0.12em]" aria-hidden>
        {parts.map((p, i) => (
          <span
            key={i}
            className={`rounded px-px ${STYLES[p.type]}`}
            title={
              p.type === "wrong"
                ? `You typed "${p.typed}"`
                : p.type === "missing"
                  ? "Missing letter"
                  : p.type === "extra"
                    ? "Extra letter"
                    : undefined
            }
          >
            {p.type === "extra" ? p.typed : p.char === " " ? " " : p.char}
          </span>
        ))}
      </p>
      <ul className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted" aria-hidden>
        <li className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-error/60" /> wrong
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-warning/70" /> missing
        </li>
        <li className="flex items-center gap-1.5">
          <span className="text-error-text line-through">a</span> extra
        </li>
      </ul>
    </div>
  );
}

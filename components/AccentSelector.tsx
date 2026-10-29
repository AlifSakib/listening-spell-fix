"use client";

import { track } from "@/lib/analytics";
import { setItem, type Accent } from "@/lib/storage";

const OPTIONS: { value: Accent; label: string; name: string }[] = [
  { value: "en-GB", label: "UK", name: "British" },
  { value: "en-US", label: "US", name: "American" },
  { value: "en-AU", label: "AU", name: "Australian" },
];

export function AccentSelector({ accent }: { accent: Accent }) {
  const select = (value: Accent) => {
    if (value === accent) return;
    setItem("accent", value);
    track("accent_changed", { accent: value });
  };

  return (
    <div role="radiogroup" aria-label="Accent" className="flex rounded-ctl border border-border bg-background p-1">
      {OPTIONS.map((o) => {
        const checked = o.value === accent;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={`${o.name} accent`}
            tabIndex={checked ? 0 : -1}
            onClick={() => select(o.value)}
            onKeyDown={(e) => {
              const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
              if (!dir) return;
              e.preventDefault();
              const idx = (OPTIONS.findIndex((x) => x.value === accent) + dir + OPTIONS.length) % OPTIONS.length;
              select(OPTIONS[idx].value);
              (e.currentTarget.parentElement?.children[idx] as HTMLElement | undefined)?.focus();
            }}
            className={`min-h-10 min-w-12 rounded-xl px-3 text-sm font-medium transition-colors duration-200 ${
              checked ? "bg-surface text-text shadow-sm ring-1 ring-border" : "text-muted hover:text-text"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

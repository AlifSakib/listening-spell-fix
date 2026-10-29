"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { setItem, useStored } from "@/lib/storage";

export function ThemeToggle() {
  const saved = useStored("theme");

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => document.documentElement.classList.toggle("dark", saved ? saved === "dark" : media.matches);
    apply();
    // Follow the system setting until the student picks a theme.
    if (saved) return;
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [saved]);

  const toggle = () => {
    const isDark = document.documentElement.classList.contains("dark");
    setItem("theme", isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="grid size-12 place-items-center rounded-ctl text-muted transition-colors duration-200 hover:bg-surface hover:text-text"
    >
      <Sun className="hidden size-5 dark:block" aria-hidden />
      <Moon className="size-5 dark:hidden" aria-hidden />
    </button>
  );
}

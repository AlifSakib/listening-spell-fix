import type { Word } from "@/data/words";

export function normalize(text: string): string {
  return text.trim().replace(/\s+/g, " ").toLowerCase();
}

/** Case-insensitive, trims spaces, and accepts the American variant. */
export function isCorrect(input: string, word: Word): boolean {
  const answer = normalize(input);
  return answer === normalize(word.word) || (!!word.alt && answer === normalize(word.alt));
}

export type DiffPart =
  | { type: "match"; char: string }
  | { type: "wrong"; char: string; typed: string }
  | { type: "missing"; char: string }
  | { type: "extra"; typed: string };

/**
 * Letter-by-letter alignment of what the student typed against the target,
 * using an edit-distance backtrace.
 */
export function diffSpelling(typed: string, target: string): DiffPart[] {
  const a = typed.trim();
  const b = target;
  const al = a.toLowerCase();
  const bl = b.toLowerCase();
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp: number[][] = Array.from({ length: rows }, () => new Array<number>(cols).fill(0));

  for (let i = 0; i < rows; i++) dp[i][0] = i;
  for (let j = 0; j < cols; j++) dp[0][j] = j;
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = al[i - 1] === bl[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }

  const parts: DiffPart[] = [];
  let i = a.length;
  let j = b.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + (al[i - 1] === bl[j - 1] ? 0 : 1)) {
      parts.push(
        al[i - 1] === bl[j - 1]
          ? { type: "match", char: b[j - 1] }
          : { type: "wrong", char: b[j - 1], typed: a[i - 1] },
      );
      i--;
      j--;
    } else if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) {
      parts.push({ type: "missing", char: b[j - 1] });
      j--;
    } else {
      parts.push({ type: "extra", typed: a[i - 1] });
      i--;
    }
  }
  return parts.reverse();
}

/** Compares against whichever accepted spelling is closest to the attempt. */
export function closestTarget(input: string, word: Word): string {
  if (!word.alt) return word.word;
  const errors = (target: string) => diffSpelling(input, target).filter((p) => p.type !== "match").length;
  return errors(word.alt) < errors(word.word) ? word.alt : word.word;
}

/** "accommodation" -> "a _ _ _ _ _ _ _ _ _ _ _ _" (spaces and hyphens kept). */
export function hintFor(word: string): string {
  return [...word]
    .map((ch, idx) => {
      if (idx === 0) return ch.toLowerCase();
      if (ch === " ") return "  ";
      if (ch === "-" || ch === "'") return ch;
      return "_";
    })
    .join(" ");
}

export function letterCount(word: string): number {
  return word.replace(/[^a-z]/gi, "").length;
}

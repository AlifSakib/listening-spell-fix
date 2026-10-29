"use client";

let ctx: AudioContext | null = null;

function tone(freq: number, start: number, duration: number, type: OscillatorType = "sine") {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const t = ctx.currentTime + start;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.12, t + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}

export function playFeedback(kind: "success" | "error"): void {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    if (kind === "success") {
      tone(660, 0, 0.12);
      tone(880, 0.1, 0.18);
    } else {
      tone(220, 0, 0.18, "triangle");
      tone(180, 0.14, 0.22, "triangle");
    }
  } catch {
    // Web Audio unavailable: stay silent.
  }
}

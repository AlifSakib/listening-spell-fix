"use client";

import type { Accent } from "./storage";

const QUALITY = /google|natural|enhanced|premium|neural/i;

export interface VoiceChoice {
  voice: SpeechSynthesisVoice | null;
  /** True when no voice exists for the chosen accent and another English voice is used. */
  fallback: boolean;
}

const sameLang = (voice: SpeechSynthesisVoice, lang: string) =>
  voice.lang.replace("_", "-").toLowerCase() === lang.toLowerCase();

function best(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  return voices.find((v) => QUALITY.test(v.name)) ?? voices.find((v) => v.localService) ?? voices[0] ?? null;
}

export function pickVoice(voices: SpeechSynthesisVoice[], accent: Accent): VoiceChoice {
  const exact = best(voices.filter((v) => sameLang(v, accent)));
  if (exact) return { voice: exact, fallback: false };
  const english = best(voices.filter((v) => v.lang.toLowerCase().startsWith("en")));
  return { voice: english, fallback: voices.length > 0 };
}

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text: string, choice: VoiceChoice, accent: Accent, slow = false): void {
  if (!speechSupported()) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = choice.voice?.lang ?? accent;
  if (choice.voice) utterance.voice = choice.voice;
  utterance.rate = slow ? 0.55 : 0.9;
  synth.speak(utterance);
}

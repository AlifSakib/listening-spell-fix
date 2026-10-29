"use client";

import type { Accent } from "./storage";

/** Voices that sound noticeably better than the default system voice. */
const QUALITY = /google|natural|enhanced|premium|neural/i;
/** Known male voice names across Chrome, Edge, Safari, Android and iOS. */
const MALE =
  /\b(male|man|ryan|guy|daniel|alex|arthur|oliver|thomas|james|fred|david|george|graham|liam|aaron|tom|mark|eric|christopher|brian|roger|steffan|gordon|william|lee|benedict|albert|nathan|reed|junior|ralph|eddy|justin|matthew|stephen|brandon|adam|andrew|jason)\b/i;
/** Names that would otherwise win a quality match but are female or child voices. */
const NOT_MALE =
  /\b(female|woman|samantha|serena|karen|moira|tessa|fiona|victoria|allison|susan|zoe|sonia|hazel|catherine|kate|aria|jenny|michelle|emma|amelie|sara|novak|libby|natasha|clara|martha|lily|ana|shelley|flo|zira|heather|joanna|salli|kimberly|ivy|kendra|amy|nicole|lauren|melanie|ashley|brittany|crystal|linda|marie|olivia|penelope)\b/i;

export interface VoiceChoice {
  voice: SpeechSynthesisVoice | null;
  /** True when no voice exists for the chosen accent and another English voice is used. */
  fallback: boolean;
}

const sameLang = (voice: SpeechSynthesisVoice, lang: string) =>
  voice.lang.replace("_", "-").toLowerCase() === lang.toLowerCase();

function score(voice: SpeechSynthesisVoice): number {
  let n = 0;
  if (MALE.test(voice.name)) n += 8;
  if (NOT_MALE.test(voice.name)) n -= 3;
  if (QUALITY.test(voice.name)) n += 4;
  if (!voice.localService) n += 1; // network voices are usually the smoother ones
  if (voice.default) n += 1;
  return n;
}

function best(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;
  return [...voices].sort((a, b) => score(b) - score(a))[0];
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

let pending: ReturnType<typeof setTimeout> | undefined;

/** Stops anything queued or playing, including a deferred utterance. */
export function stopSpeech(): void {
  if (!speechSupported()) return;
  clearTimeout(pending);
  pending = undefined;
  window.speechSynthesis.cancel();
}

export function speak(text: string, choice: VoiceChoice, accent: Accent, slow = false): void {
  if (!speechSupported()) return;
  const synth = window.speechSynthesis;

  // Chrome leaves synthesis paused after the tab has been idle for a while.
  if (synth.paused) synth.resume();
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  // Prefer the voice's own tag so browsers pick a consistent pronunciation model.
  utterance.lang = choice.voice?.lang ?? accent;
  if (choice.voice) utterance.voice = choice.voice;
  utterance.rate = slow ? 0.55 : 0.92;
  utterance.pitch = 1;
  utterance.volume = 1;

  // Chrome drops an utterance queued in the same tick as cancel(), which clips the
  // first syllable or plays nothing at all. Deferring one frame keeps audio smooth.
  clearTimeout(pending);
  pending = setTimeout(() => {
    pending = undefined;
    synth.speak(utterance);
  }, 80);
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { pickVoice, speak, speechSupported } from "./speech";
import { useStored } from "./storage";

/** Loads voices (which arrive asynchronously) and speaks with the chosen accent. */
export function useSpeech() {
  const accent = useStored("accent");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (!speechSupported()) return;
    const synth = window.speechSynthesis;
    const load = () => setVoices(synth.getVoices());
    load();
    synth.addEventListener("voiceschanged", load);
    return () => {
      synth.removeEventListener("voiceschanged", load);
      synth.cancel();
    };
  }, []);

  const choice = useMemo(() => pickVoice(voices, accent), [voices, accent]);

  const say = useCallback(
    (text: string, slow = false) => speak(text, choice, accent, slow),
    [choice, accent],
  );

  return { accent, say, fallback: choice.fallback, voiceName: choice.voice?.name };
}

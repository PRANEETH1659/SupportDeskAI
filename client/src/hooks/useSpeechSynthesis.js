import { useCallback } from "react";

// Wraps the browser-native SpeechSynthesis API so any component can read
// text out loud (used for the AI chat replies).
const useSpeechSynthesis = () => {
  const speak = useCallback((text) => {
    if (!window.speechSynthesis || !text) return;

    window.speechSynthesis.cancel(); // stop anything already speaking

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
  }, []);

  return { speak, stop };
};

export default useSpeechSynthesis;

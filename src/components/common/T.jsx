import { useEffect, useState, memo } from 'react';
import { useLang } from '../../context/LanguageContext';
import { getFromCache, queueTranslation } from '../../utils/dynamicTranslate';

/**
 * <T> — Translates any plain text string to the current language.
 * Shows English immediately, then swaps to translated (batched, cached).
 *
 * Usage:
 *   <T>Some page text</T>
 *   <T as="h1" className="text-xl">Heading</T>
 *
 * Do NOT use for strings with embedded JSX — use the `useT()` hook instead.
 */
const T = memo(function T({ children, as: Tag }) {
  const { lang } = useLang();
  const raw = typeof children === 'string' ? children : String(children ?? '');

  const [display, setDisplay] = useState(() => {
    if (lang === 'en') return raw;
    return getFromCache(raw, lang) ?? raw;
  });

  useEffect(() => {
    if (lang === 'en') { setDisplay(raw); return; }
    const cached = getFromCache(raw, lang);
    if (cached) { setDisplay(cached); return; }

    setDisplay(raw); // show English while translating
    queueTranslation(raw, lang, (translated) => setDisplay(translated));
  }, [raw, lang]);

  if (Tag) return <Tag>{display}</Tag>;
  return display;
});

export default T;

/**
 * useT() — returns a translation function for use in props (placeholder, title, aria-label, etc.)
 * Returned function is synchronous — uses cache or falls back to English.
 * Queue is fired as a side effect.
 *
 * Usage:
 *   const tp = useT();
 *   <input placeholder={tp('Search...')} />
 */
export function useT() {
  const { lang } = useLang();
  const [, rerender] = useState(0);

  return function tp(text) {
    if (!text || lang === 'en') return text;
    const cached = getFromCache(text, lang);
    if (cached) return cached;
    // Queue and trigger re-render when done
    queueTranslation(text, lang, () => rerender(n => n + 1));
    return text; // English fallback while translating
  };
}

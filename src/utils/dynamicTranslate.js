import { GoogleGenerativeAI } from '@google/generative-ai';

export const LANG_NAMES = {
  en: 'English',
  hi: 'Hindi',
  ta: 'Tamil',
  te: 'Telugu',
  kn: 'Kannada',
  mr: 'Marathi',
  bn: 'Bengali',
  gu: 'Gujarati',
  ml: 'Malayalam',
  pa: 'Punjabi',
};

function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return (h >>> 0).toString(36);
}

export function getFromCache(text, lang) {
  if (lang === 'en' || !text) return null;
  try {
    return sessionStorage.getItem(`uc_t_${lang}_${hashStr(text)}`);
  } catch { return null; }
}

export function saveToCache(text, lang, translated) {
  if (lang === 'en' || !text) return;
  try {
    sessionStorage.setItem(`uc_t_${lang}_${hashStr(text)}`, translated);
  } catch {}
}

// Batch translate many strings in one API call
export async function translateBatch(texts, lang) {
  if (lang === 'en') return texts;

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') return texts;

  const langName = LANG_NAMES[lang] || lang;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = `Translate the following ${texts.length} UI strings from English to ${langName}.

STRICT RULES:
- Return ONLY a valid JSON array with exactly ${texts.length} translated strings
- Same index order as input — do not skip or reorder
- Keep numbers, ₹ currency, %, URLs, and proper nouns (brand/place names) unchanged
- Keep placeholders like {name} or {count} unchanged
- Natural, concise UI-style translations (not literal)
- No extra explanation, no markdown — only the JSON array

Input: ${JSON.stringify(texts)}

Output:`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) return texts;

    const translated = JSON.parse(match[0]);
    if (!Array.isArray(translated) || translated.length !== texts.length) return texts;

    return translated.map((t, i) => (typeof t === 'string' && t.trim() ? t : texts[i]));
  } catch (e) {
    console.warn('Batch translation failed:', e?.message);
    return texts;
  }
}

// Pending queue: map of `lang:text` -> Set<callback>
const pendingMap = new Map();
let flushTimer = null;

export function queueTranslation(text, lang, callback) {
  if (!text || lang === 'en') { callback(text); return; }

  const key = `${lang}\x00${text}`;
  if (!pendingMap.has(key)) pendingMap.set(key, new Set());
  pendingMap.get(key).add(callback);

  clearTimeout(flushTimer);
  flushTimer = setTimeout(() => flushQueue(lang), 80);
}

async function flushQueue(lang) {
  // Snapshot and clear
  const snapshot = new Map(pendingMap);
  pendingMap.clear();

  const relevantEntries = [...snapshot.entries()].filter(([k]) => k.startsWith(lang + '\x00'));
  if (relevantEntries.length === 0) return;

  const texts = relevantEntries.map(([k]) => k.slice(lang.length + 1));
  const translated = await translateBatch(texts, lang);

  relevantEntries.forEach(([key, callbacks], i) => {
    const originalText = key.slice(lang.length + 1);
    const result = translated[i] ?? originalText;
    saveToCache(originalText, lang, result);
    callbacks.forEach(cb => cb(result));
  });
}

import { createContext, useContext, useState } from 'react';
import T, { LANGUAGES } from '../utils/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');

  function switchLang(code) {
    setLang(code);
    localStorage.setItem('lang', code);
  }

  const t = (key) => T[lang]?.[key] ?? T.en[key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, switchLang, t, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}

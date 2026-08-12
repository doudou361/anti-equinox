import React, { createContext, useContext, useState } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

const warn = (message) => {
  if (import.meta.env.DEV) console.warn(message);
};

/** Walk a dotted key path, returning undefined when any segment is missing. */
const resolve = (bundle, keyPath) =>
  keyPath.split('.').reduce(
    (current, key) => (current && current[key] !== undefined ? current[key] : undefined),
    bundle
  );

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('fr'); // Default language is French

  const toggleLanguage = () => {
    setLang(prev => (prev === 'fr' ? 'en' : 'fr'));
  };

  // Translation helper function t("nav.schedule")
  const t = (keyPath) => {
    const value = resolve(translations[lang], keyPath);
    if (value === undefined) {
      warn(`Missing translation "${keyPath}" for language "${lang}"`);
      return keyPath; // fallback to keyPath so the UI still renders
    }
    return value;
  };

  /**
   * Translation helper for keys holding a collection (object or array).
   * Always returns an array so callers never crash on — or silently render
   * nothing for — a missing or mistyped key.
   */
  const tList = (keyPath) => {
    const value = resolve(translations[lang], keyPath);
    if (Array.isArray(value)) return value;
    if (value && typeof value === 'object') return Object.values(value);
    warn(`Translation "${keyPath}" for language "${lang}" is not a list (got ${typeof value})`);
    return [];
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t, tList }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

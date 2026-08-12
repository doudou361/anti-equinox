import { describe, it, expect } from 'vitest';
import { translations } from './translations';

/** Collect every leaf key path, treating arrays as leaves. */
const leafPaths = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([key, value]) =>
    value && typeof value === 'object' && !Array.isArray(value)
      ? leafPaths(value, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  );

const valueAt = (obj, path) =>
  path.split('.').reduce((acc, key) => acc?.[key], obj);

describe('translations', () => {
  it('exposes exactly the fr and en locales', () => {
    expect(Object.keys(translations).sort()).toEqual(['en', 'fr']);
  });

  it('has identical key paths in both locales', () => {
    const fr = leafPaths(translations.fr).sort();
    const en = leafPaths(translations.en).sort();
    expect(en).toEqual(fr);
  });

  it('has matching value types and array lengths across locales', () => {
    for (const path of leafPaths(translations.fr)) {
      const frValue = valueAt(translations.fr, path);
      const enValue = valueAt(translations.en, path);
      expect(Array.isArray(enValue), path).toBe(Array.isArray(frValue));
      expect(typeof enValue, path).toBe(typeof frValue);
      if (Array.isArray(frValue)) {
        expect(enValue.length, path).toBe(frValue.length);
      }
    }
  });

  it('has no empty or whitespace-only strings', () => {
    for (const locale of ['fr', 'en']) {
      for (const path of leafPaths(translations[locale])) {
        const value = valueAt(translations[locale], path);
        if (typeof value === 'string') {
          expect(value.trim(), `${locale}.${path}`).not.toBe('');
        }
      }
    }
  });

  it('keeps the sections the components rely on', () => {
    for (const locale of ['fr', 'en']) {
      for (const section of ['nav', 'hero', 'schedule', 'pricing', 'bookingModal', 'footer']) {
        expect(translations[locale], locale).toHaveProperty(section);
      }
    }
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { translations } from '../data/translations';

const Probe = () => {
  const { lang, t, toggleLanguage, setLang } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="nested">{t('nav.schedule')}</span>
      <span data-testid="missing">{t('nav.doesNotExist')}</span>
      <span data-testid="partial">{t('nav')?.schedule}</span>
      <button onClick={toggleLanguage}>toggle</button>
      <button onClick={() => setLang('en')}>set-en</button>
    </div>
  );
};

const renderProbe = () => render(
  <LanguageProvider>
    <Probe />
  </LanguageProvider>,
);

describe('LanguageProvider', () => {
  it('defaults to French', () => {
    renderProbe();
    expect(screen.getByTestId('lang')).toHaveTextContent('fr');
    expect(screen.getByTestId('nested')).toHaveTextContent(
      translations.fr.nav.schedule,
    );
  });

  it('toggles between French and English and back', async () => {
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByRole('button', { name: 'toggle' }));
    expect(screen.getByTestId('lang')).toHaveTextContent('en');
    expect(screen.getByTestId('nested')).toHaveTextContent(
      translations.en.nav.schedule,
    );

    await user.click(screen.getByRole('button', { name: 'toggle' }));
    expect(screen.getByTestId('lang')).toHaveTextContent('fr');
  });

  it('exposes setLang for direct language selection', async () => {
    const user = userEvent.setup();
    renderProbe();
    await user.click(screen.getByRole('button', { name: 'set-en' }));
    expect(screen.getByTestId('lang')).toHaveTextContent('en');
  });

  it('falls back to the key path when a translation is missing', () => {
    renderProbe();
    expect(screen.getByTestId('missing')).toHaveTextContent('nav.doesNotExist');
  });

  it('returns intermediate objects for partial key paths', () => {
    renderProbe();
    expect(screen.getByTestId('partial')).toHaveTextContent(
      translations.fr.nav.schedule,
    );
  });
});

describe('useLanguage', () => {
  it('throws when used outside a LanguageProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(
      /useLanguage must be used within a LanguageProvider/,
    );
    spy.mockRestore();
  });
});

describe('t()', () => {
  it('resolves every top-level section for both languages', () => {
    const Collector = () => {
      const { t } = useLanguage();
      const keys = Object.keys(translations.fr);
      return <span data-testid="ok">{keys.every((k) => t(k) !== k) ? 'yes' : 'no'}</span>;
    };
    render(
      <LanguageProvider>
        <Collector />
      </LanguageProvider>,
    );
    expect(screen.getByTestId('ok')).toHaveTextContent('yes');
  });

  it('does not crash on an empty key path', () => {
    let read;
    const Reader = () => {
      const { t } = useLanguage();
      read = t;
      return null;
    };
    render(
      <LanguageProvider>
        <Reader />
      </LanguageProvider>,
    );
    act(() => {
      expect(read('')).toBe('');
    });
  });
});

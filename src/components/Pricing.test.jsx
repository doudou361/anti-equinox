import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pricing from './Pricing';
import { LanguageProvider } from '../context/LanguageContext';
import { translations } from '../data/translations';
import { pricingCategories } from '../data/pricing';

const fr = translations.fr.pricing;
const normalize = (s) => s.replace(/[\u202F\u00A0\s]/g, ' ');

const renderPricing = (onPlanBook = vi.fn()) => {
  render(
    <LanguageProvider>
      <Pricing onPlanBook={onPlanBook} />
    </LanguageProvider>,
  );
  return onPlanBook;
};

const category = (id) => pricingCategories.find((c) => c.id === id);

let openSpy;

beforeEach(() => {
  openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
});

afterEach(() => {
  openSpy.mockRestore();
});

describe('Pricing', () => {
  it('renders the section header', () => {
    renderPricing();
    expect(screen.getByText(fr.title)).toBeInTheDocument();
    expect(screen.getByText(fr.subtitle)).toBeInTheDocument();
  });

  it('renders one booking button per subscription plan', () => {
    renderPricing();
    const plans = [
      ...category('musculation_cross_training').plans,
      ...category('musculation_avec_crossfit').plans,
    ];
    expect(screen.getAllByRole('button', { name: fr.bookBtn })).toHaveLength(plans.length);
  });

  it('prices every plan from the pricing data', () => {
    renderPricing();
    const rates = [
      ...category('musculation_cross_training').plans,
      ...category('musculation_avec_crossfit').plans,
    ].map((p) => p.monthlyRate);

    const shown = screen
      .getAllByText(/DA/)
      .map((el) => normalize(el.textContent));
    for (const rate of rates) {
      const label = normalize(
        new Intl.NumberFormat('fr-FR').format(rate) + ' DA',
      );
      expect(shown.some((text) => text.includes(label)), String(rate)).toBe(true);
    }
  });

  it('marks the recommended plans as popular', () => {
    renderPricing();
    const recommended = pricingCategories.flatMap((c) =>
      c.plans.filter((p) => p.recommended),
    );
    expect(screen.getAllByText(fr.popular)).toHaveLength(recommended.length);
  });

  it('passes the selected plan up when booking a subscription', async () => {
    const user = userEvent.setup();
    const onPlanBook = renderPricing();
    const firstPlan = category('musculation_cross_training').plans[0];

    await user.click(screen.getAllByRole('button', { name: fr.bookBtn })[0]);
    expect(onPlanBook).toHaveBeenCalledWith(expect.objectContaining({
      name: expect.any(String),
      frequency: firstPlan.frequency,
      monthlyRate: firstPlan.monthlyRate,
    }));
  });

  it('books the VIP plan with its own button', async () => {
    const user = userEvent.setup();
    const onPlanBook = renderPricing();
    const vip = category('pack_vip');

    await user.click(screen.getByRole('button', { name: fr.bookVip }));
    expect(onPlanBook).toHaveBeenCalledWith(expect.objectContaining({
      name: vip.name,
      frequency: vip.plans[0].frequency,
      monthlyRate: vip.plans[0].monthlyRate,
    }));
  });

  it('sends the séance libre straight to WhatsApp instead of the modal', async () => {
    const user = userEvent.setup();
    const onPlanBook = renderPricing();

    await user.click(screen.getByRole('button', { name: new RegExp(fr.bookSession) }));
    expect(onPlanBook).not.toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('https://wa.me/213562838455?text='),
      '_blank',
    );
  });

  it('lists the VIP benefits from the translations', () => {
    renderPricing();
    for (const benefit of Object.values(fr.benefits)) {
      expect(screen.getByText(benefit), benefit).toBeInTheDocument();
    }
  });
});

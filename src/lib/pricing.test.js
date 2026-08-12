import { describe, it, expect } from 'vitest';
import { formatDA, calculatePlanTotal, getSavingsInfo } from './pricing';
import { pricingCategories } from '../data/pricing';

/** fr-FR groups thousands with a (narrow) no-break space depending on ICU version */
const normalize = (s) => s.replace(/[\u202F\u00A0\s]/g, ' ');

describe('formatDA', () => {
  it('groups thousands and appends the DA suffix', () => {
    expect(normalize(formatDA(25000))).toBe('25 000 DA');
    expect(normalize(formatDA(1800))).toBe('1 800 DA');
  });

  it('formats values below one thousand without grouping', () => {
    expect(normalize(formatDA(500))).toBe('500 DA');
    expect(normalize(formatDA(0))).toBe('0 DA');
  });
});

describe('calculatePlanTotal', () => {
  it('charges the full rate for a single month', () => {
    expect(calculatePlanTotal(3500, 1)).toBe(3500);
  });

  it('applies a 12% discount over three months, rounded', () => {
    expect(calculatePlanTotal(3500, 3)).toBe(9240);
    // 1800 * 3 * 0.88 = 4752 exactly
    expect(calculatePlanTotal(1800, 3)).toBe(4752);
    // 2500 * 3 * 0.88 = 6600 exactly; rounding only matters for odd rates
    expect(calculatePlanTotal(1875, 3)).toBe(4950);
  });

  it('gives the sixth month free', () => {
    expect(calculatePlanTotal(3500, 6)).toBe(3500 * 5);
  });

  it('gives two months free over a year', () => {
    expect(calculatePlanTotal(3500, 12)).toBe(3500 * 10);
  });

  it('falls back to a linear total for unsupported durations', () => {
    expect(calculatePlanTotal(3500, 2)).toBe(7000);
    expect(calculatePlanTotal(3500, 24)).toBe(84000);
    expect(calculatePlanTotal(3500, 0)).toBe(0);
  });

  it('never charges more than the undiscounted total for discounted durations', () => {
    for (const months of [3, 6, 12]) {
      for (const { plans } of pricingCategories) {
        for (const { monthlyRate } of plans) {
          expect(calculatePlanTotal(monthlyRate, months)).toBeLessThan(
            monthlyRate * months,
          );
        }
      }
    }
  });
});

describe('getSavingsInfo', () => {
  it('returns null for a single month', () => {
    expect(getSavingsInfo(3500, 1)).toBeNull();
  });

  it('returns null for durations without a discount label', () => {
    expect(getSavingsInfo(3500, 2)).toBeNull();
    expect(getSavingsInfo(3500, 24)).toBeNull();
  });

  it('reports the amount saved on three months', () => {
    const info = getSavingsInfo(3500, 3);
    expect(info.saved).toBe(3500 * 3 - calculatePlanTotal(3500, 3));
    expect(normalize(info.label)).toBe('Économisez 1 260 DA');
  });

  it('mentions one free month on six months', () => {
    const info = getSavingsInfo(3500, 6);
    expect(info.saved).toBe(3500);
    expect(normalize(info.label)).toBe('1 mois offert · Économisez 3 500 DA');
  });

  it('mentions two free months on twelve months', () => {
    const info = getSavingsInfo(3500, 12);
    expect(info.saved).toBe(7000);
    expect(normalize(info.label)).toBe('2 mois offerts · Économisez 7 000 DA');
  });

  it('keeps saved consistent with calculatePlanTotal for every plan', () => {
    for (const months of [3, 6, 12]) {
      for (const { plans } of pricingCategories) {
        for (const { monthlyRate } of plans) {
          const info = getSavingsInfo(monthlyRate, months);
          expect(info.saved).toBe(
            monthlyRate * months - calculatePlanTotal(monthlyRate, months),
          );
          expect(info.saved).toBeGreaterThan(0);
        }
      }
    }
  });
});

import { describe, it, expect } from 'vitest';
import { pricingCategories } from './pricing';

const allPlans = pricingCategories.flatMap((c) => c.plans);

describe('pricingCategories', () => {
  it('exposes the four categories the Pricing section renders', () => {
    expect(pricingCategories.map((c) => c.id)).toEqual([
      'musculation_cross_training',
      'musculation_avec_crossfit',
      'pack_vip',
      'seance_libre',
    ]);
  });

  it('gives every category a name, description and at least one plan', () => {
    for (const category of pricingCategories) {
      expect(category.name.trim(), category.id).not.toBe('');
      expect(category.description.trim(), category.id).not.toBe('');
      expect(category.plans.length, category.id).toBeGreaterThan(0);
    }
  });

  it('uses unique plan ids across all categories', () => {
    const ids = allPlans.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every plan a positive integer monthlyRate', () => {
    for (const plan of allPlans) {
      expect(Number.isInteger(plan.monthlyRate), plan.id).toBe(true);
      expect(plan.monthlyRate, plan.id).toBeGreaterThan(0);
    }
  });

  it('labels every plan with a frequency and a sessions description', () => {
    for (const plan of allPlans) {
      expect(plan.frequency.trim(), plan.id).not.toBe('');
      expect(plan.sessions.trim(), plan.id).not.toBe('');
    }
  });

  it('marks at most one recommended plan per category', () => {
    for (const category of pricingCategories) {
      const recommended = category.plans.filter((p) => p.recommended);
      expect(recommended.length, category.id).toBeLessThanOrEqual(1);
    }
  });

  it('prices plans in ascending order within the recurring categories', () => {
    for (const id of ['musculation_cross_training', 'musculation_avec_crossfit']) {
      const rates = pricingCategories
        .find((c) => c.id === id)
        .plans.map((p) => p.monthlyRate);
      expect(rates, id).toEqual([...rates].sort((a, b) => a - b));
    }
  });

  it('lists non-empty benefits for the VIP plan only', () => {
    for (const plan of allPlans) {
      if (!plan.benefits) continue;
      expect(plan.id).toBe('vip_1');
      expect(plan.benefits.length).toBeGreaterThan(0);
      for (const benefit of plan.benefits) {
        expect(benefit.trim()).not.toBe('');
      }
    }
  });
});

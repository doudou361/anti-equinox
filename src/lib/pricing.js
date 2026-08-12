/**
 * Pricing calculation helpers.
 * Single source of truth — components read from these functions,
 * never from hardcoded numbers. Change the formula here and
 * every displayed price updates automatically.
 */

import { pricingCategories } from '../data/pricing';

/** Format a numeric DA amount in French locale (e.g. 25000 → "25 000 DA") */
export const formatDA = (n) =>
  new Intl.NumberFormat('fr-FR').format(n) + ' DA';

/** Nutrition products have optional prices — 0 means "ask us". */
export const formatProductPrice = (price) =>
  price > 0 ? new Intl.NumberFormat('fr-DZ').format(price) + ' DA' : 'Prix sur demande';

/** Translation key suffix used for each pricing category id. */
export const CATEGORY_KEY_BY_ID = {
  musculation_cross_training: 'muscCT',
  musculation_avec_crossfit: 'muscCF',
  pack_vip: 'vip',
  seance_libre: 'libre',
};

/** Look up a pricing category by its id. */
export const getCategory = (id) => pricingCategories.find((c) => c.id === id);

/**
 * Calculate total price for a given monthly rate and subscription duration.
 *
 * Discount rules (client-approved):
 *   1 mois  → full rate
 *   3 mois  → –12% on total (pay 2.64 months)
 *   6 mois  → pay 5, 6th free
 *  12 mois  → pay 10, 2 free
 */
export function calculatePlanTotal(monthlyRate, months) {
  switch (months) {
    case 1:  return monthlyRate;
    case 3:  return Math.round(monthlyRate * 3 * 0.88);
    case 6:  return monthlyRate * 5;
    case 12: return monthlyRate * 10;
    default: return monthlyRate * months;
  }
}

/**
 * Returns a human-readable savings label for multi-month durations,
 * or null for 1-month (no discount to highlight).
 *
 * @returns {{ saved: number, label: string } | null}
 */
export function getSavingsInfo(monthlyRate, months) {
  if (months === 1) return null;
  const full  = monthlyRate * months;
  const total = calculatePlanTotal(monthlyRate, months);
  const saved = full - total;
  switch (months) {
    case 3:  return { saved, label: `Économisez ${formatDA(saved)}` };
    case 6:  return { saved, label: `1 mois offert · Économisez ${formatDA(saved)}` };
    case 12: return { saved, label: `2 mois offerts · Économisez ${formatDA(saved)}` };
    default: return null;
  }
}

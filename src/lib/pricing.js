/**
 * Pricing calculation helpers.
 * Single source of truth — components read from these functions,
 * never from hardcoded numbers. Change the formula here and
 * every displayed price updates automatically.
 */

import { pricingCategories } from '../data/pricing.js';

/**
 * Look up a pricing category by id.
 * Throws with the offending id instead of handing back undefined, which the
 * callers would only discover as a "cannot read properties of undefined" crash
 * deep inside their JSX.
 */
export function getPricingCategory(id) {
  const category = pricingCategories.find((c) => c.id === id);
  if (!category) {
    throw new Error(
      `Unknown pricing category "${id}". Known ids: ${pricingCategories.map((c) => c.id).join(', ')}`
    );
  }
  if (!Array.isArray(category.plans) || category.plans.length === 0) {
    throw new Error(`Pricing category "${id}" has no plans defined.`);
  }
  return category;
}

/** Format a numeric DA amount in French locale (e.g. 25000 → "25 000 DA") */
export const formatDA = (n) =>
  new Intl.NumberFormat('fr-FR').format(n) + ' DA';

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

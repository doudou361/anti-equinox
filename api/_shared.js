import { pricingCategories } from '../src/data/pricing.js';
import { calculatePlanTotal } from '../src/lib/pricing.js';

export const NAME_MAX = 60;
export const PHONE_MAX = 20;
export const ALLOWED_MONTHS = [1, 3, 6, 12];
const ALLOWED_GENDERS = ['Homme', 'Femme'];

/** Google Sheets treats a leading =, +, -, @ as a formula, so neutralize it. */
export function sheetSafe(value) {
  const str = String(value ?? '');
  return /^[=+\-@\t\r]/.test(str) ? `'${str}` : str;
}

export function findPlan(planId) {
  for (const category of pricingCategories) {
    const plan = category.plans.find((p) => p.id === planId);
    if (plan) return { plan, category };
  }
  return null;
}

/**
 * Validate an incoming booking payload and resolve pricing server-side.
 * Prices are never taken from the request: they are looked up from
 * `pricingCategories` by `planId` and recomputed with `calculatePlanTotal`.
 *
 * @returns {{ error: string } | { booking: object }}
 */
export function parseBooking(body) {
  if (!body || typeof body !== 'object') return { error: 'Invalid payload.' };

  const { formData, planId, months, selectedDate, selectedTime } = body;
  if (!formData || typeof formData !== 'object') return { error: 'Invalid payload.' };

  const fullName = typeof formData.fullName === 'string' ? formData.fullName.trim() : '';
  const phone = typeof formData.phone === 'string' ? formData.phone.trim() : '';
  const gender = typeof formData.gender === 'string' ? formData.gender.trim() : '';
  const digits = phone.replace(/\D/g, '');

  if (!fullName || fullName.length > NAME_MAX) return { error: 'Invalid name.' };
  if (phone.length > PHONE_MAX || digits.length < 9 || digits.length > 15) return { error: 'Invalid phone number.' };
  if (gender && !ALLOWED_GENDERS.includes(gender)) return { error: 'Invalid gender.' };
  if (!ALLOWED_MONTHS.includes(months)) return { error: 'Invalid duration.' };

  const found = findPlan(planId);
  if (!found) return { error: 'Unknown plan.' };

  const { plan, category } = found;
  return {
    booking: {
      fullName,
      phone,
      gender: gender || '-',
      months,
      planId: plan.id,
      planName: category.name,
      planFrequency: plan.frequency,
      planSessions: plan.sessions || '-',
      total: calculatePlanTotal(plan.monthlyRate, months),
      selectedDate: typeof selectedDate === 'string' ? selectedDate.slice(0, 32) : '',
      selectedTime: typeof selectedTime === 'string' ? selectedTime.slice(0, 32) : '',
    },
  };
}

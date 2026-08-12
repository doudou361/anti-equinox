/** Minimum digits accepted for an Algerian phone number. */
const MIN_PHONE_DIGITS = 9;

const DEFAULT_MESSAGES = {
  name: 'Le nom complet est requis.',
  phoneRequired: 'Le numéro de téléphone est requis.',
  phoneInvalid: 'Numéro invalide (9 chiffres minimum).',
};

/**
 * Validate the name/phone pair shared by every WhatsApp order form.
 *
 * @param {{ name: string, phone: string }} values
 * @param {{ name?: string, phoneRequired?: string, phoneInvalid?: string }} [messages]
 * @returns {{ name?: string, phone?: string }} errors keyed by field
 */
export function validateNamePhone({ name, phone }, messages = DEFAULT_MESSAGES) {
  const msg = { ...DEFAULT_MESSAGES, ...messages };
  const errors = {};
  if (!name.trim()) errors.name = msg.name;
  if (!phone.trim()) errors.phone = msg.phoneRequired;
  else if (phone.replace(/\D/g, '').length < MIN_PHONE_DIGITS) errors.phone = msg.phoneInvalid;
  return errors;
}

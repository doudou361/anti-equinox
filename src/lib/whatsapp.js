/**
 * WhatsApp helpers — single source of truth for the club number and for
 * building/opening wa.me links.
 */

export const WA_NUMBER = '213562838455';

/** Build a wa.me link with a pre-filled message. */
export const buildWhatsAppUrl = (text) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

/** Open a pre-filled WhatsApp conversation in a new tab. */
export const openWhatsApp = (text) => window.open(buildWhatsAppUrl(text), '_blank');

/** Séance Libre — direct WhatsApp booking (not a subscription). */
export const SEANCE_LIBRE_WA_URL = buildWhatsAppUrl(
  'Bonjour 👋, je souhaite réserver une Séance Libre (500 DA) à Équinox Sports Club.'
);

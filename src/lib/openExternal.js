/**
 * External-link helpers.
 *
 * Every "send on WhatsApp" flow depends on window.open, which silently
 * returns null when a popup blocker or an in-app webview refuses the tab.
 * These helpers report that failure to the caller so the UI can show a
 * manual link instead of a success message for a message that never left.
 */

/**
 * Open a URL in a new tab.
 *
 * Note: the 'noopener' window feature is intentionally omitted — browsers
 * return null for it, which would make blocked/allowed indistinguishable.
 *
 * @param {string} url
 * @returns {boolean} true when the browser accepted the new tab
 */
export function openExternalUrl(url) {
  if (typeof url !== 'string' || url.trim() === '') {
    throw new TypeError(`openExternalUrl: expected a non-empty URL, received ${String(url)}`);
  }

  let opened;
  try {
    opened = window.open(url, '_blank');
  } catch (error) {
    console.error('openExternalUrl: window.open threw for', url, error);
    return false;
  }

  if (!opened) {
    console.warn('openExternalUrl: the browser blocked opening', url);
    return false;
  }

  opened.opener = null;
  return true;
}

/** Build a wa.me URL for a phone number and a plain-text message. */
export function buildWhatsAppUrl(phone, message) {
  if (typeof phone !== 'string' || !/^\d+$/.test(phone)) {
    throw new TypeError(`buildWhatsAppUrl: expected a digits-only phone number, received ${String(phone)}`);
  }
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Inline-style hover helpers.
 *
 * The site styles elements with inline `style` objects, so hover states are
 * applied imperatively. `hoverProps` returns the mouse handlers to spread:
 *
 *   <a style={{ color: 'var(--text-main)' }} {...goldTextHover} />
 */

/**
 * @param {object} base - styles restored on mouse leave
 * @param {object} hovered - styles applied on mouse enter
 * @returns {{ onMouseEnter: Function, onMouseLeave: Function }}
 */
export const hoverProps = (base, hovered) => ({
  onMouseEnter: (e) => Object.assign(e.currentTarget.style, hovered),
  onMouseLeave: (e) => Object.assign(e.currentTarget.style, base),
});

/** Text turns gold on hover (nav links, footer links). */
export const goldTextHover = hoverProps(
  { color: 'var(--text-main)' },
  { color: 'var(--gold-primary)' }
);

/** Muted text turns gold on hover (footer contact rows). */
export const mutedToGoldHover = hoverProps(
  { color: 'var(--text-muted)' },
  { color: 'var(--gold-primary)' }
);

/** Border turns gold on hover (contact cards). */
export const goldBorderHover = hoverProps(
  { borderColor: 'rgba(197, 160, 89, 0.15)' },
  { borderColor: 'var(--gold-primary)' }
);

/** Lift an element slightly on hover (social buttons). */
export const liftHover = hoverProps(
  { transform: 'translateY(0)' },
  { transform: 'translateY(-2px)' }
);

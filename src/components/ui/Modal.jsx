import React from 'react';
import { motion } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';

/**
 * Modal building blocks shared by every dialog on the site.
 * Accent colours read the `--theme-*` variables when a modal defines them
 * (BookingModal themes itself per gender) and fall back to the site gold.
 */

/** Full-screen blurred backdrop; clicking it closes the modal. */
export const ModalOverlay = ({
  onClose,
  zIndex = 4000,
  blur = '14px',
  backdrop = 'rgba(0,0,0,0.82)',
  style,
  children,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25 }}
    onClick={onClose}
    style={{
      position: 'fixed', inset: 0,
      backgroundColor: backdrop,
      backdropFilter: `blur(${blur})`,
      WebkitBackdropFilter: `blur(${blur})`,
      zIndex,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', overflowY: 'auto',
      ...style,
    }}
  >
    {children}
  </motion.div>
);

/** Centered dialog box; swallows clicks so the backdrop doesn't close it. */
export const ModalCard = ({ maxWidth = '500px', style, children }) => (
  <motion.div
    initial={{ scale: 0.95, opacity: 0, y: 24 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    exit={{ scale: 0.95, opacity: 0, y: 24 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
    onClick={(e) => e.stopPropagation()}
    style={{
      background: '#121212',
      border: '1px solid rgba(var(--theme-rgb, 197,160,89), 0.35)',
      borderRadius: '18px',
      width: '100%', maxWidth,
      maxHeight: '90vh', overflowY: 'auto',
      boxShadow: '0 28px 70px rgba(0,0,0,0.90), 0 0 50px rgba(var(--theme-rgb, 197,160,89), 0.07)',
      transition: 'border-color 0.4s, box-shadow 0.4s',
      ...style,
    }}
  >
    {children}
  </motion.div>
);

/** Round close button — inline in a header, or absolutely placed in a corner. */
export const ModalCloseButton = ({
  onClose,
  title,
  size = 34,
  color = '#9A948A',
  absolute = false,
  offset = '1rem',
  style,
  children,
}) => (
  <button
    onClick={onClose}
    title={title}
    aria-label={title}
    style={{
      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
      color, width: `${size}px`, height: `${size}px`, borderRadius: '50%',
      cursor: 'pointer', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.2s',
      ...(absolute ? { position: 'absolute', top: offset, right: offset, zIndex: 1 } : null),
      ...style,
    }}
    onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.color = color; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
  >
    {children ?? <X size={16} />}
  </button>
);

/** Sticky header with club tag, title, optional subtitle, back and close. */
export const ModalHeader = ({ tag, title, subtitle, onBack, backTitle, onClose, closeTitle }) => (
  <div style={{
    padding: '1.4rem 1.5rem 1rem',
    borderBottom: '1px solid rgba(var(--theme-rgb, 197,160,89), 0.15)',
    display: 'flex', alignItems: 'flex-start',
    justifyContent: 'space-between', gap: '1rem',
    position: 'sticky', top: 0, background: '#121212', zIndex: 1,
    transition: 'border-color 0.4s',
  }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', flex: 1 }}>
      {onBack && (
        <button
          onClick={onBack}
          title={backTitle}
          aria-label={backTitle}
          style={{
            background: 'none', border: 'none', color: '#9A948A',
            cursor: 'pointer', padding: '2px 0 0',
            transition: 'color 0.2s', flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--theme-primary, var(--gold-primary))')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#9A948A')}
        >
          <ArrowLeft size={18} />
        </button>
      )}
      <div>
        <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#9A948A', fontWeight: 700, margin: '0 0 0.25rem' }}>
          {tag}
        </p>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F4F4F5', margin: 0, fontFamily: 'var(--font-heading)', lineHeight: 1.2 }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: '13px', color: 'var(--theme-primary, var(--gold-primary))', margin: '0.2rem 0 0', fontWeight: 500 }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
    <ModalCloseButton onClose={onClose} title={closeTitle} />
  </div>
);

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── helpers ───────────────────────────────────────────────────────────────────

const formatPrice = (price) =>
  price > 0
    ? new Intl.NumberFormat('fr-DZ').format(price) + ' DA'
    : 'Prix sur demande';

const NAME_MAX = 60;
const PHONE_MAX = 20;

const validate = (name, phone) => {
  const errors = {};
  if (!name.trim()) errors.name = 'Le nom complet est requis.';
  else if (name.trim().length > NAME_MAX) errors.name = `Le nom ne doit pas dépasser ${NAME_MAX} caractères.`;
  const digits = phone.replace(/\D/g, '');
  if (!phone.trim()) {
    errors.phone = 'Le numéro de téléphone est requis.';
  } else if (digits.length < 9 || digits.length > 15) {
    errors.phone = 'Numéro invalide (9 à 15 chiffres).';
  }
  return errors;
};

// ── CloseIcon ─────────────────────────────────────────────────────────────────

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ── WhatsApp icon ─────────────────────────────────────────────────────────────

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// ── Input field ───────────────────────────────────────────────────────────────

const Field = ({ label, type = 'text', placeholder, value, onChange, error, maxLength }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <label
        style={{
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          color: '#9A948A',
          fontWeight: 600,
        }}
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          padding: '0.85rem 1rem',
          background: '#0A0A0A',
          border: `1px solid ${
            error
              ? '#e05555'
              : focused
              ? '#C79A61'
              : 'rgba(199,154,97,0.40)'
          }`,
          borderRadius: '8px',
          color: '#F5F1EA',
          outline: 'none',
          fontSize: '0.95rem',
          transition: 'border-color 0.2s',
          boxShadow: focused ? '0 0 0 3px rgba(199,154,97,0.12)' : 'none',
        }}
      />
      {error && (
        <span style={{ fontSize: '12px', color: '#e07070', fontWeight: 500 }}>
          {error}
        </span>
      )}
    </div>
  );
};

// ── ProductModal ──────────────────────────────────────────────────────────────

const ProductModal = ({ product, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  if (!product) return null;

  const priceLabel = formatPrice(product.price);
  const hasPrice = product.price > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(name, phone);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    const text = hasPrice
      ? `Bonjour 👋, je m'appelle ${name} et je suis intéressé(e) par ${product.name} à ${product.price} DA. Mon numéro: ${phone}`
      : `Bonjour 👋, je m'appelle ${name} et je suis intéressé(e) par ${product.name}. Mon numéro: ${phone}`;

    const url = `https://wa.me/213562838455?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="product-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          overflowY: 'auto',
        }}
      >
        {/* Modal container */}
        <motion.div
          key="product-modal-container"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#121212',
            border: '1px solid rgba(199,154,97,0.35)',
            borderRadius: '16px',
            width: '95vw',
            maxWidth: '820px',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            boxShadow:
              '0 25px 60px rgba(0,0,0,0.85), 0 0 40px rgba(199,154,97,0.08)',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
              color: '#9A948A',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              zIndex: 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#9A948A';
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            }}
          >
            <CloseIcon />
          </button>

          {/* Two-column layout — desktop: row, mobile: column */}
          <div className="product-modal-layout">
            {/* ── LEFT: product info ─────────────────────────────────────── */}
            <div className="product-modal-left">
              {/* Image */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                  maxHeight: '280px',
                  minHeight: '200px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    maxHeight: '240px',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </div>

              {/* Brand */}
              <p
                style={{
                  fontSize: '13px',
                  color: '#9A948A',
                  margin: '0 0 0.35rem',
                  fontWeight: 500,
                }}
              >
                {product.brand}
              </p>

              {/* Product name */}
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#F5F1EA',
                  margin: '0 0 0.75rem',
                  lineHeight: 1.3,
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {product.name}
              </h2>

              {/* Description */}
              <p
                style={{
                  fontSize: '13px',
                  color: '#9A948A',
                  lineHeight: 1.65,
                  margin: '0 0 1.25rem',
                }}
              >
                {product.description}
              </p>

              {/* Price */}
              <div
                style={{
                  fontSize: hasPrice ? '22px' : '16px',
                  fontWeight: 700,
                  color: '#C79A61',
                  fontFamily: hasPrice ? 'var(--font-heading)' : 'inherit',
                  letterSpacing: hasPrice ? '0.5px' : 0,
                }}
              >
                {priceLabel}
              </div>
            </div>

            {/* ── RIGHT: order form ──────────────────────────────────────── */}
            <div className="product-modal-right">
              <p
                style={{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  color: '#9A948A',
                  fontWeight: 600,
                  marginBottom: '1.25rem',
                }}
              >
                Commander
              </p>

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    padding: '1.5rem',
                    textAlign: 'center',
                    background: 'rgba(199,154,97,0.08)',
                    border: '1px solid rgba(199,154,97,0.35)',
                    borderRadius: '12px',
                    color: '#C79A61',
                    fontSize: '15px',
                    fontWeight: 600,
                    lineHeight: 1.5,
                  }}
                >
                  ✓ Votre demande a été envoyée sur WhatsApp.
                  <br />
                  <span
                    style={{
                      fontSize: '13px',
                      color: '#9A948A',
                      fontWeight: 400,
                    }}
                  >
                    Nous vous contacterons très bientôt.
                  </span>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                  noValidate
                >
                  <Field
                    label="Nom complet"
                    type="text"
                    placeholder="Ex : Mohamed Amine"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name)
                        setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    error={errors.name}
                    maxLength={NAME_MAX}
                  />
                  <Field
                    label="Numéro de téléphone"
                    type="tel"
                    placeholder="05XX XX XX XX"
                    maxLength={PHONE_MAX}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone)
                        setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    error={errors.phone}
                  />

                  {/* CTA — dominant gold button */}
                  <button
                    type="submit"
                    style={{
                      marginTop: '0.5rem',
                      width: '100%',
                      padding: '1rem 1.5rem',
                      background: '#C79A61',
                      border: 'none',
                      borderRadius: '50px',
                      color: '#0A0A0A',
                      fontWeight: 800,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.6rem',
                      transition: 'background 0.2s, transform 0.15s',
                      letterSpacing: '0.3px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#EFCC91';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#C79A61';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <WhatsAppIcon />
                    Commander{hasPrice ? ` — ${priceLabel}` : ''}
                  </button>

                  <p
                    style={{
                      textAlign: 'center',
                      fontSize: '11px',
                      color: '#9A948A',
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    Vous serez contacté via WhatsApp
                  </p>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductModal;

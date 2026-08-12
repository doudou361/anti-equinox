import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatProductPrice } from '../lib/pricing';
import { openWhatsApp } from '../lib/whatsapp';
import { validateNamePhone } from '../lib/validation';
import { WhatsAppIcon, CloseIcon } from './icons';
import Field from './ui/Field';
import { ModalOverlay, ModalCloseButton } from './ui/Modal';

// ── ProductModal ──────────────────────────────────────────────────────────────

const ProductModal = ({ product, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  if (!product) return null;

  const priceLabel = formatProductPrice(product.price);
  const hasPrice = product.price > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validateNamePhone({ name, phone });
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    const text = hasPrice
      ? `Bonjour 👋, je m'appelle ${name} et je suis intéressé(e) par ${product.name} à ${product.price} DA. Mon numéro: ${phone}`
      : `Bonjour 👋, je m'appelle ${name} et je suis intéressé(e) par ${product.name}. Mon numéro: ${phone}`;

    openWhatsApp(text);
    setSent(true);
  };

  return (
    <AnimatePresence>
      <ModalOverlay
        key="product-modal-backdrop"
        onClose={onClose}
        zIndex={3000}
        blur="12px"
        backdrop="rgba(0,0,0,0.75)"
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
          <ModalCloseButton onClose={onClose} title="Fermer" size={36} absolute>
            <CloseIcon />
          </ModalCloseButton>

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
                  />
                  <Field
                    label="Numéro de téléphone"
                    type="tel"
                    placeholder="05XX XX XX XX"
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
      </ModalOverlay>
    </AnimatePresence>
  );
};

export default ProductModal;

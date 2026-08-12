import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { MAPS_URL, MAPS_EMBED_URL, PHONE_HREF, SOCIAL_LINKS } from '../lib/contact';
import { goldBorderHover, liftHover } from '../lib/hover';
import { SocialIcon } from './icons';
import { ModalOverlay, ModalCloseButton } from './ui/Modal';

const contactCardStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '0.85rem 1.25rem',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(197, 160, 89, 0.15)',
  borderRadius: '12px',
  color: 'var(--text-main)',
  textDecoration: 'none',
  transition: 'all 0.3s'
};

const socialButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.75rem 1.5rem',
  color: '#fff',
  textDecoration: 'none',
  borderRadius: '12px',
  fontWeight: 600,
  fontSize: '1rem',
  transition: 'transform 0.2s'
};

const ContactModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', phone: '', message: '' });
      onClose();
    }, 2500);
  };

  return (
    <ModalOverlay
      onClose={onClose}
      zIndex={2000}
      blur="8px"
      backdrop="rgba(0, 0, 0, 0.85)"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass"
        style={{
          width: '100%',
          maxWidth: '1050px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '24px',
          padding: '2.5rem',
          border: '1px solid rgba(197, 160, 89, 0.3)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.8), 0 0 30px rgba(197, 160, 89, 0.15)',
          position: 'relative'
        }}
      >
        <ModalCloseButton
          onClose={onClose}
          title={t('bookingModal.close')}
          size={40}
          color="var(--text-muted)"
          absolute
          offset="1.25rem"
          style={{ fontSize: '1.25rem' }}
        >
          ✕
        </ModalCloseButton>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--gold-primary)', letterSpacing: '1px', marginBottom: '0.5rem' }}>
            {t('contactModal.title')}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            {t('contactModal.subtitle')}
          </p>
        </div>

        {/* Main 2-Column Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Left Column: Info & Message Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Quick Contact Badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a 
                href={MAPS_URL}
                target="_blank" 
                rel="noreferrer"
                style={contactCardStyle}
                {...goldBorderHover}
              >
                <span style={{ fontSize: '1.5rem', color: 'var(--gold-primary)' }}>📍</span>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('contactModal.addressLabel')}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{t('contactModal.addressText')}</div>
                </div>
              </a>

              <a 
                href={PHONE_HREF}
                style={contactCardStyle}
                {...goldBorderHover}
              >
                <span style={{ fontSize: '1.5rem', color: 'var(--gold-primary)' }}>📞</span>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('contactModal.phoneLabel')}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--gold-primary)' }}>{t('contactModal.phoneText')}</div>
                </div>
              </a>
            </div>

            {/* Form */}
            {submitted ? (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                background: 'rgba(197, 160, 89, 0.1)',
                border: '1px solid var(--gold-primary)',
                borderRadius: '16px',
                color: 'var(--gold-primary)'
              }}>
                ✓ {t('contactModal.sentSuccess')}
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ color: 'var(--text-main)', margin: 0, fontSize: '1.1rem' }}>{t('contactModal.formTitle')}</h4>
                
                <input 
                  type="text" 
                  required
                  placeholder={t('contactModal.namePlaceholder')}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    padding: '0.85rem 1rem',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.95rem'
                  }}
                />

                <input 
                  type="tel" 
                  required
                  placeholder={t('contactModal.phonePlaceholder')}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    padding: '0.85rem 1rem',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.95rem'
                  }}
                />

                <textarea 
                  rows="3"
                  required
                  placeholder={t('contactModal.messagePlaceholder')}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    padding: '0.85rem 1rem',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.95rem',
                    resize: 'none'
                  }}
                />

                <button type="submit" className="btn-glow" style={{ padding: '0.85rem', width: '100%', fontSize: '1rem' }}>
                  {t('contactModal.sendBtn')}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Square Embedded Google Map */}
          <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(197, 160, 89, 0.3)',
            minHeight: '320px',
            position: 'relative',
            background: 'rgba(0,0,0,0.5)'
          }}>
            <iframe 
              title="Equinox Sports Club Location"
              src={MAPS_EMBED_URL}
              width="100%" 
              height="100%" 
              style={{ border: 0, minHeight: '320px', filter: 'brightness(0.9) contrast(1.1)' }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Bottom Social Media Bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {t('contactModal.followUs')}
          </div>
          
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                style={{ ...socialButtonStyle, background: link.background, boxShadow: link.shadow }}
                {...liftHover}
              >
                <SocialIcon network={link.network} />
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </ModalOverlay>
  );
};

export default ContactModal;

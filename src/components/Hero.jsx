import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Hero = ({ onBookClick }) => {
  const { t } = useLanguage();

  return (
    <section id="hero" style={{
      position: 'relative',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      {/* Background Image with Overlay */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1
        }} 
      />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, rgba(7,7,9,0.7) 0%, rgba(7,7,9,0.4) 50%, rgba(7,7,9,1) 100%)',
        zIndex: 2
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 3,
        textAlign: 'center',
        padding: '0 2rem',
        maxWidth: '800px'
      }}>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            color: 'var(--gold-primary)',
            letterSpacing: '4px',
            fontWeight: 600,
            textTransform: 'uppercase',
            marginBottom: '1rem',
            fontSize: '1rem'
          }}
        >
          {t('hero.tagline')}
        </motion.p>
        
        <motion.h1 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          style={{
            color: 'var(--text-main)',
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: '2.5rem',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-heading)'
          }}
        >
          {t('hero.title1')} <span className="text-gold">{t('hero.title2')}</span>
        </motion.h1>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}
        >
          <button className="btn-primary" onClick={onBookClick} style={{ padding: '1.25rem 3rem', fontSize: '1.125rem' }}>
            {t('hero.cta')}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

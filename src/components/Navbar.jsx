import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Navbar = ({ onBookClick, onContactClick, onNutritionClick, onHomeClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lang, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: '1rem 2rem',
          transition: 'all 0.3s ease',
          backgroundColor: isScrolled ? 'rgba(7, 7, 9, 0.95)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(10px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(212, 175, 55, 0.1)' : 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* ── 3-column desktop layout: logo | links (center) | actions ── */}
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '1rem' }}>

          {/* Logo — left */}
          <div style={{ flexShrink: 0 }}>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onHomeClick?.(); }}
              style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            >
              <img
                src="/logo.png"
                alt="Equinox Sports Club"
                style={{
                  height: '95px',
                  objectFit: 'contain',
                  transform: 'scale(1.3)',
                  transformOrigin: 'left center'
                }}
              />
            </a>
          </div>

          {/* Nav links — true center */}
          <div
            className="desktop-menu"
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '2rem'
            }}
          >
            <a href="#schedule"
              style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem', transition: 'color 0.3s', whiteSpace: 'nowrap' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-main)'}
            >
              {t('nav.schedule')}
            </a>
            <a href="#pricing"
              style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem', transition: 'color 0.3s', whiteSpace: 'nowrap' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-main)'}
            >
              {t('nav.pricing')}
            </a>
            <button
              onClick={onNutritionClick}
              style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontWeight: 500, fontSize: '0.95rem', cursor: 'pointer', transition: 'color 0.3s', whiteSpace: 'nowrap', padding: 0 }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-main)'}
            >
              Nutrition
            </button>
            <button
              onClick={onContactClick}
              style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontWeight: 500, fontSize: '0.95rem', cursor: 'pointer', transition: 'color 0.3s', whiteSpace: 'nowrap', padding: 0 }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-main)'}
            >
              {t('nav.contact')}
            </button>
          </div>

          {/* Actions — right */}
          <div
            className="desktop-menu"
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}
          >
            {/* Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              style={{
                background: 'rgba(197, 160, 89, 0.1)',
                border: '1px solid var(--gold-primary)',
                color: 'var(--gold-primary)',
                borderRadius: '20px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.3s'
              }}
            >
              <span>🌐</span>
              <span>{lang === 'fr' ? 'FR | EN' : 'EN | FR'}</span>
            </button>

            <button className="btn-primary" onClick={onBookClick} style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
              {t('nav.bookNow')}
            </button>
          </div>
        </div>

        {/* Mobile Menu Right Group */}
        <div style={{ alignItems: 'center', gap: '1rem' }} className="mobile-only-group">
          {/* Mobile Language Switcher */}
          <button 
            onClick={toggleLanguage}
            className="mobile-lang-btn"
            style={{
              background: 'rgba(197, 160, 89, 0.15)',
              border: '1px solid var(--gold-primary)',
              color: 'var(--gold-primary)',
              borderRadius: '15px',
              padding: '0.3rem 0.65rem',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {lang.toUpperCase()}
          </button>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: 0,
          right: 0,
          backgroundColor: 'var(--bg-card)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
          zIndex: 999,
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
        }}>
          <a href="#schedule" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '1.25rem', fontWeight: 500 }}>
            {t('nav.schedule')}
          </a>
          <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '1.25rem', fontWeight: 500 }}>
            {t('nav.pricing')}
          </a>
          <a href="#products" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '1.25rem', fontWeight: 500 }}>
            {t('nav.products')}
          </a>
          <button
            onClick={() => { setIsMobileMenuOpen(false); onNutritionClick?.(); }}
            style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '1.25rem', fontWeight: 500, cursor: 'pointer' }}
          >
            Nutrition
          </button>
          <button 
            onClick={() => { setIsMobileMenuOpen(false); onContactClick(); }} 
            style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '1.25rem', fontWeight: 500, cursor: 'pointer' }}
          >
            {t('nav.contact')}
          </button>
          
          <button 
            onClick={() => { toggleLanguage(); }}
            style={{
              background: 'rgba(197, 160, 89, 0.1)',
              border: '1px solid var(--gold-primary)',
              color: 'var(--gold-primary)',
              borderRadius: '20px',
              padding: '0.5rem 1.25rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Langue: {lang === 'fr' ? 'Français 🇫🇷' : 'English 🇬🇧'}
          </button>

          <button className="btn-primary" onClick={() => { setIsMobileMenuOpen(false); onBookClick(); }} style={{ width: '100%', padding: '1rem' }}>
            {t('nav.bookNow')}
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;

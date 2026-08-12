import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { NUTRITION_ENABLED } from '../config/features';
import { goldTextHover } from '../lib/hover';
import { MenuIcon, CloseIcon } from './icons';

// ── Nav items ─────────────────────────────────────────────────────────────

const desktopItemStyle = {
  color: 'var(--text-main)', fontWeight: 500, fontSize: '0.95rem',
  transition: 'color 0.3s', whiteSpace: 'nowrap',
};

const mobileItemStyle = {
  color: 'var(--text-main)', fontSize: '1.25rem', fontWeight: 500,
};

const langPillStyle = {
  background: 'rgba(197, 160, 89, 0.1)',
  border: '1px solid var(--gold-primary)',
  color: 'var(--gold-primary)',
  borderRadius: '20px',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const NavLink = ({ href, children }) => (
  <a href={href} style={{ ...desktopItemStyle, textDecoration: 'none' }} {...goldTextHover}>
    {children}
  </a>
);

const NavButton = ({ onClick, id, children }) => (
  <button
    onClick={onClick}
    id={id}
    style={{ ...desktopItemStyle, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
    {...goldTextHover}
  >
    {children}
  </button>
);

const MobileLink = ({ href, onClick, children }) => (
  <a href={href} onClick={onClick} style={{ ...mobileItemStyle, textDecoration: 'none' }}>
    {children}
  </a>
);

const MobileButton = ({ onClick, children }) => (
  <button
    onClick={onClick}
    style={{ ...mobileItemStyle, background: 'none', border: 'none', cursor: 'pointer' }}
  >
    {children}
  </button>
);

const Navbar = ({ onBookClick, onContactClick, onCrossfitClick, onNutritionClick, onHomeClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lang, toggleLanguage, t } = useLanguage();
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

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
          zIndex: 1000,
          padding: '1rem 0',
          transition: 'all 0.3s ease',
          backgroundColor: isScrolled ? 'rgba(7, 7, 9, 0.95)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(10px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(212, 175, 55, 0.1)' : 'none',
        }}
      >
        {/* ── 3-column desktop layout: logo | links (center) | actions ── */}
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
            <NavLink href="#schedule">{t('nav.schedule')}</NavLink>
            <NavLink href="#pricing">{t('nav.pricing')}</NavLink>
            {NUTRITION_ENABLED && <NavButton onClick={onNutritionClick}>Nutrition</NavButton>}
            <NavLink href="#team">{t('nav.team')}</NavLink>
            <NavButton onClick={onCrossfitClick} id="btn-crossfit-schedule">
              {t('nav.crossfitSchedule')}
            </NavButton>
            <NavButton onClick={onContactClick}>{t('nav.contact')}</NavButton>
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
                ...langPillStyle,
                padding: '0.35rem 0.85rem',
                fontSize: '0.85rem',
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
              ...langPillStyle,
              background: 'rgba(197, 160, 89, 0.15)',
              borderRadius: '15px',
              padding: '0.3rem 0.65rem',
              fontSize: '0.8rem',
            }}
          >
            {lang.toUpperCase()}
          </button>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <CloseIcon size={28} /> : <MenuIcon size={28} />}
          </button>
        </div>
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
          <MobileLink href="#schedule" onClick={closeMobileMenu}>{t('nav.schedule')}</MobileLink>
          <MobileLink href="#pricing" onClick={closeMobileMenu}>{t('nav.pricing')}</MobileLink>
          <MobileLink href="#products" onClick={closeMobileMenu}>{t('nav.products')}</MobileLink>
          {NUTRITION_ENABLED && (
            <MobileButton onClick={() => { closeMobileMenu(); onNutritionClick?.(); }}>
              Nutrition
            </MobileButton>
          )}
          <MobileLink href="#team" onClick={closeMobileMenu}>{t('nav.team')}</MobileLink>
          <MobileButton onClick={() => { closeMobileMenu(); onCrossfitClick(); }}>
            {t('nav.crossfitSchedule')}
          </MobileButton>
          <MobileButton onClick={() => { closeMobileMenu(); onContactClick(); }}>
            {t('nav.contact')}
          </MobileButton>
          
          <button 
            onClick={() => { toggleLanguage(); }}
            style={{ ...langPillStyle, padding: '0.5rem 1.25rem', fontSize: '1rem' }}
          >
            Langue: {lang === 'fr' ? 'Français 🇫🇷' : 'English 🇬🇧'}
          </button>

          <button className="btn-primary" onClick={() => { closeMobileMenu(); onBookClick(); }} style={{ width: '100%', padding: '1rem' }}>
            {t('nav.bookNow')}
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;

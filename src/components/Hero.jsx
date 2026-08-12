import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);
  
  // Media carousel state: 'video' -> 0 -> 1 -> 2 -> ... -> 16 -> 'video'
  const [mediaPhase, setMediaPhase] = useState('video');
  const videoRef = useRef(null);

  const IMAGES = Array.from({length: 17}, (_, i) => `/media/slide-${i+1}.jpg.jpg`);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize phase
  useEffect(() => {
    if (isMobile) {
      setMediaPhase(0); // skip video entirely on mobile
    } else {
      setMediaPhase('video');
    }
  }, [isMobile]);

  // Handle image timer
  useEffect(() => {
    let timer;
    if (typeof mediaPhase === 'number') {
      timer = setTimeout(() => {
        if (mediaPhase < IMAGES.length - 1) {
          setMediaPhase(mediaPhase + 1);
        } else {
          // loop back to video on desktop, or back to 0 on mobile
          setMediaPhase(isMobile ? 0 : 'video');
        }
      }, 5000); // 5 seconds per image
    }
    return () => clearTimeout(timer);
  }, [mediaPhase, IMAGES.length, isMobile]);

  // Handle video auto-play when switching back to video
  useEffect(() => {
    if (mediaPhase === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(e => console.log('Auto-play prevented:', e));
    }
  }, [mediaPhase]);

  const handleVideoEnded = () => {
    setMediaPhase(0);
  };

  return (
    <section id="hero" style={{
      position: 'relative',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      {/* Background Media */}
      <AnimatePresence mode="popLayout">
        {mediaPhase === 'video' && !isMobile ? (
          <motion.video
            key="video"
            ref={videoRef}
            src="/media/equinox-hero.mp4.mp4"
            poster="/hero-bg.jpg"
            muted
            playsInline
            onEnded={handleVideoEnded}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              objectFit: 'cover', zIndex: 1
            }}
          />
        ) : (
          <motion.div
            key={`img-${mediaPhase}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${IMAGES[mediaPhase]})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              zIndex: 1
            }}
          />
        )}
      </AnimatePresence>

      {/* Overlay gradient to ensure text readability */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, rgba(7,7,9,0.7) 0%, rgba(7,7,9,0.3) 50%, rgba(7,7,9,1) 100%)',
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
            fontSize: '1rem',
            textShadow: '0 2px 10px rgba(0,0,0,0.8)'
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
            fontFamily: 'var(--font-heading)',
            textShadow: '0 4px 20px rgba(0,0,0,0.9)'
          }}
        >
          {t('hero.title1')} <span className="text-gold">{t('hero.title2')}</span>
        </motion.h1>
      </div>
    </section>
  );
};

export default Hero;

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();
  
  // Media carousel state: 'video' -> 0 -> 1 -> 2 -> ... -> 16 -> 'video'
  const [mediaPhase, setMediaPhase] = useState('video');
  
  // Separate refs for desktop and mobile videos
  const desktopVideoRef = useRef(null);
  const mobileVideoRef = useRef(null);

  const IMAGES = Array.from({length: 17}, (_, i) => `/media/slide-${i+1}.jpg.jpg`);

  // Handle image timer
  useEffect(() => {
    let timer;
    if (typeof mediaPhase === 'number') {
      timer = setTimeout(() => {
        if (mediaPhase < IMAGES.length - 1) {
          setMediaPhase(mediaPhase + 1);
        } else {
          // loop back to video
          setMediaPhase('video');
        }
      }, 5000); // 5 seconds per image
    }
    return () => clearTimeout(timer);
  }, [mediaPhase, IMAGES.length]);

  // Handle video auto-play when switching back to video phase
  useEffect(() => {
    if (mediaPhase === 'video') {
      if (desktopVideoRef.current) {
        desktopVideoRef.current.currentTime = 0;
        desktopVideoRef.current.play().catch(e => console.log('Auto-play prevented (desktop):', e));
      }
      if (mobileVideoRef.current) {
        mobileVideoRef.current.currentTime = 0;
        mobileVideoRef.current.play().catch(e => console.log('Auto-play prevented (mobile):', e));
      }
    }
  }, [mediaPhase]);

  const handleVideoEnded = () => {
    // Both videos are roughly the same length, just advance when the first one ends
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
        {mediaPhase === 'video' ? (
          <motion.div
            key="video-container"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1
            }}
          >
            {/* Desktop Video */}
            <div className="desktop-video" style={{ width: '100%', height: '100%' }}>
              <video
                ref={desktopVideoRef}
                src="/media/equinox-hero.mp4.mp4"
                poster="/media/hero-poster-desktop.jpg"
                muted
                playsInline
                preload="none"
                autoPlay
                onEnded={handleVideoEnded}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            
            {/* Mobile Video */}
            <div className="mobile-video" style={{ width: '100%', height: '100%' }}>
              <video
                ref={mobileVideoRef}
                src="/media/equinox-hero-mobile.mp4"
                poster="/media/hero-poster-mobile.jpg"
                muted
                playsInline
                preload="none"
                autoPlay
                onEnded={handleVideoEnded}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </motion.div>
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
      <div className="container" style={{ position: 'relative', zIndex: 3, display: 'flex', justifyContent: 'center' }}>
        <div style={{
          textAlign: 'center',
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
      </div>
    </section>
  );
};

export default Hero;

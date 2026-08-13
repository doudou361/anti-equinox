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

  // Handle video auto-play when switching back to video phase.
  // When every video is refused (autoplay policy, decode error) the 'ended'
  // event never fires, so fall through to the image carousel instead of
  // leaving the hero frozen on a poster forever.
  useEffect(() => {
    if (mediaPhase !== 'video') return;

    let cancelled = false;
    const attempts = [
      ['desktop', desktopVideoRef.current],
      ['mobile', mobileVideoRef.current],
    ].filter(([, video]) => video !== null);

    if (attempts.length === 0) return;

    const plays = attempts.map(([label, video]) => {
      video.currentTime = 0;
      return video.play().catch((error) => {
        console.warn(`Hero video playback failed (${label}):`, error);
        return false;
      });
    });

    Promise.all(plays).then((results) => {
      if (cancelled) return;
      if (results.every((result) => result === false)) setMediaPhase(0);
    });

    return () => { cancelled = true; };
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
          maxWidth: '800px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            color: 'var(--gold-primary)',
            letterSpacing: '4px',
            fontWeight: 600,
            textTransform: 'uppercase',
            fontSize: '1rem',
            textShadow: '0 2px 10px rgba(0,0,0,0.8)'
          }}>
            {t('hero.tagline').split(' ').map((word, i, arr) => {
              // Calculate a circle off-screen for the starting position
              const angle1 = (i / arr.length) * Math.PI * 2;
              const angle2 = angle1 + Math.PI; // Opposite side for cycle effect
              return (
                <motion.span
                  key={`tagline-${i}`}
                  custom={i}
                  initial={{ 
                    opacity: 0, 
                    x: Math.cos(angle1) * 300, 
                    y: Math.sin(angle1) * 300,
                    scale: 0,
                    rotate: 180
                  }}
                  animate={{
                    opacity: [0, 1, 1, 1],
                    x: [Math.cos(angle1) * 300, Math.cos(angle2) * 150, 0],
                    y: [Math.sin(angle1) * 300, Math.sin(angle2) * 150, 0],
                    scale: [0, 1.5, 1],
                    rotate: [180, -45, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: 0.2 + (i * 0.15),
                    times: [0, 0.6, 1],
                    ease: "easeInOut"
                  }}
                  style={{ display: 'inline-block' }}
                >
                  {word}
                </motion.span>
              );
            })}
          </div>
        
          <h1 style={{
            color: 'var(--text-main)',
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: '2.5rem',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-heading)',
            textShadow: '0 4px 20px rgba(0,0,0,0.9)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem'
          }}>
            {`${t('hero.title1')} ${t('hero.title2')}`.split(' ').map((word, i) => {
              let initialProps = { opacity: 0, x: 0, y: 0 };
              if (i % 3 === 0) initialProps = { opacity: 0, x: -200, y: 0 }; // Left
              else if (i % 3 === 1) initialProps = { opacity: 0, x: 200, y: 0 }; // Right
              else if (i % 3 === 2) initialProps = { opacity: 0, x: 0, y: 200 }; // Below
              
              // Paint the words from title2 as gold (title2 is usually the last word(s))
              // For simplicity, just color the last word gold, as was done originally
              const totalWords = `${t('hero.title1')} ${t('hero.title2')}`.split(' ').length;
              const isGold = i === totalWords - 1;

              return (
                <motion.span
                  key={`title-${i}`}
                  initial={initialProps}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{
                    duration: 1,
                    delay: 1.5 + (i * 0.2), // Start after the tagline finishes its orbit
                    type: 'spring',
                    bounce: 0.4
                  }}
                  className={isGold ? "text-gold" : ""}
                  style={{ display: 'inline-block' }}
                >
                  {word}
                </motion.span>
              );
            })}
          </h1>
        </div>
      </div>
    </section>
  );
};

export default Hero;

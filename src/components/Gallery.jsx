import React from 'react';
import { motion } from 'framer-motion';

const IMAGES = Array.from({length: 14}, (_, i) => `/media/slide-${i+1}.jpg.jpg`);

const Gallery = () => {
  return (
    <section id="gallery" style={{ padding: '6rem 2rem', backgroundColor: '#070709', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <p style={{ color: 'var(--gold-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Discover Our Gym
          </p>
          <h2 style={{ fontSize: '2.5rem', color: '#F4F4F5', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>
            L'Élégance de l'Effort
          </h2>
        </motion.div>

        {/* CSS Grid Masonry-style Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
          gridAutoRows: '250px'
        }}>
          {IMAGES.map((img, idx) => {
            // Make some images span 2 rows for a masonry effect
            const isTall = idx % 5 === 0;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (idx % 4) * 0.1 }}
                style={{
                  gridRow: isTall ? 'span 2' : 'span 1',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#121212',
                }}
              >
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url(${img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform 0.5s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Gallery;

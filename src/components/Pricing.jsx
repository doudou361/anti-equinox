import React from 'react';
import { motion } from 'framer-motion';
import { pricingCategories } from '../data/pricing';
import { useLanguage } from '../context/LanguageContext';

const getIconForCategory = (id) => {
  switch(id) {
    case 'musculation_cross_training':
    case 'musculation_avec_crossfit':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>
      );
    case 'pack_promo':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect width="20" height="5" x="2" y="7"/><line x1="12" x2="12" y1="22" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
      );
    case 'pack_vip':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
      );
    case 'student':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.42 10.922a2 2 0 0 1-.01 2.833l-7.1 7.1a2 2 0 0 1-2.827 0l-7.1-7.1a2 2 0 0 1-.01-2.833L12 2.29l9.42 8.632z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
      );
  }
};

const Pricing = ({ onBookClick }) => {
  const { lang, t } = useLanguage();

  return (
    <section id="pricing" style={{ padding: '6rem 2rem', backgroundColor: 'var(--bg-card)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <h2 style={{ fontSize: '3rem', color: 'var(--text-main)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
            {t('pricing.title')}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            {t('pricing.subtitle')}
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          alignItems: 'stretch'
        }}>
          {pricingCategories.map((cat, idx) => (
            <motion.div 
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ scale: 1.02, borderColor: 'var(--gold-primary)', boxShadow: '0 10px 30px rgba(197,160,89,0.15)' }}
              className="glass" 
              style={{
                position: 'relative',
                padding: '3rem 2rem',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                opacity: 0.03,
                backgroundImage: 'url(/hero-bg.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 0,
                pointerEvents: 'none'
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ color: 'var(--gold-primary)' }}>
                    {getIconForCategory(cat.id)}
                  </div>
                  <h3 style={{ color: 'var(--text-main)', fontSize: '1.8rem', margin: 0, lineHeight: 1.1 }}>{cat.name}</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.5 }}>
                  {cat.description}
                </p>
                
                {cat.plans && cat.plans.length > 0 && (
                  <div style={{ marginBottom: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                    <span style={{ color: 'var(--gold-primary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                      {lang === 'fr' ? `À partir de ${cat.plans[0].price}` : `Starting at ${cat.plans[0].price}`}
                    </span>
                  </div>
                )}
              </div>
              
              <button 
                className="btn-glow" 
                onClick={() => onBookClick(cat)}
                style={{ 
                  width: '100%', 
                  position: 'relative', 
                  zIndex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem'
                }}>
                {lang === 'fr' ? 'RÉSERVEZ' : 'BOOK NOW'}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Pricing;

import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { scheduleData } from '../data/schedule';
import { useLanguage } from '../context/LanguageContext';

const CrossfitScheduleModal = ({ onClose }) => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.82)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        zIndex: 4000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem', overflowY: 'auto'
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 24 }}
        animate={{ scale: 1,    opacity: 1, y: 0  }}
        exit={   { scale: 0.95, opacity: 0, y: 24 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#121212',
          border: '1px solid rgba(197,160,89, 0.35)',
          borderRadius: '18px',
          width: '100%', maxWidth: '400px',
          maxHeight: '90vh', overflowY: 'auto',
          boxShadow: '0 28px 70px rgba(0,0,0,0.90), 0 0 50px rgba(197,160,89, 0.07)'
        }}
      >
        <div style={{
          padding: '1.4rem 1.5rem 1rem',
          borderBottom: '1px solid rgba(197,160,89, 0.15)',
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', gap: '1rem',
          position: 'sticky', top: 0, background: '#121212', zIndex: 1
        }}>
          <div>
            <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#9A948A', fontWeight: 700, margin: '0 0 0.25rem' }}>
              Équinox Sports Club
            </p>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F4F4F5', margin: 0, fontFamily: 'var(--font-heading)', lineHeight: 1.2 }}>
              {t('nav.crossfitSchedule')}
            </h2>
          </div>
          <button
            onClick={onClose}
            title={t('bookingModal.close')}
            style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
              color: '#9A948A', width: '34px', height: '34px', borderRadius: '50%',
              cursor: 'pointer', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#9A948A'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {scheduleData.crossfit.map((item, idx) => {
            const dayKey = item.day.toLowerCase();
            const translatedDay = t(`schedule.days.${dayKey === 'samedi' ? 'saturday' : dayKey === 'lundi' ? 'monday' : 'wednesday'}`);
            
            return (
              <div key={idx} style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '12px', padding: '1rem',
              }}>
                <h3 style={{ 
                  color: 'var(--gold-primary)', 
                  fontSize: '1.1rem', 
                  margin: '0 0 0.8rem',
                  display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                  <span style={{ 
                    display: 'inline-block', width: '6px', height: '6px', 
                    borderRadius: '50%', backgroundColor: 'var(--gold-primary)' 
                  }} />
                  {translatedDay}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem' }}>
                  {item.times.map((time, tIdx) => (
                    <div key={tIdx} style={{
                      color: 'var(--text-main)', fontSize: '0.9rem',
                      background: 'rgba(197,160,89, 0.08)', border: '1px solid rgba(197,160,89, 0.2)',
                      padding: '0.4rem', borderRadius: '6px', textAlign: 'center', fontWeight: 600
                    }}>
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CrossfitScheduleModal;

import React from 'react';
import { scheduleData } from '../data/schedule';
import { useLanguage } from '../context/LanguageContext';
import { ModalOverlay, ModalCard, ModalHeader } from './ui/Modal';

/** Crossfit sessions only run on these three days. */
const DAY_KEYS = { samedi: 'saturday', lundi: 'monday', mercredi: 'wednesday' };

const CrossfitScheduleModal = ({ onClose }) => {
  const { t } = useLanguage();

  return (
    <ModalOverlay onClose={onClose}>
      <ModalCard maxWidth="400px">
        <ModalHeader
          tag="Équinox Sports Club"
          title={t('nav.crossfitSchedule')}
          onClose={onClose}
          closeTitle={t('bookingModal.close')}
        />

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {scheduleData.crossfit.map((item, idx) => {
            const translatedDay = t(`schedule.days.${DAY_KEYS[item.day.toLowerCase()]}`);
            
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.4rem', paddingLeft: '0.5rem' }}>
                  {item.times.map((time, tIdx) => (
                    <div key={tIdx} style={{
                      display: 'flex', justifyContent: 'space-between',
                      color: 'var(--text-main)', fontSize: '0.95rem',
                      padding: '0.4rem 0.8rem', borderRadius: '6px', fontWeight: 500,
                      background: 'rgba(255,255,255,0.02)'
                    }}>
                      <span style={{ color: '#9A948A' }}>Groupe {tIdx + 1}</span>
                      <span style={{ color: 'var(--gold-primary)', fontWeight: 700 }}>{time}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ModalCard>
    </ModalOverlay>
  );
};

export default CrossfitScheduleModal;

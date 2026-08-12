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
      </ModalCard>
    </ModalOverlay>
  );
};

export default CrossfitScheduleModal;

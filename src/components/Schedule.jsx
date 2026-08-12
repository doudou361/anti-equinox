import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { scheduleData } from '../data/schedule';
import { useLanguage } from '../context/LanguageContext';
import SectionHeader from './ui/SectionHeader';

const Schedule = () => {
  const [activeTab, setActiveTab] = useState('hommes'); // 'hommes', 'femmes'
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <section id="schedule" style={{ padding: '6rem 2rem', backgroundColor: 'var(--bg-dark)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <SectionHeader title={t('schedule.title')} subtitle={t('schedule.subtitle')} />

        {/* Custom Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1.5rem',
          marginBottom: '3rem',
          flexWrap: 'wrap'
        }}>
          {['hommes', 'femmes'].map((tab) => {
            const isFemme = tab === 'femmes';
            const activeBg = isFemme ? 'var(--pink-accent)' : 'var(--gold-gradient)';
            const activeGlow = isFemme ? '0 4px 15px rgba(255, 182, 193, 0.4)' : '0 4px 15px rgba(212, 175, 55, 0.3)';
            const label = isFemme ? t('schedule.tabWomen') : t('schedule.tabMen');

            return (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: activeTab === tab ? activeBg : 'transparent',
                  color: activeTab === tab ? '#000' : 'var(--text-main)',
                  border: `1px solid ${activeTab === tab ? 'transparent' : (isFemme ? 'rgba(255, 182, 193, 0.3)' : 'rgba(212, 175, 55, 0.3)')}`,
                  padding: '0.85rem 2.5rem',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s ease',
                  boxShadow: activeTab === tab ? activeGlow : 'none'
                }}
              >
                {label}
              </motion.button>
            );
          })}
        </div>

        {/* Schedule Grid */}
        <motion.div 
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="glass" 
          style={{
            padding: '3rem',
            borderRadius: '16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}
        >
          {scheduleData[activeTab].map((item, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                paddingBottom: '1.5rem'
              }}
            >
              <h3 style={{ 
                color: activeTab === 'femmes' ? 'var(--pink-accent)' : 'var(--gold-primary)', 
                fontSize: '1.4rem', 
                marginBottom: '1rem' 
              }}>
                {item.day}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {item.times.map((time, tIdx) => (
                  <div key={tIdx} style={{
                    color: 'var(--text-main)',
                    fontSize: '1.05rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <span style={{ 
                      display: 'inline-block', 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: activeTab === 'femmes' ? 'var(--pink-accent)' : 'var(--gold-primary)' 
                    }} />
                    {time}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Schedule;

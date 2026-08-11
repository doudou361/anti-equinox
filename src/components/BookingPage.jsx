import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pricingCategories } from '../data/pricing';
import { useLanguage } from '../context/LanguageContext';

const BookingPage = ({ onClose, preselectedCategory }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for back
  const [selections, setSelections] = useState({
    gender: null,
    category: preselectedCategory || null,
    plan: null,
    fullName: '',
    phone: ''
  });

  // Reset state when page loads with a new preselected category
  useEffect(() => {
    setStep(1);
    setDirection(1);
    setSelections(prev => ({
      ...prev,
      category: preselectedCategory || null,
      plan: null,
      fullName: '',
      phone: ''
    }));
  }, [preselectedCategory]);

  const navigate = (newStep, dir) => {
    setDirection(dir);
    setStep(newStep);
  };

  const handleSelect = (field, value) => {
    setSelections(prev => ({ ...prev, [field]: value }));
  };

  const selectPlanAndProceed = (cat, plan) => {
    handleSelect('category', cat);
    handleSelect('plan', plan);
    navigate(3, 1);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  const isFemale = selections.gender === 'Femmes';
  const accentColor = isFemale ? 'var(--pink-accent)' : 'var(--gold-primary)';
  const btnClass = isFemale ? 'btn-glow-pink' : 'btn-glow';

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                {t('bookingModal.step1Title')}
              </h2>
              <p style={{ color: 'var(--text-muted)' }}>{t('bookingModal.step1Subtitle')}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              {['Hommes', 'Femmes'].map(gender => {
                const label = gender === 'Femmes' ? t('bookingModal.womenCard') : t('bookingModal.menCard');
                return (
                  <motion.div
                    key={gender}
                    whileHover={{ scale: 1.03, borderColor: gender === 'Femmes' ? 'var(--pink-accent)' : 'var(--gold-primary)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      handleSelect('gender', gender);
                      if (preselectedCategory && preselectedCategory.plans.length === 1) {
                        handleSelect('plan', preselectedCategory.plans[0]);
                        navigate(3, 1);
                      } else {
                        navigate(2, 1);
                      }
                    }}
                    style={{
                      padding: '3.5rem 1.5rem',
                      textAlign: 'center',
                      background: 'var(--bg-card)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                      transition: 'all 0.3s'
                    }}
                  >
                    <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                      {gender === 'Femmes' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--pink-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gold-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      )}
                    </div>
                    <h3 style={{ 
                      fontSize: '1.5rem', 
                      color: gender === 'Femmes' ? 'var(--pink-accent)' : 'var(--gold-primary)',
                      fontFamily: 'var(--font-heading)',
                      textTransform: 'uppercase'
                    }}>
                      {label}
                    </h3>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );
      case 2:
        const categoriesToShow = preselectedCategory ? [preselectedCategory] : pricingCategories;
        
        return (
          <motion.div
            key="step2"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '65vh', overflowY: 'auto', paddingRight: '0.5rem' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', color: 'var(--text-main)' }}>
                {t('bookingModal.step2Title')}
              </h2>
              {preselectedCategory && <p style={{ color: accentColor, fontSize: '1.25rem', fontWeight: 600 }}>{preselectedCategory.name}</p>}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {categoriesToShow.map(cat => (
                <div key={cat.id} style={{
                  background: 'var(--bg-card)',
                  border: `1px solid ${accentColor}`,
                  borderRadius: '16px',
                  padding: '1.75rem',
                  boxShadow: `0 10px 30px rgba(0,0,0,0.3)`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                    <h3 style={{ color: accentColor, fontSize: '1.6rem', fontFamily: 'var(--font-heading)', margin: 0, textTransform: 'uppercase' }}>
                      {cat.name}
                    </h3>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cat.plans.map(plan => {
                      const isPromo = cat.id === 'pack_promo';

                      if (isPromo) {
                        // Parse promo rewards for structured display
                        const priceParts = plan.price.split(' + ');
                        const mainReward = priceParts[0];
                        const bonusItems = priceParts.slice(1);

                        return (
                          <button
                            key={plan.id}
                            className={`${btnClass} plan-row-promo`}
                            onClick={() => selectPlanAndProceed(cat, plan)}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '1.25rem 1.5rem',
                              textAlign: 'left'
                            }}
                          >
                            <div className="plan-label" style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                              <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>{plan.frequency}</span>
                              <span style={{ fontSize: '0.85rem', opacity: 0.85 }}>{plan.sessions}</span>
                            </div>
                            <div className="plan-price-promo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
                              <span style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-heading)', whiteSpace: 'nowrap' }}>
                                {mainReward}
                              </span>
                              {bonusItems.length > 0 && (
                                <span style={{ fontSize: '0.75rem', opacity: 0.8, whiteSpace: 'nowrap' }}>
                                  + {bonusItems.join(' + ')}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      }

                      return (
                        <button
                          key={plan.id}
                          className={`${btnClass} plan-row`}
                          onClick={() => selectPlanAndProceed(cat, plan)}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1.25rem 1.5rem',
                            textAlign: 'left',
                            gap: '1rem'
                          }}
                        >
                          <div className="plan-label" style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>{plan.frequency}</span>
                            <span style={{ fontSize: '0.85rem', opacity: 0.85 }}>{plan.sessions}</span>
                          </div>
                          <span className="plan-price" style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-heading)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                            {plan.price}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step3"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', color: 'var(--text-main)' }}>
                {t('bookingModal.step3Title')}
              </h2>
              <p style={{ color: 'var(--text-muted)' }}>{t('bookingModal.step3Subtitle')}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '400px', margin: '0 auto', width: '100%' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                  {t('bookingModal.fullNameLabel')}
                </label>
                <input 
                  type="text" 
                  placeholder="Ex: Mohamed Amine" 
                  value={selections.fullName}
                  onChange={(e) => handleSelect('fullName', e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '1.1rem', 
                    background: 'rgba(255,255,255,0.03)', 
                    border: `1px solid ${accentColor}`, 
                    color: 'var(--text-main)', 
                    borderRadius: '10px', 
                    outline: 'none',
                    fontSize: '1rem'
                  }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                  {t('bookingModal.phoneLabel')}
                </label>
                <input 
                  type="tel" 
                  placeholder="05XX XX XX XX" 
                  value={selections.phone}
                  onChange={(e) => handleSelect('phone', e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '1.1rem', 
                    background: 'rgba(255,255,255,0.03)', 
                    border: `1px solid ${accentColor}`, 
                    color: 'var(--text-main)', 
                    borderRadius: '10px', 
                    outline: 'none',
                    fontSize: '1rem'
                  }} 
                />
              </div>

              <button 
                className={btnClass} 
                onClick={() => navigate(4, 1)}
                disabled={!selections.fullName || !selections.phone}
                style={{ 
                  opacity: (!selections.fullName || !selections.phone) ? 0.5 : 1, 
                  marginTop: '1rem',
                  padding: '1.1rem',
                  fontSize: '1.1rem',
                  textAlign: 'center',
                  display: 'block'
                }}
              >
                {t('bookingModal.confirmBtn')}
              </button>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            key="step4"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', color: accentColor, marginBottom: '0.5rem' }}>✓</div>
              <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                {t('bookingModal.step4Title')}
              </h2>
              <p style={{ color: 'var(--text-muted)' }}>{t('bookingModal.step4Subtitle')}</p>
            </div>

            {/* Bill Summary */}
            <div style={{
              background: 'var(--bg-card)',
              border: `1px solid ${accentColor}`,
              borderRadius: '20px',
              width: '100%',
              maxWidth: '480px',
              padding: '2rem',
              boxShadow: isFemale ? '0 15px 35px rgba(255, 182, 193, 0.15)' : '0 15px 35px rgba(197, 160, 89, 0.15)'
            }}>
              <div style={{ textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                <img 
                  src="/logo.png" 
                  alt="Equinox Sports Club" 
                  style={{ 
                    height: '90px', 
                    objectFit: 'contain', 
                    marginBottom: '0.5rem',
                    transform: 'scale(1.2)'
                  }} 
                />
                <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', margin: 0, fontFamily: 'var(--font-heading)' }}>
                  {t('bookingModal.billTitle')}
                </h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{t('bookingModal.clientLabel')}:</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{selections.fullName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{t('bookingModal.phoneBillLabel')}:</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{selections.phone}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{t('bookingModal.spaceLabel')}:</span>
                  <span style={{ color: accentColor, fontWeight: 600 }}>{selections.gender}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{t('bookingModal.categoryLabel')}:</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{selections.category?.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{t('bookingModal.planLabel')}:</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{selections.plan?.frequency} ({selections.plan?.sessions})</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  borderTop: '1px dashed rgba(255,255,255,0.2)', 
                  paddingTop: '1rem', 
                  marginTop: '0.5rem',
                  fontSize: '1.25rem',
                  fontWeight: 'bold'
                }}>
                  <span style={{ color: 'var(--text-main)' }}>{t('bookingModal.totalPrice')}:</span>
                  <span style={{ color: accentColor }}>{selections.plan?.price}</span>
                </div>
              </div>
            </div>
            
            <button className={btnClass} onClick={onClose} style={{ width: '100%', maxWidth: '480px', textAlign: 'center', display: 'block', padding: '1.1rem', fontSize: '1.1rem' }}>
              {t('bookingModal.finishBtn')}
            </button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'var(--bg-main)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Page Header */}
      <div style={{
        padding: '1.25rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <button 
          onClick={() => {
            if (step === 1) {
              onClose();
            } else if (step === 3 && preselectedCategory && preselectedCategory.plans.length === 1) {
              navigate(1, -1);
            } else if (step < 4) {
              navigate(step - 1, -1);
            }
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--gold-primary)',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600
          }}
        >
          ← {t('bookingModal.back')}
        </button>

        <img 
          src="/logo.png" 
          alt="Equinox Sports Club" 
          style={{ height: '50px', objectFit: 'contain' }} 
        />

        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
          {t('bookingModal.stepCount')} {step > 3 ? 3 : step} / 3
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.05)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(Math.min(step, 3) / 3) * 100}%` }}
          transition={{ duration: 0.4 }}
          style={{
            height: '100%',
            background: isFemale ? 'var(--pink-accent)' : 'var(--gold-primary)',
            borderRadius: '0 2px 2px 0'
          }}
        />
      </div>

      {/* Page Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{ width: '100%', maxWidth: '700px' }}>
          <AnimatePresence mode="wait" custom={direction}>
            {renderStep()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

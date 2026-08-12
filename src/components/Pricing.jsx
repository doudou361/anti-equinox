import React from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { formatDA, getCategory, CATEGORY_KEY_BY_ID } from '../lib/pricing';
import { SEANCE_LIBRE_WA_URL } from '../lib/whatsapp';
import { hoverProps } from '../lib/hover';
import { WhatsAppIcon, DumbbellIcon, CalendarIcon } from './icons';
import SectionHeader from './ui/SectionHeader';

// ── Plan row inside a category card ──────────────────────────────────────────

const PlanRow = ({ catName, plan, onBook, index, t }) => (
  <motion.div
    initial={{ opacity: 0, x: -8 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    className="plan-row"
    style={{
      display: 'flex', alignItems: 'center',
      padding: '0.8rem 1rem', borderRadius: '10px', gap: '12px',
      background: plan.recommended ? 'rgba(197,160,89,0.07)' : 'rgba(255,255,255,0.02)',
      border:     plan.recommended ? '1px solid rgba(197,160,89,0.30)' : '1px solid rgba(255,255,255,0.05)',
    }}
  >
    {/* Label */}
    <div className="plan-label" style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 700, fontSize: '0.975rem', color: '#F4F4F5', whiteSpace: 'nowrap' }}>
          {t(`pricing.freq.${plan.frequency}`)}
        </span>
        {plan.recommended && (
          <span style={{
            fontSize: '10px', fontWeight: 700, color: '#C5A059',
            background: 'rgba(197,160,89,0.18)', padding: '0.12rem 0.45rem',
            borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.4px',
          }}>
            {t('pricing.popular')}
          </span>
        )}
      </div>
      <span style={{ fontSize: '12px', color: '#9A948A' }}>{t(`pricing.sessions.${plan.sessions}`)}</span>
    </div>

    {/* Price */}
    <span className="plan-price" style={{
      fontWeight: 700, fontSize: '1.05rem', color: '#C5A059',
      whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      {formatDA(plan.monthlyRate)}
    </span>

    {/* CTA */}
    <button
      className="btn-glow"
      onClick={() => onBook(catName, plan)}
      style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem', borderRadius: '6px', flexShrink: 0, whiteSpace: 'nowrap' }}
    >
      {t('pricing.bookBtn')}
    </button>
  </motion.div>
);

// ── Category section card ─────────────────────────────────────────────────────

const CategoryCard = ({ cat, icon, onBook, delay = 0, t }) => {
  const key = CATEGORY_KEY_BY_ID[cat.id];

  return (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="glass"
    style={{
      borderRadius: '16px', padding: '2rem',
      border: '1px solid rgba(255,255,255,0.05)',
      display: 'flex', flexDirection: 'column', gap: '1.1rem',
    }}
  >
    {/* Header */}
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
      <div style={{ color: 'var(--gold-primary)', flexShrink: 0, marginTop: '2px' }}>{icon}</div>
      <div>
        <h3 style={{ color: '#F4F4F5', fontSize: '1.25rem', margin: 0, lineHeight: 1.2 }}>
          {t(`pricing.planNames.${key}`)}
        </h3>
        <p style={{ color: '#9A948A', fontSize: '13px', margin: '0.2rem 0 0', lineHeight: 1.5 }}>
          {t(`pricing.desc.${key}`)}
        </p>
      </div>
    </div>

    {/* Plan rows */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
      {cat.plans.map((plan, i) => (
        <PlanRow key={plan.id} catName={cat.name} plan={plan} onBook={onBook} index={i} t={t} />
      ))}
    </div>
    
    {cat.id === 'musculation_avec_crossfit' && (
      <button
        onClick={() => document.getElementById('btn-crossfit-schedule')?.click()}
        style={{
          marginTop: '0.5rem', background: 'transparent',
          border: '1px solid rgba(197,160,89,0.3)', color: '#C5A059',
          padding: '0.6rem', borderRadius: '8px', fontSize: '0.9rem',
          fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
        }}
        {...hoverProps({ background: 'transparent' }, { background: 'rgba(197,160,89,0.1)' })}
      >
        {t('pricing.seeSchedule')}
      </button>
    )}
  </motion.div>
  );
};

// ── Main Pricing component ────────────────────────────────────────────────────

const Pricing = ({ onPlanBook }) => {
  const { lang, t } = useLanguage();

  const muscCT  = getCategory('musculation_cross_training');
  const muscCF  = getCategory('musculation_avec_crossfit');
  const vip     = getCategory('pack_vip');
  const libre   = getCategory('seance_libre');

  const openModal = (catName, plan) =>
    onPlanBook({ name: catName, frequency: plan.frequency, monthlyRate: plan.monthlyRate });

  return (
    <>
      <section id="pricing" style={{ padding: '6rem 0', backgroundColor: 'var(--bg-card)' }}>
        <div className="container">

          <SectionHeader title={t('pricing.title')} subtitle={t('pricing.subtitle')} />

          {/* Row 1 — two category cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            <CategoryCard cat={muscCT} icon={<DumbbellIcon />} onBook={openModal} delay={0} t={t} />
            <CategoryCard cat={muscCF} icon={<DumbbellIcon />} onBook={openModal} delay={0.1} t={t} />
          </div>

          {/* Row 2 — VIP + Séance Libre */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>

            {/* ── Pack VIP ── */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02, borderColor: 'rgba(197,160,89,0.70)', boxShadow: '0 12px 35px rgba(197,160,89,0.20)' }}
              className="glass"
              style={{
                borderRadius: '16px', padding: '2.5rem 2rem',
                border: '1px solid rgba(197,160,89,0.35)',
                background: 'rgba(197,160,89,0.03)',
                display: 'flex', flexDirection: 'column', gap: '1.25rem',
                transition: 'border-color 0.3s, box-shadow 0.3s',
              }}
            >
              {/* Crown + title */}
              <div style={{ textAlign: 'center' }}>
                <Crown
                  size={30}
                  strokeWidth={1.75}
                  color="#C5A059"
                  style={{
                    display: 'block', margin: '0 auto 0.75rem',
                    filter: 'drop-shadow(0 0 8px rgba(197,160,89,0.45))',
                  }}
                />
                <h3 style={{ color: '#F4F4F5', fontSize: '1.8rem', margin: '0 0 0.4rem', fontFamily: 'var(--font-heading)' }}>
                  {t('pricing.planNames.vip')}
                </h3>
                <p style={{ color: '#9A948A', fontSize: '13px', margin: '0 0 1rem', lineHeight: 1.5 }}>{t('pricing.desc.vip')}</p>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#C5A059', fontFamily: 'var(--font-heading)' }}>
                  {formatDA(vip.plans[0].monthlyRate)}
                  <span style={{ fontSize: '1rem', fontWeight: 400, color: '#9A948A' }}>{t('pricing.pricePerMonth')}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {Object.values(t('pricing.benefits', { returnObjects: true })).map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '14px', color: '#F4F4F5' }}>
                    <span style={{ color: '#C5A059', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {b}
                  </div>
                ))}
              </div>

              <button
                className="btn-glow"
                onClick={() => openModal(vip.name, vip.plans[0])}
                style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', borderRadius: '8px', marginTop: 'auto' }}
              >
                {t('pricing.bookVip')}
              </button>
            </motion.div>

            {/* ── Séance Libre ── */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.02, borderColor: 'rgba(197,160,89,0.35)' }}
              className="glass"
              style={{
                borderRadius: '16px', padding: '2.5rem 2rem',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.25rem',
                transition: 'border-color 0.3s, box-shadow 0.3s',
              }}
            >
              <div>
                <div style={{ color: 'var(--gold-primary)', marginBottom: '0.875rem' }}>
                  <CalendarIcon />
                </div>
                <h3 style={{ color: '#F4F4F5', fontSize: '1.8rem', margin: '0 0 0.4rem', fontFamily: 'var(--font-heading)' }}>
                  {t('pricing.planNames.libre')}
                </h3>
                <p style={{ color: '#9A948A', fontSize: '13px', margin: '0 0 1.25rem', lineHeight: 1.5 }}>
                  {t('pricing.desc.libre')}
                </p>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#C5A059', fontFamily: 'var(--font-heading)' }}>
                  {formatDA(libre.plans[0].monthlyRate)}
                  <span style={{ fontSize: '1rem', fontWeight: 400, color: '#9A948A' }}>{t('pricing.pricePerSession')}</span>
                </div>
              </div>

              <button
                className="btn-glow"
                onClick={() => window.open(SEANCE_LIBRE_WA_URL, '_blank')}
                style={{
                  width: '100%', padding: '0.9rem', fontSize: '1rem', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                }}
              >
                <WhatsAppIcon />
                {t('pricing.bookSession')}
              </button>
            </motion.div>

          </div>
        </div>
      </section>

    </>
  );
};

export default Pricing;

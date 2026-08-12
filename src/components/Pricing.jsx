import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown } from 'lucide-react';
import { pricingCategories } from '../data/pricing';
import { useLanguage } from '../context/LanguageContext';
import { formatDA } from '../lib/pricing';

// ── Séance Libre — direct WhatsApp (not a subscription, no duration picker) ──

const SL_WA_URL =
  'https://wa.me/213562838455?text=' +
  encodeURIComponent(
    'Bonjour 👋, je souhaite réserver une Séance Libre (500 DA) à Équinox Sports Club.'
  );

// ── Icons ─────────────────────────────────────────────────────────────────────

const DumbbellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/>
    <path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
    <line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/>
    <line x1="3" x2="21" y1="10" y2="10"/>
    <path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/>
    <path d="M8 18h.01"/><path d="M12 18h.01"/>
  </svg>
);

const WAIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

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
  const catIdToKey = {
    musculation_cross_training: 'muscCT',
    musculation_avec_crossfit: 'muscCF',
    pack_vip: 'vip',
    seance_libre: 'libre'
  };
  const key = catIdToKey[cat.id];

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
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(197,160,89,0.1)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
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

  const muscCT  = pricingCategories.find((c) => c.id === 'musculation_cross_training');
  const muscCF  = pricingCategories.find((c) => c.id === 'musculation_avec_crossfit');
  const vip     = pricingCategories.find((c) => c.id === 'pack_vip');
  const libre   = pricingCategories.find((c) => c.id === 'seance_libre');

  const openModal = (catName, plan) =>
    onPlanBook({ name: catName, frequency: plan.frequency, monthlyRate: plan.monthlyRate });

  return (
    <>
      <section id="pricing" style={{ padding: '6rem 2rem', backgroundColor: 'var(--bg-card)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Section header */}
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
                onClick={() => window.open(SL_WA_URL, '_blank')}
                style={{
                  width: '100%', padding: '0.9rem', fontSize: '1rem', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                }}
              >
                <WAIcon />
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

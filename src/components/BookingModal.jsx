import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Crown, User, Users } from 'lucide-react';
import { calculatePlanTotal, formatDA, getCategory } from '../lib/pricing';
import { SEANCE_LIBRE_WA_URL } from '../lib/whatsapp';
import { validateNamePhone } from '../lib/validation';
import { useLanguage } from '../context/LanguageContext';
import { WhatsAppIcon } from './icons';
import Field from './ui/Field';
import { ModalOverlay, ModalCard, ModalHeader } from './ui/Modal';

// ── Constants ─────────────────────────────────────────────────────────────────

const BLOOD_GROUPS = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'];
const DURATIONS    = [1, 3, 6, 12];

/** Per-space accent palette; Homme (gold) doubles as the default. */
const THEMES = {
  Homme: { primary: '#C5A059', light: '#EFCC91', rgb: '197,160,89' },
  Femme: { primary: '#E27694', light: '#F49BB2', rgb: '226,118,148' },
};

// ── ChooseBtn — pill used in plan picker ──────────────────────────────────────

const ChooseBtn = ({ onClick, label = 'Choisir', isWA = false }) => {
  const base = { background: 'rgba(var(--theme-rgb), 0.12)', color: 'var(--theme-primary)' };
  const hover = { background: 'var(--theme-primary)', color: '#0A0A0A' };
  const [hov, setHov] = useState(false);
  const s = hov ? hover : base;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...s,
        border: '1px solid rgba(var(--theme-rgb), 0.40)',
        borderRadius: '6px',
        padding: '0.35rem 0.7rem',
        fontSize: '0.8rem',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.18s',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: '0.3rem',
        flexShrink: 0,
      }}
    >
      {isWA && <WhatsAppIcon />}
      {label}
    </button>
  );
};

// ── Step 0 — Gender picker ────────────────────────────────────────────────────

const GenderCard = ({ onClick, icon, accentRgb, accentColor, title, description }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '1rem',
      padding: '1.25rem', borderRadius: '12px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      color: '#F4F4F5', cursor: 'pointer', transition: 'all 0.2s',
      textAlign: 'left'
    }}
    onMouseEnter={(e) => { e.currentTarget.style.background = `rgba(${accentRgb},0.08)`; e.currentTarget.style.borderColor = `rgba(${accentRgb},0.3)`; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
  >
    <div style={{ background: `rgba(${accentRgb},0.15)`, padding: '0.75rem', borderRadius: '50%', color: accentColor }}>
      {icon}
    </div>
    <div>
      <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', fontWeight: 700 }}>{title}</h3>
      <p style={{ margin: 0, fontSize: '0.85rem', color: '#9A948A' }}>{description}</p>
    </div>
  </button>
);

const GenderPicker = ({ onSelect }) => {
  const { t } = useLanguage();
  return (
    <div style={{ padding: '0.5rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      <p style={{
        fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px',
        color: '#9A948A', fontWeight: 600, marginBottom: '0.5rem', textAlign: 'center'
      }}>
        {t('bookingModal.step1Small')}
      </p>

      <GenderCard
        onClick={() => onSelect('Homme')}
        icon={<User size={24} />}
        accentRgb={THEMES.Homme.rgb}
        accentColor={THEMES.Homme.primary}
        title={t('bookingModal.menCard')}
        description={t('bookingModal.menDesc')}
      />

      <GenderCard
        onClick={() => onSelect('Femme')}
        icon={<Users size={24} />}
        accentRgb={THEMES.Femme.rgb}
        accentColor={THEMES.Femme.primary}
        title={t('bookingModal.womenCard')}
        description={t('bookingModal.womenDesc')}
      />
    </div>
  );
};

// ── Step 1 — Plan picker ──────────────────────────────────────────────────────

const SectionLabel = ({ children, icon }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '0.45rem',
    marginTop: '1rem', marginBottom: '0.4rem',
    paddingBottom: '0.35rem',
    borderBottom: '1px solid rgba(var(--theme-rgb), 0.12)',
  }}>
    {icon}
    <span style={{
      fontSize: '10px', textTransform: 'uppercase',
      letterSpacing: '1.2px', color: '#9A948A', fontWeight: 700,
    }}>
      {children}
    </span>
  </div>
);

const PlanPickerRow = ({ catKey, plan, special, onSelect, t }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '0.6rem 0.75rem', borderRadius: '8px',
    background: plan.recommended || special ? 'rgba(var(--theme-rgb), 0.06)' : 'rgba(255,255,255,0.02)',
    border: plan.recommended || special ? '1px solid rgba(var(--theme-rgb), 0.28)' : '1px solid rgba(255,255,255,0.05)',
    marginBottom: '0.3rem',
  }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#F4F4F5' }}>{t(`pricing.freq.${plan.frequency}`)}</span>
        {plan.recommended && (
          <span style={{
            fontSize: '9px', fontWeight: 700, color: 'var(--theme-primary)',
            background: 'rgba(var(--theme-rgb), 0.18)', padding: '0.1rem 0.4rem',
            borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.4px',
          }}>
            {t('pricing.popular')}
          </span>
        )}
      </div>
      <span style={{ fontSize: '11px', color: '#9A948A' }}>{t(`pricing.sessions.${plan.sessions}`)}</span>
    </div>
    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--theme-primary)', whiteSpace: 'nowrap' }}>
      {formatDA(plan.monthlyRate)}
    </span>
    <ChooseBtn onClick={() => onSelect({ catKey, frequency: plan.frequency, monthlyRate: plan.monthlyRate, name: plan.name })} label={t('bookingModal.chooseBtn')} />
  </div>
);

const PlanPicker = ({ onSelect }) => {
  const { t } = useLanguage();
  const muscCT = getCategory('musculation_cross_training');
  const muscCF = getCategory('musculation_avec_crossfit');
  const vip    = getCategory('pack_vip');

  return (
    <div style={{ padding: '0.25rem 1.5rem 1.5rem' }}>
      <SectionLabel>{t('pricing.planNames.muscCT')}</SectionLabel>
      {muscCT.plans.map((p) => (
        <PlanPickerRow key={p.id} catKey="muscCT" plan={p} onSelect={onSelect} t={t} />
      ))}

      <SectionLabel>{t('pricing.planNames.muscCF')}</SectionLabel>
      {muscCF.plans.map((p) => (
        <PlanPickerRow key={p.id} catKey="muscCF" plan={p} onSelect={onSelect} t={t} />
      ))}

      <SectionLabel icon={<Crown size={12} color="var(--theme-primary)" strokeWidth={1.75} />}>{t('pricing.planNames.vip')}</SectionLabel>
      {vip.plans.map((p) => (
        <PlanPickerRow key={p.id} catKey="vip" plan={p} special onSelect={onSelect} t={t} />
      ))}

      <SectionLabel>{t('pricing.planNames.libre')}</SectionLabel>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '0.6rem 0.75rem', borderRadius: '8px',
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#F4F4F5' }}>{t('pricing.freq.1 Séance')}</span>
          <br />
          <span style={{ fontSize: '11px', color: '#9A948A' }}>{t('pricing.sessions.Accès unitaire — sans engagement')}</span>
        </div>
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--theme-primary)', whiteSpace: 'nowrap' }}>500 DA</span>
        <ChooseBtn onClick={() => window.open(SEANCE_LIBRE_WA_URL, '_blank')} label={t('bookingModal.waBtn')} isWA />
      </div>
    </div>
  );
};

// ── Step 2 — Booking form ─────────────────────────────────────────────────────

const BookingForm = ({ plan, gender, onSubmit, submitted, onClose }) => {
  const { t } = useLanguage();
  const [months,     setMonths]     = useState(1);
  const [bloodGroup, setBloodGroup] = useState('');
  const [birthdate,  setBirthdate]  = useState('');
  const [name,       setName]       = useState('');
  const [phone,      setPhone]      = useState('');
  const [errors,     setErrors]     = useState({});
  const [isLoading,  setIsLoading]  = useState(false);

  const total       = calculatePlanTotal(plan.monthlyRate, months);
  const full        = plan.monthlyRate * months;
  const saved       = full - total;
  const show12Perk  = months === 12;

  const clear = (key) => setErrors((p) => { const n = { ...p }; delete n[key]; return n; });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateNamePhone({ name, phone }, {
      name: t('bookingModal.errors.name'),
      phoneRequired: t('bookingModal.errors.phoneReq'),
      phoneInvalid: t('bookingModal.errors.phoneInv'),
    });
    if (!bloodGroup) errs.bloodGroup = t('bookingModal.errors.bloodGroup');
    if (!birthdate)  errs.birthdate  = t('bookingModal.errors.birthdate');
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setIsLoading(true);

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: {
            fullName: name,
            phone: phone,
            gender: gender,
          },
          planData: {
            name: plan.name || plan.catKey,
            frequency: plan.frequency,
            sessions: plan.sessions || '-',
            monthlyRate: total
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to book. Please try again.');
      }

      const data = await response.json();
      
      if (data.type === 'stripe' && data.url) {
        window.location.href = data.url;
      } else {
        onSubmit();
      }
    } catch (err) {
      console.error(err);
      setErrors({ form: 'An error occurred. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate
      style={{ padding: '1.25rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
    >
      {/* Duration pills */}
      <div>
        <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#9A948A', fontWeight: 600, marginBottom: '0.6rem' }}>
          {t('bookingModal.duration')}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.45rem' }}>
          {DURATIONS.map((m) => (
            <button key={m} type="button" onClick={() => setMonths(m)} style={{
              padding: '0.6rem 0.25rem', borderRadius: '8px',
              border: `1px solid ${months === m ? 'transparent' : 'rgba(var(--theme-rgb), 0.40)'}`,
              background: months === m ? 'var(--theme-primary)' : 'transparent',
              color: months === m ? '#0A0A0A' : 'var(--theme-primary)',
              fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
              transition: 'all 0.18s', whiteSpace: 'nowrap',
            }}>
              {m} {m === 1 ? t('bookingModal.month') : t('bookingModal.months')}
            </button>
          ))}
        </div>
      </div>

      {/* Live price */}
      <motion.div
        key={`price-${months}`}
        initial={{ opacity: 0.6, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.18 }}
        style={{
          background: 'rgba(var(--theme-rgb), 0.06)', border: '1px solid rgba(var(--theme-rgb), 0.25)',
          borderRadius: '12px', padding: '1.1rem', textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--theme-primary)', fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px', lineHeight: 1 }}>
          {formatDA(total)}
        </div>
        {months > 1 && (
          <div style={{ fontSize: '12px', color: '#9A948A', marginTop: '0.3rem' }}>{t('bookingModal.forMonths')} {months} {t('bookingModal.months').toLowerCase()}</div>
        )}
        {saved > 0 && (
          <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 600, marginTop: '0.4rem' }}>
            {months === 6 && `${t('bookingModal.oneMonthFree')} · `}
            {months === 12 && `${t('bookingModal.twoMonthsFree')} · `}
            {t('bookingModal.save')} {formatDA(saved)}
          </div>
        )}
        {show12Perk && (
          <div style={{
            marginTop: '0.65rem', padding: '0.3rem 0.8rem',
            background: 'rgba(var(--theme-rgb), 0.14)', border: '1px solid rgba(var(--theme-rgb), 0.40)',
            borderRadius: '50px', display: 'inline-block',
            fontSize: '12px', color: 'var(--theme-light)', fontWeight: 700,
          }}>
            {t('bookingModal.perks')}
          </div>
        )}
      </motion.div>

      {/* Name + Phone */}
      <Field label={t('bookingModal.fullNameLabel')} placeholder="" value={name}
        onChange={(e) => { setName(e.target.value); clear('name'); }} error={errors.name} />
      <Field label={t('bookingModal.phoneLabel')} type="tel" placeholder="" value={phone}
        onChange={(e) => { setPhone(e.target.value); clear('phone'); }} error={errors.phone} />

      {/* Blood group */}
      <div>
        <p style={{
          fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px',
          color: errors.bloodGroup ? '#e07070' : '#9A948A', fontWeight: 600, marginBottom: '0.6rem',
        }}>
          {t('bookingModal.bloodGroup')}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.45rem' }}>
          {BLOOD_GROUPS.map((bg) => (
            <button key={bg} type="button"
              onClick={() => { setBloodGroup(bg); clear('bloodGroup'); }}
              style={{
                padding: '0.55rem 0.25rem', borderRadius: '8px',
                border: `1px solid ${bloodGroup === bg ? 'transparent' : errors.bloodGroup ? 'rgba(224,85,85,0.5)' : 'rgba(var(--theme-rgb), 0.40)'}`,
                background: bloodGroup === bg ? 'var(--theme-primary)' : 'transparent',
                color: bloodGroup === bg ? '#0A0A0A' : errors.bloodGroup ? '#e07070' : 'var(--theme-primary)',
                fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
                transition: 'all 0.18s', textAlign: 'center',
              }}
            >
              {bg}
            </button>
          ))}
        </div>
        {errors.bloodGroup && (
          <span style={{ fontSize: '12px', color: '#e07070', fontWeight: 500, marginTop: '0.3rem', display: 'block' }}>
            {errors.bloodGroup}
          </span>
        )}
      </div>

      {/* Birthdate */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <label style={{
          fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px',
          color: errors.birthdate ? '#e07070' : '#9A948A', fontWeight: 600,
        }}>
          {t('bookingModal.birthdate')}
        </label>
        <input type="date" value={birthdate}
          max={new Date().toISOString().split('T')[0]}
          onChange={(e) => { setBirthdate(e.target.value); clear('birthdate'); }}
          style={{
            padding: '0.85rem 1rem', background: '#0A0A0A',
            border: `1px solid ${errors.birthdate ? '#e05555' : 'rgba(var(--theme-rgb), 0.40)'}`,
            borderRadius: '8px', color: '#F4F4F5', outline: 'none',
            fontSize: '0.95rem', width: '100%', colorScheme: 'dark',
            transition: 'border-color 0.2s',
          }}
        />
        {errors.birthdate && (
          <span style={{ fontSize: '12px', color: '#e07070', fontWeight: 500 }}>{errors.birthdate}</span>
        )}
      </div>

      {/* CIN notice */}
      <div style={{
        padding: '0.875rem 1rem',
        background: 'rgba(var(--theme-rgb), 0.05)', border: '1px solid rgba(var(--theme-rgb), 0.30)',
        borderRadius: '10px', display: 'flex', gap: '0.7rem', alignItems: 'flex-start',
      }}>
        <AlertCircle size={16} color="var(--theme-primary)" style={{ flexShrink: 0, marginTop: '1px' }} />
        <p style={{ fontSize: '13px', color: '#9A948A', margin: 0, lineHeight: 1.6 }}>
          {t('bookingModal.cinNotice')}{' '}
          <strong style={{ color: 'var(--theme-primary)' }}>{t('bookingModal.cinBold')}</strong>{' '}
          {t('bookingModal.cinEnd')}
        </p>
      </div>

      {/* Submit / success */}
      {errors.form && (
        <div style={{ color: '#e07070', fontSize: '14px', textAlign: 'center', fontWeight: 500 }}>
          {errors.form}
        </div>
      )}
      
      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(var(--theme-rgb), 0.35)',
            borderRadius: '16px', overflow: 'hidden'
          }}
        >
          {/* Receipt Header */}
          <div style={{ background: 'rgba(var(--theme-rgb), 0.1)', padding: '1.25rem', textAlign: 'center', borderBottom: '1px solid rgba(var(--theme-rgb), 0.2)' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%', background: 'var(--theme-primary)', color: '#000',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontWeight: 'bold'
            }}>✓</div>
            <h3 style={{ color: 'var(--theme-primary)', margin: 0, fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>Réservation Confirmée</h3>
            <p style={{ color: '#9A948A', fontSize: '12px', margin: '0.2rem 0 0' }}>Vos informations ont été transmises avec succès.</p>
          </div>
          
          {/* Receipt Details */}
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: '#9A948A' }}>Nom</span>
              <span style={{ color: '#F4F4F5', fontWeight: 600 }}>{name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: '#9A948A' }}>Téléphone</span>
              <span style={{ color: '#F4F4F5', fontWeight: 600 }}>{phone}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: '#9A948A' }}>Formule</span>
              <span style={{ color: '#F4F4F5', fontWeight: 600 }}>{plan.name || plan.catKey}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: '#9A948A' }}>Durée</span>
              <span style={{ color: '#F4F4F5', fontWeight: 600 }}>{months} {months === 1 ? 'mois' : 'mois'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: '#9A948A' }}>Espace</span>
              <span style={{ color: '#F4F4F5', fontWeight: 600 }}>{gender}</span>
            </div>

            {saved > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                <span style={{ color: '#10b981' }}>Économie</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>-{formatDA(saved)}</span>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(var(--theme-rgb), 0.2)' }}>
              <span style={{ color: '#F4F4F5', fontWeight: 700 }}>Total à Payer</span>
              <span style={{ color: 'var(--theme-primary)', fontWeight: 900 }}>{formatDA(total)}</span>
            </div>

            <button type="button" onClick={onClose} style={{
              width: '100%', padding: '0.85rem', marginTop: '1rem',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50px', color: '#F4F4F5', fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
            >
              Fermer
            </button>
          </div>
        </motion.div>
      ) : (
        <button type="submit" disabled={isLoading} style={{
          width: '100%', padding: '1rem 1.5rem',
          background: 'var(--theme-primary)', border: 'none', borderRadius: '50px',
          color: '#0A0A0A', fontWeight: 800, fontSize: '1rem', cursor: isLoading ? 'wait' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
          transition: 'background 0.2s, transform 0.15s',
          opacity: isLoading ? 0.7 : 1
        }}
          onMouseEnter={(e) => { if (!isLoading) { e.currentTarget.style.background = 'var(--theme-light)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
          onMouseLeave={(e) => { if (!isLoading) { e.currentTarget.style.background = 'var(--theme-primary)'; e.currentTarget.style.transform = 'translateY(0)'; } }}
        >
          {isLoading ? 'Traitement en cours...' : 'Confirmer la Réservation'}
        </button>
      )}
    </form>
  );
};

// ── BookingModal — root component ─────────────────────────────────────────────
//
// Step flow:
// 1. Gender picker ('gender') - Always the first step.
// 2. If plan = null, go to Plan picker ('plan'). If plan is preset, go to Form ('form').
// 3. Booking form ('form')

const BookingModal = ({ plan: initialPlan = null, onClose }) => {
  const { t } = useLanguage();
  const startedWithPlan = initialPlan !== null;
  const [step,      setStep]      = useState('gender'); // 'gender' | 'plan' | 'form'
  const [gender,    setGender]    = useState(null);
  const [plan,      setPlan]      = useState(initialPlan);
  const [submitted, setSubmitted] = useState(false);

  const theme = THEMES[gender] ?? THEMES.Homme;

  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
    setStep(startedWithPlan ? 'form' : 'plan');
  };

  const handlePlanSelect = (selectedPlan) => {
    setPlan(selectedPlan);
    setStep('form');
  };

  const handleBack = () => {
    if (step === 'form') {
      if (startedWithPlan) setStep('gender');
      else setStep('plan');
    } else if (step === 'plan') {
      setStep('gender');
    }
    setSubmitted(false);
  };

  let headerTitle = '';
  let headerSub = '';
  if (step === 'gender') {
    headerTitle = t('bookingModal.step1Title');
    headerSub = t('bookingModal.step1Subtitle');
  } else if (step === 'plan') {
    headerTitle = t('bookingModal.step2Title');
    headerSub = t('bookingModal.step2Subtitle');
  } else {
    // Attempt to map from catKey or plan name
    headerTitle = plan?.catKey ? t(`pricing.planNames.${plan.catKey}`) : plan?.name;
    headerSub = plan?.frequency ? t(`pricing.freq.${plan.frequency}`) : '';
  }

  return (
    <ModalOverlay
      onClose={onClose}
      style={{
        // Define theme variables on the root container
        '--theme-primary': theme.primary,
        '--theme-light': theme.light,
        '--theme-rgb': theme.rgb,
      }}
    >
      <ModalCard>
        <ModalHeader
          tag={t('bookingModal.headerTag')}
          title={headerTitle}
          subtitle={headerSub}
          onBack={step === 'gender' ? undefined : handleBack}
          backTitle={t('bookingModal.back')}
          onClose={onClose}
          closeTitle={t('bookingModal.close')}
        />

        {/* Step content — animated swap */}
        <AnimatePresence mode="wait">
          {step === 'gender' ? (
            <motion.div key="step-gender"
              initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.22 }}
            >
              <GenderPicker onSelect={handleGenderSelect} />
            </motion.div>
          ) : step === 'plan' ? (
            <motion.div key="step-plan"
              initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.22 }}
            >
              <PlanPicker onSelect={handlePlanSelect} />
            </motion.div>
          ) : (
            <motion.div key="step-form"
              initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 18 }} transition={{ duration: 0.22 }}
            >
              <BookingForm plan={plan} gender={gender} onSubmit={() => setSubmitted(true)} submitted={submitted} onClose={onClose} />
            </motion.div>
          )}
        </AnimatePresence>
      </ModalCard>
    </ModalOverlay>
  );
};

export default BookingModal;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Crown, ArrowLeft, User, Users } from 'lucide-react';
import { calculatePlanTotal, getSavingsInfo, formatDA, getPricingCategory } from '../lib/pricing';
import { useLanguage } from '../context/LanguageContext';
import { openExternalUrl, buildWhatsAppUrl } from '../lib/openExternal';
import WhatsAppBlockedNotice from './WhatsAppBlockedNotice';

// ── Constants ─────────────────────────────────────────────────────────────────

const BLOOD_GROUPS = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'];
const DURATIONS    = [1, 3, 6, 12];
const WA_NUMBER    = '213562838455';
const NAME_MAX     = 60;
const PHONE_MAX    = 20;

const SL_WA_URL = buildWhatsAppUrl(
  WA_NUMBER,
  'Bonjour 👋, je souhaite réserver une Séance Libre (500 DA) à Équinox Sports Club.'
);

/** Convert an <input type="date"> value (YYYY-MM-DD) to DD/MM/YYYY, or null. */
const formatBirthdate = (value) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, year, month, day] = match;
  if (Number.isNaN(new Date(`${value}T00:00:00`).getTime())) return null;
  return `${day}/${month}/${year}`;
};

// ── Shared icons ──────────────────────────────────────────────────────────────

const WAIcon = ({ size = 17 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

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
      {isWA && <WAIcon />}
      {label}
    </button>
  );
};

// ── Step 0 — Gender picker ────────────────────────────────────────────────────

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

      <button
        onClick={() => onSelect('Homme')}
        style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          padding: '1.25rem', borderRadius: '12px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#F4F4F5', cursor: 'pointer', transition: 'all 0.2s',
          textAlign: 'left'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(197,160,89,0.08)'; e.currentTarget.style.borderColor = 'rgba(197,160,89,0.3)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
      >
        <div style={{ background: 'rgba(197,160,89,0.15)', padding: '0.75rem', borderRadius: '50%', color: '#C5A059' }}>
          <User size={24} />
        </div>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', fontWeight: 700 }}>{t('bookingModal.menCard')}</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#9A948A' }}>{t('bookingModal.menDesc')}</p>
        </div>
      </button>

      <button
        onClick={() => onSelect('Femme')}
        style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          padding: '1.25rem', borderRadius: '12px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#F4F4F5', cursor: 'pointer', transition: 'all 0.2s',
          textAlign: 'left'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(226,118,148,0.08)'; e.currentTarget.style.borderColor = 'rgba(226,118,148,0.3)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
      >
        <div style={{ background: 'rgba(226,118,148,0.15)', padding: '0.75rem', borderRadius: '50%', color: '#E27694' }}>
          <Users size={24} />
        </div>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', fontWeight: 700 }}>{t('bookingModal.womenCard')}</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#9A948A' }}>{t('bookingModal.womenDesc')}</p>
        </div>
      </button>
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
    <ChooseBtn onClick={() => onSelect({ id: plan.id, catKey, frequency: plan.frequency, monthlyRate: plan.monthlyRate, name: plan.name })} label={t('bookingModal.chooseBtn')} />
  </div>
);

const PlanPicker = ({ onSelect }) => {
  const { t } = useLanguage();
  const [waBlocked, setWaBlocked] = useState(false);
  const muscCT = getPricingCategory('musculation_cross_training');
  const muscCF = getPricingCategory('musculation_avec_crossfit');
  const vip    = getPricingCategory('pack_vip');

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
        <ChooseBtn onClick={() => setWaBlocked(!openExternalUrl(SL_WA_URL))} label={t('bookingModal.waBtn')} isWA />
      </div>
      {waBlocked && (
        <div style={{ marginTop: '0.6rem' }}>
          <WhatsAppBlockedNotice url={SL_WA_URL} />
        </div>
      )}
    </div>
  );
};

// ── Reusable text field ───────────────────────────────────────────────────────

const Field = ({ label, type = 'text', placeholder, value, onChange, error, maxLength }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <label style={{
        fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px',
        color: error ? '#e07070' : '#9A948A', fontWeight: 600,
      }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          padding: '0.85rem 1rem',
          background: '#0A0A0A',
          border: `1px solid ${error ? '#e05555' : focused ? 'var(--theme-primary)' : 'rgba(var(--theme-rgb), 0.40)'}`,
          borderRadius: '8px', color: '#F4F4F5', outline: 'none',
          fontSize: '0.95rem', width: '100%', transition: 'border-color 0.2s',
          boxShadow: focused ? '0 0 0 3px rgba(var(--theme-rgb), 0.12)' : 'none',
          colorScheme: 'dark',
        }}
      />
      {error && <span style={{ fontSize: '12px', color: '#e07070', fontWeight: 500 }}>{error}</span>}
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
    const errs = {};
    if (!name.trim() || name.trim().length > NAME_MAX) errs.name = t('bookingModal.errors.name');
    const digits = phone.replace(/\D/g, '');
    if (!phone.trim())          errs.phone = t('bookingModal.errors.phoneReq');
    else if (digits.length < 9 || digits.length > 15) errs.phone = t('bookingModal.errors.phoneInv');
    if (!bloodGroup) errs.bloodGroup = t('bookingModal.errors.bloodGroup');
    if (!birthdate)  errs.birthdate  = t('bookingModal.errors.birthdate');
    const formattedBirthdate = birthdate ? formatBirthdate(birthdate) : null;
    if (birthdate && !formattedBirthdate) errs.birthdate = t('bookingModal.errors.birthdateInv');
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

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
          planId: plan.id,
          months,
        })
      });

      if (!response.ok) {
        const detail = await response.text().catch(() => '');
        throw new Error(`Booking request failed (${response.status}): ${detail}`);
      }

      const data = await response.json();

      if (data.type === 'stripe' && data.url) {
        window.location.href = data.url;
      } else {
        onSubmit();
      }
    } catch (err) {
      console.error('Booking request failed:', err);
      setErrors({ form: t('bookingModal.errors.submitFailed') });
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
      <Field label={t('bookingModal.fullNameLabel')} placeholder="" value={name} maxLength={NAME_MAX}
        onChange={(e) => { setName(e.target.value); clear('name'); }} error={errors.name} />
      <Field label={t('bookingModal.phoneLabel')} type="tel" placeholder="" value={phone} maxLength={PHONE_MAX}
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

// ── Theme Config ──────────────────────────────────────────────────────────────

const getTheme = (gender) => {
  if (gender === 'Femme') {
    return {
      primary: '#E27694', // A premium rose pink
      light: '#F49BB2',
      rgb: '226,118,148'
    };
  }
  // Default / Homme (Gold)
  return {
    primary: '#C5A059',
    light: '#EFCC91',
    rgb: '197,160,89'
  };
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

  const theme = getTheme(gender);

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
        padding: '1rem', overflowY: 'auto',
        // Define theme variables on the root container
        '--theme-primary': theme.primary,
        '--theme-light': theme.light,
        '--theme-rgb': theme.rgb,
      }}
    >
      {/* Modal box */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 24 }}
        animate={{ scale: 1,    opacity: 1, y: 0  }}
        exit={   { scale: 0.95, opacity: 0, y: 24 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#121212',
          border: '1px solid rgba(var(--theme-rgb), 0.35)',
          borderRadius: '18px',
          width: '100%', maxWidth: '500px',
          maxHeight: '90vh', overflowY: 'auto',
          boxShadow: '0 28px 70px rgba(0,0,0,0.90), 0 0 50px rgba(var(--theme-rgb), 0.07)',
          transition: 'border-color 0.4s, box-shadow 0.4s', // Smooth transition when theme changes
        }}
      >
        {/* Sticky header */}
        <div style={{
          padding: '1.4rem 1.5rem 1rem',
          borderBottom: '1px solid rgba(var(--theme-rgb), 0.15)',
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', gap: '1rem',
          position: 'sticky', top: 0, background: '#121212', zIndex: 1,
          transition: 'border-color 0.4s',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', flex: 1 }}>
            {step !== 'gender' && (
              <button
                onClick={handleBack}
                title={t('bookingModal.back')}
                style={{
                  background: 'none', border: 'none', color: '#9A948A',
                  cursor: 'pointer', padding: '2px 0 0',
                  transition: 'color 0.2s', flexShrink: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--theme-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#9A948A')}
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div>
              <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#9A948A', fontWeight: 700, margin: '0 0 0.25rem' }}>
                {t('bookingModal.headerTag')}
              </p>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F4F4F5', margin: 0, fontFamily: 'var(--font-heading)', lineHeight: 1.2 }}>
                {headerTitle}
              </h2>
              {headerSub && (
                <p style={{ fontSize: '13px', color: 'var(--theme-primary)', margin: '0.2rem 0 0', fontWeight: 500 }}>
                  {headerSub}
                </p>
              )}
            </div>
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
      </motion.div>
    </motion.div>
  );
};

export default BookingModal;

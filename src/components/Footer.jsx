import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  MAPS_URL, PHONE_HREF, EMAIL_HREF,
  INSTAGRAM_MAIN_URL, FACEBOOK_URL,
} from '../lib/contact';
import { mutedToGoldHover } from '../lib/hover';
import { InstagramIcon, FacebookIcon, MapPinIcon, PhoneIcon, MailIcon } from './icons';

const contactRowStyle = {
  display: 'flex', alignItems: 'center', gap: '0.75rem',
  color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s',
};

const ContactRow = ({ href, icon, label, align = 'center' }) => (
  <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
    style={{ ...contactRowStyle, alignItems: align }} {...mutedToGoldHover}>
    {icon}
    <span>{label}</span>
  </a>
);

const Footer = ({ onContactClick }) => {
  const { t } = useLanguage();

  return (
    <footer style={{
      backgroundColor: 'var(--bg-card)',
      padding: '4rem 2rem 2rem',
      marginTop: 'auto',
      borderTop: '1px solid rgba(212, 175, 55, 0.1)'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '3rem'
      }}>
        <div>
          <h3 style={{ color: 'var(--text-main)', fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
            EQUINOX <span className="text-gold">SPORTS CLUB</span>
          </h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem', whiteSpace: 'pre-line' }}>
            {t('footer.tagline')}
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href={INSTAGRAM_MAIN_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--gold-primary)' }}>
              <InstagramIcon />
            </a>
            <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--gold-primary)' }}>
              <FacebookIcon />
            </a>
          </div>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>
            {t('nav.contact')}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <ContactRow
              href={MAPS_URL}
              align="flex-start"
              icon={<MapPinIcon style={{ flexShrink: 0 }} />}
              label={t('contactModal.addressText')}
            />
            <ContactRow href={PHONE_HREF} icon={<PhoneIcon />} label={t('contactModal.phoneText')} />
            <ContactRow href={EMAIL_HREF} icon={<MailIcon />} label={t('contactModal.emailText')} />
          </div>
        </div>
      </div>
      
      <div style={{
        textAlign: 'center',
        paddingTop: '2rem',
        marginTop: '3rem',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        color: 'var(--text-muted)',
        fontSize: '0.875rem'
      }}>
        © {new Date().getFullYear()} Equinox Sports Club. {t('footer.rights')}
      </div>
    </footer>
  );
};

export default Footer;

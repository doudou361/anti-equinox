import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

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
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 5, type: "spring", bounce: 0.4 }}
        >
          <h3 style={{ color: 'var(--text-main)', fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
            EQUINOX <span className="text-gold">SPORTS CLUB</span>
          </h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem', whiteSpace: 'pre-line' }}>
            {t('footer.tagline')}
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="https://www.instagram.com/equinoxsports_club/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-primary)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61554660353364" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-primary)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 5, type: "spring", bounce: 0.4, delay: 0.2 }}
        >
          <h4 style={{ color: 'var(--text-main)', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>
            {t('nav.contact')}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <a href="https://maps.google.com/?q=P982+X7C+EQUINOX+sport+club,+Ouled+Hedadj" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>{t('contactModal.addressText')}</span>
            </a>
            <a href="tel:0562838455" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <span>{t('contactModal.phoneText')}</span>
            </a>
            <a href="mailto:sportsclubequinox@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
              <span>{t('contactModal.emailText')}</span>
            </a>
          </div>
        </motion.div>
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

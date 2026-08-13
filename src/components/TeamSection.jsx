import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Target, Utensils, Zap, Medal } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CoachCard = ({ name, role, image, icon: Icon, iconColor, bgPosition = 'center' }) => {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '400px',
      width: '100%'
    }}>
      <div style={{
        height: '400px',
        backgroundColor: 'rgba(255,255,255,0.05)',
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: bgPosition,
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, #0A0A0A 0%, rgba(10,10,10,0) 100%)'
        }} />
      </div>
      <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', marginTop: '-40px', position: 'relative', zIndex: 2 }}>
        {Icon && (
          <div style={{
            background: `rgba(${iconColor === '#C5A059' ? '197,160,89' : '255,255,255'}, 0.15)`,
            padding: '0.75rem', borderRadius: '50%', color: iconColor,
            flexShrink: 0
          }}>
            <Icon size={24} />
          </div>
        )}
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.4rem', color: '#F4F4F5', fontFamily: 'var(--font-heading)' }}>
            {name}
          </h3>
          <p style={{ margin: 0, color: 'var(--gold-primary)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {role}
          </p>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon: Icon, title }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', textAlign: 'center' }}>
    <div style={{
      width: '60px', height: '60px', borderRadius: '50%',
      background: 'rgba(197,160,89,0.1)', border: '1px solid rgba(197,160,89,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C5A059'
    }}>
      <Icon size={28} />
    </div>
    <span style={{ color: '#F4F4F5', fontWeight: 600, fontSize: '0.95rem' }}>{title}</span>
  </div>
);

const TeamSection = () => {
  const { t } = useLanguage();

  return (
    <section id="team" style={{ padding: '6rem 0', backgroundColor: '#070709', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container">

        {/* Intro Title */}
        <motion.div
          initial={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 5, ease: "easeOut" }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <h2 style={{ fontSize: '3rem', color: '#F4F4F5', margin: '0 auto', fontFamily: 'var(--font-heading)' }}>
            Nos Coachs
          </h2>
        </motion.div>

        {/* Coaches */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'center' }}>
          
          <motion.div
            initial={{ opacity: 0, x: -300, skewX: -15 }}
            whileInView={{ opacity: 1, x: 0, skewX: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, type: "spring", bounce: 0.4, delay: 0.2 }}
          >
            <CoachCard 
              name="Kamel Ailane" 
              role="Head Coach" 
              image="/coaches/kamel-ailane-2.jpg.jpg"
              icon={Medal}
              iconColor="#C5A059"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 300, skewX: 15 }}
            whileInView={{ opacity: 1, x: 0, skewX: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, type: "spring", bounce: 0.4, delay: 0.3 }}
          >
            <CoachCard 
              name="Mohamed Boukatha" 
              role="Head Coach" 
              image="/coaches/mohamed-boukatha-1.jpg.jpg"
              icon={Medal}
              iconColor="#C5A059"
              bgPosition="top center"
            />
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default TeamSection;

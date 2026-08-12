import React from 'react';
import { motion } from 'framer-motion';

/** Centered title + subtitle block that opens each home page section. */
const SectionHeader = ({ title, subtitle, titleSize = '3rem', titleColor = 'var(--text-main)' }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    style={{ textAlign: 'center', marginBottom: '4rem' }}
  >
    <h2 style={{ fontSize: titleSize, color: titleColor, marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
      {title}
    </h2>
    {subtitle && (
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
        {subtitle}
      </p>
    )}
  </motion.div>
);

export default SectionHeader;

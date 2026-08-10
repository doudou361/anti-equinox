import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Products = ({ onContactClick }) => {
  const { t } = useLanguage();
  const items = t('products.items');

  return (
    <section id="products" style={{ padding: '6rem 2rem', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: '2.5rem', 
              color: 'var(--gold-primary)',
              letterSpacing: '1px',
              marginBottom: '1rem'
            }}
          >
            {t('products.title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}
          >
            {t('products.subtitle')}
          </motion.p>
        </div>

        {/* Product Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2rem'
        }}>
          {Array.isArray(items) && items.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="glass"
              style={{
                borderRadius: '20px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid rgba(197, 160, 89, 0.2)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                position: 'relative'
              }}
            >
              {/* Product Badge */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(197, 160, 89, 0.15)',
                border: '1px solid var(--gold-primary)',
                color: 'var(--gold-primary)',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                {product.tag}
              </div>

              <div>
                {/* Category & Name */}
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  {product.category}
                </div>
                <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '0.75rem' }}>
                  {product.name}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  {product.desc}
                </p>
              </div>

              {/* Price & Action Button */}
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--gold-primary)', marginBottom: '1.25rem' }}>
                  {product.price}
                </div>
                <button 
                  onClick={onContactClick}
                  className="btn-glow"
                  style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
                >
                  {t('products.orderBtn')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;

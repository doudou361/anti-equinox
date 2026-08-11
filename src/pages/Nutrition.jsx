import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { products, CATEGORIES } from '../data/products';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

// ── Framer Motion variants (match site patterns exactly) ──────────────────────

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const cardVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

// ── FilterPill ────────────────────────────────────────────────────────────────

const FilterPill = ({ label, isActive, onClick }) => (
  <motion.button
    layout
    whileTap={{ scale: 0.96 }}
    onClick={onClick}
    style={{
      position: 'relative',
      flexShrink: 0,
      padding: '0.5rem 1.1rem',
      borderRadius: '50px',
      border: `1px solid ${isActive ? 'transparent' : '#C79A61'}`,
      background: isActive ? '#C79A61' : 'transparent',
      color: isActive ? '#0A0A0A' : '#C79A61',
      fontSize: '13px',
      fontWeight: 700,
      cursor: 'pointer',
      letterSpacing: '0.3px',
      transition: 'background 0.22s, color 0.22s, border-color 0.22s',
      whiteSpace: 'nowrap',
    }}
  >
    {isActive && (
      <motion.span
        layoutId="active-pill-bg"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50px',
          background: '#C79A61',
          zIndex: -1,
        }}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      />
    )}
    {label}
  </motion.button>
);

// ── NutritionPage ─────────────────────────────────────────────────────────────

const NutritionPage = ({ onHomeClick }) => {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filtered =
    activeCategory === 'Tous'
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#0A0A0A',
          paddingTop: '110px', // clear fixed navbar
          paddingBottom: '5rem',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 1.5rem',
          }}
        >
          {/* ── Back Button ────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{ marginBottom: '2rem' }}
          >
            <button
              onClick={onHomeClick}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gold-primary)',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              ← Accueil
            </button>
          </motion.div>

          {/* ── Page Header ────────────────────────────────────────────────── */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 900,
                textTransform: 'uppercase',
                fontStyle: 'italic',
                letterSpacing: '-0.5px',
                color: 'var(--text-main)',
                margin: '0 0 0.75rem',
                lineHeight: 1.1,
              }}
            >
              NUTRITION &amp;{' '}
              <span style={{ color: '#C79A61' }}>COMPLÉMENTS</span>
            </h1>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '1.05rem',
                margin: 0,
                fontWeight: 400,
              }}
            >
              Sélectionnez votre complément.
            </p>
          </motion.div>

          {/* ── Category Filter Bar ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            className="nutrition-filter-bar"
            style={{ marginBottom: '2.5rem' }}
          >
            {CATEGORIES.map((cat) => (
              <FilterPill
                key={cat}
                label={cat}
                isActive={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
              />
            ))}
          </motion.div>

          {/* ── Product Grid ─────────────────────────────────────────────── */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="nutrition-grid"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 0',
                color: '#9A948A',
                fontSize: '1rem',
              }}
            >
              Aucun produit dans cette catégorie.
            </div>
          )}
        </div>
      </div>

      {/* ── Product Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default NutritionPage;

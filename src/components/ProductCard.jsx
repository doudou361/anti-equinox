import React from 'react';
import { motion } from 'framer-motion';

/**
 * ProductCard — clean minimal tile, no price, no button.
 * Entire card is clickable → opens ProductModal.
 * Matches the exact Framer Motion spring language used across the site.
 */
const ProductCard = ({ product, onClick, index = 0 }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.05 }}
      whileHover={{
        y: -4,
        borderColor: '#C79A61',
        boxShadow: '0 8px 32px rgba(199,154,97,0.22)',
        transition: { duration: 0.25, ease: 'easeOut' },
      }}
      onClick={onClick}
      style={{
        background: '#121212',
        border: '1px solid rgba(199,154,97,0.20)',
        borderRadius: '12px',
        cursor: 'pointer',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
      }}
    >
      {/* Product image — white bg area, object-fit contain, never cropped */}
      <div
        className="product-card-img"
        style={{
          background: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          flexShrink: 0,
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>

      {/* Card body */}
      <div
        style={{
          padding: '0.875rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.2rem',
          flex: 1,
        }}
      >
        {/* Brand */}
        <span
          style={{
            fontSize: '12px',
            color: '#9A948A',
            fontWeight: 500,
            letterSpacing: '0.3px',
          }}
        >
          {product.brand}
        </span>

        {/* Product name — max 2 lines, ellipsis */}
        <h3
          style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#F5F1EA',
            margin: 0,
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.name}
        </h3>

        {/* Category pill — pushed to bottom */}
        <div style={{ marginTop: 'auto', paddingTop: '0.75rem' }}>
          <span
            style={{
              display: 'inline-block',
              background: 'rgba(199,154,97,0.10)',
              border: '1px solid rgba(199,154,97,0.30)',
              color: '#C79A61',
              fontSize: '11px',
              padding: '0.2rem 0.6rem',
              borderRadius: '20px',
              fontWeight: 600,
              letterSpacing: '0.4px',
            }}
          >
            {product.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

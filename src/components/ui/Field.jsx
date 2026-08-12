import React, { useState } from 'react';

/**
 * Labelled text input used by every WhatsApp form.
 * Accent colours come from the `--theme-*` variables set by the surrounding
 * modal, falling back to the site gold when no theme is defined.
 */
const Field = ({ label, type = 'text', placeholder, value, onChange, error, ...inputProps }) => {
  const [focused, setFocused] = useState(false);
  const borderColor = error
    ? '#e05555'
    : focused
    ? 'var(--theme-primary, #C79A61)'
    : 'rgba(var(--theme-rgb, 199,154,97), 0.40)';

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
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          padding: '0.85rem 1rem',
          background: '#0A0A0A',
          border: `1px solid ${borderColor}`,
          borderRadius: '8px', color: '#F4F4F5', outline: 'none',
          fontSize: '0.95rem', width: '100%', transition: 'border-color 0.2s',
          boxShadow: focused ? '0 0 0 3px rgba(var(--theme-rgb, 199,154,97), 0.12)' : 'none',
          colorScheme: 'dark',
        }}
        {...inputProps}
      />
      {error && <span style={{ fontSize: '12px', color: '#e07070', fontWeight: 500 }}>{error}</span>}
    </div>
  );
};

export default Field;

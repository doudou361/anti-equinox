import React from 'react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Shown when the browser refused to open WhatsApp (popup blocker, in-app
 * webview). Gives the visitor the link so the message is not lost.
 */
const WhatsAppBlockedNotice = ({ url }) => {
  const { t } = useLanguage();
  return (
    <div
      role="alert"
      style={{
        padding: '0.85rem 1rem',
        background: 'rgba(224,85,85,0.08)',
        border: '1px solid rgba(224,85,85,0.45)',
        borderRadius: '10px',
        color: '#e07070',
        fontSize: '13px',
        lineHeight: 1.6,
      }}
    >
      {t('common.waBlocked')}{' '}
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        style={{ color: '#F49BB2', fontWeight: 700, textDecoration: 'underline' }}
      >
        {t('common.waBlockedLink')}
      </a>
    </div>
  );
};

export default WhatsAppBlockedNotice;

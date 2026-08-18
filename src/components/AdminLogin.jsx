import React, { useState } from 'react';
import { Check, Mail, ArrowRight } from 'lucide-react';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1); // 1 = email, 2 = code
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/admin-send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (res.ok) {
        setStep(2);
        // If in test mode (no resend key), it might log the code to console.
        if (data.testMode) {
          console.log("Check the backend console for the OTP code!");
        }
      } else {
        setError(data.error || 'Erreur lors de l\'envoi');
      }
    } catch (err) {
      setError('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!code) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin-verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const data = await res.json();
      
      if (data.success) {
        onLogin(data.token);
      } else {
        setError(data.error || 'Code invalide');
      }
    } catch (err) {
      setError('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0a',
      color: '#fff',
      padding: '20px'
    }}>
      <div style={{
        background: '#111',
        padding: '30px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.1)',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--theme-primary)' }}>
          Administration
        </h2>
        <p style={{ color: '#888', marginBottom: '24px', fontSize: '14px' }}>
          {step === 1 ? 'Entrez votre adresse email pour recevoir un code d\'accès.' : 'Un code à 6 chiffres a été envoyé à votre email.'}
        </p>

        {error && (
          <div style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendCode}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Email Admin</label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#1a1a1a', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', padding: '0 12px' }}>
                <Mail size={18} color="#666" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@equinox.com"
                  required
                  style={{
                    background: 'transparent', border: 'none', color: '#fff', padding: '14px 12px',
                    width: '100%', outline: 'none', fontSize: '15px'
                  }}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !email}
              style={{
                width: '100%', padding: '14px', background: 'var(--theme-primary)', color: '#000',
                border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px',
                cursor: loading || !email ? 'not-allowed' : 'pointer', opacity: loading || !email ? 0.7 : 1,
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              {loading ? 'Envoi...' : 'Recevoir le code'} <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Code à 6 chiffres</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
                required
                style={{
                  background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '14px 16px',
                  width: '100%', outline: 'none', fontSize: '24px', letterSpacing: '8px', textAlign: 'center', borderRadius: '8px'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading || code.length < 6}
              style={{
                width: '100%', padding: '14px', background: 'var(--theme-primary)', color: '#000',
                border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px',
                cursor: loading || code.length < 6 ? 'not-allowed' : 'pointer', opacity: loading || code.length < 6 ? 0.7 : 1,
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              {loading ? 'Vérification...' : 'Valider'} <Check size={18} />
            </button>
            <button
              type="button"
              onClick={() => { setStep(1); setCode(''); setError(''); }}
              style={{
                width: '100%', padding: '12px', background: 'transparent', color: '#888',
                border: 'none', fontSize: '14px', cursor: 'pointer', marginTop: '10px'
              }}
            >
              ← Retour
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

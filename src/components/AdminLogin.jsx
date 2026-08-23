import React, { useState } from 'react';
import { Check, Lock } from 'lucide-react';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        onLogin(data.token);
      } else {
        setError(data.error || 'Mot de passe incorrect');
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
          Entrez le mot de passe administrateur pour accéder au tableau de bord.
        </p>

        {error && (
          <div style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Mot de passe</label>
            <div style={{ display: 'flex', alignItems: 'center', background: '#1a1a1a', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', padding: '0 12px' }}>
              <Lock size={18} color="#666" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
            disabled={loading || !password}
            style={{
              width: '100%', padding: '14px', background: 'var(--theme-primary)', color: '#000',
              border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px',
              cursor: loading || !password ? 'not-allowed' : 'pointer', opacity: loading || !password ? 0.7 : 1,
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Connexion...' : 'Accéder'} <Check size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

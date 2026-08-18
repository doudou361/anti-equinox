import React, { useState, useEffect, useCallback } from 'react';
import AdminLogin from './AdminLogin';
import { Plus, Trash2, ToggleLeft, ToggleRight, LogOut, Tag, RefreshCw } from 'lucide-react';

const SESSION_KEY = 'equinox_admin_token';

function AdminDashboard({ token, onLogout }) {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ code: '', discount: '', maxUses: '', expiry: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const fetchCodes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin-codes', { headers: authHeaders });
      if (res.status === 401) { onLogout(); return; }
      const data = await res.json();
      if (data.success) setCodes(data.codes || []);
      else setError(data.error || 'Erreur de chargement');
    } catch (e) {
      setError('Erreur réseau');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchCodes(); }, [fetchCodes]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.code || !form.discount) {
      setFormError('Le code et la réduction sont requis.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    setFormSuccess('');
    try {
      const res = await fetch('/api/admin-codes', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          code: form.code.toUpperCase(),
          discount: Number(form.discount),
          maxUses: form.maxUses ? Number(form.maxUses) : 9999,
          expiry: form.expiry || ''
        })
      });
      const data = await res.json();
      if (data.success) {
        setFormSuccess(`Code "${form.code.toUpperCase()}" créé avec succès !`);
        setForm({ code: '', discount: '', maxUses: '', expiry: '' });
        fetchCodes();
      } else {
        setFormError(data.error || 'Erreur lors de la création');
      }
    } catch (e) {
      setFormError('Erreur réseau');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (rowIdx) => {
    try {
      await fetch('/api/admin-codes', {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ rowIdx })
      });
      fetchCodes();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (rowIdx, code) => {
    if (!window.confirm(`Supprimer le code "${code}" ?`)) return;
    try {
      await fetch('/api/admin-codes', {
        method: 'DELETE',
        headers: authHeaders,
        body: JSON.stringify({ rowIdx })
      });
      fetchCodes();
    } catch (e) { console.error(e); }
  };

  const s = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'sans-serif' },
    header: { background: '#111', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: '20px', fontWeight: 'bold', color: 'var(--theme-primary, #D8B06B)', display: 'flex', alignItems: 'center', gap: '10px' },
    logoutBtn: { background: 'transparent', color: '#888', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' },
    body: { maxWidth: '900px', margin: '0 auto', padding: '24px 16px' },
    card: { background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', marginBottom: '24px' },
    sectionTitle: { fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#F4F4F5' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' },
    input: { background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', padding: '10px 14px', fontSize: '14px', outline: 'none', width: '100%' },
    createBtn: { background: 'var(--theme-primary, #D8B06B)', color: '#000', border: 'none', borderRadius: '8px', padding: '11px 20px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '10px 14px', fontSize: '12px', color: '#777', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
    td: { padding: '14px', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.04)', verticalAlign: 'middle' },
    badge: (active) => ({
      display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
      background: active ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
      color: active ? '#22c55e' : '#ef4444'
    }),
    iconBtn: (color) => ({ background: 'transparent', border: 'none', cursor: 'pointer', color, padding: '6px', borderRadius: '6px', display: 'inline-flex' }),
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.title}><Tag size={20} /> Codes de réduction — Admin Equinox</div>
        <button style={s.logoutBtn} onClick={onLogout}><LogOut size={14} /> Déconnexion</button>
      </div>

      <div style={s.body}>
        {/* Create new code */}
        <div style={s.card}>
          <p style={s.sectionTitle}>➕ Créer un nouveau code</p>
          {formError && <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{formError}</div>}
          {formSuccess && <div style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{formSuccess}</div>}
          <form onSubmit={handleCreate}>
            <div style={s.grid}>
              <div>
                <label style={{ fontSize: '11px', color: '#777', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Code *</label>
                <input style={s.input} placeholder="ex: RAMADAN30" value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#777', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Réduction (%) *</label>
                <input style={s.input} type="number" min="1" max="100" placeholder="ex: 20" value={form.discount} onChange={e => setForm(p => ({ ...p, discount: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#777', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Limite d'utilisations</label>
                <input style={s.input} type="number" min="1" placeholder="Illimité" value={form.maxUses} onChange={e => setForm(p => ({ ...p, maxUses: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#777', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Date d'expiration</label>
                <input style={s.input} type="date" value={form.expiry} onChange={e => setForm(p => ({ ...p, expiry: e.target.value }))} />
              </div>
            </div>
            <button type="submit" style={s.createBtn} disabled={submitting}>
              <Plus size={16} /> {submitting ? 'Création...' : 'Créer le code'}
            </button>
          </form>
        </div>

        {/* List of existing codes */}
        <div style={s.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <p style={{ ...s.sectionTitle, marginBottom: 0 }}>📋 Codes existants ({codes.length})</p>
            <button style={s.logoutBtn} onClick={fetchCodes}><RefreshCw size={14} /> Actualiser</button>
          </div>

          {error && <div style={{ color: '#ef4444', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

          {loading ? (
            <p style={{ color: '#777', textAlign: 'center', padding: '40px 0' }}>Chargement...</p>
          ) : codes.length === 0 ? (
            <p style={{ color: '#777', textAlign: 'center', padding: '40px 0' }}>Aucun code créé pour l'instant.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Code</th>
                    <th style={s.th}>Réduction</th>
                    <th style={s.th}>Utilisations</th>
                    <th style={s.th}>Expiration</th>
                    <th style={s.th}>Statut</th>
                    <th style={s.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {codes.map((c) => (
                    <tr key={c.rowIdx}>
                      <td style={s.td}><span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--theme-primary, #D8B06B)', fontSize: '15px' }}>{c.code}</span></td>
                      <td style={s.td}><span style={{ color: '#22c55e', fontWeight: '600' }}>{c.discount}%</span></td>
                      <td style={s.td}><span style={{ color: '#ccc' }}>{c.timesUsed} / {Number(c.maxUses) >= 9999 ? '∞' : c.maxUses}</span></td>
                      <td style={s.td}><span style={{ color: '#999' }}>{c.expiry || '—'}</span></td>
                      <td style={s.td}><span style={s.badge(c.active === 'YES')}>{c.active === 'YES' ? 'Actif' : 'Inactif'}</span></td>
                      <td style={s.td}>
                        <button style={s.iconBtn(c.active === 'YES' ? '#22c55e' : '#888')} onClick={() => handleToggle(c.rowIdx)} title={c.active === 'YES' ? 'Désactiver' : 'Activer'}>
                          {c.active === 'YES' ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                        </button>
                        <button style={s.iconBtn('#ef4444')} onClick={() => handleDelete(c.rowIdx, c.code)} title="Supprimer">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const [token, setToken] = useState(() => sessionStorage.getItem(SESSION_KEY));

  const handleLogin = (newToken) => {
    sessionStorage.setItem(SESSION_KEY, newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setToken(null);
  };

  if (!token) return <AdminLogin onLogin={handleLogin} />;
  return <AdminDashboard token={token} onLogout={handleLogout} />;
}

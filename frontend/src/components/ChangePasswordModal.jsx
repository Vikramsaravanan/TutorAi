import React, { useState } from 'react';
import { X, Lock, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

export default function ChangePasswordModal({ onClose }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setStatus('error');
      setMessage('Passwords do not match');
      return;
    }

    try {
      await axios.post('/users/change-password', { newPassword: password });
      setStatus('success');
      setMessage('Password safely updated!');
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '2rem', width: '100%', maxWidth: '400px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
          <Lock size={24} />
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Change Password</h2>
        </div>

        {status === 'error' && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--error)', padding: '1rem', marginBottom: '1rem', borderRadius: '4px', fontSize: '0.875rem' }}>
            {message}
          </div>
        )}
        
        {status === 'success' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', color: '#4ade80' }}>
            <CheckCircle2 size={20} /><span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>New Password</label>
            <input 
              type="password" 
              className="glass-input" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" 
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Confirm Password</label>
            <input 
              type="password" 
              className="glass-input" 
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="••••••••" 
              required 
            />
          </div>
          <button type="submit" className="glass-button">Update Security</button>
        </form>
      </div>
    </div>
  );
}

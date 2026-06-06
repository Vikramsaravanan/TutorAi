import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userResponse = await login(email, password);
      const role = userResponse.role;

      setTimeout(() => {
        if (role === 'super_admin') navigate('/super-admin');
        else if (role === 'dean') navigate('/dean');
        else if (role === 'hod') navigate('/hod');
        else if (role === 'mentor') navigate('/mentor');
        else if (role === 'student') navigate('/student');
        else navigate('/');
      }, 500);
    } catch (err) {
      setError(err.message || 'Login failed. Try using a valid role name.');
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '1rem'
      }}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '2rem'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              background: 'rgba(99, 102, 241, 0.2)',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto 1rem'
            }}
          >
            <LogIn color="#818cf8" size={32} />
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
            Welcome Back
          </h2>

          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>
            Login to access your dashboard
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              borderLeft: '4px solid var(--error)',
              padding: '1rem',
              marginBottom: '1.5rem',
              borderRadius: '4px',
              fontSize: '0.875rem'
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleLogin}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {/* Email */}
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                color: 'var(--text-muted)'
              }}
            >
              Email/Role Name
            </label>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail
                size={18}
                color="var(--text-muted)"
                style={{
                  position: 'absolute',
                  left: '12px',
                  pointerEvents: 'none'
                }}
              />

              <input
                type="text"
                className="glass-input"
                placeholder="super, dean, hod..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <p
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginTop: '0.5rem'
              }}
            >
              Use your academic email address
            </p>
          </div>

          {/* Password */}
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                color: 'var(--text-muted)'
              }}
            >
              Password
            </label>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock
                size={18}
                color="var(--text-muted)"
                style={{
                  position: 'absolute',
                  left: '12px',
                  pointerEvents: 'none'
                }}
              />

              <input
                type="password"
                className="glass-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="glass-button"
            disabled={loading}
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
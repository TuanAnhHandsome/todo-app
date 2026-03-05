import { useState } from 'react';
import { login, register } from '../services/api';

// AuthPage — hiển thị form Login hoặc Register
// Props:
//   onAuth(user) — gọi khi đăng nhập / đăng ký thành công

export default function AuthPage({ onAuth }) {
  const [mode, setMode]       = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    try {
      const user = mode === 'login'
        ? await login(username, password)
        : await register(username, password);
      onAuth(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode(m => m === 'login' ? 'register' : 'login');
    setError('');
    setUsername('');
    setPassword('');
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        {/* Logo / brand */}
        <div className="auth-logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
        </div>

        <h1 className="auth-title">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p className="auth-sub">
          {mode === 'login'
            ? 'Sign in to your todo list'
            : 'Start organising your tasks'}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="your_username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading
              ? 'Please wait…'
              : mode === 'login' ? 'Sign in' : 'Register'}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={switchMode}>
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </p>

      </div>
    </div>
  );
}

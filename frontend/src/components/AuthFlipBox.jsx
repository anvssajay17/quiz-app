// components/AuthFlipBox.jsx
import React, { useState } from 'react';
import './AuthFlipBox.css';
import { useNavigate } from 'react-router-dom';

const AuthFlipBox = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? '/auth/register' : '/auth/login';
    try {
      const res = await fetch(`http://localhost:3500${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Authentication failed');

      localStorage.setItem('token', data.token);
      navigate('/auth-redirect', { replace: true });
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className={`flip-container ${isSignup ? 'show-signup' : ''}`}>
      <div className="flip-inner">
        {/* Login */}
        <div className="flip-front">
          <h2>Welcome Back</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <i className="fas fa-envelope"></i>
              <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit">Login</button>
          </form>
          <div className="switch-link" onClick={() => { setIsSignup(true); setErrorMsg(''); }}>Don't have an account? Sign Up</div>
          {errorMsg && <p className="error-msg">{errorMsg}</p>}
        </div>

        {/* Signup */}
        <div className="flip-back">
          <h2>Create Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <i className="fas fa-envelope"></i>
              <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit">Sign Up</button>
          </form>
          <div className="switch-link" onClick={() => { setIsSignup(false); setErrorMsg(''); }}>Already have an account? Login</div>
          {errorMsg && <p className="error-msg">{errorMsg}</p>}
        </div>
      </div>
    </div>
  );
};

export default AuthFlipBox;



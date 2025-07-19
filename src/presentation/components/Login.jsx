import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8001';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email || !password) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }
    setError('');
    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || 'Giriş başarısız.');
        return;
      }
      const data = await res.json();
      localStorage.setItem('user_id', data.id);
      localStorage.setItem('role', data.role);
      if (data.role === 'teacher') {
        navigate('/teacher-panel');
      } else {
        navigate('/student-panel');
      }
    } catch (err) {
      setError('Giriş sırasında bir hata oluştu.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '3rem auto', background: '#232526cc', borderRadius: 24, boxShadow: '0 2px 12px #7f5fff22', padding: '2.5rem 2rem' }}>
      <h2 style={{ color: '#7f5fff', textAlign: 'center', marginBottom: 24 }}>Giriş Yap</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <input type="email" placeholder="E-posta" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Şifre" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
        {error && <div style={{ color: '#ff6b6b', marginBottom: 8 }}>{error}</div>}
        <button type="submit" style={btnStyle}>Giriş Yap</button>
      </form>
    </div>
  );
};

const inputStyle = {
  padding: '0.7rem 1rem',
  borderRadius: 10,
  border: 'none',
  fontSize: 16,
  marginBottom: 6
};
const btnStyle = {
  background: 'linear-gradient(90deg, #7f5fff 0%, #00c6ff 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  padding: '0.7rem 1.2rem',
  fontSize: 18,
  fontWeight: 600,
  cursor: 'pointer',
  marginTop: 8
};

export default Login; 
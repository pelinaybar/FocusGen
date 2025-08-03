import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';

const API_URL = 'http://localhost:8000';

const AuthPage = () => {
  const [tab, setTab] = useState('login');
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('student');
  const [regError, setRegError] = useState('');
  const navigate = useNavigate();

  // Login fonksiyonu
  const handleLogin = async e => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail || !loginPassword) {
      setLoginError('Lütfen tüm alanları doldurun.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      if (!res.ok) {
        const data = await res.json();
        setLoginError(data.detail || 'Giriş başarısız.');
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
      setLoginError('Giriş sırasında bir hata oluştu.');
    }
  };

  // Register fonksiyonu
  const handleRegister = async e => {
    e.preventDefault();
    setRegError('');
    if (!regName || !regEmail || !regPassword) {
      setRegError('Lütfen tüm alanları doldurun.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword, role: regRole })
      });
      if (!res.ok) {
        const data = await res.json();
        setRegError(data.detail || 'Kayıt başarısız.');
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
      setRegError('Kayıt sırasında bir hata oluştu.');
    }
  };

  return (
    <div style={authPageStyle}>
      <div style={tabBarStyle}>
        <button
          onClick={() => setTab('login')}
          style={{
            ...tabBtnStyle,
            background: tab === 'login' ? 'linear-gradient(90deg, #7f5fff 0%, #00c6ff 100%)' : '#232526',
            color: tab === 'login' ? '#fff' : '#b3e0ff',
            borderRadius: '12px 0 0 12px',
            boxShadow: tab === 'login' ? '0 2px 12px #7f5fff44' : 'none',
            transition: 'all 0.2s'
          }}
        >Giriş Yap</button>
        <button
          onClick={() => setTab('register')}
          style={{
            ...tabBtnStyle,
            background: tab === 'register' ? 'linear-gradient(90deg, #7f5fff 0%, #00c6ff 100%)' : '#232526',
            color: tab === 'register' ? '#fff' : '#b3e0ff',
            borderRadius: '0 12px 12px 0',
            boxShadow: tab === 'register' ? '0 2px 12px #00c6ff44' : 'none',
            transition: 'all 0.2s'
          }}
        >Kayıt Ol</button>
      </div>
      <div style={formBoxStyle}>
        {tab === 'login' ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={inputGroupStyle}>
              <span style={iconStyle}>📧</span>
              <input type="email" placeholder="E-posta" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} style={inputStyle} className="auth-input" />
            </div>
            <div style={inputGroupStyle}>
              <span style={iconStyle}>🔒</span>
              <input type="password" placeholder="Şifre" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} style={inputStyle} className="auth-input" />
            </div>
            {loginError && <div style={{ color: '#ff6b6b', marginBottom: 8 }}>{loginError}</div>}
            <button type="submit" style={btnStyle}>Giriş Yap</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={inputGroupStyle}>
              <span style={iconStyle}>👤</span>
              <input type="text" placeholder="Ad Soyad" value={regName} onChange={e => setRegName(e.target.value)} style={inputStyle} className="auth-input" />
            </div>
            <div style={inputGroupStyle}>
              <span style={iconStyle}>📧</span>
              <input type="email" placeholder="E-posta" value={regEmail} onChange={e => setRegEmail(e.target.value)} style={inputStyle} className="auth-input" />
            </div>
            <div style={inputGroupStyle}>
              <span style={iconStyle}>🔒</span>
              <input type="password" placeholder="Şifre" value={regPassword} onChange={e => setRegPassword(e.target.value)} style={inputStyle} className="auth-input" />
            </div>
            <div style={{ display: 'flex', gap: 16, margin: '8px 0', justifyContent: 'center' }}>
              <label style={{ color: '#e0e0e0', fontWeight: 500 }}>
                <input type="radio" name="role" value="student" checked={regRole === 'student'} onChange={() => setRegRole('student')} /> Öğrenci
              </label>
              <label style={{ color: '#e0e0e0', fontWeight: 500 }}>
                <input type="radio" name="role" value="teacher" checked={regRole === 'teacher'} onChange={() => setRegRole('teacher')} /> Öğretmen
              </label>
            </div>
            {regError && <div style={{ color: '#ff6b6b', marginBottom: 8 }}>{regError}</div>}
            <button type="submit" style={btnStyle}>Kayıt Ol</button>
          </form>
        )}
      </div>
    </div>
  );
};

const authPageStyle = {
  maxWidth: 440,
  margin: '3rem auto',
  background: 'linear-gradient(120deg, #232526 0%, #414345 100%)',
  borderRadius: 28,
  boxShadow: '0 4px 32px #7f5fff33',
  padding: '2.5rem 2rem',
  minHeight: 420
};
const tabBarStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: 24,
  background: '#181c24',
  borderRadius: 12,
  boxShadow: '0 2px 12px #7f5fff22',
  overflow: 'hidden'
};
const tabBtnStyle = {
  flex: 1,
  border: 'none',
  padding: '0.7rem 1.2rem',
  fontSize: 18,
  fontWeight: 600,
  cursor: 'pointer',
  outline: 'none',
  transition: 'all 0.2s',
  background: 'none'
};
const formBoxStyle = {
  background: '#232526cc',
  borderRadius: 18,
  boxShadow: '0 2px 12px #7f5fff22',
  padding: '2rem 1.5rem',
  marginTop: 8
};
const inputGroupStyle = {
  display: 'flex',
  alignItems: 'center',
  background: '#232526',
  borderRadius: 10,
  boxShadow: '0 1px 6px #7f5fff11',
  padding: '0.2rem 1rem',
  marginBottom: 10,
  border: '2px solid #232526',
  transition: 'border 0.2s',
};
const iconStyle = {
  fontSize: 20,
  marginRight: 10,
  color: '#b3b3b3',
  minWidth: 24,
  textAlign: 'center',
  opacity: 0.85
};
const inputStyle = {
  flex: 1,
  padding: '0.7rem 0.5rem',
  borderRadius: 10,
  border: 'none',
  fontSize: 16,
  background: 'transparent',
  color: '#fff',
  outline: 'none',
  height: 38,
  fontWeight: 500,
  letterSpacing: 0.2
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
  marginTop: 8,
  boxShadow: '0 2px 8px #7f5fff33',
  transition: 'all 0.2s'
};

export default AuthPage; 
// Not: Üstteki menü çubuğu. Sayfa geçişleri için Link kullandım.
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  const user_id = localStorage.getItem('user_id');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('role');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="navbar" style={navbarStyle}>
      <div className="navbar-inner" style={navbarInnerStyle}>
        <div className="navbar-logo" style={logoStyle}>🧠 FocusGen</div>
        <div className="hamburger" onClick={handleMenuToggle}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
        <ul className={`navbar-links${menuOpen ? ' open' : ''}`} style={linksStyle}>
          <li><Link to="/">Ana Sayfa</Link></li>
          <li><Link to="/about">Biz Kimiz?</Link></li>
          <li><Link to="/pomodoro">⏲️ Pomodoro</Link></li>
          {!user_id ? (
            <li><Link to="/auth">Giriş / Kayıt</Link></li>
          ) : role === 'student' ? (
            <>
              <li><Link to="/student-panel">Öğrenci Paneli</Link></li>
              <li><button onClick={handleLogout} style={logoutBtnStyle}>Çıkış Yap</button></li>
            </>
          ) : role === 'teacher' ? (
            <>
              <li><Link to="/teacher-panel">Öğretmen Paneli</Link></li>
              <li><button onClick={handleLogout} style={logoutBtnStyle}>Çıkış Yap</button></li>
            </>
          ) : null}
        </ul>
      </div>
    </nav>
  );
};

const navbarStyle = {
  width: '100%',
  background: 'linear-gradient(90deg, #7f5fff 0%, #00c6ff 100%)',
  boxShadow: '0 2px 12px #7f5fff22',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  minHeight: 60,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
const navbarInnerStyle = {
  width: '100%',
  maxWidth: 1200,
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 2rem',
  minHeight: 60,
};
const logoStyle = {
  fontWeight: 700,
  fontSize: 24,
  color: '#fff',
  letterSpacing: 1.2,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};
const linksStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 28,
  listStyle: 'none',
  margin: 0,
  padding: 0,
  fontSize: 17,
  fontWeight: 500,
};
const logoutBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#fff',
  cursor: 'pointer',
  fontSize: 'inherit',
  fontWeight: 500,
  padding: 0,
};

export default Navbar; 
// Not: Uygulamanın ana dosyası. Splash ekranı, yönlendirme ve navbar burada yönetiliyor.
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Splash from './components/Splash';
import MainContent from './components/MainContent';
import AboutSection from './components/AboutSection';
import Pomodoro from './components/Pomodoro';
import Sidebar from './components/Sidebar';
import Register from './components/Register';
import Login from './components/Login';
import AuthPage from './components/AuthPage';
// Not: Örnek öğrenci ve öğretmen paneli bileşenlerini import ediyorum
import StudentPanel from './pages/StudentPanel';
import TeacherPanel from './pages/TeacherPanel';

function App() {
  // Not: Açılışta kısa bir hoşgeldiniz animasyonu göstermek için state kullandım.
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // 2.5 saniye sonra splash ekranı kaybolacak
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <Splash />;

  // Not: React Router ile sayfa geçişlerini sağladım. Navbar her sayfada görünüyor.
  return (
    <Router>
      {/* Not: Sidebar'ı Navbar'dan önce ekledim, böylece her sayfada sol üstte görünecek */}
      <Sidebar />
      <Navbar />
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/about" element={<AboutSection />} />
        <Route path="/pomodoro" element={<Pomodoro />} />
        <Route path="/auth" element={<AuthPage />} />
        {/* Not: Kayıt sonrası yönlendirme için örnek paneller */}
        <Route path="/student-panel" element={<StudentPanel />} />
        <Route path="/teacher-panel" element={<TeacherPanel />} />
        {/* Diğer sayfalar için route'lar buraya eklenecek */}
      </Routes>
    </Router>
  );
}

export default App; 
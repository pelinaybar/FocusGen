// Not: Hoşgeldiniz başlığı ve motivasyon sözü/emoji.
import React, { useMemo, useState, useEffect } from 'react';
import './WelcomeSection.css';

const SLIDER_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80', text: 'Odaklan, başarabilirsin! 💪' },
  { url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80', text: 'Her gün bir adım daha ileri! 🚀' },
  { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', text: 'Küçük adımlar büyük farklar yaratır. 🌱' },
  { url: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=800&q=80', text: 'Bugün odaklan, yarın gurur duy! 🏆' },
];

const MOTIVATIONS = [
  { text: 'Odaklan, başarabilirsin! 💪', emoji: '💪' },
  { text: 'Her gün bir adım daha ileri! 🚀', emoji: '🚀' },
  { text: 'Küçük adımlar büyük farklar yaratır. 🌱', emoji: '🌱' },
  { text: 'Bugün odaklan, yarın gurur duy! 🏆', emoji: '🏆' },
  { text: 'Senin zamanın, senin başarın! ⏳', emoji: '⏳' },
  { text: 'Dikkatini topla, hayallerine yaklaş! ✨', emoji: '✨' },
  { text: 'Bir mola, bir nefes, sonra tekrar! ☕', emoji: '☕' },
  { text: 'Başarı, odakla başlar! 🎯', emoji: '🎯' },
];

const WelcomeSection = () => {
  // Slider için state
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setSlide(s => (s + 1) % SLIDER_IMAGES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Sayfa her yüklendiğinde rastgele bir motivasyon seç
  const motivation = useMemo(() => {
    return MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];
  }, []);

  return (
    <section className="welcome-section" id="home">
      {/* Slider */}
      <div style={{ width: '100%', maxWidth: 800, margin: '0 auto', borderRadius: 24, overflow: 'hidden', boxShadow: '0 4px 24px #7f5fff33', marginBottom: 32, position: 'relative', minHeight: 220 }}>
        {SLIDER_IMAGES.map((img, i) => (
          <div
            key={i}
            style={{
              background: `url(${img.url}) center/cover no-repeat`,
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              opacity: slide === i ? 1 : 0,
              zIndex: slide === i ? 2 : 1,
              transition: 'opacity 1s',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-start',
              padding: '2.5rem',
              color: '#fff',
              fontSize: 28,
              fontWeight: 700,
              textShadow: '0 2px 12px #232526cc',
              minHeight: 220,
              height: '100%',
            }}
          >
            <span style={{ background: 'rgba(0,0,0,0.32)', borderRadius: 12, padding: '0.5rem 1.2rem' }}>{img.text}</span>
          </div>
        ))}
        {/* Slider dotları */}
        <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
          {SLIDER_IMAGES.map((_, i) => (
            <span key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: slide === i ? '#7f5fff' : '#fff', opacity: slide === i ? 1 : 0.5, transition: 'all 0.3s' }}></span>
          ))}
        </div>
      </div>
      {/* Motivasyon ve başlıklar */}
      <h1 className="welcome-title">🧠 FocusGen'e Hoşgeldiniz!</h1>
      <p className="welcome-desc">
        FocusGen, göz takibi teknolojisiyle odaklanma seviyenizi ölçer, gelişiminizi takip eder ve hem öğrenciler hem de öğretmenler için kişiselleştirilmiş paneller sunar. Odaklanma sürenizi artırmak ve verimliliğinizi en üst düzeye çıkarmak için tasarlandı!
      </p>
    </section>
  );
};

export default WelcomeSection; 
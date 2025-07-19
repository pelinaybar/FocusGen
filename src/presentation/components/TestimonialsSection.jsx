import React, { useState } from 'react';
import './TestimonialsSection.css';

const testimonials = [
  {
    name: 'Ayşe Y.',
    role: 'Öğrenci',
    comment: 'Focus Tracker sayesinde ders çalışırken ne zaman dağıldığımı fark ettim ve odak süremi artırdım. Grafiklerle gelişimimi görmek çok motive edici!'
  },
  {
    name: 'Mehmet K.',
    role: 'Öğretmen',
    comment: 'Sınıfımın genel odak seviyesini takip edebiliyorum. Öğrencilerim için raporlar hazırlamak çok kolaylaştı.'
  },
  {
    name: 'Elif D.',
    role: 'Öğrenci',
    comment: 'Kendi odak geçmişimi ve gelişimimi görmek beni daha disiplinli yaptı. Uygulama çok eğlenceli!'
  },
  {
    name: 'Ahmet S.',
    role: 'Öğretmen',
    comment: 'Öğrencilerimin odaklanma sorunlarını erken fark edip onlara özel öneriler sunabiliyorum.'
  },
  {
    name: 'Zeynep T.',
    role: 'Öğrenci',
    comment: 'Odak skorlarım arttıkça kendime olan güvenim de arttı. Tavsiye ederim!'
  },
  {
    name: 'Burak E.',
    role: 'Öğretmen',
    comment: 'Focus Tracker ile sınıf yönetimi çok daha verimli hale geldi. Öğrencilerimle birebir ilgilenebiliyorum.'
  }
];

const TestimonialsSection = () => {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((index - 1 + testimonials.length) % testimonials.length);
  const next = () => setIndex((index + 1) % testimonials.length);

  return (
    <section className="testimonials-section">
      <h2 className="testimonials-title animated-title">🌟 Memnuniyet</h2>
      <div className="testimonial-carousel">
        <button className="carousel-arrow" onClick={prev} aria-label="Önceki">◀️</button>
        <div className="testimonial-card">
          <div className="testimonial-comment">“{testimonials[index].comment}”</div>
          <div className="testimonial-user">
            <span className="testimonial-name">{testimonials[index].name}</span> - <span className="testimonial-role">{testimonials[index].role}</span>
          </div>
        </div>
        <button className="carousel-arrow" onClick={next} aria-label="Sonraki">▶️</button>
      </div>
    </section>
  );
};

export default TestimonialsSection; 
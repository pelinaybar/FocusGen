import React, { useState } from 'react';
import './FAQSection.css';

const faqs = [
  {
    question: 'Focus Tracker nasıl çalışır?',
    answer: 'Focus Tracker, bilgisayarınızın kamerası üzerinden göz hareketlerinizi analiz ederek odaklanma seviyenizi ölçer. Gelişmiş algoritmalar sayesinde, ders veya çalışma sırasında dikkatinizin ne kadar süreyle ekranda kaldığını tespit eder ve size anlık geri bildirimler sunar.'
  },
  {
    question: 'Odak skoru nedir ve nasıl hesaplanır?',
    answer: 'Odak skoru, göz takibiyle elde edilen veriler ve kullanıcı etkileşimleriyle hesaplanan 0-100 arası bir puandır. Skorunuz 50’nin altına düştüğünde sistem sizi uyarır ve odaklanmanızı artırmak için öneriler sunar.'
  },
  {
    question: 'Öğrenci ve öğretmen panellerinde hangi özellikler var?',
    answer: 'Öğrenciler için kişisel odak geçmişi, gelişim grafikleri ve motivasyon araçları; öğretmenler için ise sınıf genelinde odak analizi, öğrenci karşılaştırmaları ve raporlar sunulmaktadır.'
  },
  {
    question: 'Verilerim güvende mi?',
    answer: 'Evet, Focus Tracker gizliliğinize önem verir. Tüm veriler şifreli olarak saklanır ve üçüncü şahıslarla paylaşılmaz. Kamera verileri sadece analiz için kullanılır ve kaydedilmez.'
  },
  {
    question: 'Focus Tracker’ı kimler kullanabilir?',
    answer: 'Focus Tracker, öğrenciler, öğretmenler ve odaklanma becerisini geliştirmek isteyen herkes için uygundur. Kişisel ve kurumsal kullanıma açıktır.'
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = idx => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="faq-section">
      <h2 className="faq-title animated-title">❓ Merak Edilenler</h2>
      <div className="faq-list">
        {faqs.map((faq, idx) => (
          <div key={idx} className={`faq-item ${openIndex === idx ? 'open' : ''}`}>
            <div className="faq-question" onClick={() => toggleFAQ(idx)}>
              {faq.question}
              <span className="faq-arrow">{openIndex === idx ? '▲' : '▼'}</span>
            </div>
            {openIndex === idx && (
              <div className="faq-answer">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection; 
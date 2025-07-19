// Not: Ana sayfa içeriği. Hoşgeldiniz, merak edilenler, yorumlar, istatistik ve odak demo burada.
import React from 'react';
import WelcomeSection from './WelcomeSection';
import FAQSection from './FAQSection';
import TestimonialsSection from './TestimonialsSection';
import StatsSection from './StatsSection';
import FocusDemo from './FocusDemo';

const MainContent = () => (
  <div>
    <WelcomeSection />
    <FAQSection />
    <TestimonialsSection />
    <StatsSection />
    <FocusDemo /> {/* Mini odak skoru demo alanı */}
  </div>
);

export default MainContent; 
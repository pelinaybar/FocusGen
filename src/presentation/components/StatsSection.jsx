import React, { useEffect, useState } from 'react';
import './StatsSection.css';

const months = [
  { label: 'Ocak', value: 40 },
  { label: 'Şubat', value: 55 },
  { label: 'Mart', value: 65 },
  { label: 'Nisan', value: 75 },
  { label: 'Mayıs', value: 85 },
];

const StatsSection = () => {
  const [heights, setHeights] = useState(months.map(() => 0));

  useEffect(() => {
    // Barlar animasyonlu şekilde dolsun
    const timeouts = months.map((m, i) =>
      setTimeout(() => {
        setHeights(hs => {
          const newHs = [...hs];
          newHs[i] = m.value;
          return newHs;
        });
      }, 300 + i * 250)
    );
    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <section className="stats-section">
      <h2 className="stats-title animated-title">📈 Odak Süresi Gelişimi</h2>
      <p className="stats-desc">
        Focus Tracker'ı kullanan öğrencilerin aylık ortalama odak süresi %35 arttı! Düzenli takip ve kişisel öneriler sayesinde öğrenciler, dikkatlerini daha uzun süre koruyabiliyor ve akademik başarılarını artırıyor.
      </p>
      <div className="stats-graph">
        {months.map((m, i) => (
          <React.Fragment key={m.label}>
            <div className="bar-label">{m.label}</div>
            <div
              className="bar"
              style={{
                height: `${heights[i]}%`,
                transition: 'height 1s cubic-bezier(.4,2,.6,1)',
              }}
            >
              {heights[i] > 0 ? `${m.value} dk` : ''}
            </div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default StatsSection; 
// Not: Mini odak skoru demo alanı. Kullanıcı 5 kez hızlıca tıklayarak odak skorunu öğrenir.
import React, { useState, useRef } from 'react';
import './FocusDemo.css';

const getRandomPosition = () => ({
  top: Math.random() * 60 + 10 + '%',
  left: Math.random() * 60 + 10 + '%',
});

// Daha motive edici ve yüksek puan veren yeni puanlama
const getScore = (avgMs) => {
  if (avgMs < 250) return 100;
  if (avgMs < 350) return 95;
  if (avgMs < 450) return 90;
  if (avgMs < 550) return 85;
  if (avgMs < 650) return 80;
  if (avgMs < 750) return 75;
  if (avgMs < 850) return 70;
  if (avgMs < 950) return 65;
  if (avgMs < 1100) return 60;
  if (avgMs < 1300) return 55;
  return 50;
};

const getComment = (score) => {
  if (score >= 90) return "Süper odak! 🚀";
  if (score >= 75) return "Gayet iyi, odaklanmaya devam! 💪";
  if (score >= 60) return "Fena değil, biraz daha dikkat! 👀";
  return "Daha iyi odaklanabilirsin! Bir mola iyi gelebilir. ☕";
};

const FocusDemo = () => {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [times, setTimes] = useState([]);
  const [showBtn, setShowBtn] = useState(false);
  const [btnPos, setBtnPos] = useState({ top: '50%', left: '50%' });
  const [score, setScore] = useState(null);
  const [comment, setComment] = useState('');
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const startTest = () => {
    setStarted(true);
    setStep(0);
    setTimes([]);
    setScore(null);
    setComment('');
    setTimeout(showButton, 800 + Math.random() * 1200);
  };

  const showButton = () => {
    setBtnPos(getRandomPosition());
    setShowBtn(true);
    startTimeRef.current = Date.now();
  };

  const handleClick = () => {
    const reaction = Date.now() - startTimeRef.current;
    setTimes((prev) => [...prev, reaction]);
    setShowBtn(false);
    if (step < 4) {
      setStep(step + 1);
      setTimeout(showButton, 800 + Math.random() * 1200);
    } else {
      // Test bitti
      const allTimes = [...times, reaction];
      const avg = allTimes.reduce((a, b) => a + b, 0) / allTimes.length;
      const s = getScore(avg);
      setScore(s);
      setComment(getComment(s));
      setStarted(false);
    }
  };

  return (
    <div className="focus-demo">
      <h3 className="focus-demo-title">Mini Odak Skoru Testi</h3>
      {!started && score === null && (
        <button className="focus-demo-start" onClick={startTest}>
          Teste Başla
        </button>
      )}
      {started && (
        <div className="focus-demo-info">
          <p>Buton ekranda belirdiğinde <b>hemen tıkla!</b> (Toplam 5 deneme)</p>
          <p>Deneme: <b>{step + 1}/5</b></p>
        </div>
      )}
      {showBtn && (
        <button
          className="focus-demo-btn"
          style={{ top: btnPos.top, left: btnPos.left, position: 'absolute' }}
          onClick={handleClick}
        >
          Tıkla!
        </button>
      )}
      {score !== null && (
        <div className="focus-demo-result">
          <div className="focus-demo-score">Odak Skorun: <b>{score}</b>/100</div>
          <div className="focus-demo-comment">{comment}</div>
          <button className="focus-demo-start" onClick={startTest}>
            Tekrar Dene
          </button>
        </div>
      )}
    </div>
  );
};

export default FocusDemo; 
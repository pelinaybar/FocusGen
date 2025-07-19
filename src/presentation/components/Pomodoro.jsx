// Not: Pomodoro sayfası. Farklı süreler seçilebiliyor, sayaç başlıyor ve bitince sesli uyarı ve motivasyon mesajı veriyor.
import React, { useState, useRef } from 'react';

const DURATIONS = [
  { label: '25 Dakika', value: 25 * 60 },
  { label: '50 Dakika', value: 50 * 60 },
  { label: '1 Saat', value: 60 * 60 },
];

const MOTIVATION_QUOTES = [
  'Harikasın! Bir adım daha ileri gittin. 👏',
  'Odaklanmak başarıya giden yoldur! 🚀',
  'Küçük adımlar büyük farklar yaratır. 💡',
  'Devam et, hedefin çok yakın! 🏆',
  'Mola sonrası daha güçlü dön! 💪',
];

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

const Pomodoro = () => {
  const [selected, setSelected] = useState(null);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [breakTime, setBreakTime] = useState(5 * 60); // Kısa mola
  const [longBreakTime, setLongBreakTime] = useState(15 * 60); // Uzun mola
  const [showQuote, setShowQuote] = useState('');
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [cycleCount, setCycleCount] = useState(0); // 4 odak döngüsü için
  const [initialTime, setInitialTime] = useState(0); // Progress bar için başlangıç süresi
  const [customDuration, setCustomDuration] = useState('');
  const intervalRef = useRef(null);

  // Sesli uyarı için basit bir beep
  const beep = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 880;
    osc.connect(ctx.destination);
    osc.start();
    setTimeout(() => {
      osc.stop();
      ctx.close();
    }, 400);
  };

  const startTimer = () => {
    if (!running && time > 0) {
      setRunning(true);
      setShowQuote('');
      intervalRef.current = setInterval(() => {
        setTime(t => {
          if (t > 1) return t - 1;
          clearInterval(intervalRef.current);
          setRunning(false);
          if (!onBreak) {
            setOnBreak(true);
            setPomodoroCount(c => c + 1);
            setCycleCount(cycle => cycle + 1);
            beep();
            setShowQuote(MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)]);
            // 4. odak sonrası uzun mola
            if ((cycleCount + 1) % 4 === 0) {
              setTime(longBreakTime);
              setInitialTime(longBreakTime);
            } else {
              setTime(breakTime);
              setInitialTime(breakTime);
            }
          } else {
            setOnBreak(false);
            setSelected(null);
            beep();
          }
          return 0;
        });
      }, 1000);
    }
  };

  const stopTimer = () => {
    setRunning(false);
    clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    stopTimer();
    setOnBreak(false);
    setShowQuote('');
    setTime(selected ? selected.value : 0);
    setInitialTime(selected ? selected.value : 0);
    setCycleCount(0);
  };

  const selectDuration = d => {
    stopTimer();
    setOnBreak(false);
    setShowQuote('');
    setSelected(d);
    setTime(d.value);
    setInitialTime(d.value);
  };

  const handleBreakChange = e => {
    let val = Number(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    if (val > 30) val = 30;
    setBreakTime(val * 60);
  };

  const handleLongBreakChange = e => {
    let val = Number(e.target.value);
    if (isNaN(val) || val < 5) val = 5;
    if (val > 60) val = 60;
    setLongBreakTime(val * 60);
  };

  // Progress bar genişliği hesaplama
  const progress = initialTime > 0 ? (time / initialTime) * 100 : 0;

  return (
    <div style={{
      minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(120deg, #232526 0%, #7f5fff 100%)', borderRadius: 32, margin: '2rem auto', maxWidth: 400, boxShadow: '0 4px 24px #7f5fff33', padding: 32
    }}>
      {/* Not: Başlık ile sayaç arasında daha fazla boşluk bıraktım, üstte sabit ve net görünüyor */}
      <h2 style={{ color: '#fff', marginBottom: 36, marginTop: 8, fontSize: 32, textAlign: 'center' }}>⏲️ Pomodoro Zamanı</h2>
      <div style={{ color: '#fff', marginBottom: 16, fontSize: 16 }}>
        Toplam Pomodoro: <b>{pomodoroCount}</b>
      </div>
      {/* Progress Bar */}
      {selected && (
        <div style={{ width: '100%', height: 16, background: '#23252655', borderRadius: 8, marginBottom: 16, overflow: 'hidden', boxShadow: '0 1px 6px #7f5fff33' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: onBreak ? '#00c6ff' : '#7f5fff', transition: 'width 1s linear' }}></div>
        </div>
      )}
      <div style={{ color: '#fff', marginBottom: 16, fontSize: 15 }}>
        Kısa mola süresi (dk): <input type="number" min={1} max={30} value={breakTime/60} onChange={handleBreakChange} style={{ width: 50, borderRadius: 6, border: 'none', padding: 4, marginLeft: 8 }} />
      </div>
      <div style={{ color: '#fff', marginBottom: 16, fontSize: 15 }}>
        Uzun mola süresi (dk): <input type="number" min={5} max={60} value={longBreakTime/60} onChange={handleLongBreakChange} style={{ width: 50, borderRadius: 6, border: 'none', padding: 4, marginLeft: 8 }} />
      </div>
      {!selected && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {DURATIONS.map(d => (
            <button key={d.label} onClick={() => selectDuration(d)} style={btnStyle}>{d.label}</button>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <input
              type="number"
              min={1}
              max={180}
              value={customDuration}
              onChange={e => setCustomDuration(e.target.value)}
              placeholder="Dakika gir..."
              style={{ width: 80, borderRadius: 8, border: 'none', padding: 6 }}
            />
            <button
              onClick={() => {
                const min = Math.max(1, Math.min(180, Number(customDuration)));
                if (!isNaN(min)) selectDuration({ label: `${min} Dakika`, value: min * 60 });
                setCustomDuration('');
              }}
              style={{ ...btnStyle, padding: '0.7rem 1rem', fontSize: 16 }}
            >Başlat</button>
          </div>
        </div>
      )}
      {selected && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{ fontSize: 64, color: '#fff', textShadow: '0 0 16px #00c6ff, 0 0 32px #7f5fff', margin: '32px 0' }}>
            {formatTime(time)}
          </div>
          <div style={{ color: '#fff', fontSize: 22, marginBottom: 8 }}>
            {onBreak ? 'Mola Zamanı! 🧘‍♂️' : `${selected.label} Odak`}
          </div>
          {showQuote && (
            <div style={{ color: '#7f5fff', fontSize: 18, marginBottom: 8, textAlign: 'center', minHeight: 32 }}>
              {showQuote}
            </div>
          )}
          <div style={{ display: 'flex', gap: 16 }}>
            {!running && <button onClick={startTimer} style={btnStyle}>Başlat</button>}
            {running && <button onClick={stopTimer} style={btnStyle}>Durdur</button>}
            <button onClick={resetTimer} style={btnStyle}>Sıfırla</button>
          </div>
        </div>
      )}
    </div>
  );
};

const btnStyle = {
  fontSize: 18,
  padding: '0.7rem 1.5rem',
  borderRadius: 12,
  border: 'none',
  background: 'linear-gradient(90deg, #7f5fff 0%, #00c6ff 100%)',
  color: '#fff',
  fontWeight: 500,
  cursor: 'pointer',
  boxShadow: '0 2px 8px #7f5fff33'
};

export default Pomodoro; 
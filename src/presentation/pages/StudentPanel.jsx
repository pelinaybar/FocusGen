// Not: Sadece ssdMobilenetv1 modeliyle çalışan sade örnek
import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

const MODEL_URL = '/models';
const API_URL = 'http://localhost:8001';

const StudentPanel = () => {
  const videoRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [focusScore, setFocusScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [lowFocus, setLowFocus] = useState(false);
  const [focusHistory, setFocusHistory] = useState([]); // Son 10 puan için
  const detectionInterval = useRef(null);
  const [classCode, setClassCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [joinedClasses, setJoinedClasses] = useState([]);
  const [joinCode, setJoinCode] = useState('');
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [announcements, setAnnouncements] = useState({});

  // user_id'yi localStorage'dan al (örnek)
  const user_id = localStorage.getItem('user_id');

  useEffect(() => {
    Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
    ])
      .then(() => setLoading(false))
      .catch(() => setError('Model yüklenemedi.'));
    if (user_id) fetchHistory();
    return () => {
      if (detectionInterval.current) clearTimeout(detectionInterval.current);
    };
  }, [user_id]);

  useEffect(() => {
    let interval = null;
    if (cameraOn) {
      interval = setInterval(() => {
        runFaceDetection();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line
  }, [cameraOn]);

  useEffect(() => {
    if (user_id) fetchJoinedClasses();
  }, [user_id]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user_id) return;
      try {
        const res = await fetch(`${API_URL}/users/all`);
        const users = await res.json();
        const me = users.find(u => u.id === Number(user_id));
        if (me) setUserInfo({ name: me.name, email: me.email });
      } catch {}
    };
    fetchUserInfo();
  }, [user_id]);

  useEffect(() => {
    const fetchAllAnnouncements = async () => {
      const all = {};
      for (const item of joinedClasses) {
        if (!item.class_id) continue;
        try {
          const res = await fetch(`${API_URL}/announcements/class/${item.class_id}`);
          const data = await res.json();
          all[item.class_id] = data;
        } catch {}
      }
      setAnnouncements(all);
    };
    if (joinedClasses.length > 0) fetchAllAnnouncements();
  }, [joinedClasses]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/focus/user/${user_id}`);
      const data = await res.json();
      setHistory(data);
    } catch (e) {
      setError('Geçmiş odak puanları alınamadı.');
    }
  };

  const fetchJoinedClasses = async () => {
    try {
      const res = await fetch(`${API_URL}/studentclass/student/${user_id}`);
      const data = await res.json();
      // Her bir item için class_id'den sınıf adını çek
      const classNames = {};
      for (const item of data) {
        if (!classNames[item.class_id]) {
          const classRes = await fetch(`${API_URL}/class/all`);
          const allClasses = await classRes.json();
          const found = allClasses.find(cls => cls.id === item.class_id);
          classNames[item.class_id] = found ? found.name : '';
        }
        item.class_name = classNames[item.class_id];
      }
      setJoinedClasses(data);
    } catch (e) {
      setJoinError('Katıldığın sınıflar alınamadı.');
    }
  };

  const handleStartCamera = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setCameraOn(true);
    } catch (err) {
      setError('Kamera erişimi reddedildi');
    }
  };

  const handleStopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
    setFocusScore(0);
    setLowFocus(false);
    setFocusHistory([]);
    if (detectionInterval.current) clearTimeout(detectionInterval.current);
  };

  const handleJoinClass = async () => {
    setJoinError('');
    if (!joinCode) {
      setJoinError('Lütfen sınıf kodu gir.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/studentclass/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: Number(user_id), join_code: joinCode })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setJoinError(err.detail || 'Sınıfa katılım başarısız veya kod yanlış.');
        return;
      }
      setJoinCode('');
      fetchJoinedClasses();
    } catch (e) {
      setJoinError('Sınıfa katılım başarısız veya kod yanlış.');
    }
  };

  // Gözlerin açık olup olmadığını kontrol eden fonksiyon
  const areEyesOpen = (landmarks) => {
    if (!landmarks) return false;
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
    const getEAR = (eye) => {
      const a = Math.hypot(eye[1].x - eye[5].x, eye[1].y - eye[5].y);
      const b = Math.hypot(eye[2].x - eye[4].x, eye[2].y - eye[4].y);
      const c = Math.hypot(eye[0].x - eye[3].x, eye[0].y - eye[3].y);
      return (a + b) / (2.0 * c);
    };
    const leftEAR = getEAR(leftEye);
    const rightEAR = getEAR(rightEye);
    return leftEAR > 0.23 && rightEAR > 0.23;
  };

  const runFaceDetection = async () => {
    if (!videoRef.current || !cameraOn) {
      console.log('runFaceDetection: zincir durdu', { cameraOn });
      return;
    }
    const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options())
      .withFaceLandmarks()
      .withFaceExpressions();
    console.log('detections:', detections.length);
    let score = 0;
    if (detections.length > 0) {
      const d = detections[0];
      if (areEyesOpen(d.landmarks)) {
        const expressions = d.expressions || {};
        if ((expressions.neutral > 0.5 || expressions.happy > 0.5) && d.detection.score > 0.8) {
          score = 90 + Math.floor(Math.random() * 10);
        } else {
          score = 70 + Math.floor(Math.random() * 20);
        }
      } else {
        score = 20 + Math.floor(Math.random() * 20);
      }
    } else {
      score = Math.floor(Math.random() * 10);
    }
    console.log('Odak puanı:', score);
    setFocusScore(score);
    setLowFocus(score < 30);
    setFocusHistory(prev => {
      const updated = [...prev, score];
      return updated.length > 10 ? updated.slice(updated.length - 10) : updated;
    });
    if (user_id && cameraOn) {
      try {
        await fetch(`${API_URL}/focus/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: Number(user_id), score })
        });
        fetchHistory();
      } catch (e) {
        setError('Odak puanı kaydedilemedi.');
      }
    }
  };

  // Son 10 puanın ortalamasını yüzde olarak hesapla
  const focusPercent = focusHistory.length > 0 ? Math.round(focusHistory.reduce((a, b) => a + b, 0) / focusHistory.length) : 0;

  return (
    <div style={{ maxWidth: 800, margin: '3rem auto', background: '#232526cc', borderRadius: 24, boxShadow: '0 2px 12px #7f5fff22', padding: '3rem 2.5rem', textAlign: 'center', minHeight: 600 }}>
      <h2 style={{ color: '#7f5fff', marginBottom: 18 }}>👩‍🎓 Öğrenci Paneli</h2>
      <p>Hoş geldin! Burada odaklanma süreni takip edebilir, Pomodoro zamanlayıcısını kullanabilir ve motivasyonunu artıracak içeriklere ulaşabilirsin.</p>
      {/* Kullanıcı bilgisi kutusu */}
      <div style={{
        background: 'linear-gradient(90deg, #7f5fff22 0%, #00c6ff22 100%)',
        borderRadius: 16,
        padding: '1.2rem 1.5rem',
        margin: '0 auto 1.5rem',
        maxWidth: 420,
        boxShadow: '0 2px 12px #7f5fff11',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        justifyContent: 'center'
      }}>
        <div style={{ fontSize: 32, color: '#7f5fff' }}>👤</div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: '#fff', letterSpacing: 0.5 }}>{userInfo.name}</div>
          <div style={{ color: '#b3e0ff', fontSize: 15 }}>{userInfo.email}</div>
        </div>
      </div>
      <div style={{ margin: '2rem 0' }}>
        {!cameraOn ? (
          <button onClick={handleStartCamera} style={btnStyle} disabled={loading}>Kamerayı Aç</button>
        ) : (
          <button onClick={handleStopCamera} style={btnStyle}>Kamerayı Kapat</button>
        )}
        <div style={{ margin: '1.2rem 0' }}>
          <video ref={videoRef} autoPlay playsInline width={640} height={480} style={{ borderRadius: 16, background: '#111', boxShadow: '0 2px 12px #7f5fff22' }} />
        </div>
        {/* Odak Yüzdesi */}
        <div style={{ color: focusPercent > 50 ? '#7f5fff' : '#ff6b6b', fontWeight: 600, fontSize: 20, marginTop: 8, marginBottom: 12 }}>
          Odak Yüzdesi: %{focusPercent}
        </div>
        {lowFocus && <div style={{ color: '#ff6b6b', fontWeight: 700, marginTop: 8, fontSize: 18 }}>⚠️ Dikkat! Odak puanın çok düşük veya gözlerin kapalı.</div>}
        {loading && <div style={{ color: '#b3e0ff', marginTop: 8 }}>Modeller yükleniyor...</div>}
        {error && <div style={{ color: '#ff6b6b', marginTop: 8 }}>{error}</div>}
      </div>
      <div style={{ margin: '2rem 0', background: '#1a1b2bcc', borderRadius: 16, padding: 24 }}>
        <h3 style={{ color: '#b3e0ff' }}>Sınıf Kodu ile Katıl</h3>
        <input
          type="text"
          value={joinCode}
          onChange={e => setJoinCode(e.target.value)}
          placeholder="Sınıf Kodu"
          style={{ padding: 8, borderRadius: 8, border: '1px solid #7f5fff', marginRight: 8 }}
        />
        <button onClick={handleJoinClass} style={btnStyle}>Katıl</button>
        {joinError && <div style={{ color: '#ff6b6b', marginTop: 8 }}>{joinError}</div>}
        <div style={{ marginTop: 16 }}>
          <b style={{ color: '#b3e0ff' }}>Katıldığın Sınıflar:</b>
          <ul style={{ color: '#fff', fontSize: 15, listStyle: 'none', paddingLeft: 0, margin: 0 }}>
            {joinedClasses.map((item, i) => (
              <li key={i}>Sınıf: <b>{item.class_name}</b> (Kodu: {item.class_id})</li>
            ))}
          </ul>
        </div>
      </div>
      {/* Duyurular alanı */}
      <div style={{ margin: '1.5rem 0 2rem', background: '#1a1b2bcc', borderRadius: 16, padding: 20, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
        <h3 style={{ color: '#b3e0ff', marginBottom: 10 }}>Duyurular</h3>
        {joinedClasses.length === 0 && <div style={{ color: '#b3e0ff' }}>Henüz bir sınıfa katılmadın.</div>}
        {joinedClasses.map((item) => (
          <div key={item.class_id} style={{ marginBottom: 14 }}>
            <div style={{ color: '#7f5fff', fontWeight: 600, fontSize: 16 }}>{item.class_name}</div>
            {(announcements[item.class_id]?.length > 0) ? (
              <ul style={{ color: '#fff', fontSize: 15, listStyle: 'none', paddingLeft: 0, margin: 0 }}>
                {announcements[item.class_id].map((a, i) => (
                  <li key={i} style={{ marginBottom: 4, background: '#232526', borderRadius: 8, padding: '6px 12px' }}>{a.message}</li>
                ))}
              </ul>
            ) : (
              <div style={{ color: '#b3e0ff', fontSize: 14 }}>Bu sınıfta henüz duyuru yok.</div>
            )}
          </div>
        ))}
      </div>
      {/* Geçmiş odak puanları listesini kaldır, sadece son 1 dakikanın ortalamasını ve yüzdesini göster */}
      <div style={{ marginTop: 32, textAlign: 'left' }}>
        <h3 style={{ color: '#b3e0ff' }}>Son 1 Dakika Odak Özeti</h3>
        <div style={{ color: '#fff', fontSize: 16, marginBottom: 8 }}>
          Ortalama Odak Puanı: <b>{focusPercent}</b>
        </div>
        <div style={{ color: focusPercent > 50 ? '#7f5fff' : '#ff6b6b', fontWeight: 600, fontSize: 16 }}>
          Odak Yüzdesi: %{focusPercent}
        </div>
      </div>
    </div>
  );
};

const btnStyle = {
  background: 'linear-gradient(90deg, #7f5fff 0%, #00c6ff 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  padding: '0.7rem 1.2rem',
  fontSize: 16,
  fontWeight: 600,
  cursor: 'pointer',
  marginBottom: 12
};

export default StudentPanel;

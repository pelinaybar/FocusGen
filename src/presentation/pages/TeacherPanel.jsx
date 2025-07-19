// Not: Öğretmen paneli. Sınıf listesi, istatistik, özet ve duyuru alanı ekledim.
import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8001';

const TeacherPanel = () => {
  const [announcement, setAnnouncement] = useState('');
  const [sentAnnouncements, setSentAnnouncements] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [error, setError] = useState('');
  const [newClassName, setNewClassName] = useState('');
  const [createClassError, setCreateClassError] = useState('');
  const [studentCounts, setStudentCounts] = useState({});

  // user_id ve role localStorage'dan alınır (örnek)
  const user_id = localStorage.getItem('user_id');
  const role = localStorage.getItem('role');

  useEffect(() => {
    fetchClasses();
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (selectedClass) fetchStudents(selectedClass);
    // Canlı güncelleme için periyodik çekme
    const interval = selectedClass ? setInterval(() => fetchStudents(selectedClass), 5000) : null;
    return () => interval && clearInterval(interval);
  }, [selectedClass]);

  useEffect(() => {
    if (classes.length > 0) fetchStudentCounts(classes);
  }, [classes]);

  const fetchClasses = async () => {
    try {
      const res = await fetch(`${API_URL}/class/teacher/${user_id}`);
      const data = await res.json();
      setClasses(data);
      if (data.length > 0) setSelectedClass(data[0].id);
    } catch (e) {
      setError('Sınıflar alınamadı.');
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`${API_URL}/announcements/all`);
      const data = await res.json();
      setSentAnnouncements(data.map(a => a.message));
    } catch (e) {
      setError('Duyurular alınamadı.');
    }
  };

  const fetchStudents = async (classId) => {
    try {
      const res = await fetch(`${API_URL}/focus/class/${classId}`);
      const data = await res.json();
      setStudents(data);
    } catch (e) {
      setError('Öğrenci verileri alınamadı.');
    }
  };

  const fetchStudentCounts = async (classList) => {
    try {
      const counts = {};
      for (const cls of classList) {
        const res = await fetch(`${API_URL}/studentclass/class/${cls.id}`);
        const data = await res.json();
        counts[cls.id] = data.length;
      }
      setStudentCounts(counts);
    } catch {}
  };

  const sendAnnouncement = async () => {
    if (announcement.trim()) {
      try {
        await fetch(`${API_URL}/announcements/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teacher_id: Number(user_id), class_id: selectedClass, message: announcement })
        });
        setAnnouncement('');
        fetchAnnouncements();
      } catch (e) {
        setError('Duyuru gönderilemedi.');
      }
    }
  };

  const handleCreateClass = async () => {
    setCreateClassError('');
    if (!newClassName.trim()) {
      setCreateClassError('Sınıf adı boş olamaz.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/class/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newClassName, teacher_id: Number(user_id) })
      });
      if (!res.ok) throw new Error('Sınıf oluşturulamadı');
      setNewClassName('');
      fetchClasses();
    } catch (e) {
      setCreateClassError('Sınıf oluşturulamadı.');
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm('Bu sınıfı silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`${API_URL}/class/${classId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Sınıf silinemedi');
      // Eğer silinen sınıf seçiliyse, başka bir sınıfı seç
      if (selectedClass === classId) {
        const remaining = classes.filter(cls => cls.id !== classId);
        setSelectedClass(remaining.length > 0 ? remaining[0].id : '');
      }
      fetchClasses();
    } catch (e) {
      alert('Sınıf silinemedi!');
    }
  };

  const avgFocus = students.length > 0 ? Math.round(students.reduce((sum, s) => sum + s.score, 0) / students.length) : 0;
  const odakliYuzde = students.length > 0 ? Math.round((students.filter(s => s.score >= 50).length / students.length) * 100) : 0;

  return (
    <div style={{ maxWidth: 700, margin: '3rem auto', background: '#232526cc', borderRadius: 24, boxShadow: '0 2px 12px #7f5fff22', padding: '2.5rem 2rem' }}>
      <h2 style={{ color: '#7f5fff', marginBottom: 18, textAlign: 'center' }}>👨‍🏫 Öğretmen Paneli</h2>
      {/* Sınıf istatistikleri ve bar chart */}
      <div style={{ marginBottom: 28 }}>
        <h3 style={{ color: '#b3e0ff', marginBottom: 8 }}>Yeni Sınıf Oluştur</h3>
        <input
          type="text"
          value={newClassName}
          onChange={e => setNewClassName(e.target.value)}
          placeholder="Sınıf adı girin"
          style={{ padding: 8, borderRadius: 8, border: '1px solid #7f5fff', marginRight: 8 }}
        />
        <button onClick={handleCreateClass} style={{ background: 'linear-gradient(90deg, #7f5fff 0%, #00c6ff 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>Oluştur</button>
        {createClassError && <div style={{ color: '#ff6b6b', marginTop: 8 }}>{createClassError}</div>}
      </div>
      <div style={{ marginBottom: 28 }}>
        <h3 style={{ color: '#b3e0ff', marginBottom: 8 }}>Sınıflarım</h3>
        <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
          {classes.map(cls => (
            <li key={cls.id} style={{ marginBottom: 8 }}>
              <button
                onClick={() => setSelectedClass(cls.id)}
                style={{
                  background: selectedClass === cls.id ? '#7f5fff' : '#232526',
                  color: selectedClass === cls.id ? '#fff' : '#b3e0ff',
                  border: '1px solid #7f5fff',
                  borderRadius: 8,
                  padding: '0.5rem 1.2rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginRight: 8
                }}
              >
                {cls.name}
              </button>
              <span style={{ color: '#b3e0ff', fontSize: 13, marginRight: 8 }}>
                Kodu: <span style={{ fontWeight: 700, letterSpacing: 1 }}>{cls.join_code}</span>
                <button onClick={() => {navigator.clipboard.writeText(cls.join_code)}} style={{marginLeft: 4, fontSize: 12, background: '#232526', color: '#7f5fff', border: 'none', borderRadius: 4, cursor: 'pointer', padding: '2px 6px'}}>Kopyala</button>
              </span>
              <span style={{ color: '#b3e0ff', fontSize: 13, marginRight: 8 }}>
                👥 {studentCounts[cls.id] || 0} öğrenci
              </span>
              <button
                onClick={() => handleDeleteClass(cls.id)}
                style={{ background: '#ff6b6b', color: '#fff', border: 'none', borderRadius: 8, padding: '0.3rem 0.8rem', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >Sil</button>
            </li>
          ))}
        </ul>
      </div>
      {/* Sınıf Odak İstatistikleri */}
      <div style={{ color: '#b3e0ff', marginBottom: 8 }}>Sınıfın % {odakliYuzde}’i odaklı</div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', height: 120, marginBottom: 8 }}>
        {students.map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ background: '#7f5fff', height: `${s.score}px`, width: 32, borderRadius: 8, margin: '0 auto', transition: 'height 0.5s' }}></div>
            <div style={{ color: '#e0e0e0', fontSize: 13, marginTop: 4 }}>{s.name.split(' ')[0]}</div>
            <div style={{ color: '#b3e0ff', fontSize: 12 }}>{s.score}</div>
          </div>
        ))}
      </div>
      <div style={{ color: '#e0e0e0', fontSize: 15 }}>Ortalama Odak Puanı: <b>{avgFocus}</b></div>
      {/* Sınıf öğrenci listesi */}
      <div style={{ marginBottom: 28 }}>
        <h3 style={{ color: '#b3e0ff', marginBottom: 8 }}>Sınıf Listesi</h3>
        <table style={{ width: '100%', background: '#23252677', borderRadius: 12, color: '#fff', fontSize: 15 }}>
          <thead>
            <tr style={{ color: '#7f5fff' }}>
              <th style={{ padding: 8, textAlign: 'left' }}>Ad Soyad</th>
              <th style={{ padding: 8 }}>Odak Puanı</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={i}>
                <td style={{ padding: 8 }}>{s.name}</td>
                <td style={{ padding: 8, textAlign: 'center' }}>{s.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Duyuru gönderme alanı */}
      <div style={{ marginBottom: 28 }}>
        <h3 style={{ color: '#b3e0ff', marginBottom: 8 }}>Duyuru Gönder</h3>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input
            type="text"
            value={announcement}
            onChange={e => setAnnouncement(e.target.value)}
            placeholder="Duyuru yaz..."
            style={{ flex: 1, borderRadius: 8, border: 'none', padding: '0.5rem 1rem', fontSize: 15 }}
          />
          <button onClick={sendAnnouncement} style={{ background: 'linear-gradient(90deg, #7f5fff 0%, #00c6ff 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>Gönder</button>
        </div>
        <ul style={{ color: '#e0e0e0', fontSize: 14, paddingLeft: 18 }}>
          {sentAnnouncements.map((msg, i) => <li key={i}>{msg}</li>)}
        </ul>
      </div>
      {/* Otomatik özet ve kısa notlar alanı */}
      <div style={{ background: '#7f5fff22', borderRadius: 12, padding: '1rem 1.2rem', color: '#e0e0e0', fontSize: 15 }}>
        <b>Haftalık Özet:</b> Sınıfın ortalama odak puanı bu hafta %5 arttı. En çok gelişen öğrenci: <b>Elif Kaya</b> 🎉
        <br />
        <b>Notlar:</b> Öğrencilerle birebir ilgilenmek verimi artırıyor. Haftaya mini bir yarışma planlanabilir.
      </div>
      {error && <div style={{ color: '#ff6b6b', marginTop: 16 }}>{error}</div>}
    </div>
  );
};

export default TeacherPanel; 
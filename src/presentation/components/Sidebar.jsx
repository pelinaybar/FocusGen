// Not: Sol sabit hamburger menü (sidebar) ve Odaklanma Koçu sohbet arayüzü. Burada rehber, motivasyon, taktikler ve yapay zeka desteği var.
import React, { useState, useEffect } from 'react';
import './Sidebar.css';

// Not: Sidebar başlıkları ve içerikleri
const MENU_ITEMS = [
  { key: 'coach', label: 'Odaklanma Koçu (Yapay Zeka)' },
  { key: 'guide', label: 'Rehber / Danışma' },
  { key: 'motivation', label: 'Motivasyon Cümleleri' },
  { key: 'tactics', label: 'Odaklanma Taktikleri' },
];

// Not: Motivasyon cümleleri ve taktikler örnek olarak burada
const MOTIVATION_LIST = [
  'Başlamak için mükemmel olmanı bekleme, mükemmel olmak için başla!',
  'Her gün küçük bir adım, büyük değişimlere yol açar.',
  'Odaklan, nefes al, devam et!',
];
const TACTICS_LIST = [
  '25 dakika odaklan, 5 dakika mola ver (Pomodoro).',
  'Telefonunu başka odaya bırak.',
  'Çalışma alanını sadeleştir.',
];

// Not: Soru-cevaplı chatbot için örnek veri
const QA_LIST = [
  { q: 'Odaklanmakta zorlanıyorum, ne yapmalıyım?', a: 'Kısa bir mola ver, derin nefes al ve dikkat dağıtıcıları ortadan kaldır. Çalışma ortamını sadeleştir ve küçük hedeflerle başla.' },
  { q: 'Pomodoro tekniği nedir?', a: 'Pomodoro, 25 dakika odaklanıp 5 dakika mola vermeye dayalı bir zaman yönetimi tekniğidir. 4 pomodoro sonrası uzun mola verilir.' },
  { q: 'Motivasyonum yok, nasıl motive olabilirim?', a: 'Küçük hedefler koy, başardıkça kendini ödüllendir. Başarılarını görünür kıl ve ilerlemeni takip et.' },
  { q: 'Dikkatimi dağıtan şeyleri nasıl engellerim?', a: 'Telefonunu uzaklaştır, bildirimleri kapat, tek bir işe odaklan ve çalışma ortamını sadeleştir.' },
  { q: 'Sınav stresiyle nasıl başa çıkabilirim?', a: 'Düzenli tekrar yap, nefes egzersizleri uygula, yeterli uyku al ve sınavdan önce kısa yürüyüşler yap.' },
  { q: 'Verimli ders çalışmak için önerileriniz var mı?', a: 'Kısa ve odaklı çalışma seansları yap, not al, aktif tekrar uygula ve öğrendiklerini başkasına anlat.' },
  { q: 'Mola vermek odaklanmayı bozar mı?', a: 'Hayır, aksine kısa molalar beynin dinlenmesini sağlar ve uzun vadede odaklanmayı artırır.' },
  { q: 'Göz sağlığımı nasıl koruyabilirim?', a: 'Her 20 dakikada bir 20 saniye uzağa bak (20-20-20 kuralı), ekran parlaklığını ayarla ve göz kırpmayı unutma.' },
  { q: 'Odak artırıcı uygulamalar var mı?', a: 'Forest, Focus To-Do, Cold Turkey gibi uygulamalar odaklanmanı destekleyebilir.' },
  { q: 'Çalışma ortamı nasıl olmalı?', a: 'Aydınlık, sessiz, düzenli ve dikkat dağıtıcı nesnelerden arındırılmış bir ortam tercih et.' },
  { q: 'Motivasyon kaybı yaşarsam ne yapmalıyım?', a: 'Kısa bir yürüyüş yap, sevdiğin bir müzik dinle, başarılarını hatırla ve küçük bir ödül koy.' },
  { q: 'Sınavdan önce nasıl hazırlanmalıyım?', a: 'Son gün yeni konu öğrenmektense tekrar yap, iyi uyu, sağlıklı beslen ve sınav sabahı hafif bir kahvaltı yap.' },
  { q: 'Dikkat egzersizleri nelerdir?', a: 'Nefes egzersizleri, meditasyon, kısa süreli odaklanma oyunları ve görsel dikkat testleri faydalı olabilir.' },
  { q: 'Teknolojik dikkat dağıtıcılarla nasıl başa çıkılır?', a: 'Telefonu başka odaya bırak, sosyal medya uygulamalarını sınırla, çalışma süresince interneti kısıtla.' },
  { q: 'Uyku ve odaklanma ilişkisi nedir?', a: 'Yeterli ve kaliteli uyku, odaklanma ve hafıza için kritiktir. Uykusuzluk dikkat dağınıklığına yol açar.' },
  { q: 'Uzun süre odaklanmak için ne yapmalıyım?', a: 'Çalışma süresini parçalara böl, düzenli molalar ver, su iç ve ortamı havalandır.' },
  { q: 'Kısa molalar neden önemli?', a: 'Beynin dinlenmesini sağlar, yorgunluğu azaltır ve yeni bilgiye daha iyi odaklanmanı sağlar.' },
  { q: 'Hedef belirlemenin önemi nedir?', a: 'Net hedefler motivasyonu artırır, ilerlemeni ölçmeni sağlar ve odaklanmanı kolaylaştırır.' },
  { q: 'Odaklanma alışkanlığı nasıl kazanılır?', a: 'Her gün aynı saatte çalışmak, küçük hedeflerle başlamak ve başarıyı ödüllendirmek alışkanlık kazandırır.' },
  { q: 'Sınav anında panik olursam ne yapmalıyım?', a: 'Derin nefes al, soruları sırayla çöz, takıldığın soruda çok oyalanma ve kendine güven.' },
];

// Not: Soruya tıklanınca cevap gösteren gelişmiş chatbot
function CoachChat({ messages, onQuestion, availableQuestions, showPrompt, isFirstQuestion }) {
  return (
    <div className="coach-chat">
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.from === 'user' ? 'msg-user' : 'msg-bot'}>{msg.text}</div>
        ))}
      </div>
      <div className="chat-questions" style={isFirstQuestion ? {maxHeight: 180, overflowY: 'auto', flexWrap: 'nowrap', flexDirection: 'column', display: 'flex'} : {}}>
        {/* Not: İlk soruda tüm sorular kaydırmalı olarak */}
        {isFirstQuestion && availableQuestions.map((qa, i) => (
          <button key={i} onClick={() => onQuestion(qa.q, qa.a)} className="chat-q-btn" style={{marginBottom: 6}}>{qa.q}</button>
        ))}
        {/* Not: Sonraki sorularda öneri başlığı ve 3 seçenek */}
        {!isFirstQuestion && showPrompt && availableQuestions.length > 0 && (
          <div className="msg-bot" style={{marginBottom: 8}}>Bunu da öğrenmek ister misin?</div>
        )}
        {!isFirstQuestion && availableQuestions.map((qa, i) => (
          <button key={i} onClick={() => onQuestion(qa.q, qa.a)} className="chat-q-btn">{qa.q}</button>
        ))}
      </div>
    </div>
  );
}

// Not: Rehber/SSS için interaktif bileşen
function GuideFAQ() {
  // SSS soruları ve cevapları
  const faqList = [
    {
      q: 'Odaklanamıyorum, ne yapmalıyım?',
      a: 'Kısa bir mola ver, dikkat dağıtıcıları ortadan kaldır, çalışma ortamını sadeleştir ve küçük hedeflerle başla.'
    },
    {
      q: 'Sınav kaygısı ile nasıl başa çıkabilirim?',
      a: 'Düzenli tekrar yap, nefes egzersizleri uygula, yeterli uyku al ve sınavdan önce kısa yürüyüşler yap.'
    },
    {
      q: 'Zaman yönetimi için önerileriniz var mı?',
      a: 'Günlük yapılacaklar listesi oluştur, işleri önceliklendir, Pomodoro tekniğini dene ve mola vermeyi unutma.'
    },
    {
      q: 'Motivasyonum düştüğünde ne yapmalıyım?',
      a: 'Kısa bir yürüyüş yap, sevdiğin bir müzik dinle, başarılarını hatırla ve küçük bir ödül koy.'
    },
  ];
  const [openIndex, setOpenIndex] = React.useState(null);

  return (
    <div>
      <h3 style={{color:'#7f5fff', marginBottom:8}}>Sıkça Sorulan Sorular</h3>
      <ul style={{marginBottom:18, paddingLeft:0}}>
        {faqList.map((item, i) => (
          <li key={i} style={{marginBottom:10, listStyle:'none'}}>
            <button onClick={() => setOpenIndex(openIndex === i ? null : i)} style={{background:'none', border:'none', color:'#fff', fontWeight:600, cursor:'pointer', fontSize:'1.05rem', textAlign:'left', padding:0}}>
              {item.q}
            </button>
            {openIndex === i && (
              <div style={{marginTop:4, color:'#b3e0ff', fontSize:'0.98rem', background:'#232526cc', borderRadius:8, padding:'0.5rem 0.8rem', boxShadow:'0 1px 6px #7f5fff22'}}>
                {item.a}
              </div>
            )}
          </li>
        ))}
      </ul>
      <h3 style={{color:'#7f5fff', marginBottom:8}}>Acil Destek Bilgileri</h3>
      <ul style={{marginBottom:18}}>
        <li>112 Acil</li>
        <li>183 Sosyal Destek Hattı</li>
        <li>Okul/üniversite psikolojik danışma merkezi</li>
      </ul>
      <h3 style={{color:'#7f5fff', marginBottom:8}}>Küçük Motivasyon Notları</h3>
      <ul>
        <li>Unutma, yalnız değilsin. Zorlandığında yardım istemekten çekinme.</li>
        <li>Her sorun çözülebilir, önemli olan pes etmemek.</li>
      </ul>
    </div>
  );
}

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('coach');
  const [highlight, setHighlight] = useState(true); // İlk girişte animasyon
  // Not: CoachChat mesajlarını burada tutuyorum, sekme değişse de kaybolmaz
  const [coachMessages, setCoachMessages] = useState([
    { from: 'bot', text: 'Merhaba! Sormak istediğin bir şey var mı? Bir soru seçebilirsin.' }
  ]);
  // Not: Kullanıcıya sunulacak soruların listesini burada tutuyorum
  const [remainingQuestions, setRemainingQuestions] = useState(QA_LIST);

  // Not: Sidebar açma/kapama fonksiyonu
  const toggleSidebar = () => setOpen(val => !val);

  // Not: Soruya tıklanınca mesajları güncelle ve sorulan soruyu listeden çıkar
  const handleCoachQuestion = (q, a) => {
    setCoachMessages(msgs => [...msgs, { from: 'user', text: q }, { from: 'bot', text: a }]);
    setRemainingQuestions(prev => prev.filter(qa => qa.q !== q));
  };

  // Not: İlk soru mu soruluyor kontrolü
  const isFirstQuestion = coachMessages.length === 1;
  // Not: İlk soruda tüm sorular, sonrasında 3 öneri
  const showQuestions = isFirstQuestion ? remainingQuestions : remainingQuestions.slice(0, 3);
  const showPrompt = !isFirstQuestion && coachMessages.length > 1;

  // İlk girişte hamburger menüyü vurgula, tıklanınca kaldır
  useEffect(() => {
    if (open) setHighlight(false);
    else setHighlight(true);
  }, [open]);

  return (
    <>
      {/* Not: Hamburger ikonu sol üstte */}
      <div
        className={`sidebar-hamburger${highlight ? ' highlight' : ''}`}
        onClick={() => { setOpen(val => !val); setHighlight(false); }}
        style={highlight ? hamburgerHighlightStyle : {}}
      >
        <span></span><span></span><span></span>
      </div>
      <aside className={`sidebar${open ? ' open' : ''}`}>
        <div className="sidebar-header">
          <span>Menü</span>
          <button onClick={toggleSidebar}>Kapat</button>
        </div>
        <ul className="sidebar-menu">
          {MENU_ITEMS.map(item => (
            <li
              key={item.key}
              className={active === item.key ? 'active' : ''}
              onClick={() => setActive(item.key)}
            >
              {item.label}
            </li>
          ))}
        </ul>
        <div className="sidebar-content">
          {active === 'coach' && <CoachChat messages={coachMessages} onQuestion={handleCoachQuestion} availableQuestions={showQuestions} showPrompt={showPrompt} isFirstQuestion={isFirstQuestion} />}
          {active === 'guide' && (
            <GuideFAQ />
          )}
          {active === 'motivation' && (
            <ul>
              {MOTIVATION_LIST.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          )}
          {active === 'tactics' && (
            <ul>
              {TACTICS_LIST.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          )}
        </div>
      </aside>
      {/* Not: Sidebar açıkken arka planı karartmak için basit bir overlay */}
      {open && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  );
};

const hamburgerHighlightStyle = {
  boxShadow: '0 0 16px 4px #7f5fff, 0 0 32px 8px #00c6ff',
  background: 'linear-gradient(90deg, #7f5fff 0%, #00c6ff 100%)',
  borderRadius: 12,
  animation: 'shake 0.7s infinite',
  transition: 'all 0.3s',
};

export default Sidebar; 
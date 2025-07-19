// Not: Biz Kimiz sayfası. Ekibimizin hikayesini burada anlattım.
import React from 'react';
import './AboutSection.css';

const AboutSection = () => (
  <section className="about-section" id="about">
    <h2 className="about-title">👩‍💻 Biz Kimiz?</h2>
    <div className="about-content">
      <p>
        {/* Not: Burada ekibin hikayesini biraz esprili ve uzun tuttum. */}
        Merhaba! Biz, <b>Yapay Zeka ve Teknoloji Akademisi</b> Bootcamp'inin en enerjik, en meraklı ve en odaklı ekibiyiz! 🚀
        <br /><br />
        Her şey, "Odaklanmak neden bu kadar zor?" sorusuyla başladı. Kahvelerimizi yudumlarken, gözlerimizin ekranda ne kadar gezindiğini fark ettik ve dedik ki: <b>"Odaklanmayı teknolojiyle ölçsek nasıl olur?"</b> İşte böylece <span className="about-highlight">Focus Tracker</span> doğdu!
        <br /><br />
        Ekibimiz 5 kişiden oluşuyor:
        <ul className="about-list">
          {/* Not: LinkedIn linklerini isimlerin üstüne ekledim. Pelin için link yok. */}
          <li>✨ <b><a href="https://www.linkedin.com/in/aslisdetetik?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer">Aslı Sude Tetik</a></b> – Takımın motivasyon kaynağı, kodun melodisi!</li>
          <li>✨ <b>Pelin Aybar</b> – Backedin ustası, tasarımın sihirbazı!</li>
          <li>✨ <b><a href="https://www.linkedin.com/in/anda%C3%A7semercio%C4%9Flu614a221?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer">Andaç Semercioğlu</a></b> – Algoritma avcısı, çözüm makinesi!</li>
          <li>✨ <b><a href="https://www.linkedin.com/in/fethiye-helvac%C4%B1lar-?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer">Fethiye Helvacılar</a></b> – Testlerin kraliçesi, hata avcısı!</li>
          <li>✨ <b><a href="https://www.linkedin.com/in/bet%C3%BCl-alpaslan-164998289?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer">Betül Alpaslan</a></b> – Yaratıcı fikirlerin kaynağı, ekip ruhunun mimarı!</li>
        </ul>
        <br />
        {/* Not: Uzaktan çalıştığımız için başarılarımızı ekran başında kutladık! */}
        Her birimiz farklı alanlarda uzman olsak da, ortak noktamız <b>teknolojiye ve öğrenmeye olan tutkumuz</b>. Birlikte kod yazarken, bazen debug yaparken gözlerimizden yaşlar gelirken, bazen de başarılarımızı kutlarken kahkahalarımız ekran başında yankılandı!
        <br /><br />
        Focus Tracker, sadece bir proje değil; <b>ekip ruhumuzun, emeğimizin ve hayallerimizin bir ürünü</b>. Umarız siz de kullanırken bizim kadar keyif alırsınız!
        <br /><br />
        <span className="about-highlight">Takipte kalın, odakta kalın! 😎</span>
      </p>
      {/* Not: Vizyon ve hedefler bölümü ekledim */}
      <div className="about-vision">
        <h3>🚀 Vizyonumuz ve Gelecek Hedeflerimiz</h3>
        <p>
          Amacımız, teknolojiyle odaklanmayı herkes için kolay ve eğlenceli hale getirmek. Focus Tracker’ı daha fazla kullanıcıya ulaştırmak, yeni odaklanma teknikleri ve yapay zeka destekli özellikler eklemek, eğitimde ve iş dünyasında verimliliği artırmak istiyoruz. Her gün daha iyiye gitmek için çalışmaya devam!
        </p>
      </div>
      {/* Sosyal medya ve ek bilgiler için buraya alan eklenebilir */}
    </div>
  </section>
);

export default AboutSection; 
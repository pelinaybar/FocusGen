# 🎯 FocusGen - Odak Takip Sistemi

FocusGen, öğrencilerin ders sırasındaki odak seviyelerini gerçek zamanlı olarak takip eden ve öğretmenlere detaylı raporlar sunan modern bir web uygulamasıdır.

Neden “FocusGen”?
Proje ekibimizde farklı yaş gruplarından üyeler yer aldığı için, jenerasyonlar arası iş birliğini ve teknolojiye ortak katkıyı temsil etmek amacıyla “FocusGen” (Focus + Generation) ismi tercih edilmiştir. Bu isim, farklı kuşaklardan gelen bireylerin birlikte üreterek ortaya koyduğu güçlü bir vizyonu temsil eder.

## 🚀 Özellikler

- **Gerçek Zamanlı Odak Takibi**: Face-api.js ile yüz analizi
- **Öğretmen Paneli**: Sınıf yönetimi ve öğrenci takibi
- **Öğrenci Paneli**: Kişisel odak göstergesi ve sınıf bilgileri
- **Duyuru Sistemi**: Sınıf bazında anlık duyuru gönderme
- **İstatistikler**: Sınıf ortalaması ve odak verileri
- **Modern UI/UX**: Responsive ve kullanıcı dostu arayüz

## 📋 Gereksinimler

### Sistem Gereksinimleri
- **Node.js** (v16 veya üzeri)
- **Python** (v3.9 veya üzeri)
- **PostgreSQL** (v12 veya üzeri)
- **Git**

### Kurulum Adımları

## 1️⃣ Projeyi İndirin

```bash
git clone <repository-url>
cd Grup201-main
```

## 2️⃣ Backend Kurulumu

### PostgreSQL Kurulumu
```bash
# macOS (Homebrew ile)
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Veritabanı Oluşturun
```bash
# PostgreSQL'e bağlanın
sudo -u postgres psql

# Veritabanı oluşturun
CREATE DATABASE focusgen;
CREATE USER focusgen_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE focusgen TO focusgen_user;
\q
```

### Python Sanal Ortamı Oluşturun
```bash
cd backend
python -m venv venv

# macOS/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### Python Bağımlılıklarını Yükleyin
```bash
pip install -r requirements.txt
```

### Veritabanı Bağlantısını Yapılandırın
`backend/core/database.py` dosyasını düzenleyin:
```python
DATABASE_URL = "postgresql://focusgen_user:your_password@localhost/focusgen"
```

### Veritabanı Tablolarını Oluşturun
```bash
# Alembic ile migration
alembic upgrade head

# Veya manuel olarak
python create_tables.py
```

## 3️⃣ Frontend Kurulumu

### Node.js Bağımlılıklarını Yükleyin
```bash
# Proje ana dizininde
npm install
```

## 4️⃣ Projeyi Çalıştırın

### Backend'i Başlatın
```bash
cd backend
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate  # Windows

uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend'i Başlatın
```bash
# Yeni bir terminal açın
npm run dev
```

## 5️⃣ Erişim

- **Ana Uygulama**: http://localhost:5173
- **API Dokümantasyonu**: http://localhost:8000/docs
- **Backend API**: http://localhost:8000

## 🎯 Kullanım Rehberi

### İlk Kullanım

1. **Kayıt Olun**: http://localhost:5173 adresine gidin
2. **Öğretmen Hesabı**: Yeni bir öğretmen hesabı oluşturun
3. **Sınıf Oluşturun**: Öğretmen panelinden sınıf oluşturun
4. **Öğrenci Hesabı**: Ayrı bir tarayıcıda öğrenci hesabı oluşturun
5. **Sınıfa Katılın**: Join code ile sınıfa katılın

### Özellikler

#### Öğretmen Paneli
- Sınıf oluşturma ve yönetimi
- Öğrenci odak verilerini görüntüleme
- Sınıf bazında duyuru gönderme
- İstatistikler ve raporlar

#### Öğrenci Paneli
- Gerçek zamanlı odak takibi
- Kamera ile yüz analizi
- Sınıf bilgileri ve duyurular
- Kişisel odak geçmişi

## 🔧 Geliştirme

### Proje Yapısı
```
Grup201-main/
├── backend/                 # FastAPI backend
│   ├── api/                # API endpoint'leri
│   ├── core/               # Veritabanı ve yapılandırma
│   ├── crud/               # Veritabanı işlemleri
│   ├── models/             # SQLAlchemy modelleri
│   ├── schemas/            # Pydantic şemaları
│   └── services/           # İş mantığı
├── src/                    # React frontend
│   ├── presentation/       # UI bileşenleri
│   ├── application/        # İş mantığı
│   ├── infrastructure/     # API çağrıları
│   └── domain/            # Veri modelleri
└── public/                # Statik dosyalar
```

### Teknolojiler

#### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: ORM ve veritabanı yönetimi
- **PostgreSQL**: Ana veritabanı
- **Alembic**: Veritabanı migration'ları
- **Pydantic**: Veri doğrulama

#### Frontend
- **React 18**: Modern UI framework
- **Vite**: Hızlı geliştirme ortamı
- **face-api.js**: Yüz analizi
- **React Router**: Sayfa yönlendirmeleri

## 🐛 Sorun Giderme

### Yaygın Sorunlar

#### Backend Bağlantı Hatası
```bash
# PostgreSQL servisinin çalıştığını kontrol edin
sudo systemctl status postgresql

# Veritabanı bağlantısını test edin
psql -h localhost -U focusgen_user -d focusgen
```

#### Frontend API Hatası
- API URL'lerinin `localhost:8000` olduğunu kontrol edin
- Backend'in çalıştığından emin olun

#### Kamera Erişim Sorunu
- HTTPS gereklidir (production'da)
- Tarayıcı izinlerini kontrol edin
- Kamera erişimini etkinleştirin

### Log Kontrolü
```bash
# Backend logları
tail -f backend/logs/app.log

# Frontend logları
# Tarayıcı Developer Tools > Console
```

## 📦 Production Deployment

### Environment Variables
```bash
# Backend
DATABASE_URL=postgresql://user:pass@host/db
SECRET_KEY=your_secret_key

# Frontend
VITE_API_URL=http://your-api-domain.com
```

### Docker Deployment
```bash
# Backend
docker build -t focusgen-backend ./backend
docker run -p 8000:8000 focusgen-backend

# Frontend
docker build -t focusgen-frontend .
docker run -p 80:80 focusgen-frontend
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👥 Ekibimiz

| İsim                | Rol            |
|---------------------|----------------|
| Fethiye Helvacılar  | Product Owner  |
| Andaç Semercioğlu   | Scrum Master   |
| Pelin Aybar         | Developer      |
| Aslı Sude Tetik     | Developer      |
| Betül Alpaslan      | Developer      |


---

**FocusGen** - Odak takibinde yeni nesil teknoloji! 🎯✨ 

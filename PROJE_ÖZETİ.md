# 🎯 FocusGen - Proje Özeti ve Kurulum Rehberi

## 📋 Proje Hakkında

**FocusGen**, öğrencilerin ders sırasındaki odak seviyelerini gerçek zamanlı olarak takip eden modern bir web uygulamasıdır. Face-api.js teknolojisi ile yüz analizi yaparak odak seviyesini ölçer ve öğretmenlere detaylı raporlar sunar.

## 🚀 Hızlı Başlangıç

### 1. Otomatik Kurulum (Önerilen)

#### macOS/Linux:
```bash
./setup.sh
```

#### Windows:
```bash
setup.bat
```

### 2. Manuel Kurulum

#### Gereksinimler:
- Node.js (v16+)
- Python (v3.9+)
- PostgreSQL (v12+)
- Git

#### Adımlar:
```bash
# 1. Projeyi klonlayın
git clone <repository-url>
cd Grup201-main

# 2. Frontend bağımlılıkları
npm install

# 3. Backend kurulumu
cd backend
python -m venv venv
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate  # Windows
pip install -r requirements.txt

# 4. Veritabanı kurulumu
# PostgreSQL'i başlatın ve veritabanı oluşturun
python create_tables.py
```

### 3. Docker ile Kurulum

```bash
# Tüm servisleri başlat
docker-compose up -d

# Erişim
# Frontend: http://localhost
# Backend: http://localhost:8000
```

## 🎯 Projeyi Çalıştırma

### Hızlı Başlatma:
```bash
./start.sh
```

### Manuel Başlatma:
```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
npm run dev
```

### Erişim:
- **Ana Uygulama**: http://localhost:5173
- **API Dokümantasyonu**: http://localhost:8000/docs

## 🏗️ Proje Mimarisi

### Frontend (React + Vite)
```
src/
├── presentation/          # UI bileşenleri
│   ├── components/       # Yeniden kullanılabilir bileşenler
│   └── pages/           # Sayfa bileşenleri
├── application/          # İş mantığı
├── infrastructure/       # API çağrıları
└── domain/             # Veri modelleri
```

### Backend (FastAPI)
```
backend/
├── api/                # API endpoint'leri
├── core/               # Veritabanı ve yapılandırma
├── crud/               # Veritabanı işlemleri
├── models/             # SQLAlchemy modelleri
├── schemas/            # Pydantic şemaları
└── services/           # İş mantığı
```

## 🗄️ Veritabanı Şeması

### Ana Tablolar:
- **users**: Kullanıcı bilgileri (öğrenci/öğretmen)
- **classes**: Sınıf bilgileri
- **student_classes**: Öğrenci-sınıf ilişkileri
- **focus_scores**: Odak puanları
- **announcements**: Duyurular

## 🎨 Özellikler

### Öğretmen Paneli:
- ✅ Sınıf oluşturma ve yönetimi
- ✅ Öğrenci odak verilerini görüntüleme
- ✅ Sınıf bazında duyuru gönderme
- ✅ İstatistikler ve raporlar

### Öğrenci Paneli:
- ✅ Gerçek zamanlı odak takibi
- ✅ Kamera ile yüz analizi
- ✅ Sınıf bilgileri ve duyurular
- ✅ Kişisel odak geçmişi

## 🔧 Teknolojiler

### Frontend:
- **React 18**: Modern UI framework
- **Vite**: Hızlı geliştirme ortamı
- **face-api.js**: Yüz analizi
- **React Router**: Sayfa yönlendirmeleri

### Backend:
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: ORM ve veritabanı yönetimi
- **PostgreSQL**: Ana veritabanı
- **Pydantic**: Veri doğrulama

## 📁 Dosya Yapısı

```
Grup201-main/
├── README.md              # Detaylı kurulum rehberi
├── setup.sh              # Otomatik kurulum (macOS/Linux)
├── setup.bat             # Otomatik kurulum (Windows)
├── start.sh              # Hızlı başlatma script'i
├── docker-compose.yml    # Docker kurulumu
├── Dockerfile            # Frontend Docker
├── backend/
│   ├── Dockerfile        # Backend Docker
│   ├── requirements.txt  # Python bağımlılıkları
│   ├── main.py          # FastAPI uygulaması
│   └── ...
├── src/                  # React frontend
├── public/               # Statik dosyalar
└── package.json          # Node.js bağımlılıkları
```

## 🐛 Sorun Giderme

### Yaygın Sorunlar:

#### 1. API Bağlantı Hatası
```bash
# API URL'lerini kontrol edin
# Tüm dosyalarda localhost:8000 olduğundan emin olun
```

#### 2. PostgreSQL Bağlantı Hatası
```bash
# PostgreSQL servisini başlatın
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS
```

#### 3. Kamera Erişim Sorunu
- HTTPS gereklidir (production'da)
- Tarayıcı izinlerini kontrol edin
- Kamera erişimini etkinleştirin

## 📦 Deployment

### Production Environment Variables:
```bash
# Backend
DATABASE_URL=postgresql://user:pass@host/db
SECRET_KEY=your_secret_key

# Frontend
VITE_API_URL=http://your-api-domain.com
```

### Docker Deployment:
```bash
# Build ve çalıştır
docker-compose up -d

# Logları görüntüle
docker-compose logs -f
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun
3. Commit edin
4. Push edin
5. Pull Request oluşturun

## 📞 İletişim

- **Proje**: FocusGen - Odak Takip Sistemi
- **Teknoloji**: React + FastAPI + PostgreSQL
- **Lisans**: MIT

---

**FocusGen** - Odak takibinde yeni nesil teknoloji! 🎯✨ 
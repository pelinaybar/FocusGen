@echo off
chcp 65001 >nul
echo 🎯 FocusGen - Otomatik Kurulum Script'i (Windows)
echo.

REM Sistem kontrolü
echo 📋 Sistem gereksinimleri kontrol ediliyor...

REM Node.js kontrolü
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js bulunamadı! Lütfen Node.js'i yükleyin.
    echo https://nodejs.org adresinden indirebilirsiniz.
    pause
    exit /b 1
) else (
    echo ✅ Node.js bulundu
)

REM Python kontrolü
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python bulunamadı! Lütfen Python'u yükleyin.
    pause
    exit /b 1
) else (
    echo ✅ Python bulundu
)

REM Git kontrolü
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git bulunamadı! Lütfen Git'i yükleyin.
    pause
    exit /b 1
) else (
    echo ✅ Git bulundu
)

echo ✅ Tüm sistem gereksinimleri karşılanıyor!
echo.

REM Frontend kurulumu
echo 📦 Frontend bağımlılıkları yükleniyor...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend bağımlılıkları yüklenemedi!
    pause
    exit /b 1
)
echo ✅ Frontend bağımlılıkları yüklendi!
echo.

REM Backend kurulumu
echo 🐍 Backend kurulumu başlatılıyor...
cd backend

REM Python sanal ortamı oluştur
if not exist "venv" (
    echo 🔧 Python sanal ortamı oluşturuluyor...
    python -m venv venv
)

REM Sanal ortamı aktifleştir
echo 🔧 Sanal ortam aktifleştiriliyor...
call venv\Scripts\activate.bat

REM Python bağımlılıklarını yükle
echo 📦 Python bağımlılıkları yükleniyor...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Backend bağımlılıkları yüklenemedi!
    pause
    exit /b 1
)
echo ✅ Backend bağımlılıkları yüklendi!
echo.

REM Veritabanı kurulumu
echo 🗄️ Veritabanı kurulumu...
echo ⚠️  PostgreSQL kurulumu manuel olarak yapılmalıdır.
echo PostgreSQL'i https://www.postgresql.org/download/windows/ adresinden indirin.
echo Kurulumdan sonra aşağıdaki komutları çalıştırın:
echo.
echo psql -U postgres
echo CREATE DATABASE focusgen;
echo CREATE USER focusgen_user WITH PASSWORD 'focusgen123';
echo GRANT ALL PRIVILEGES ON DATABASE focusgen TO focusgen_user;
echo \q
echo.

REM Veritabanı tablolarını oluştur
echo 📋 Veritabanı tabloları oluşturuluyor...
python create_tables.py
echo ✅ Veritabanı kurulumu tamamlandı!
echo.

cd ..

REM Kurulum tamamlandı
echo 🎉 Kurulum tamamlandı!
echo.
echo 🚀 Projeyi başlatmak için:
echo.
echo 1. Backend'i başlatın:
echo    cd backend
echo    venv\Scripts\activate.bat
echo    uvicorn main:app --reload --host 0.0.0.0 --port 8000
echo.
echo 2. Frontend'i başlatın (yeni terminal):
echo    npm run dev
echo.
echo 3. Tarayıcıda açın:
echo    http://localhost:5173
echo.
echo 🎯 FocusGen kullanıma hazır!
pause 
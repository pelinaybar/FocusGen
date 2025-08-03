#!/bin/bash

# 🎯 FocusGen - Otomatik Kurulum Script'i
echo "🎯 FocusGen kurulumu başlatılıyor..."

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Hata kontrolü
set -e

# Sistem kontrolü
echo -e "${BLUE}📋 Sistem gereksinimleri kontrol ediliyor...${NC}"

# Node.js kontrolü
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js bulunamadı! Lütfen Node.js'i yükleyin.${NC}"
    echo "https://nodejs.org adresinden indirebilirsiniz."
    exit 1
else
    echo -e "${GREEN}✅ Node.js bulundu: $(node --version)${NC}"
fi

# Python kontrolü
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python3 bulunamadı! Lütfen Python3'ü yükleyin.${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Python3 bulundu: $(python3 --version)${NC}"
fi

# PostgreSQL kontrolü
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL bulunamadı! Kurulum gerekli.${NC}"
    echo "macOS: brew install postgresql"
    echo "Ubuntu: sudo apt install postgresql"
    echo "Kurulumdan sonra script'i tekrar çalıştırın."
    exit 1
else
    echo -e "${GREEN}✅ PostgreSQL bulundu${NC}"
fi

# Git kontrolü
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git bulunamadı! Lütfen Git'i yükleyin.${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Git bulundu: $(git --version)${NC}"
fi

echo -e "${GREEN}✅ Tüm sistem gereksinimleri karşılanıyor!${NC}"

# Frontend kurulumu
echo -e "${BLUE}📦 Frontend bağımlılıkları yükleniyor...${NC}"
npm install
echo -e "${GREEN}✅ Frontend bağımlılıkları yüklendi!${NC}"

# Backend kurulumu
echo -e "${BLUE}🐍 Backend kurulumu başlatılıyor...${NC}"
cd backend

# Python sanal ortamı oluştur
if [ ! -d "venv" ]; then
    echo -e "${BLUE}🔧 Python sanal ortamı oluşturuluyor...${NC}"
    python3 -m venv venv
fi

# Sanal ortamı aktifleştir
echo -e "${BLUE}🔧 Sanal ortam aktifleştiriliyor...${NC}"
source venv/bin/activate

# Python bağımlılıklarını yükle
echo -e "${BLUE}📦 Python bağımlılıkları yükleniyor...${NC}"
pip install -r requirements.txt
echo -e "${GREEN}✅ Backend bağımlılıkları yüklendi!${NC}"

# Veritabanı kurulumu
echo -e "${BLUE}🗄️  Veritabanı kurulumu...${NC}"

# PostgreSQL servisini başlat
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    brew services start postgresql 2>/dev/null || true
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    sudo systemctl start postgresql 2>/dev/null || true
fi

# Veritabanı oluştur
echo -e "${BLUE}🗄️  Veritabanı oluşturuluyor...${NC}"
sudo -u postgres psql -c "CREATE DATABASE focusgen;" 2>/dev/null || echo "Veritabanı zaten mevcut"
sudo -u postgres psql -c "CREATE USER focusgen_user WITH PASSWORD 'focusgen123';" 2>/dev/null || echo "Kullanıcı zaten mevcut"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE focusgen TO focusgen_user;" 2>/dev/null || true

# Veritabanı tablolarını oluştur
echo -e "${BLUE}📋 Veritabanı tabloları oluşturuluyor...${NC}"
python create_tables.py
echo -e "${GREEN}✅ Veritabanı kurulumu tamamlandı!${NC}"

cd ..

# Kurulum tamamlandı
echo -e "${GREEN}🎉 Kurulum tamamlandı!${NC}"
echo ""
echo -e "${BLUE}🚀 Projeyi başlatmak için:${NC}"
echo ""
echo -e "${YELLOW}1. Backend'i başlatın:${NC}"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   uvicorn main:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo -e "${YELLOW}2. Frontend'i başlatın (yeni terminal):${NC}"
echo "   npm run dev"
echo ""
echo -e "${YELLOW}3. Tarayıcıda açın:${NC}"
echo "   http://localhost:5173"
echo ""
echo -e "${GREEN}🎯 FocusGen kullanıma hazır!${NC}" 
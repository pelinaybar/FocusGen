#!/bin/bash

# 🚀 FocusGen - Hızlı Başlatma Script'i
echo "🚀 FocusGen başlatılıyor..."

# Renk kodları
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Backend'i başlat
echo -e "${BLUE}🔧 Backend başlatılıyor...${NC}"
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# 3 saniye bekle
sleep 3

# Frontend'i başlat
echo -e "${BLUE}🔧 Frontend başlatılıyor...${NC}"
npm run dev &
FRONTEND_PID=$!

# URL'leri göster
echo ""
echo -e "${GREEN}🎉 FocusGen başlatıldı!${NC}"
echo ""
echo -e "${YELLOW}📱 Erişim URL'leri:${NC}"
echo -e "${BLUE}   Ana Uygulama:${NC} http://localhost:5173"
echo -e "${BLUE}   API Docs:${NC} http://localhost:8000/docs"
echo -e "${BLUE}   Backend API:${NC} http://localhost:8000"
echo ""
echo -e "${YELLOW}⏹️  Durdurmak için:${NC}"
echo "   Ctrl+C veya ./stop.sh"
echo ""

# Process'leri bekle
wait $BACKEND_PID $FRONTEND_PID 
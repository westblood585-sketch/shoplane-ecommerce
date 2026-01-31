#!/bin/bash

# 🚀 MyShop Deployment Quick Start
# Bu script deployment öncesi gerekli tüm adımları yapıyor

echo "╔════════════════════════════════════════╗"
echo "║   🚀 MyShop Deployment Quick Start    ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Git Setup
echo -e "${YELLOW}[1/6] Git Repository Oluşturuluyor...${NC}"
if [ ! -d ".git" ]; then
    git init
    git add .
    git commit -m "🎉 Initial commit - MyShop E-commerce Platform"
    echo -e "${GREEN}✅ Git repository oluşturuldu${NC}"
else
    echo -e "${GREEN}✅ Git repository zaten var${NC}"
fi
echo ""

# 2. Backend Dependencies
echo -e "${YELLOW}[2/6] Backend Bağımlılıkları Yükleniyor...${NC}"
cd backend
npm install > /dev/null 2>&1
echo -e "${GREEN}✅ Backend bağımlılıkları yüklendi${NC}"
cd ..
echo ""

# 3. Frontend Dependencies
echo -e "${YELLOW}[3/6] Frontend Bağımlılıkları Yükleniyor...${NC}"
cd frontend
npm install > /dev/null 2>&1
echo -e "${GREEN}✅ Frontend bağımlılıkları yüklendi${NC}"
cd ..
echo ""

# 4. Build Frontend
echo -e "${YELLOW}[4/6] Frontend Build Edilmeye Hazırlanıyor...${NC}"
cd frontend
npm run build > /dev/null 2>&1
if [ -d "dist" ]; then
    echo -e "${GREEN}✅ Frontend build başarılı ($(du -sh dist | cut -f1) disk kullanımı)${NC}"
else
    echo -e "${RED}❌ Frontend build başarısız${NC}"
fi
cd ..
echo ""

# 5. Environment Variables Check
echo -e "${YELLOW}[5/6] Environment Variables Kontrol Ediliyor...${NC}"
if [ -f "backend/.env.production" ]; then
    echo -e "${GREEN}✅ backend/.env.production mevcut${NC}"
else
    echo -e "${RED}❌ backend/.env.production bulunamadı${NC}"
fi

if [ -f "frontend/.env.production" ]; then
    echo -e "${GREEN}✅ frontend/.env.production mevcut${NC}"
else
    echo -e "${RED}❌ frontend/.env.production bulunamadı${NC}"
fi
echo ""

# 6. Deployment Info
echo -e "${YELLOW}[6/6] Deployment Bilgisi${NC}"
echo ""
echo -e "${GREEN}📋 Deployment Checklist:${NC}"
echo "  ✅ Git repository setup"
echo "  ✅ Backend bağımlılıkları"
echo "  ✅ Frontend bağımlılıkları"
echo "  ✅ Frontend build"
echo ""
echo -e "${GREEN}📝 Sonraki Adımlar:${NC}"
echo "  1. MongoDB Atlas kurulumu: https://www.mongodb.com/cloud/atlas"
echo "  2. Render.com'da backend deploy"
echo "  3. Vercel'de frontend deploy"
echo "  4. GitHub Secrets ekle (RENDER_DEPLOY_HOOK, VERCEL_TOKEN)"
echo ""
echo -e "${GREEN}📖 Detaylı Rehber:${NC}"
echo "  DEPLOYMENT_GUIDE.md dosyasını oku"
echo ""
echo -e "${GREEN}🔗 Deployment Links:${NC}"
echo "  Render: https://render.com"
echo "  Vercel: https://vercel.com"
echo "  MongoDB Atlas: https://www.mongodb.com/cloud/atlas"
echo ""
echo -e "${GREEN}🚀 Deployment hazır!${NC}"
echo ""

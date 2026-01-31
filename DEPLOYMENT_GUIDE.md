# 🚀 DEPLOYMENT GUIDE - MyShop E-Ticaret Platformu

## 📋 Deployment Checklist

### ✅ ADIM 1-7: Dosya Yapılandırması (TAMAMLANDI)
- ✅ backend/render.yaml - Render.com config
- ✅ backend/.env.production - Production environment variables
- ✅ backend/package.json - Güvenlik paketleri eklendi
- ✅ backend/src/server.js - Security middleware eklendi
- ✅ backend/src/middleware/logger.js - Logger middleware oluşturuldu
- ✅ backend/seed-production.js - Production seed script
- ✅ .github/workflows/deploy.yml - CI/CD workflow
- ✅ frontend/.env.production - Frontend production config
- ✅ frontend/vite.config.js - Build optimizasyonları
- ✅ frontend/index.html - Google Analytics eklendi
- ✅ .gitignore (root, backend, frontend) - Güncellenmiş

---

## 🔧 SETUP STEPS

### 1️⃣ **Local Setup**

```bash
# Root klasörüne gir
cd ~/Downloads/eticaret-projesi

# Git repository oluştur
git init
git add .
git commit -m "🎉 Initial commit - MyShop E-commerce Platform"
```

### 2️⃣ **MongoDB Atlas Kurulumu**

1. https://www.mongodb.com/cloud/atlas adresine git
2. "Create an Account" → Ücretsiz hesap oluştur
3. **Cluster Oluştur:**
   - "Create a Deployment" → M0 Free tier seç
   - Cluster adı: `myshop-cluster`
   - Provider: AWS
   - Region: Serbestçe seç

4. **Database User Oluştur:**
   - "Database Access" → "Add New Database User"
   - Username: `myshop_user`
   - Password: **Güçlü bir şifre** (örn: `MyShop@2024#Secure`)
   - Role: Read and write to any database

5. **Network Access:**
   - "Network Access" → "Allow Access from Anywhere"
   - IP Address: `0.0.0.0/0` (Production için daha spesifik yapılabilir)

6. **Connection String:**
   - "Databases" → "Connect" → "Drivers"
   - **MongoDB URI:**
   ```
   mongodb+srv://myshop_user:YOUR_PASSWORD@myshop-cluster.xxxxx.mongodb.net/myshop?retryWrites=true&w=majority
   ```
   - Bu URI'yi `backend/.env.production`'a yapıştır

---

### 3️⃣ **Backend - Render.com Deploy**

#### A. GitHub'a Push

```bash
# GitHub'da yeni repository oluştur (myshop)
git remote add origin https://github.com/YOUR_USERNAME/myshop.git
git branch -M main
git push -u origin main
```

#### B. Render.com'da Deploy

1. https://render.com adresine git
2. **New Web Service oluştur:**
   - GitHub repository'ni bağla
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free

3. **Environment Variables Ekle:**

```
NODE_ENV                production
PORT                    5000
MONGODB_URI            mongodb+srv://myshop_user:PASSWORD@myshop-cluster.xxxxx.mongodb.net/myshop?retryWrites=true&w=majority
JWT_SECRET             your-super-secret-key-minimum-32-characters-here
JWT_COOKIE_EXPIRE      7
CLIENT_URL             https://myshop-dogukanbayar.vercel.app
IYZICO_API_KEY         your-api-key
IYZICO_SECRET_KEY      your-secret-key
SMTP_HOST              smtp.gmail.com
SMTP_PORT              587
SMTP_USER              your-email@gmail.com
SMTP_PASS              your-app-password
```

4. **Deploy başlat** → URL al (örn: `https://myshop-backend.onrender.com`)

5. **Deploy Hook Kopyala:**
   - Settings → Deploy Hook
   - GitHub Secrets'a ekle: `RENDER_DEPLOY_HOOK`

---

### 4️⃣ **Frontend - Vercel Deploy**

#### A. Vercel CLI ile Deploy

```bash
# Vercel CLI yükle
npm install -g vercel

# Vercel'e login
vercel login

# Frontend klasörüne git
cd frontend

# İlk deployment
vercel
# Sorulara yanıtla:
# - Set up and deploy? → Y
# - Which scope? → Hesabını seç
# - Link to existing project? → N
# - Project name? → myshop
# - Directory? → ./
# - Override settings? → N

# Production'a deploy
vercel --prod
```

#### B. Vercel Dashboard'da Environment Variables

1. Project Settings → Environment Variables
2. **Ekle:**
   ```
   VITE_API_URL = https://myshop-backend.onrender.com/api
   ```
3. **Redeploy:**
   - Deployments → Redeploy production

#### C. GitHub Secrets Ekle

GitHub Settings → Secrets and Variables → Actions

```
VERCEL_TOKEN          (Vercel Account Settings → Tokens)
VERCEL_ORG_ID         (Vercel Dashboard → Settings)
VERCEL_PROJECT_ID     (Vercel Project Settings)
RENDER_DEPLOY_HOOK    (Render.com → Settings → Deploy Hook)
```

---

### 5️⃣ **Production Database Seed**

```bash
# Backend klasörüne git
cd backend

# Production database'i seed et
node seed-production.js
```

**Oluşturulan Kullanıcılar:**
- **Admin:** admin@myshop.com / Admin123!
- **Demo:** demo@myshop.com / Demo123!

---

### 6️⃣ **Deployment Test**

```bash
# Backend Health Check
curl https://myshop-backend.onrender.com/health

# API Test
curl https://myshop-backend.onrender.com/api/products?limit=5

# Frontend Test
# Browser'da aç: https://myshop.vercel.app
```

**Test Checklist:**
- [ ] Frontend açılıyor
- [ ] Dark mode toggle çalışıyor
- [ ] Login işlevi çalışıyor
- [ ] Admin Panel erişilebilir
- [ ] Analytics grafikler gösteriliyor
- [ ] Ürün listesi yükleniyor
- [ ] Aramak çalışıyor
- [ ] Sepet işlevi çalışıyor

---

## 🔐 **Security Best Practices**

### Uygulanan Güvenlik Önlemleri:
- ✅ Helmet - HTTP headers güvenliği
- ✅ Rate Limiting - DDoS koruması
- ✅ MongoDB Sanitization - NoSQL injection koruması
- ✅ XSS Protection - XSS attack koruması
- ✅ HPP - HTTP Parameter Pollution koruması
- ✅ Compression - Response compression
- ✅ CORS - Cross-Origin Resource Sharing

### Environment Variables Güvenliği:
- Hiçbir secret kodu GitHub'a commitleme
- `.env` dosyaları `.gitignore`'da listeli
- Production ve development environment'ları ayırı

---

## 📊 **Monitoring & Analytics**

### Google Analytics
- Frontend index.html'e eklendi
- Tracking ID: `G-XXXXXXXXXX` (Google Analytics'ten al)

### Backend Logging
- Development: Tüm requestler loglanır
- Production: Sadece errors (4xx, 5xx) loglanır

### Health Checks
```bash
# Backend health
curl https://myshop-backend.onrender.com/health

# Response:
{
  "success": true,
  "message": "Server is running",
  "environment": "production",
  "timestamp": "2024-01-31T..."
}
```

---

## 🔄 **Auto-Deployment (CI/CD)**

### GitHub Actions Workflow
- **File:** `.github/workflows/deploy.yml`
- **Trigger:** `main` branch'a push
- **Actions:**
  1. Backend'i Render.com'a deploy
  2. Frontend'i build et
  3. Frontend'i Vercel'e deploy
  4. Tests çalıştır

### Manual Trigger:
```bash
# Backend redeploy
curl -X POST YOUR_RENDER_DEPLOY_HOOK

# Frontend redeploy
vercel --prod --token YOUR_VERCEL_TOKEN
```

---

## 🌐 **Domain Setup (Opsiyonel)**

### Custom Domain - Vercel
1. Project Settings → Domains
2. Domain ekle (örn: myshop.com)
3. DNS records'u güncelle

### Custom Domain - Render.com
1. Settings → Custom Domain
2. Backend subdomain (örn: api.myshop.com)
3. DNS records'u güncelle

---

## 📱 **PWA Configuration**

### Progressive Web App Features
- ✅ Service Worker (public/sw.js)
- ✅ Web App Manifest (public/manifest.json)
- ✅ App Icons (public/icons/)
- ✅ Offline Support

### Mobil Cihazdan Kurulum
1. https://myshop-dogukanbayar.vercel.app'i aç
2. Browser menüsünden "Ana Ekrana Ekle"
3. Native app gibi kullan

---

## 🚨 **Troubleshooting**

### Backend Deploy Hatası
```bash
# Logs kontrol et
# Render.com Dashboard → Service → Logs

# Local'de test et
cd backend
npm install
npm start
```

### Frontend Build Hatası
```bash
# Build'i local'de test et
cd frontend
npm install
npm run build

# Hatalar var mı kontrol et
npm run lint
```

### API Connection Hatası
- `VITE_API_URL` environment variable'ını kontrol et
- CORS ayarlarını kontrol et (backend server.js)
- Network tab'ında request'leri kontrol et

### MongoDB Connection Hatası
- Connection string'i kontrol et
- IP whitelist'i kontrol et (0.0.0.0/0 set?)
- Database user credentials'ı kontrol et

---

## 📈 **Performance Optimization**

### Frontend
- ✅ Code splitting (vendor, ui, charts, store)
- ✅ Compression enabled
- ✅ Sourcemap disabled (production)
- ✅ Image optimization

### Backend
- ✅ Compression middleware
- ✅ Rate limiting
- ✅ Connection pooling

---

## 📞 **Support Resources**

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **MongoDB Atlas:** https://docs.atlas.mongodb.com
- **Express Security:** https://expressjs.com/en/advanced/best-practice-security.html

---

## ✅ **Post-Deployment Checklist**

- [ ] Frontend ve Backend production'da çalışıyor
- [ ] Database'e veri seed edildi
- [ ] Admin kullanıcısı oluşturuldu
- [ ] SSL sertifikası aktif (auto. Vercel/Render)
- [ ] Email notifications kurulu
- [ ] Backup strategy hazırlandı
- [ ] Monitoring aktif
- [ ] Analytics kurulu
- [ ] Custom domain konfigüre edildi (opsiyonel)
- [ ] CI/CD workflow test edildi

---

## 🎉 **Deployment Tamamlandı!**

**Production URLs:**
- 🌐 Frontend: https://myshop-dogukanbayar.vercel.app
- ⚙️ Backend: https://myshop-backend.onrender.com
- 📊 Admin Panel: https://myshop-dogukanbayar.vercel.app/admin

**Default Credentials:**
```
Admin Email: admin@myshop.com
Admin Password: Admin123!

Demo Email: demo@myshop.com
Demo Password: Demo123!
```

**Features:**
✅ 570+ Ürün
✅ PWA Support
✅ Dark Mode
✅ Live Chat
✅ Gamification (Spin Wheel)
✅ Analytics Dashboard
✅ Admin Panel
✅ Mega Menu
✅ Smart Search
✅ Quick View
✅ Favorites System
✅ Recently Viewed
✅ Compare Products

**Kontakt & Support:**
Herhangi bir sorun için GitHub Issues'u kullan.

---

Last Updated: 31 Ocak 2026
Version: 1.0.0 Production

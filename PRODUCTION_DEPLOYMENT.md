# 🚀 Production Deployment Guide (Ücretsiz)

## 📋 Sistem Sınırları
- **Backend**: Render free tier (0.5 CPU, 512MB RAM, 15 dakika inaktif = uyku)
- **Frontend**: Vercel (Unlimited)
- **Database**: MongoDB Atlas M0 (512MB storage)

---

## ✅ 1. MONGODB ATLAS (Database Kurulumu)

### Adımlar:

1. **Web'e git**: https://www.mongodb.com/cloud/atlas
2. **Sign Up** (email'inle)
3. **Create Organization** → "eticaret-project"
4. **Create Project** → Herhangi bir isim
5. **Create Cluster**:
   - Provider: AWS
   - Region: Frankfurt (eu-central-1) - Avrupa'ya yakın hızlı
   - Cluster Tier: **M0 Sandbox** ✅ (BEDAVA)
   - "Create Cluster" & 3-5 dakika bekle
   
6. **Database Access** (Sol menu):
   - Add Database User
   - Username: `eticaret_user`
   - Password: Güçlü şifre (kopyala → not et)
   - Autogenerate password seç
   
7. **Network Access** (Sol menu):
   - Add IP Address
   - **Allow from anywhere** (0.0.0.0/0) seç
   - "Confirm" tıkla

8. **Connection String Kopyala**:
   - "Databases" → "Connect" butonu
   - "Connect your application" seç
   - Driver: Node.js, Version: 4.x
   - **Connection String kopyala**:
   ```
   mongodb+srv://eticaret_user:YOUR_PASSWORD@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
   - `YOUR_PASSWORD` yerine adım 6'daki şifreyi yaz
   - `/eticaret` ekle sonuna

**Final Connection String:**
```
mongodb+srv://eticaret_user:YOUR_PASSWORD@cluster.mongodb.net/eticaret?retryWrites=true&w=majority
```

---

## 🟢 2. RENDER (Backend Deployment)

### Adımlar:

1. **Web'e git**: https://render.com
2. **Sign Up** (email'inle veya GitHub ile)
3. **New** → **Web Service** seç
4. **Repository Source**:
   - GitHub repository: `dogu08/eticaret-projesi`
   - (Render GitHub ile bağla - popup'ta authorize et)

5. **Configure Service**:
   - **Name**: `eticaret-backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Region**: Frankfurt (closest to users)
   
6. **Root Directory** (Advanced):
   - Root directory: `./backend`
   
7. **Environment Variables** (Add):
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://eticaret_user:YOUR_PASSWORD@cluster.mongodb.net/eticaret?retryWrites=true&w=majority
   JWT_SECRET=super_secret_key_123456789_abcdefghij_production
   JWT_EXPIRE=30d
   CLIENT_URL=https://eticaret-frontend.vercel.app
   CLIENT_URLS=https://eticaret-frontend.vercel.app
   IYZICO_API_KEY=sandbox-your-api-key
   IYZICO_SECRET_KEY=sandbox-your-secret-key
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   SMTP_FROM_EMAIL=noreply@myshop.com
   ```

8. **Deploy** → "Create Web Service"
9. ⏳ Deploy 3-5 dakika sürer
10. **Backend URL'sini kopyala** (örn: `https://eticaret-backend.onrender.com`)

### Uyku Sorunu Çözümü:
Render'ın free tier 15 dakika sonra uyku modu giriyor. Çözüm:
- UptimeRobot (https://uptimerobot.com) ücretsiz olarak her 5 dakika ping at
- Monitor URL: `https://eticaret-backend.onrender.com/api/experiments/active/home`

---

## 🔵 3. VERCEL (Frontend Deployment)

### Adımlar:

1. **Web'e git**: https://vercel.com
2. **Sign Up** (email'inle)
3. **Import Project**:
   - "Import Git Repository"
   - GitHub: `dogu08/eticaret-projesi`
   - (GitHub'ı authorize et)

4. **Configure Project**:
   - **Project Name**: `eticaret-frontend`
   - **Framework Preset**: Vite
   - **Root Directory**: `./frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Environment Variables** (Add):
   ```
   VITE_API_URL=https://eticaret-backend.onrender.com/api
   VITE_APP_NAME=MyShop
   VITE_ENABLE_PWA=true
   VITE_ENABLE_CHAT=true
   VITE_ENABLE_ANALYTICS=true
   VITE_ENABLE_GAMIFICATION=true
   ```

6. **Deploy** → "Deploy"
7. ⏳ Deploy 1-2 dakika sürer
8. **Frontend URL'sini kopyala** (vercel otomatik verecek)

---

## 🧪 4. TEST ETME

### Backend:
```bash
curl https://eticaret-backend.onrender.com/api/experiments/active/home
```
→ JSON response gerekli

### Frontend:
- https://eticaret-frontend.vercel.app adresine git
- Giriş yap: `demo@example.com` / `123456`
- Ürünleri görüp, "Sepete Ekle" yapabilmen gerekli

### Sorun Giderme:

**Backend 503 hatası alıyorsam:**
- Render dashboard'da logs kontrol et
- Environment variable'lar doğru mu?
- MongoDB Atlas connection string'i kontrol et

**Frontend ürün satırları boşsa:**
- DevTools → Network → `/api/products` kontrol et
- VITE_API_URL doğru mu?
- Backend 200 response veriyor mu?

---

## 📝 Adım Adım Checklist

- [ ] MongoDB Atlas cluster + user + connection string ✅
- [ ] Render backend deploy + environment variables ✅
- [ ] Vercel frontend deploy + environment variables ✅
- [ ] Backend URL test (`/api/experiment...`)
- [ ] Frontend açıldı mı?
- [ ] Giriş yaptın mı?
- [ ] Sepete Ekle button çalışıyor mu?
- [ ] UptimeRobot'a ping kuralı ekle (isteğe bağlı)

---

## 🚨 Production İçin Önemli

**JWT_SECRET değiştir!**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
→ Çıkan değeri JWT_SECRET'e yapıştır (her deployment'de farklı olmalı)

**Gerçek Email Kurulumu:**
Gmail SMTP yerine şunları kullan:
- SendGrid
- Mailgun
- AWS SES

---

## 💰 Aylık Maliyet
- **MongoDB Atlas**: $0 (M0 bedava)
- **Render**: $0 (free tier, sleep var)
- **Vercel**: $0 (serverless)
- **UptimeRobot**: $0 (bedava)
- **TOTAL**: $0 ✅

---

## ⚠️ Sınırlamalar & Çözümleri

| Problem | Çözüm |
|---------|-------|
| Render 15 dakika sonra uyku | UptimeRobot/cron job ekle |
| MongoDB 512MB sınırı | Para verip upgrade (veya veri temizle) |
| Vercel build zaman limiti | Optimize et (lazy loading, code splitting) |
| Cold start (ilk request yavaş) | Normal, kullanıcı bekler |

---

Good luck! 🎉

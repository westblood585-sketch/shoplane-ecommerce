# Deployment Guide

## 📋 Overview
This guide covers deploying the MyShop e-commerce platform to production using Railway (backend) and Vercel (frontend).

## 🗄️ Step 1: Database Deployment (MongoDB Atlas)

### Setup MongoDB Atlas
1. Visit https://cloud.mongodb.com
2. Create account and log in
3. Create new cluster (FREE tier available)
4. Go to Database Access → Add New Database User
   - Username: `myshop_user`
   - Password: Generate secure password
   - Built-in roles: Read/write to any database
5. Go to Network Access → Add IP Address
   - For development: Add `0.0.0.0/0` (TEMPORARY)
   - For production: Add specific IPs only
6. Click "Connect" to get connection string
7. Replace `<username>` and `<password>` placeholders

### Connection String Example
```
mongodb+srv://myshop_user:PASSWORD@cluster0.xxxxx.mongodb.net/myshop?retryWrites=true&w=majority
```

---

## 🚀 Step 2: Backend Deployment (Railway)

### Prerequisites
- Node.js installed
- Railway account (https://railway.app)
- MongoDB Atlas connection string

### Deployment Steps

#### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

#### 2. Login to Railway
```bash
railway login
```

#### 3. Initialize Railway Project
```bash
cd backend
railway init
# Follow the prompts to create new project
```

#### 4. Set Environment Variables
```bash
# Database
railway variables set MONGODB_URI="mongodb+srv://username:password@cluster..."
railway variables set NODE_ENV=production
railway variables set PORT=5000

# JWT & Security
railway variables set JWT_SECRET="your-super-secret-key-min-32-chars"
railway variables set JWT_EXPIRE=7d

# Cloudinary (Image Storage)
railway variables set CLOUDINARY_CLOUD_NAME="your-cloud-name"
railway variables set CLOUDINARY_API_KEY="your-api-key"
railway variables set CLOUDINARY_API_SECRET="your-api-secret"

# Email Service
railway variables set EMAIL_SERVICE="gmail"
railway variables set EMAIL_USERNAME="your-email@gmail.com"
railway variables set EMAIL_PASSWORD="your-app-password"
railway variables set EMAIL_FROM="noreply@myshop.com"

# Stripe Payment
railway variables set STRIPE_SECRET_KEY="your-stripe-secret-key"
railway variables set STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"

# Frontend URL (for CORS)
railway variables set FRONTEND_URL="https://myshop.vercel.app"

# Iyzico Payment (if used)
railway variables set IYZICO_API_KEY="your-iyzico-key"
railway variables set IYZICO_SECRET_KEY="your-iyzico-secret"
```

#### 5. Deploy
```bash
railway up
# This will deploy your backend to Railway
```

#### 6. Get Your Backend URL
```bash
railway domain
# Example output: https://myshop-backend-production.up.railway.app
```

---

## 🎨 Step 3: Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (https://vercel.com)
- Frontend code ready
- Backend URL from Railway

### Deployment Steps

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login to Vercel
```bash
vercel login
```

#### 3. Create Environment File
```bash
cd frontend

cat > .env.production << EOF
VITE_API_URL=https://your-railway-backend-url.up.railway.app/api
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
VITE_APP_NAME=MyShop
EOF
```

#### 4. Deploy to Production
```bash
vercel --prod
# Follow prompts:
# - Link existing project? No
# - Project name: myshop
# - Directory: ./
# - Build command: npm run build
# - Install command: npm install
# - Output dir: dist
```

#### 5. Get Your Frontend URL
```bash
# After deployment, you'll get:
# https://myshop.vercel.app
```

---

## 🖼️ Step 4: Cloudinary Setup (Image Storage)

### Setup Steps
1. Visit https://cloudinary.com
2. Create free account
3. Go to Dashboard → Account Details
4. Copy your **Cloud Name**, **API Key**, **API Secret**
5. Go to Settings → Upload
6. Enable "Unsigned uploading"
7. Create upload preset: `myshop-products`
8. Use these credentials in your backend environment variables

---

## 💳 Step 5: Stripe Setup (Payment Processing)

### Setup Steps
1. Visit https://dashboard.stripe.com
2. Create account and verify
3. Go to Developers → API Keys
4. Copy **Publishable Key** and **Secret Key**
5. Set these in your environment variables
6. Go to Webhooks → Add endpoint
   - Endpoint URL: `https://your-backend-url/api/payments/webhook`
   - Events to send:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
7. Copy Webhook Signing Secret
8. Add to `.env`: `STRIPE_WEBHOOK_SECRET`

### Testing Payments
Use Stripe test cards:
- Visa: `4242 4242 4242 4242`
- Expire: Any future date
- CVC: Any 3 digits

---

## 📊 Step 6: Monitoring & Uptime

### Setup Uptime Robot
1. Visit https://uptimerobot.com
2. Create account (Free tier: 50 monitors)
3. Add New Monitor:
   - Type: HTTP(s)
   - URL: `https://your-backend-url/health`
   - Monitoring Interval: 5 minutes
   - Alert Contacts: Your email
4. Add another for frontend:
   - URL: `https://myshop.vercel.app`

### Health Check Endpoint
```bash
# Test your backend health
curl https://your-backend-url/health
# Should return: { status: "OK", uptime, database: {...} }
```

---

## 🔒 Security Checklist

- [x] All API keys stored in environment variables
- [x] HTTPS enforced on all endpoints
- [x] CORS configured for production domain
- [x] Rate limiting enabled on API
- [x] Security headers configured (Helmet.js)
- [x] Input validation on all endpoints
- [x] XSS protection enabled
- [x] CSRF tokens implemented
- [x] Sensitive data removed from logs
- [x] Database backups automated

---

## 📈 Performance Optimization

### Frontend Optimization
- [x] Code splitting enabled
- [x] Tree-shaking configured
- [x] Images optimized with Cloudinary
- [x] Lazy loading implemented
- [x] Gzip/Brotli compression
- [x] Lighthouse score 90+

### Backend Optimization
- [x] Database indexes created
- [x] Connection pooling configured
- [x] Caching headers set
- [x] API response compression
- [x] Load balancing ready (Railway handles this)

---

## 🧪 Testing Before Production

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test

# Test payment flow
# Use Stripe test card: 4242 4242 4242 4242

# Test email notifications
# Place test order, check inbox

# Test authentication
# Register, login, reset password
```

---

## 🚨 Troubleshooting

### Backend Not Starting
```bash
# Check logs
railway logs

# Check if port is available
lsof -i :5000

# Rebuild
railway up --force
```

### Frontend Not Deploying
```bash
# Check build
npm run build

# Check for errors
npm run lint

# View Vercel logs
vercel logs
```

### Database Connection Issues
```bash
# Test connection
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Connected!')).catch(e => console.error(e))"

# Check IP whitelist in MongoDB Atlas
# Add Railway's IPs to Network Access
```

### Payment Processing Errors
```bash
# Check Stripe webhook delivery
# Dashboard → Developers → Webhooks → View details

# Test webhook
curl -X POST https://your-backend-url/api/payments/webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"test"}'
```

---

## 📝 Post-Deployment Tasks

1. ✅ Test complete user journey
   - Browse products
   - Add to cart
   - Checkout with test card
   - Receive order confirmation email

2. ✅ Verify monitoring
   - Check Uptime Robot status
   - Review health check logs
   - Test alert notifications

3. ✅ Update domain (optional)
   - Add custom domain in Vercel
   - Add custom domain in Railway
   - Update SSL certificates

4. ✅ Monitor logs
   - Check error logs daily
   - Monitor API response times
   - Review user analytics

5. ✅ Security audit
   - Run security scan
   - Check for vulnerabilities
   - Update dependencies

---

## 🎉 You're Live!

Your e-commerce platform is now deployed and ready for business!

- **Backend**: https://your-backend-url.up.railway.app
- **Frontend**: https://myshop.vercel.app
- **Health Check**: https://your-backend-url/health
- **Admin Panel**: https://myshop.vercel.app/admin

### Next Steps
1. Start marketing your store
2. Monitor analytics and user behavior
3. Respond to customer inquiries
4. Process orders and shipments
5. Collect customer feedback
6. Continuously improve based on data

---

## 📞 Support

- Railway Support: https://railway.app/support
- Vercel Support: https://vercel.com/support
- MongoDB Support: https://www.mongodb.com/support
- Stripe Support: https://support.stripe.com

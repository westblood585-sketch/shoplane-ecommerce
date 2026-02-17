/**
 * PRODUCTION DEPLOYMENT CONFIGURATION GUIDE
 * 
 * This file contains all the steps needed to deploy your e-commerce app
 * from localhost to production with proper SEO & security settings.
 * 
 * Estimated Time: 30-60 minutes
 * Difficulty: Medium
 * Cost: FREE (using Vercel + Render/Railway for backend)
 */

// ============================================================
// STEP 1: Choose Your Deployment Platforms
// ============================================================

/*
RECOMMENDED SETUP (100% FREE):

Frontend (React/Vite):
  ✅ Vercel (https://vercel.com)
  - Zero-config deployment
  - Automatic HTTPS
  - CDN worldwide
  - Free tier: Unlimited deployments
  - Perfect for Next.js/Vite

Backend (Node.js/Express):
  ✅ Render.com (https://render.com) OR Railway.app (https://railway.app)
  - Free PostgreSQL/MongoDB included
  - Automatic HTTPS
  - $7/month for production (first 750 hours free)
  - Railway: $5/month, more generous free tier

Database:
  ✅ MongoDB Atlas Free Tier (https://mongodb.com/cloud/atlas)
  - 512MB free storage
  - Perfect for starting
  - Upgrade anytime when needed

Domain:
  ✅ Namecheap.com ($0.99/year .com)
  - Register your domain
  - Set up DNS records
*/

// ============================================================
// STEP 2: Environment Variables Setup
// ============================================================

/*
BACKEND - Create .env.production file:
*/

const backendEnvProduction = {
  NODE_ENV: 'production',
  PORT: 5001,
  
  // Database
  MONGODB_URI: 'mongodb+srv://<username>:<password>@cluster.mongodb.net/eticaret?retryWrites=true&w=majority',
  
  // Frontend URL (IMPORTANT FOR CORS & SEO)
  FRONTEND_URL: 'https://yourdomain.com', // Change this!
  
  // Email Service (Optional - for notifications)
  SMTP_HOST: 'smtp.gmail.com',
  SMTP_PORT: 587,
  SMTP_EMAIL: 'your-email@gmail.com',
  SMTP_PASSWORD: 'your-app-password', // Use App Password, not actual password
  
  // JWT & Security
  JWT_SECRET: 'your-super-secret-key-change-this', // Generate: require('crypto').randomBytes(32).toString('hex')
  JWT_EXPIRE: '7d',
  
  // Payment Gateway (Iyzico)
  IYZICO_API_KEY: 'your-api-key',
  IYZICO_API_SECRET: 'your-api-secret',
  IYZICO_BASE_URL: 'https://api.iyzipay.com',
  
  // Logging
  LOG_LEVEL: 'info',
  
  // Security
  ALLOWED_ORIGINS: 'https://yourdomain.com,https://www.yourdomain.com',
  RATE_LIMIT: 100, // requests per 15 minutes
};

/*
FRONTEND - Create .env.production file:
*/

const frontendEnvProduction = {
  // Backend API URL (CRITICAL FOR SEO - used in schemas)
  VITE_API_URL: 'https://api.yourdomain.com', // Your backend domain
  
  // Or if backend is on same domain:
  // VITE_API_URL: 'https://yourdomain.com/api'
  
  // Analytics (Optional)
  VITE_GOOGLE_ANALYTICS_ID: 'G-XXXXXXXXXX',
  
  // Feature Flags
  VITE_ENABLE_PWA: 'true',
  VITE_ENABLE_DARK_MODE: 'true',
};

// ============================================================
// STEP 3: SEO Configuration for Production
// ============================================================

/*
CRITICAL: Update all BASE URLs in your code:

File: backend/scripts/generate-sitemap.js
  ❌ OLD: const BASE_URL = process.env.BASE_URL || 'http://localhost:5178'
  ✅ NEW: const BASE_URL = process.env.BASE_URL || 'https://yourdomain.com'

File: frontend/src/pages/Products/ProductDetailPage.jsx
  ❌ OLD: const productSchema = {
           '@context': 'https://schema.org/',
           'offers': {
             'url': `http://localhost:5178/product/${product?._id}`,
  ✅ NEW: const productSchema = {
           '@context': 'https://schema.org/',
           'offers': {
             'url': `https://yourdomain.com/product/${product?._id}`,

File: frontend/index.html (all og: tags)
  ❌ OLD: <meta property="og:url" content="http://localhost:5178" />
  ✅ NEW: <meta property="og:url" content="https://yourdomain.com" />

File: frontend/src/components/seo/OrganizationSchema.jsx
  ❌ OLD: url: 'http://localhost:5178'
  ✅ NEW: url: 'https://yourdomain.com'
  
  ❌ OLD: 'https://localhost:5178/contact',
  ✅ NEW: 'https://yourdomain.com/contact',

Pro Tip: Use environment variables instead:
  In React: ${import.meta.env.VITE_APP_URL}
  In Node: process.env.FRONTEND_URL
*/

// ============================================================
// STEP 4: Build Optimization
// ============================================================

/*
FRONTEND BUILD:

1. Create optimized production build:
   cd frontend
   npm run build

   This creates:
   - dist/ folder with minified, optimized code
   - Automatic code splitting
   - Image optimization (if using Vite plugins)
   - ~500KB total size (down from ~5MB dev)

2. Verify build works locally:
   npm run preview
   # Should see frontend on http://localhost:4173

3. Test sitemap generation:
   cd backend
   npm run generate-sitemap
   
   This updates public/sitemap.xml with:
   - All products from production DB
   - All categories
   - All info pages
   - File: frontend/public/sitemap.xml
*/

// ============================================================
// STEP 5: DNS & Domain Setup
// ============================================================

/*
When you register domain (e.g., myshop.com):

1. Vercel Frontend Deployment:
   - Deploy on Vercel (see below)
   - Vercel gives you: <projectname>.vercel.app
   - In Vercel Domains → Add myshop.com
   - Add DNS records Vercel shows you to your domain registrar

2. Backend Domain (API):
   - Deploy on Render/Railway
   - Get backend URL: myshop-api.onrender.com
   - Option A: Use as is (api.myshop.com via CNAME)
   - Option B: Subdomain → api.myshop.com points to render

DNS Records to Add (at Namecheap/GoDaddy):
  Type    Name              Value
  ----    ----              -----
  CNAME   www               myshop.vercel.app (points to Vercel)
  CNAME   @                 myshop.vercel.app (root domain)
  CNAME   api               myshop-api.onrender.com (backend)
  
  Settings:
  - SSL: Enabled (automatic with all three)
  - Redirect root to www (optional)

3. Verify Setup:
   curl https://myshop.com/api/products
   # Should return JSON products
*/

// ============================================================
// STEP 6: Deployment Guide - VERCEL (Frontend)
// ============================================================

/*
1. Push code to GitHub:
   git init
   git add .
   git commit -m "Ready for production"
   git remote add origin https://github.com/yourusername/myshop
   git push -u origin main

2. Connect to Vercel:
   a) Go to https://vercel.com
   b) Click "New Project"
   c) "Import Git Repository"
   d) Select your GitHub repository
   e) Framework: Vite
   f) Root Directory: frontend

3. Environment Variables:
   In Vercel Dashboard → Settings → Environment Variables
   Add:
   - VITE_API_URL: https://api.yourdomain.com
   - VITE_APP_URL: https://yourdomain.com
   - Any others from .env.production

4. Deploy:
   - Click "Deploy"
   - Wait 2-3 minutes
   - Get URL: yourdomain.vercel.app
   - Add custom domain in Vercel settings

5. Auto-Deploy:
   - Every push to main branch = automatic deployment
   - Vercel handles HTTPS, CDN, caching automatically
*/

// ============================================================
// STEP 7: Deployment Guide - RENDER/RAILWAY (Backend)
// ============================================================

/*
USING RENDER.COM:

1. Connect GitHub:
   a) Go to https://render.com
   b) Click "New +" → "Web Service"
   c) Select your repository
   d) Choose branch: main

2. Configure:
   - Name: myshop-api (or any name)
   - Environment: Node
   - Build Command: npm install
   - Start Command: npm start (or node src/server.js)
   - Port: 5001

3. Environment Variables:
   In Render Dashboard → Environment:
   Add all variables from .env.production (MongoDB, JWT, etc.)

4. Deploy:
   - Click "Create Web Service"
   - Wait 5-10 minutes for build & deploy
   - Get URL: myshop-api.onrender.com
   - Set up CNAME → api.yourdomain.com (in domain registrar)

5. Free Tier Details:
   - Auto-spins down after 15 min of inactivity (😴)
   - First request after spin-down = 30 sec startup (slow)
   - Upgrade to paid ($7+) to keep always-on
   - OR use Railway for better free tier

USING RAILWAY.APP:

1. Connect GitHub:
   a) Go to https://railway.app
   b) Click "New Project" → "Deploy from GitHub repo"
   c) Select repository

2. Configure:
   - RAM: 0.5GB (default)
   - CPU: 1 (default)
   - Let Railway auto-detect (it's smart)

3. Environment Variables:
   In Railway Project → Variables
   Paste entire .env.production content

4. Deploy:
   - Click "Deploy"
   - Wait 2-3 minutes
   - Railway gives you: yourdomain.up.railway.app
   - Better free tier than Render (no spin-down)
*/

// ============================================================
// STEP 8: Database Setup - MongoDB Atlas
// ============================================================

/*
1. Create Account:
   a) Go to https://mongodb.com/cloud/atlas
   b) Sign up (free)
   c) Create organization: "MyShop"

2. Create Cluster:
   a) Click "Create" → "Database"
   b) Choose "Free" tier (M0 Sandboxed)
   c) Select region close to your users
   d) Wait 5-10 minutes for creation

3. Security:
   a) Network Access → Add IP Address
      - Option 1: Add your IP (for development)
      - Option 2: Allow 0.0.0.0/0 (for production - fine with auth)
   
   b) Database Users → Create User
      - Username: eticaret_admin
      - Password: STRONG_PASSWORD_HERE
      - Built-in Role: Atlas Admin

4. Connection String:
   a) Click "Connect" → "Connect your application"
   b) Copy connection string:
      mongodb+srv://eticaret_admin:<password>@...
   
   c) Replace <password> with your actual password
   d) Add to .env.production as MONGODB_URI

5. Import Data:
   If you have existing data:
   - Use MongoDB Compass (free GUI)
   - Or mongodump/mongorestore
   - Or copy from local MongoDB
*/

// ============================================================
// STEP 9: HTTPS & SSL Certificates
// ============================================================

/*
GOOD NEWS: All platforms handle this automatically!

✅ Vercel:
   - Automatic HTTPS for all domains
   - SSL cert auto-renews
   - No configuration needed

✅ Render/Railway:
   - Automatic HTTPS for custom domains
   - SSL cert auto-renews
   - No configuration needed

❌ DO NOT:
   - Serve HTTP (only HTTPS)
   - Use self-signed certificates in production
   - Ignore SSL warnings

✅ DO:
   - Redirect HTTP → HTTPS (Vercel does this)
   - Test with: https://www.ssllabs.com/ssltest/
   - Get A+ rating for security
*/

// ============================================================
// STEP 10: CRITICAL - SEO Checklist Before Going Live
// ============================================================

/*
Before launching, run this checklist:

TECHNICAL:
  ☐ All http:// changed to https:// 
  ☐ Sitemap generated: npm run generate-sitemap
  ☐ Sitemap accessible: https://yourdomain.com/sitemap.xml
  ☐ robots.txt accessible: https://yourdomain.com/robots.txt
  ☐ No console errors: Check DevTools
  ☐ HTTPS working: curl https://yourdomain.com
  ☐ API accessible: curl https://api.yourdomain.com/products

ON-PAGE:
  ☐ Meta descriptions unique per page
  ☐ Page titles set correctly
  ☐ OG images loading correctly
  ☐ Breadcrumbs visible on product pages
  ☐ Related products showing
  ☐ Category links working

SCHEMAS:
  ☐ Product schema valid: https://schema.org/validate/
  ☐ Organization schema present
  ☐ BreadcrumbList schema on products
  ☐ No duplicate schemas

PERFORMANCE:
  ☐ Lighthouse Score 90+
  ☐ Images optimized (under 2MB homepage)
  ☐ No render-blocking resources
  ☐ Core Web Vitals: Good

SECURITY:
  ☐ HTTPS everywhere (strict)
  ☐ CORS properly configured
  ☐ JWT secret unique & strong
  ☐ Database password different from dev
  ☐ API keys not in code (use env vars)
  ☐ Rate limiting enabled (100 req/15min)

MONITORING:
  ☐ Error logging set up
  ☐ Uptime monitoring enabled
  ☐ Performance monitoring enabled
  ☐ Can access logs easily
*/

// ============================================================
// STEP 11: Google Search Console Setup
// ============================================================

/*
After deploying:

1. Claim Your Domain:
   a) Go to https://search.google.com/search-console
   b) Click "Add property"
   c) Enter: https://yourdomain.com
   d) Choose domain verification method:
      - DNS record (recommended)
      - HTML file upload
      - Google Analytics
   e) Verify

2. Submit Sitemap:
   a) In Search Console → Sitemaps
   b) Click "Add/test sitemap"
   c) Enter: sitemap.xml
   d) Google fetches and indexes all 51 URLs

3. Monitor:
   a) Performance → See your search impressions & clicks
   b) Coverage → Check for indexing errors
   c) Enhancements → See rich snippets (product ratings)
   d) Mobile Usability → Ensure mobile-friendly

4. Set Preferred Domain:
   a) Settings → Domains
   b) Choose: https://yourdomain.com (not www)
   c) Or both (recommend www for consistency)
*/

// ============================================================
// STEP 12: Ongoing Monitoring & SEO
// ============================================================

/*
After launch, monitor monthly:

Google Search Console:
  - Check impressions & CTR (should improve over time)
  - Fix any coverage issues
  - Monitor Core Web Vitals

Google Analytics 4:
  - Session time per page
  - Bounce rate by page
  - Conversion funnels
  - User behavior

Performance:
  - Monthly Lighthouse audit
  - Target: 90+ SEO, 85+ Performance
  - Check for new alerts

SEO:
  - Rank tracking (tools: Ahrefs, Semrush free version)
  - Backlinks (Google Search Console shows referring domains)
  - Content updates needed? (E.g., expand product descriptions)
  - New categories to add?

Every Quarter:
  - Regenerate sitemap: npm run generate-sitemap
  - Submit updated sitemap to Google
  - Audit meta descriptions
  - Check for broken links
  - Update production data
*/

// ============================================================
// COST BREAKDOWN (First Year)
// ============================================================

/*
Domain (Namecheap):          $0.99    (renew: $8.95/year)
MongoDB Atlas:               FREE     (or $57/year for upgraded)
Vercel Frontend:             FREE     ($20/mo if you need more)
Railway Backend:             FREE     (or $5/mo for 24/7 uptime)
─────────────────────────────────────
TOTAL FIRST YEAR:           ~$10     (crazy cheap!)

Production Setup Ready:      ✅ FREE & Professional Grade
*/

export const productionDeploymentGuide = {
  frontendEnvProduction,
  backendEnvProduction,
  platforms: ['Vercel', 'Railway or Render', 'MongoDB Atlas'],
  estimatedTime: '60 minutes',
  totalCost: 'Under $20/year',
};

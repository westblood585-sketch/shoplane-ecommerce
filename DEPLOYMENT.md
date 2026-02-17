# MyShop E-commerce Platform - Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Docker Deployment](#docker-deployment)
7. [CI/CD Setup](#cicd-setup)

## Prerequisites

### Required Software
- Node.js >= 18.0.0
- MongoDB >= 6.0
- npm >= 9.0.0
- Git

### Recommended Services
- MongoDB Atlas (Database)
- Cloudinary (Image hosting)
- Stripe (Payments)
- Railway/Render (Backend hosting)
- Vercel/Netlify (Frontend hosting)

## Environment Setup

### Backend Environment Variables
Create `.env` file in backend directory:
```bash
# Server
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com

# Database
MONGO_URI=your-mongodb-connection-string

# JWT
JWT_SECRET=your-super-secret-key-min-32-characters
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@myshop.com

# Stripe
STRIPE_SECRET_KEY=sk_live_your-key
STRIPE_PUBLISHABLE_KEY=pk_live_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-secret
```

### Frontend Environment Variables
Create `.env` file in frontend directory:
```bash
VITE_API_URL=https://your-backend-url.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your-key
```

## Database Setup

### MongoDB Atlas Setup

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create new cluster (Free tier available)
3. Configure network access (0.0.0.0/0 for production)
4. Create database user
5. Get connection string
6. Update MONGO_URI in .env

### Initialize Database
```bash
cd backend
npm run seed  # Seed initial products
```

## Backend Deployment

### Option 1: Railway

1. Create account at https://railway.app
2. Create new project
3. Connect GitHub repository
4. Add environment variables from .env
5. Deploy
```bash
# Railway CLI (alternative)
npm i -g @railway/cli
railway login
railway init
railway up
```

### Option 2: Render

1. Create account at https://render.com
2. New Web Service
3. Connect GitHub repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables
6. Deploy

### Option 3: VPS (Ubuntu)
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone https://github.com/yourusername/myshop.git
cd myshop/backend

# Install dependencies
npm install --production

# Setup environment
nano .env  # Add your variables

# Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

# Setup Nginx reverse proxy
sudo apt install nginx
sudo nano /etc/nginx/sites-available/myshop
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/myshop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. Create account at https://vercel.com
2. Import GitHub repository
3. Configure:
   - Framework Preset: Vite
   - Root Directory: frontend
   - Build Command: `npm run build`
   - Output Directory: dist
4. Add environment variables
5. Deploy
```bash
# Vercel CLI (alternative)
npm i -g vercel
cd frontend
vercel --prod
```

### Option 2: Netlify

1. Create account at https://netlify.com
2. New site from Git
3. Configure:
   - Base directory: frontend
   - Build command: `npm run build`
   - Publish directory: frontend/dist
4. Add environment variables
5. Deploy

### Option 3: Static Hosting
```bash
# Build frontend
cd frontend
npm run build

# Upload dist/ folder to:
# - AWS S3 + CloudFront
# - Google Cloud Storage
# - Azure Blob Storage
# - GitHub Pages
```

## Docker Deployment

### Build and Run
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Docker Hub Deployment
```bash
# Login to Docker Hub
docker login

# Tag images
docker tag myshop-backend yourusername/myshop-backend:latest
docker tag myshop-frontend yourusername/myshop-frontend:latest

# Push images
docker push yourusername/myshop-backend:latest
docker push yourusername/myshop-frontend:latest
```

## CI/CD Setup

See `.github/workflows/` for GitHub Actions configuration.

## Post-Deployment Checklist

- [ ] All environment variables set
- [ ] Database connected and seeded
- [ ] SSL certificates installed
- [ ] Domain DNS configured
- [ ] CORS origins updated
- [ ] Payment webhooks configured
- [ ] Email service working
- [ ] Image uploads working
- [ ] Error logging enabled
- [ ] Monitoring setup
- [ ] Backups scheduled
- [ ] Security headers verified
- [ ] Rate limiting active
- [ ] Health checks passing

## Monitoring

### Application Monitoring
- PM2 Dashboard: `pm2 monit`
- Logs: `pm2 logs`
- Health: `https://api.yourdomain.com/health/detailed`

### Database Monitoring
- MongoDB Atlas Dashboard
- Connection pooling metrics
- Query performance

### Error Tracking
Consider integrating:
- Sentry (https://sentry.io)
- LogRocket (https://logrocket.com)
- New Relic (https://newrelic.com)

## Backup Strategy

### Automated Backups
```bash
# Add to crontab
0 2 * * * cd /path/to/myshop/backend && node scripts/backup.js
```

### Manual Backup
```bash
mongodump --uri="your-mongodb-uri" --out="./backup-$(date +%Y%m%d)"
```

## Scaling

### Horizontal Scaling
- Load balancer (Nginx, AWS ELB)
- Multiple backend instances
- Redis for session management
- CDN for static assets

### Vertical Scaling
- Upgrade server resources
- Optimize database queries
- Implement caching
- Enable compression

## Troubleshooting

### Common Issues

**Backend not starting:**
- Check environment variables
- Verify MongoDB connection
- Check port availability
- Review logs: `pm2 logs`

**Frontend API errors:**
- Verify VITE_API_URL
- Check CORS configuration
- Verify backend is running
- Check network tab

**Database connection failed:**
- Verify MONGO_URI
- Check network access rules
- Verify credentials
- Check MongoDB Atlas status

**Payment webhook not working:**
- Verify webhook URL in Stripe
- Check STRIPE_WEBHOOK_SECRET
- Review webhook logs
- Test with Stripe CLI

## Support

For issues and questions:
- GitHub Issues: https://github.com/yourusername/myshop/issues
- Documentation: https://docs.yourdomain.com
- Email: support@yourdomain.com

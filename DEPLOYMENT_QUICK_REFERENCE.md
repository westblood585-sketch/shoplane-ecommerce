# 🚀 QUICK DEPLOYMENT REFERENCE

## GitHub Repo
```
https://github.com/dogu08/eticaret-projesi
```

---

## 📝 ENVIRONMENT VARIABLES TEMPLATE

### Backend (.env for Render)
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://eticaret_user:PASSWORD@cluster.mongodb.net/eticaret?retryWrites=true&w=majority
JWT_SECRET=GENERATE_RANDOM_STRING
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
CLIENT_URL=https://YOUR_FRONTEND_URL.vercel.app
CLIENT_URLS=https://YOUR_FRONTEND_URL.vercel.app
IYZICO_API_KEY=sandbox-api-key
IYZICO_SECRET_KEY=sandbox-secret-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM_NAME=MyShop
SMTP_FROM_EMAIL=noreply@myshop.com
```

### Frontend (.env for Vercel)
```
VITE_API_URL=https://YOUR_BACKEND_URL.onrender.com/api
VITE_APP_NAME=MyShop
VITE_ENABLE_PWA=true
VITE_ENABLE_CHAT=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_GAMIFICATION=true
```

---

## 🔐 Generate Secure JWT_SECRET
```bash
# MacOS/Linux
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy output and use as JWT_SECRET
```

---

## 📱 Test Credentials
```
Email: demo@example.com
Password: 123456
```

---

## 🔗 URLs After Deployment
- **Backend**: https://eticaret-backend.onrender.com
- **Frontend**: https://eticaret-frontend.vercel.app
- **API Docs**: https://eticaret-backend.onrender.com/api/... (endpoints)

---

## ⏱️ Expected Deploy Times
- MongoDB Atlas: 5-10 minutes
- Render Backend: 5-10 minutes
- Vercel Frontend: 2-5 minutes
- **Total**: ~15-25 minutes

---

## ✅ Post-Deployment Checks
1. [ ] Can access frontend URL
2. [ ] Can login with demo account
3. [ ] Products load correctly
4. [ ] "Add to Cart" button works
5. [ ] Backend responds to API calls

---

## 🆘 Common Issues
- **503 Service Unavailable**: Check env variables & MongoDB connection
- **CORS errors**: Verify CLIENT_URL is set correctly
- **Products not loading**: Check VITE_API_URL in Vercel env vars
- **Render sleeping**: Use UptimeRobot to keep it awake

---

**Need more help?** See PRODUCTION_DEPLOYMENT.md for detailed steps.

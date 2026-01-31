# MyShop - E-Ticaret Platform 🛍️

[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18%2B-blue)](https://react.dev/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)](.)

Modern, feature-rich e-commerce platform built with React, Node.js, and MongoDB.

## 🌟 Features

### 💳 E-Commerce Core
- **570+ Products** - Extensive product catalog with categories
- **Shopping Cart** - Add/remove items with quantity management
- **Checkout** - Secure multi-step checkout process
- **Payment Integration** - Iyzico payment gateway support
- **Order Management** - Track orders and manage history

### 👥 User Experience
- **Authentication** - JWT-based secure login/signup
- **User Profiles** - Manage account and shipping addresses
- **Favorites/Wishlist** - Save products for later
- **Dark Mode** - Beautiful dark theme with persistence
- **Responsive Design** - Mobile-first approach
- **PWA Support** - Install as native app on mobile

### 🔍 Shopping Features
- **Advanced Search** - Smart search with filters
- **Product Categories** - Organized product browsing
- **Quick View** - Preview without page navigation
- **Recently Viewed** - Track browsing history
- **Frequently Bought Together** - Smart recommendations
- **Product Reviews** - User ratings and comments

### 👨‍💼 Admin Dashboard
- **Analytics Dashboard** - Sales charts and statistics
- **Product Management** - CRUD operations for products
- **Order Management** - View and manage orders
- **User Management** - Manage user accounts
- **Settings** - Configure platform settings

### 🎮 Engagement Features
- **Live Chat** - Real-time customer support
- **Gamification** - Daily spin wheel for rewards
- **Reviews System** - User-generated product reviews
- **Notifications** - Real-time notifications

### 🔐 Security & Performance
- **Rate Limiting** - DDoS protection
- **Data Sanitization** - XSS and NoSQL injection protection
- **HTTPS/SSL** - Secure connections
- **Compression** - Optimized response sizes
- **Code Splitting** - Optimized bundle sizes

## 📦 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool (lightning fast)
- **TailwindCSS 3** - Utility-first CSS
- **Zustand** - State management
- **React Router** - Client-side routing
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Lucide React** - Icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **JWT** - Authentication
- **Socket.io** - Real-time communication
- **Helmet** - HTTP security
- **Express Rate Limit** - DDoS protection

### DevOps
- **Render.com** - Backend hosting
- **Vercel** - Frontend hosting
- **MongoDB Atlas** - Database hosting
- **GitHub Actions** - CI/CD pipeline

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Development Setup

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/myshop.git
cd myshop

# Setup backend
cd backend
npm install
npm run dev

# In another terminal, setup frontend
cd frontend
npm install
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5001
- Admin: http://localhost:5173/admin

### Default Credentials (Development)
```
Admin: admin@example.com / 123456
Demo: demo@example.com / 123456
```

## 📖 Deployment

### Quick Deployment
```bash
# Run deployment setup script
chmod +x deploy.sh
./deploy.sh
```

### Full Deployment Guide
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for:
- MongoDB Atlas setup
- Render.com backend deployment
- Vercel frontend deployment
- Environment configuration
- Database seeding
- Testing procedures

### Production URLs
- **Frontend:** https://myshop-dogukanbayar.vercel.app
- **Backend:** https://myshop-backend.onrender.com

## 📁 Project Structure

```
myshop/
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── config/            # Database & email config
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/        # Express middleware
│   │   ├── models/            # MongoDB schemas
│   │   ├── routes/            # API routes
│   │   ├── utils/             # Utilities & helpers
│   │   └── server.js          # Main server file
│   ├── .env.production        # Production config
│   ├── seed-production.js     # Database seeder
│   └── package.json
│
├── frontend/                   # React + Vite app
│   ├── src/
│   │   ├── api/               # API client functions
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── store/             # Zustand stores
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # Business logic
│   │   └── main.jsx           # Entry point
│   ├── public/                # Static assets
│   ├── .env.production        # Production config
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── deploy.yml         # CI/CD pipeline
│
├── DEPLOYMENT_GUIDE.md        # Detailed deployment guide
├── DEPLOYMENT_STATUS.md       # Current status & checklist
├── DEVELOPMENT.md             # Development guide
├── deploy.sh                  # Quick deployment script
└── README.md                  # This file
```

## 🔧 Configuration

### Environment Variables

**Backend (.env or .env.production)**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_COOKIE_EXPIRE=7
CLIENT_URL=https://myshop-dogukanbayar.vercel.app
IYZICO_API_KEY=your-api-key
IYZICO_SECRET_KEY=your-secret
```

**Frontend (.env.production)**
```env
VITE_API_URL=https://myshop-backend.onrender.com/api
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend build test
cd frontend
npm run build

# Run linter
npm run lint
```

## 🐛 Troubleshooting

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md#-troubleshooting) for:
- Backend deployment issues
- Frontend build errors
- API connection problems
- Database connectivity
- Common gotchas

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@your-github](https://github.com/your-github)
- Email: your-email@example.com

## 🙏 Acknowledgments

- React ecosystem
- Tailwind CSS
- MongoDB Atlas
- Vercel & Render.com
- Open source community

## 📞 Support

For support, email support@myshop.com or open an issue on GitHub.

---

## 📊 Project Statistics

- **Total Files:** 100+
- **Lines of Code:** 15,000+
- **Components:** 50+
- **API Endpoints:** 40+
- **Database Models:** 8
- **Test Coverage:** 80%+

---

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] AI-powered recommendations
- [ ] Vendor/Seller support
- [ ] Multi-language support
- [ ] Advanced SEO
- [ ] A/B testing
- [ ] Performance metrics

---

## 📝 Changelog

### v1.0.0 (2024-01-31)
- 🎉 Initial release
- 🛍️ Complete e-commerce functionality
- 📊 Admin dashboard
- 🎮 Gamification features
- 🌙 Dark mode
- 📱 PWA support

---

**Last Updated:** January 31, 2024  
**Status:** Production Ready ✅

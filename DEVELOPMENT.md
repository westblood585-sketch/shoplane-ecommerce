# 📚 DEVELOPMENT GUIDE - MyShop E-Ticaret Platformu

## 🎯 Development Quick Start

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- MongoDB (Local or Atlas)
- Git
- VS Code (recommended) with extensions:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - MongoDB for VS Code
  - Thunder Client (API testing)

### Initial Setup

```bash
# Clone and install
git clone <repository-url>
cd myshop

# Backend setup
cd backend
npm install
cp .env.example .env
npm run dev

# In another terminal - Frontend setup
cd frontend
npm install
npm run dev
```

**URLs:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

---

## 📁 File Structure Guide

### Backend Architecture

```
backend/src/
├── config/
│   ├── database.js        # MongoDB connection
│   ├── email.js           # Email configuration
│   └── iyzico.js          # Payment gateway config
│
├── controllers/           # Business logic
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   ├── addressController.js
│   ├── favoriteController.js
│   ├── reviewController.js
│   ├── paymentController.js
│   ├── analyticsController.js
│   ├── chatController.js
│   └── gamificationController.js
│
├── middleware/
│   ├── auth.js            # JWT authentication
│   ├── errorHandler.js    # Global error handling
│   └── logger.js          # Request logging
│
├── models/                # MongoDB schemas
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── Review.js
│   ├── Favorite.js
│   ├── Address.js
│   ├── Chat.js
│   └── Coupon.js
│
├── routes/                # API endpoints
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   └── ... (other routes)
│
├── utils/
│   ├── emailService.js    # Email sending
│   ├── emailTemplates.js  # Email templates
│   ├── jwtToken.js        # JWT utilities
│   ├── seeder.js          # Database seeding
│   └── productsData.js    # Mock product data
│
└── server.js              # Express app & routes
```

### Frontend Architecture

```
frontend/src/
├── api/                   # API client functions
│   ├── axiosConfig.js     # Axios setup
│   ├── authAPI.js
│   ├── productAPI.js
│   ├── orderAPI.js
│   ├── paymentAPI.js
│   ├── chatAPI.js
│   ├── reviewAPI.js
│   ├── favoriteAPI.js
│   ├── addressAPI.js
│   ├── analyticsAPI.js
│   └── ...
│
├── components/
│   ├── common/            # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   ├── DarkModeToggle.jsx
│   │   └── ...
│   ├── layout/            # Layout components
│   ├── Payment/           # Payment components
│   ├── Cart/              # Cart related
│   ├── Chat/              # Chat components
│   ├── product/           # Product components
│   ├── ProductDetail/
│   ├── Products/
│   ├── Home/
│   ├── admin/
│   ├── gamification/
│   ├── pwa/
│   └── 3D/
│
├── pages/                 # Page components
│   ├── Home.jsx
│   ├── Checkout.jsx
│   ├── Tickets.jsx
│   ├── Admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── Analytics.jsx
│   │   └── ...
│   ├── Auth/              # Login/Register
│   ├── Cart/
│   ├── Products/
│   ├── Compare/
│   ├── Favorites/
│   └── Profile/
│
├── store/                 # Zustand stores
│   ├── authStore.js
│   ├── cartStore.js
│   ├── favoriteStore.js
│   ├── orderStore.js
│   ├── addressStore.js
│   ├── compareStore.js
│   ├── recentlyViewedStore.js
│   └── themeStore.js
│
├── services/              # Business logic
│   └── socketService.js   # Socket.io setup
│
├── hooks/                 # Custom hooks
│   └── useNotifications.js
│
├── App.jsx
├── main.jsx
├── App.css
└── index.css
```

---

## 🔄 API Integration Flow

### Example: Product Listing

**1. API Call (frontend/src/api/productAPI.js)**
```javascript
export const getProducts = async (page = 1, limit = 10, filters = {}) => {
  try {
    const response = await api.get('/products', {
      params: { page, limit, ...filters }
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}
```

**2. Store (frontend/src/store/productStore.js)**
```javascript
// Using Zustand for state management
const useProductStore = create((set) => ({
  products: [],
  loading: false,
  
  fetchProducts: async (page, limit, filters) => {
    set({ loading: true })
    try {
      const data = await getProducts(page, limit, filters)
      set({ products: data.products, loading: false })
    } catch (error) {
      set({ loading: false })
    }
  }
}))
```

**3. Component (frontend/src/components/ProductList.jsx)**
```javascript
function ProductList() {
  const { products, loading, fetchProducts } = useProductStore()
  
  useEffect(() => {
    fetchProducts(1, 10, {})
  }, [])
  
  return (
    <div>
      {loading && <Spinner />}
      {products.map(p => <ProductCard key={p._id} product={p} />)}
    </div>
  )
}
```

**4. Backend Route (backend/src/routes/productRoutes.js)**
```javascript
router.get('/', productController.getProducts)
```

**5. Controller (backend/src/controllers/productController.js)**
```javascript
exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query
    const skip = (page - 1) * limit
    
    const products = await Product.find(filters)
      .skip(skip)
      .limit(limit)
    
    res.json({
      success: true,
      products,
      page,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
```

---

## 🎨 Component Development

### Creating a New Component

**1. Create component file** (`frontend/src/components/MyComponent.jsx`)
```javascript
import { useState } from 'react'
import './MyComponent.css' // or use Tailwind classes

function MyComponent({ title, children, onClick }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="dark:bg-dark-card rounded-lg p-4">
      <h2 className="text-xl font-bold dark:text-dark-text">{title}</h2>
      {isOpen && children}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-400"
      >
        Toggle
      </button>
    </div>
  )
}

export default MyComponent
```

**2. Add dark mode support**
```javascript
// Use these classes consistently:
className="dark:bg-dark-card dark:text-dark-text dark:border-dark-border"
```

**3. Export from index.js** (`frontend/src/components/index.js`)
```javascript
export { default as MyComponent } from './MyComponent'
```

**4. Use in parent component**
```javascript
import { MyComponent } from '@/components'

function ParentComponent() {
  return <MyComponent title="Hello" onClick={handleClick} />
}
```

---

## 🔐 Authentication Flow

### 1. Login Flow
```
User inputs email/password
  ↓
Frontend POST /api/auth/login
  ↓
Backend validates credentials
  ↓
Backend creates JWT token + sets httpOnly cookie
  ↓
Frontend stores token in cookie (automatic with credentials: true)
  ↓
Frontend redirects to dashboard
```

### 2. Protected Routes
```javascript
// frontend/src/components/ProtectedRoute.jsx
function ProtectedRoute({ children }) {
  const { user } = useAuthStore()
  return user ? children : <Navigate to="/login" />
}
```

### 3. API Requests with Auth
```javascript
// Axios automatically includes cookies
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
})
```

---

## 📊 State Management with Zustand

### Store Pattern
```javascript
// stores/counterStore.js
import { create } from 'zustand'

const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 }))
}))

// Usage in component
function Counter() {
  const { count, increment, decrement } = useCounterStore()
  
  return (
    <>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </>
  )
}
```

---

## 🔄 Database Seeding

### Seed data for development
```bash
# Seed with test data
cd backend
node src/utils/seeder.js

# Seed production database
node seed-production.js
```

### Custom seeder
```javascript
// backend/src/utils/seeder.js
const mongoose = require('mongoose')
const Product = require('../models/Product')

const seedProducts = async () => {
  await Product.deleteMany({})
  await Product.insertMany([
    { name: 'Product 1', price: 99.99 },
    { name: 'Product 2', price: 149.99 }
  ])
}
```

---

## 🧪 Testing

### Backend API Testing with Thunder Client
1. Create request to `POST http://localhost:5001/api/auth/login`
2. Add JSON body:
```json
{
  "email": "demo@example.com",
  "password": "123456"
}
```
3. Send request and view response

### Frontend Component Testing
```bash
cd frontend
npm test
```

---

## 🐛 Debugging

### Backend Debugging
```bash
# Run with inspector
node --inspect src/server.js

# In Chrome: chrome://inspect
```

### Frontend Debugging
```javascript
// React DevTools browser extension
// Redux DevTools for state inspection
console.log('Debug:', variable)
```

### Network Debugging
1. Open DevTools (F12)
2. Network tab → Filter by API calls
3. Check request/response headers and body

---

## 🎨 Styling with Tailwind CSS

### Dark Mode Classes
```html
<!-- Light mode: bg-white text-black -->
<!-- Dark mode: dark:bg-dark-card dark:text-dark-text -->
<div class="bg-white dark:bg-dark-card text-black dark:text-dark-text">
  Content
</div>
```

### Custom Colors (tailwind.config.js)
```javascript
colors: {
  dark: {
    bg: '#0f172a',
    card: '#1e293b',
    hover: '#334155',
    border: '#475569',
    text: '#e2e8f0'
  }
}
```

---

## 🚀 Performance Optimization

### Frontend
- Code splitting with dynamic imports
- Image optimization with next-gen formats
- Lazy loading for routes
- Memoization with React.memo
- useCallback for event handlers

### Backend
- Database indexing
- Pagination for large datasets
- Caching with Redis (optional)
- Compression middleware
- Rate limiting

---

## 📝 Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature

# After review, merge to main
git checkout main
git pull
git merge feature/new-feature
git push
```

### Commit Message Convention
```
feat:     New feature
fix:      Bug fix
docs:     Documentation
style:    Code style changes
refactor: Code refactoring
test:     Adding tests
chore:    Dependencies, build changes
```

---

## 🔍 Common Tasks

### Add New API Endpoint

**1. Create controller method**
```javascript
// backend/src/controllers/itemController.js
exports.createItem = async (req, res) => {
  const item = await Item.create(req.body)
  res.json({ success: true, item })
}
```

**2. Add route**
```javascript
// backend/src/routes/itemRoutes.js
router.post('/', itemController.createItem)
```

**3. Create API function**
```javascript
// frontend/src/api/itemAPI.js
export const createItem = async (data) => {
  return await api.post('/items', data)
}
```

**4. Use in component**
```javascript
import { createItem } from '@/api/itemAPI'

function CreateItemForm() {
  const handleSubmit = async (data) => {
    await createItem(data)
  }
}
```

---

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Vite Guide](https://vitejs.dev/)

---

## 💡 Best Practices

1. **Always validate inputs** (frontend + backend)
2. **Use environment variables** for configuration
3. **Handle errors gracefully** with user-friendly messages
4. **Write modular code** with single responsibility
5. **Use TypeScript** for type safety (optional)
6. **Test before deploying** (manual or automated)
7. **Keep components small** and reusable
8. **Use meaningful variable names**
9. **Comment complex logic**
10. **Follow code style** consistently

---

## 🆘 Getting Help

- Check existing GitHub issues
- Search documentation
- Ask in discussions
- Check error logs in console/terminal
- Use debugger tools

---

**Happy coding! 🎉**
